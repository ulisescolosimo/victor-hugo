import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

/**
 * Admin si:
 * - `public.profiles.role = 'admin'`, o
 * - existe fila en `public.admin_users` para el usuario.
 *
 * Asignar (SQL Editor):
 *   update public.profiles set role = 'admin' where id = '<uuid>';
 *   insert into public.admin_users (user_id) values ('<uuid>');
 *
 * La consulta usa service_role solo tras comprobar que `userId` coincide con la sesión.
 */
export async function isUserAdmin(
  userId: string | null | undefined
): Promise<boolean> {
  if (!userId) return false
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id || user.id !== userId) return false

  try {
    const admin = createAdminClient()

    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()
    if (profile?.role === "admin") return true

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
