import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Si Supabase redirige a / con ?code=... (en vez de /auth/callback), reenviar al callback para hacer el exchange
  if (pathname === "/" && searchParams.has("code")) {
    const callbackUrl = new URL("/auth/callback", request.url)
    searchParams.forEach((value, key) => callbackUrl.searchParams.set(key, value))
    if (!callbackUrl.searchParams.has("next")) callbackUrl.searchParams.set("next", "/")
    return NextResponse.redirect(callbackUrl)
  }

  // No ejecutar lógica de auth en restablecer ni en auth/callback: preservar query params (code, etc.)
  // para que la página/route pueda hacer exchangeCodeForSession sin que el middleware toque la request.
  if (pathname === "/restablecer" || pathname === "/auth/callback") {
    return NextResponse.next({
      request: { headers: request.headers },
    })
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresca la sesión si ha expirado
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - archivos de imagen
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
