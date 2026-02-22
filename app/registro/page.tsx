"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

function getRedirectPath(redirect: string | null): string {
  if (!redirect) return "/"
  if (redirect.startsWith("/") && !redirect.startsWith("//")) return redirect
  return "/"
}

function RegistroContent() {
  const searchParams = useSearchParams()
  const redirectTo = getRedirectPath(searchParams.get("redirect"))
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Completa todos los campos")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectTo !== "/" ? `${origin}${redirectTo}` : `${origin}/`,
        data: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
        },
      },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Revisa tu correo para confirmar la cuenta")
    window.location.href = redirectTo
  }

  async function handleGoogleSignIn() {
    if (loadingGoogle) return
    setLoadingGoogle(true)
    const supabase = createClient()
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const redirectToCallback =
      redirectTo !== "/"
        ? `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : `${origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectToCallback },
    })
    setLoadingGoogle(false)
    if (error) {
      toast.error(error.message)
      return
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="relative">
        <Header />
      </div>

      <section className="relative bg-[#1a1a1a] py-12 sm:py-16 md:py-24 min-h-[100vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-4 max-w-6xl pt-12">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-white tracking-tight"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
          >
            Crear cuenta
          </motion.h1>

          <motion.div
            className="rounded-lg max-w-md mx-auto relative"
            style={{
              background: "linear-gradient(137.78deg, rgba(36, 36, 36, 0.862981) 0.8%, rgba(185, 185, 185, 0.5) 52.07%, #000000 98.64%)",
              padding: "2px",
              boxShadow: "0px 20px 20px 0px #00000080",
            }}
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
          >
            <div
              className="rounded-lg p-6 sm:p-8 w-full"
              style={{
                background: "linear-gradient(118.21deg, #141414 -0.82%, rgba(47, 47, 47, 0.65) 48.44%, rgba(20, 20, 20, 0.25) 100.64%)",
                backdropFilter: "blur(40px)",
              }}
            >
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading || loadingGoogle}
                  onClick={handleGoogleSignIn}
                  className="w-full h-11 rounded-lg border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white flex items-center justify-center gap-2"
                >
                  <GoogleIcon />
                  {loadingGoogle ? "Conectando…" : "Continuar con Google"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-2 text-white/60">o</span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible" className="space-y-4">
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-nombre" className="text-white/90 font-medium">
                      Nombre
                    </Label>
                    <Input
                      id="reg-nombre"
                      type="text"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      autoComplete="given-name"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-apellido" className="text-white/90 font-medium">
                      Apellido
                    </Label>
                    <Input
                      id="reg-apellido"
                      type="text"
                      placeholder="Tu apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      autoComplete="family-name"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-email" className="text-white/90 font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-password" className="text-white/90 font-medium">
                      Contraseña
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-confirm" className="text-white/90 font-medium">
                      Repetir contraseña
                    </Label>
                    <Input
                      id="reg-confirm"
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                </motion.div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-base h-11 rounded-lg"
                >
                  {loading ? "Creando cuenta…" : "Registrarme"}
                </Button>
              </form>
              <p className="mt-6 text-center text-white/70 text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href={redirectTo !== "/" ? "/login?redirect=" + encodeURIComponent(redirectTo) : "/login"}
                  className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function RegistroPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black">
          <div className="relative">
            <Header />
          </div>
          <section className="relative bg-[#1a1a1a] min-h-[60vh] flex items-center justify-center">
            <p className="text-white/70">Cargando…</p>
          </section>
        </main>
      }
    >
      <RegistroContent />
    </Suspense>
  )
}
