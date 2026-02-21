"use client"

import { Suspense, useState, useId } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, useReducedMotion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

const fadeInUpVariants = (reduced: boolean) => ({
  hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.6 },
  },
})

const staggerContainerVariants = (reduced: boolean) => ({
  hidden: { opacity: reduced ? 1 : 0 },
  visible: {
    opacity: 1,
    transition: reduced
      ? { duration: 0 }
      : { staggerChildren: 0.1, delayChildren: 0.1 },
  },
})

const staggerItemVariants = (reduced: boolean) => ({
  hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.5 },
  },
})

function getRedirectPath(redirect: string | null): string {
  if (!redirect) return "/"
  if (redirect.startsWith("/") && !redirect.startsWith("//")) return redirect
  return "/"
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = getRedirectPath(searchParams.get("redirect"))
  const reducedMotion = useReducedMotion()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const errorId = useId()
  const emailId = "login-email"
  const passwordId = "login-password"

  const hasError = Boolean(error)
  const isEmailInvalid = hasError && (error === "Completa email y contraseña" || error === "Email inválido")
  const isPasswordInvalid = hasError && (error === "Completa email y contraseña" || error === "Email o contraseña incorrectos")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password) {
      const msg = "Completa email y contraseña"
      setError(msg)
      toast.error(msg)
      return
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      const msg = "Email inválido"
      setError(msg)
      toast.error(msg)
      return
    }
    if (loading) return
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setLoading(false)
    if (authError) {
      const msg =
        authError.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos"
          : authError.message
      setError(msg)
      toast.error(msg)
      return
    }
    toast.success("Sesión iniciada")
    router.refresh()
    router.push(redirectTo)
  }

  const variants = {
    fade: fadeInUpVariants(Boolean(reducedMotion)),
    stagger: staggerContainerVariants(Boolean(reducedMotion)),
    item: staggerItemVariants(Boolean(reducedMotion)),
  }

  const recuperarHref =
    redirectTo !== "/"
      ? "/recuperar?redirect=" + encodeURIComponent(redirectTo)
      : "/recuperar"

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
            variants={variants.fade}
          >
            Iniciar sesión
          </motion.h1>

          <motion.div
            className="rounded-lg max-w-md mx-auto relative"
            style={{
              background:
                "linear-gradient(137.78deg, rgba(36, 36, 36, 0.862981) 0.8%, rgba(185, 185, 185, 0.5) 52.07%, #000000 98.64%)",
              padding: "2px",
              boxShadow: "0px 20px 20px 0px #00000080",
            }}
            initial="hidden"
            animate="visible"
            variants={variants.fade}
          >
            <div
              className="rounded-lg p-6 sm:p-8 w-full"
              style={{
                background:
                  "linear-gradient(118.21deg, #141414 -0.82%, rgba(47, 47, 47, 0.65) 48.44%, rgba(20, 20, 20, 0.25) 100.64%)",
                backdropFilter: "blur(40px)",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <motion.div
                  variants={variants.stagger}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.div variants={variants.item}>
                    <Label htmlFor={emailId} className="text-white/90 font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      id={emailId}
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError("")
                      }}
                      autoComplete="email"
                      disabled={loading}
                      aria-invalid={isEmailInvalid}
                      aria-describedby={hasError ? errorId : undefined}
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={variants.item}>
                    <Label htmlFor={passwordId} className="text-white/90 font-medium">
                      Contraseña
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id={passwordId}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (error) setError("")
                        }}
                        autoComplete="current-password"
                        disabled={loading}
                        aria-invalid={isPasswordInvalid}
                        aria-describedby={hasError ? errorId : undefined}
                        className="w-full pr-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        aria-pressed={showPassword}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden />
                        )}
                      </button>
                    </div>
                    <p className="mt-1.5 text-sm">
                      <Link
                        href={recuperarHref}
                        className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] rounded"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </p>
                  </motion.div>
                </motion.div>

                {hasError && (
                  <div
                    id={errorId}
                    role="alert"
                    aria-live="assertive"
                    className="rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-4 py-3"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-base h-11 rounded-lg"
                >
                  {loading ? "Entrando…" : "Entrar"}
                </Button>
              </form>
              <p className="mt-6 text-center text-white/70 text-sm">
                ¿No tenés cuenta?{" "}
                <Link
                  href={
                    redirectTo !== "/"
                      ? "/registro?redirect=" + encodeURIComponent(redirectTo)
                      : "/registro"
                  }
                  className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                >
                  Registrate
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

export default function LoginPage() {
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
      <LoginContent />
    </Suspense>
  )
}
