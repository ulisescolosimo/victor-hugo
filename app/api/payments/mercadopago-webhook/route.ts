import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Webhook para actualizar el estado del pago.
 * Puede ser llamado por n8n (cuando MercadoPago notifica a n8n) con un payload normalizado,
 * o configurado para recibir directamente de MercadoPago.
 *
 * Payload esperado (desde n8n o similar):
 * - preference_id (string)
 * - status (string): approved | rejected | cancelled | in_process | pending
 * - payment_id (string, opcional): ID del pago en MercadoPago
 * - raw (object, opcional): payload completo para guardar en raw_webhook_payload
 */
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>
    const contentType = request.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
      body = await request.json()
    } else {
      const text = await request.text()
      try {
        body = JSON.parse(text) as Record<string, unknown>
      } catch {
        const params = new URLSearchParams(text)
        body = {
          preference_id: params.get("preference_id") ?? params.get("id"),
          status: params.get("status"),
          payment_id: params.get("payment_id"),
        }
      }
    }

    const preferenceId = (body.preference_id ?? body.preferenceId) as string | undefined
    const status = (body.status ?? body.payment_status) as string | undefined
    const paymentId = (body.payment_id ?? body.paymentId) as string | undefined

    if (!preferenceId || !status) {
      return NextResponse.json(
        { error: "Faltan preference_id o status" },
        { status: 400 }
      )
    }

    const normalizedStatus = normalizeStatus(status)
    const admin = createAdminClient()

    const update: Record<string, unknown> = {
      status: normalizedStatus,
      updated_at: new Date().toISOString(),
      raw_webhook_payload: body.raw ?? body,
    }
    if (paymentId) {
      update.payment_id = paymentId
    }
    if (normalizedStatus === "approved") {
      update.approved_at = new Date().toISOString()
    }

    const { data, error } = await admin
      .from("payments")
      .update(update)
      .eq("preference_id", preferenceId)
      .select("id, status")
      .single()

    if (error) {
      console.error("Webhook update error:", error)
      return NextResponse.json({ error: "Error al actualizar el pago" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, payment_id: data?.id, status: data?.status })
  } catch (err) {
    console.error("mercadopago-webhook error:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

function normalizeStatus(status: string): string {
  const s = status.toLowerCase()
  if (s === "accredited") return "approved"
  if (["approved", "rejected", "cancelled", "in_process", "pending", "refunded"].includes(s)) {
    return s
  }
  return "pending"
}
