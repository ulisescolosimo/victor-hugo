import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isUserAdmin } from "@/lib/admin-role"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id) {
    return NextResponse.json({ admin: false })
  }
  const admin = await isUserAdmin(user.id)
  const res = NextResponse.json({ admin })
  res.headers.set("Cache-Control", "private, no-store, max-age=0")
  return res
}
