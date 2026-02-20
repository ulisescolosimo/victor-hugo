import { createClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase con service_role. Solo usar en API routes del servidor
 * (ej. webhook de MercadoPago) donde no hay sesión de usuario.
 * Requiere SUPABASE_SERVICE_ROLE_KEY en .env.local
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }
  return createClient(url, key)
}
