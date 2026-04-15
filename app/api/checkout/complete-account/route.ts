import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const paymentId = typeof body?.paymentId === "string" ? body.paymentId.trim() : ""
    const checkoutToken = typeof body?.checkoutToken === "string" ? body.checkoutToken.trim() : ""
    const email = normalizeEmail(body?.email)
    const password = typeof body?.password === "string" ? body.password : ""
    const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : ""
    const apellido = typeof body?.apellido === "string" ? body.apellido.trim() : ""

    if (!paymentId || !checkoutToken) {
      return NextResponse.json({ error: "Faltan datos de validación del checkout." }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: payment, error: paymentError } = await admin
      .from("payments")
      .select("id, status, user_id, user_email, checkout_token")
      .eq("id", paymentId)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: "No encontramos el pago." }, { status: 404 })
    }
    if (payment.checkout_token !== checkoutToken) {
      return NextResponse.json({ error: "Token de checkout inválido." }, { status: 403 })
    }
    if (normalizeEmail(payment.user_email) !== email) {
      return NextResponse.json({ error: "El email no coincide con el usado al pagar." }, { status: 400 })
    }
    if (["failure", "cancelled", "rejected"].includes(payment.status)) {
      return NextResponse.json({ error: "Este pago no está en estado válido para activar cuenta." }, { status: 400 })
    }

    let userId = payment.user_id as string | null

    if (!userId) {
      const { data: createdUser, error: createUserError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          nombre,
          apellido,
          full_name: [nombre, apellido].filter(Boolean).join(" ").trim(),
        },
      })

      if (createUserError) {
        // fallback: si ya existe cuenta con ese email, intentar vincular por perfil.
        const { data: profile } = await admin
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle()
        if (!profile?.id) {
          return NextResponse.json({ error: createUserError.message }, { status: 400 })
        }
        userId = profile.id
      } else {
        userId = createdUser.user.id
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "No pudimos vincular la cuenta." }, { status: 500 })
    }

    const { error: linkError } = await admin
      .from("payments")
      .update({
        user_id: userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .eq("checkout_token", checkoutToken)

    if (linkError) {
      return NextResponse.json({ error: "No pudimos asociar el pago a tu cuenta." }, { status: 500 })
    }

    // Vincular también otros pagos de invitado del mismo email para no perder historial.
    await admin
      .from("payments")
      .update({
        user_id: userId,
        updated_at: new Date().toISOString(),
      })
      .is("user_id", null)
      .eq("user_email", email)

    return NextResponse.json({ ok: true, userId })
  } catch (error) {
    console.error("complete-account error:", error)
    return NextResponse.json({ error: "Error al completar la cuenta." }, { status: 500 })
  }
}
