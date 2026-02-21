"use client"

import { Suspense, useState, useId } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, useReducedMotion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { translateAuthError } from "@/lib/utils/error-translator"

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getRedirectPath(redirect: string | null): string {
  if (!redirect) return "/"
  if (redirect.startsWith("/") && !redirect.startsWith("//")) return redirect
  return "/"
}

function getSiteUrl(): string {
  if (typeof window !== "undefined") return window.location.origin
  return process.env.NEXT_PUBLIC_SITE_URL ?? ""
}

function RecuperarContent() {
  const searchParams = useSearchParams()
  const redirectTo = getRedirectPath(searchParams.get("redirect"))
  const reducedMotion = useReducedMotion()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const errorId = useId()
  const emailId = "recuperar-email"
  const hasError = Boolean(error)
  const isEmailInvalid =
    hasError &&
    (error === "Ingresá tu correo electrónico" || error === "Email inválido")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email.trim()) {
      const msg = "Ingresá tu correo electrónico"
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
    const siteUrl = getSiteUrl()
    const resetUrl =
      siteUrl +
      "/restablecer" +
      (redirectTo !== "/" ? "?redirect=" + encodeURIComponent(redirectTo) : "")
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: resetUrl }
    )
    setLoading(false)
    if (authError) {
      const msg = translateAuthError(authError.message, "forgot-password")
      setError(msg)
      toast.error(msg)
      return
    }
    setEmailSent(true)
    toast.success("Revisá tu correo")
  }

  const variants = {
    fade: fadeInUpVariants(Boolean(reducedMotion)),
    stagger: staggerContainerVariants(Boolean(reducedMotion)),
    item: staggerItemVariants(Boolean(reducedMotion)),
  }

  const loginHref =
    redirectTo !== "/"
      ? "/login?redirect=" + encodeURIComponent(redirectTo)
      : "/login"

  const cardStyle = {
    background:
      "linear-gradient(137.78deg, rgba(36, 36, 36, 0.862981) 0.8%, rgba(185, 185, 185, 0.5) 52.07%, #000000 98.64%)",
    padding: "2px",
    boxShadow: "0px 20px 20px 0px #00000080",
  }

  const innerStyle = {
    background:
      "linear-gradient(118.21deg, #141414 -0.82%, rgba(47, 47, 47, 0.65) 48.44%, rgba(20, 20, 20, 0.25) 100.64%)",
    backdropFilter: "blur(40px)",
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
            variants={variants.fade}
          >
            Recuperar contraseña
          </motion.h1>

          <motion.div
            className="rounded-lg max-w-md mx-auto relative"
            style={cardStyle}
            initial="hidden"
            animate="visible"
            variants={variants.fade}
          >
            <div
              className="rounded-lg p-6 sm:p-8 w-full"
              style={innerStyle}
            >
              {!emailSent ? (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  noValidate
                >
                  <motion.div
                    variants={variants.stagger}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <motion.div variants={variants.item}>
                      <Label
                        htmlFor={emailId}
                        className="text-white/90 font-medium"
                      >
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
                      <p className="mt-2 text-sm text-white/60">
                        Te enviaremos un enlace para restablecer tu contraseña.
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
                    {loading ? "Enviando…" : "Enviar enlace"}
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 text-center"
                >
                  <p className="text-white/90">
                    Revisá tu correo. Si existe una cuenta con{" "}
                    <strong className="text-white">{email}</strong>, te enviamos
                    un enlace para restablecer la contraseña.
                  </p>
                  <p className="text-sm text-white/60">
                    ¿No lo ves? Revisá la carpeta de spam o{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setEmailSent(false)
                        setError("")
                      }}
                      className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                    >
                      enviar de nuevo
                    </button>
                    .
                  </p>
                </motion.div>
              )}

              <p className="mt-6 text-center text-white/70 text-sm">
                <Link
                  href={loginHref}
                  className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                >
                  Volver al inicio de sesión
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

export default function RecuperarPage() {
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
      <RecuperarContent />
    </Suspense>
  )
}
