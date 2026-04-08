import { NextRequest, NextResponse } from "next/server"
import {
  createAdminSessionToken,
  getAdminCookieName,
  isAdminConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Falta configurar ADMIN_DASHBOARD_PASSWORD en el servidor." },
      { status: 500 }
    )
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string }
  const password = body.password?.trim() ?? ""

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Contraseña inválida" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: getAdminCookieName(),
    value: createAdminSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })

  return response
}
