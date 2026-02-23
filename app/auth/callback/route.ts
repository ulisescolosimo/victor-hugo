import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

function getNextPath(next: string | null): string {
  if (!next) return "/miembros"
  if (next.startsWith("/") && !next.startsWith("//")) return next
  return "/miembros"
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = getNextPath(requestUrl.searchParams.get("next"))
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
