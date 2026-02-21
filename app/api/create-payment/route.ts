import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUsdToArsRate } from "@/lib/get-usd-ars-rate"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { createOrder } from "@/lib/paypal"

const UNIT_PRICE_USD = 0.1
const MIN_QUANTITY = 1
const MAX_QUANTITY = 10

function getSiteUrl(request: NextRequest): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (url) return url.replace(/\/$/, "")
  const host = request.headers.get("host") || "localhost:3000"
  const proto = request.headers.get("x-forwarded-proto") || "http"
  return `${proto}://${host}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const quantity = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Number(body?.quantity) || 1))
    const provider = body?.provider === "paypal" ? "paypal" : "mercadopago"

    const amountUsd = quantity * UNIT_PRICE_USD
    const { rate: usdToArsRate } = await getUsdToArsRate()
    const amountArs = Math.round(amountUsd * usdToArsRate)

    const userName = user.user_metadata?.full_name ?? user.user_metadata?.nombre ?? user.email ?? ""
    const userEmail = user.email ?? ""

    const title = quantity === 1 ? "1 Aporte - Proyecto VHM" : `${quantity} Aportes - Proyecto VHM`
    const { data: payment, error: insertError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        user_email: userEmail,
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
        payment_provider: provider,
      })
      .select("id, external_reference")
      .single()

    if (insertError || !payment) {
      console.error("Error creating payment:", insertError)
      return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
    }

    const siteUrl = getSiteUrl(request)

    if (provider === "paypal") {
      try {
        const description =
          quantity === 1
            ? `1 Aporte - Proyecto VHM`
            : `${quantity} Aportes - Proyecto VHM`
        const { orderId, approveUrl } = await createOrder({
          paymentId: payment.id,
          amountUsd,
          description: `${description} - ${quantity} x ${UNIT_PRICE_USD} USD`,
          returnUrl: `${siteUrl}/miembros?payment=success&payment_id=${payment.id}`,
          cancelUrl: `${siteUrl}/miembros?payment=cancelled&payment_id=${payment.id}`,
          brandName: "Proyecto VHM",
          requestId: payment.id,
        })
        await supabase
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
      success: `${siteUrl}/miembros?payment=success&payment_id=${payment.id}`,
      failure: `${siteUrl}/miembros?payment=failure&payment_id=${payment.id}`,
      pending: `${siteUrl}/miembros?payment=pending&payment_id=${payment.id}`,
    }

    const config = new MercadoPagoConfig({ accessToken })
    const preferenceClient = new Preference(config)
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: payment.id,
            title,
            description: `Aporte${quantity > 1 ? "s" : ""} al Proyecto Victor Hugo Mora - ${quantity} x ${UNIT_PRICE_USD} USD`,
            quantity: 1,
            unit_price: amountArs,
            currency_id: "ARS",
          },
        ],
        payer: {
          email: userEmail,
          name: userName,
        },
        back_urls: backUrls,
        auto_return: "approved",
        external_reference: payment.external_reference,
        notification_url: notificationUrl || undefined,
        statement_descriptor: "VHM APORTE",
        metadata: {
          type: "vhm_aporte",
          user_id: user.id,
          quantity,
          amount_usd: amountUsd,
          amount_ars: amountArs,
        },
      },
    })

    const paymentUrl = preference.init_point ?? (preference as { sandbox_init_point?: string }).sandbox_init_point
    const preferenceId = preference.id

    if (paymentUrl) {
      await supabase
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
    })
  } catch (err) {
    console.error("create-payment error:", err)
    return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
  }
}
