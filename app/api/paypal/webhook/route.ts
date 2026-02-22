import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyPayPalWebhook } from "@/lib/paypal-verify-webhook"
import { notifyPayPalApproved } from "@/lib/notify-paypal-approved"

type WebhookEvent = {
  id?: string
  event_type?: string
  resource?: {
    id?: string
    purchase_units?: Array<{ reference_id?: string }>
    suppressions?: unknown
  }
}

/**
 * Webhook de PayPal. Configura esta URL en el dashboard de PayPal.
 * Verifica firma si PAYPAL_WEBHOOK_ID está definido.
 * Eventos: CHECKOUT.ORDER.APPROVED, PAYMENT.CAPTURE.COMPLETED, CHECKOUT.ORDER.COMPLETED,
 * PAYMENT.CAPTURE.DENIED, PAYMENT.CAPTURE.REFUNDED, CHECKOUT.ORDER.CANCELLED
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    if (!rawBody) {
      return NextResponse.json({ error: "Empty body" }, { status: 400 })
    }

    const verified = await verifyPayPalWebhook(request.headers, rawBody)
    if (!verified) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(rawBody) as WebhookEvent
    const eventType = event.event_type ?? ""
    const eventId = event.id

    // order_id: puede venir en resource.id (orden) o en purchase_units[0].reference_id es nuestro payment id
    const resource = event.resource
    const orderId = resource?.id
    const referenceId = resource?.purchase_units?.[0]?.reference_id

    if (!orderId) {
      return NextResponse.json({ ok: true, message: "No order id in event" })
    }

    const admin = createAdminClient()

    const { data: payment, error: findError } = await admin
      .from("payments")
      .select("id, status")
      .eq("payment_provider", "paypal")
      .eq("preference_id", orderId)
      .single()

    if (findError || !payment) {
      return NextResponse.json({ ok: true, message: "Payment not found for order" })
    }

    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      raw_webhook_payload: event,
    }

    switch (eventType) {
      case "CHECKOUT.ORDER.APPROVED":
        update.status = "pending" // aprobado por usuario, pendiente de captura
        break
      case "PAYMENT.CAPTURE.COMPLETED":
      case "CHECKOUT.ORDER.COMPLETED":
        update.status = "approved"
        update.approved_at = new Date().toISOString()
        break
      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.REFUNDED":
        update.status = "rejected"
        break
      case "CHECKOUT.ORDER.CANCELLED":
        update.status = "cancelled"
        break
      default:
        return NextResponse.json({ ok: true, message: "Event type ignored" })
    }

    const { error: updateError } = await admin
      .from("payments")
      .update(update)
      .eq("id", payment.id)

    if (updateError) {
      console.error("PayPal webhook update error:", updateError)
      return NextResponse.json(
        { error: "Error al actualizar el pago" },
        { status: 500 }
      )
    }

    if (update.status === "approved") {
      await notifyPayPalApproved(payment.id)
    }

    return NextResponse.json({
      ok: true,
      payment_id: payment.id,
      status: update.status,
      event_id: eventId,
    })
  } catch (err) {
    console.error("paypal/webhook error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
