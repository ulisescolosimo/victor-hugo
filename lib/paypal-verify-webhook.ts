import { getBaseUrl, getAccessToken } from "./paypal"

/**
 * Verifica la firma del webhook de PayPal.
 * Requiere PAYPAL_WEBHOOK_ID. Si no está definido, no se verifica (retorna true).
 */
export async function verifyPayPalWebhook(
  headers: Headers,
  rawBody: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) return true

  const authAlgo = headers.get("paypal-auth-algo") ?? headers.get("PAYPAL-AUTH-ALGO")
  const certUrl = headers.get("paypal-cert-url") ?? headers.get("PAYPAL-CERT-URL")
  const transmissionId =
    headers.get("paypal-transmission-id") ?? headers.get("PAYPAL-TRANSMISSION-ID")
  const transmissionSig =
    headers.get("paypal-transmission-sig") ?? headers.get("PAYPAL-TRANSMISSION-SIG")
  const transmissionTime =
    headers.get("paypal-transmission-time") ?? headers.get("PAYPAL-TRANSMISSION-TIME")

  if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
    return false
  }

  let webhookEvent: unknown
  try {
    webhookEvent = JSON.parse(rawBody)
  } catch {
    return false
  }

  const token = await getAccessToken()
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  })

  if (!res.ok) return false
  const data = (await res.json()) as { verification_status?: string }
  return data.verification_status === "SUCCESS"
}
