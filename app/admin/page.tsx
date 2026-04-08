import { cookies } from "next/headers"
import { AdminDashboard } from "./admin-dashboard"
import { AdminLogin } from "./admin-login"
import { getAdminCookieName, isAdminConfigured, isValidAdminSession } from "@/lib/admin-auth"

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <p className="text-sm text-muted-foreground">
          Configurá <code>ADMIN_DASHBOARD_PASSWORD</code> en el entorno para habilitar el panel.
        </p>
      </div>
    )
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(getAdminCookieName())?.value
  const isLogged = isValidAdminSession(token)

  return isLogged ? <AdminDashboard /> : <AdminLogin />
}
