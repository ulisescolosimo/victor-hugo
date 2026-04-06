import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin } from "@/lib/admin-role"

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=" + encodeURIComponent("/admin/ventas"))
  }
  if (!(await isUserAdmin(user.id))) {
    redirect("/")
  }

  return <>{children}</>
}
