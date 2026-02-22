import { createAdminClient } from "@/lib/supabase/admin"

const N8N_WEBHOOK_URL = "https://orsai.app.n8n.cloud/webhook/paypal-vhm"

/**
 * Envía un POST al webhook de n8n con los datos del pago cuando está approved.
 * No lanza error para no afectar la respuesta al usuario; los fallos se registran en consola.
 */
export async function notifyPayPalApproved(paymentId: string): Promise<void> {
  try {
    const admin = createAdminClient()
    const { data: payment, error } = await admin
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single()

    if (error || !payment) {
      console.error("notifyPayPalApproved: payment not found", paymentId, error)
      return
    }

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    })

    if (!res.ok) {
      console.error(
        "notifyPayPalApproved: n8n webhook failed",
        res.status,
        await res.text()
      )
    }
  } catch (err) {
    console.error("notifyPayPalApproved:", err)
  }
}
