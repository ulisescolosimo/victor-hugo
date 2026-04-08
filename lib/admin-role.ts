import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Admin si:
 * - `public.profiles.role = 'admin'`, o
 * - existe fila en `public.admin_users` para el usuario (si la tabla sigue existiendo).
 *
 * Asignar (SQL Editor):
 *   update public.profiles set role = 'admin' where id = '<uuid>';
 *
 * Tras la migración que elimina `admin_users`, solo cuenta `profiles.role`.
 *
 * IMPORTANTE: `userId` debe ser el `id` del usuario obtenido con
 * `createClient().auth.getUser()` en el mismo request (layout, route handler, etc.).
 * No volver a leer la sesión aquí: una segunda `getUser()` puede fallar o diferir
 * y devolver 403 en la API aunque el layout haya autorizado.
 */
export async function isUserAdmin(
  userId: string | null | undefined
): Promise<boolean> {
  if (!userId) return false

  try {
    const admin = createAdminClient()

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()

    if (profileError) {
      console.error("isUserAdmin profiles:", profileError.message)
    } else {
      const role = String(profile?.role ?? "")
        .trim()
        .toLowerCase()
      if (role === "admin") return true
    }

    const { data: adminRow, error: adminUsersError } = await admin
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()

    if (adminUsersError) {
      const msg = adminUsersError.message ?? ""
      const tableMissing =
        msg.includes("schema cache") ||
        msg.includes("does not exist") ||
        msg.includes("Could not find the table")
      if (!tableMissing) {
        console.error("isUserAdmin admin_users:", msg)
      }
      return false
    }
    return adminRow != null
  } catch {
    return false
  }
}
