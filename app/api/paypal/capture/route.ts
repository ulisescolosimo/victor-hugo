import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { captureOrder } from "@/lib/paypal"
import { notifyPayPalApproved } from "@/lib/notify-paypal-approved"

/**
 * Captura una orden de PayPal tras el retorno del usuario.
 * Body: { orderId: string (token de PayPal), paymentId?: string (id interno), checkoutToken?: string }
 * Permite captura autenticada o por checkoutToken para flujo de invitado.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json().catch(() => ({}))
    const orderId = (body?.orderId ?? body?.token) as string | undefined
    const paymentIdParam = body?.paymentId as string | undefined
    const checkoutToken = (body?.checkoutToken ?? "").toString().trim()

    if (!orderId?.trim()) {
      return NextResponse.json(
        { error: "Falta orderId (token de PayPal)" },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // Buscar pago por preference_id (order ID de PayPal) o por paymentId
    let query = admin
      .from("payments")
      .select("id, user_id, status, payment_provider, metadata")
      .eq("payment_provider", "paypal")

    if (paymentIdParam) {
      query = query.eq("id", paymentIdParam)
    } else {
      query = query.eq("preference_id", orderId)
    }

    const { data: payment, error: findError } = await query.single()

    if (findError || !payment) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      )
    }

    const authorizedByUser = Boolean(user?.id && payment.user_id === user.id)
    const metadata = payment.metadata as { checkout_token?: string } | null
    const paymentCheckoutToken =
      typeof metadata?.checkout_token === "string" ? metadata.checkout_token : ""
    const authorizedByToken =
      Boolean(checkoutToken) && paymentCheckoutToken === checkoutToken

    if (!authorizedByUser && !authorizedByToken) {
      return NextResponse.json({ error: "No autorizado para capturar este pago" }, { status: 403 })
    }

    // Si ya está completado/aprobado, devolver éxito sin volver a capturar
    if (payment.status === "completed" || payment.status === "approved") {
      return NextResponse.json({
        ok: true,
        paymentId: payment.id,
        status: payment.status,
        alreadyCompleted: true,
      })
    }

    const { captureId, paypalNet, paypalFee, raw } = await captureOrder(orderId)

    const update: Record<string, unknown> = {
      status: "approved",
      capture_id: captureId,
      paypal_raw: raw,
      updated_at: new Date().toISOString(),
      approved_at: new Date().toISOString(),
    }
    if (paypalNet != null) update.paypal_net = paypalNet
    if (paypalFee != null) update.paypal_fee = paypalFee
    update.last_capture_error = null

    const { error: updateError } = await admin
      .from("payments")
      .update(update)
      .eq("id", payment.id)

    if (updateError) {
      console.error("PayPal capture DB update error:", updateError)
      return NextResponse.json(
        { error: "Error al actualizar el pago" },
        { status: 500 }
      )
    }

    await notifyPayPalApproved(payment.id)

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      status: "approved",
      captureId,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al capturar"
    console.error("paypal/capture error:", err)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
