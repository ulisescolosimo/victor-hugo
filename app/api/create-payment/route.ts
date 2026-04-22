import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getUsdToArsRate } from "@/lib/get-usd-ars-rate"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { createOrder } from "@/lib/paypal"

/** Precio por aporte en USD. PayPal cobra en USD; Mercado Pago convierte a ARS con cotización del día. */
const UNIT_PRICE_USD = 18
/** Porcentaje que se agrega al valor por plataforma de pagos (se suma al precio final). */
const PLATFORM_FEE_PERCENT = 12
const MIN_QUANTITY = 1
const MAX_QUANTITY = 50

function getSiteUrl(request: NextRequest): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (url) return url.replace(/\/$/, "")
  const host = request.headers.get("host") || "localhost:3000"
  const proto = request.headers.get("x-forwarded-proto") || "http"
  return `${proto}://${host}`
}

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = createAdminClient()
    const body = await request.json()
    const quantity = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Number(body?.quantity) || 1))
    const provider = body?.provider === "paypal" ? "paypal" : "mercadopago"
    const checkoutEmail = normalizeEmail(body?.email)
    const checkoutName = typeof body?.name === "string" ? body.name.trim() : ""

    const { data: { user } } = await supabase.auth.getUser()
    const userEmail = normalizeEmail(user?.email ?? "")
    const effectiveEmail = userEmail || checkoutEmail

    if (!effectiveEmail || !isValidEmail(effectiveEmail)) {
      return NextResponse.json({ error: "Ingresá un email válido para continuar." }, { status: 400 })
    }

    const amountUsdBeforeFee = quantity * UNIT_PRICE_USD
    const amountUsd = amountUsdBeforeFee * (1 + PLATFORM_FEE_PERCENT / 100)
    const { rate: usdToArsRate } = await getUsdToArsRate()
    const amountArs = Math.round(amountUsd * usdToArsRate)

    const userName =
      checkoutName ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.nombre ||
      effectiveEmail
    const checkoutToken = crypto.randomUUID()

    const title = quantity === 1 ? "1 Aporte - Proyecto VHM" : `${quantity} Aportes - Proyecto VHM`
    const { data: payment, error: insertError } = await admin
      .from("payments")
      .insert({
        user_id: user?.id ?? null,
        user_email: effectiveEmail,
        user_name: userName,
        amount_usd: amountUsd,
        amount_ars: amountArs,
        currency_id: provider === "paypal" ? "USD" : "ARS",
        usd_to_ars_rate: usdToArsRate,
        quantity,
        unit_price_usd: UNIT_PRICE_USD,
        title,
        status: "pending",
        external_reference: crypto.randomUUID(),
        metadata: {
          checkout_token: checkoutToken,
          checkout_flow: "guest_or_fast_checkout",
        },
        payment_provider: provider,
      })
      .select("id, external_reference")
      .single()

    if (insertError || !payment) {
      console.error("Error creating payment:", insertError)
      return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
    }

    const siteUrl = getSiteUrl(request)
    const checkoutParams = `payment_id=${payment.id}&checkout=${checkoutToken}&email=${encodeURIComponent(effectiveEmail)}`
    const thankYouBase = `${siteUrl}/gracias?${checkoutParams}`

    if (provider === "paypal") {
      try {
        const description =
          quantity === 1
            ? `1 Aporte - Proyecto VHM`
            : `${quantity} Aportes - Proyecto VHM`
        const unitWithFee = UNIT_PRICE_USD * (1 + PLATFORM_FEE_PERCENT / 100)
        const { orderId, approveUrl } = await createOrder({
          paymentId: payment.id,
          amountUsd,
          description: `${description} - ${quantity} x ${unitWithFee.toFixed(2)} USD (incl. ${PLATFORM_FEE_PERCENT}% plataforma)`,
          returnUrl: `${thankYouBase}&payment=success`,
          cancelUrl: `${thankYouBase}&payment=cancelled`,
          brandName: "Proyecto VHM",
          requestId: payment.id,
        })
        await admin
          .from("payments")
          .update({
            preference_id: orderId,
            payment_url: approveUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.id)
        return NextResponse.json({
          paymentUrl: approveUrl,
          paymentId: payment.id,
          preferenceId: orderId,
          checkoutToken,
        })
      } catch (err) {
        console.error("PayPal create order error:", err)
        return NextResponse.json(
          { error: "Error al crear la orden en PayPal" },
          { status: 500 }
        )
      }
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    const notificationUrl = process.env.N8N_ENDPOINT_VHM
    if (!accessToken) {
      return NextResponse.json({ error: "MercadoPago no configurado" }, { status: 500 })
    }

    const backUrls = {
      success: `${thankYouBase}&payment=success`,
      failure: `${thankYouBase}&payment=failure`,
      pending: `${thankYouBase}&payment=pending`,
    }

    const config = new MercadoPagoConfig({ accessToken })
    const preferenceClient = new Preference(config)
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: payment.id,
            title,
            description: `Aporte${quantity > 1 ? "s" : ""} al Proyecto Victor Hugo Mora - ${quantity} x ${UNIT_PRICE_USD} USD + ${PLATFORM_FEE_PERCENT}% plataforma`,
            quantity: 1,
            unit_price: amountArs,
            currency_id: "ARS",
          },
        ],
        payer: {
          email: effectiveEmail,
          name: userName,
        },
        back_urls: backUrls,
        auto_return: "approved",
        external_reference: payment.external_reference,
        notification_url: notificationUrl || undefined,
        statement_descriptor: "VHM APORTE",
        metadata: {
          type: "vhm_aporte",
          user_id: user?.id ?? null,
          quantity,
          amount_usd: amountUsd,
          amount_ars: amountArs,
        },
      },
    })

    const paymentUrl = preference.init_point ?? (preference as { sandbox_init_point?: string }).sandbox_init_point
    const preferenceId = preference.id

    if (paymentUrl) {
      await admin
        .from("payments")
        .update({
          payment_url: paymentUrl,
          preference_id: preferenceId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id)
    }

    return NextResponse.json({
      paymentUrl: paymentUrl ?? null,
      paymentId: payment.id,
      preferenceId: preferenceId ?? null,
      checkoutToken,
    })
  } catch (err) {
    console.error("create-payment error:", err)
    return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
  }
}
