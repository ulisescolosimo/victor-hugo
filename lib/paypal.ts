/**
 * Helpers para la API de PayPal (OAuth2 + Orders v2).
 * PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENVIRONMENT (sandbox | live)
 */

const SANDBOX = "https://api-m.sandbox.paypal.com"
const LIVE = "https://api-m.paypal.com"

export function getBaseUrl(): string {
  const env = (process.env.PAYPAL_ENVIRONMENT ?? "sandbox").toLowerCase()
  return env === "live" ? LIVE : SANDBOX
}

export async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not set")
  }
  const baseUrl = getBaseUrl()
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal token error: ${res.status} ${err}`)
  }
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export type CreateOrderParams = {
  paymentId: string
  amountUsd: number
  description: string
  returnUrl: string
  cancelUrl: string
  brandName?: string
  requestId?: string
}

export type CreateOrderResult = {
  orderId: string
  approveUrl: string
}

export async function createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  const token = await getAccessToken()
  const baseUrl = getBaseUrl()
  const value = params.amountUsd.toFixed(2)
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: params.paymentId,
        amount: {
          currency_code: "USD",
          value,
        },
        description: params.description,
      },
    ],
    application_context: {
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
      brand_name: params.brandName ?? "Proyecto VHM",
      user_action: "PAY_NOW",
    },
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
  if (params.requestId) {
    headers["PayPal-Request-Id"] = params.requestId
  }
  const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal create order error: ${res.status} ${err}`)
  }
  const order = (await res.json()) as {
    id: string
    links?: Array<{ rel: string; href: string }>
  }
  const approveLink = order.links?.find((l) => l.rel === "approve")
  const approveUrl = approveLink?.href ?? ""
  if (!approveUrl) {
    throw new Error("PayPal order created but no approve link")
  }
  return { orderId: order.id, approveUrl }
}

export type CaptureOrderResult = {
  captureId: string
  paypalNet?: number
  paypalFee?: number
  raw: unknown
}

export async function captureOrder(orderId: string): Promise<CaptureOrderResult> {
  const token = await getAccessToken()
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: "{}",
  })
  const raw = await res.json()
  if (!res.ok) {
    throw new Error(
      `PayPal capture error: ${res.status} ${JSON.stringify((raw as { message?: string })?.message ?? raw)}`
    )
  }
  const data = raw as {
    id?: string
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{
          id?: string
          seller_receivable_breakdown?: {
            net_amount?: { value?: string }
            paypal_fee?: { value?: string }
          }
        }>
      }
    }>
  }
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
  const captureId = capture?.id ?? data.id ?? ""
  const breakdown = capture?.seller_receivable_breakdown
  const paypalNet = breakdown?.net_amount?.value
    ? parseFloat(breakdown.net_amount.value)
    : undefined
  const paypalFee = breakdown?.paypal_fee?.value
    ? parseFloat(breakdown.paypal_fee.value)
    : undefined
  return {
    captureId,
    paypalNet,
    paypalFee,
    raw,
  }
}
