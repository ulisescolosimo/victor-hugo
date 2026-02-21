"use client"

import { Suspense, useState, useEffect, useId } from "react"
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
import { translateAuthError } from "@/lib/utils/error-translator"

const REDIRECT_DELAY_MS = 4000
const SUCCESS_REDIRECT_MS = 2000

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

/** Params que Supabase puede enviar por query o por hash */
function getRecoveryParams(
  searchParams: URLSearchParams,
  hash: string | null
): {
  code: string | null
  type: string | null
  error: string | null
  error_code: string | null
  error_description: string | null
} {
  const fromQuery = {
    code: searchParams.get("code"),
    type: searchParams.get("type"),
    error: searchParams.get("error"),
    error_code: searchParams.get("error_code"),
    error_description: searchParams.get("error_description"),
  }
  if (fromQuery.code ?? fromQuery.error) return fromQuery
  if (!hash) return fromQuery
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""))
  return {
    code: hashParams.get("code") ?? fromQuery.code,
    type: hashParams.get("type") ?? fromQuery.type,
    error: hashParams.get("error") ?? fromQuery.error,
    error_code: hashParams.get("error_code") ?? fromQuery.error_code,
    error_description:
      hashParams.get("error_description") ?? fromQuery.error_description,
  }
}

function RestablecerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = getRedirectPath(searchParams.get("redirect"))
  const reducedMotion = useReducedMotion()

  const [codeExchanged, setCodeExchanged] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verifying, setVerifying] = useState(true)

  const errorId = useId()
  const passwordId = "restablecer-password"
  const confirmPasswordId = "restablecer-confirm"
  const hasError = Boolean(errorMessage)
  const isPasswordInvalid =
    hasError &&
    (errorMessage === "Las contraseñas no coinciden" ||
      errorMessage === "La contraseña debe tener al menos 6 caracteres")
  const isConfirmInvalid = hasError && errorMessage === "Las contraseñas no coinciden"

  const recuperarHref =
    redirectTo !== "/"
      ? "/recuperar?redirect=" + encodeURIComponent(redirectTo)
      : "/recuperar"
  const loginHref =
    redirectTo !== "/"
      ? "/login?redirect=" + encodeURIComponent(redirectTo)
      : "/login"

  // Intercambiar code por sesión o detectar error; si no hay code, comprobar sesión existente
  useEffect(() => {
    if (typeof window === "undefined") return

    const hash = window.location.hash || null
    const params = getRecoveryParams(
      new URLSearchParams(searchParams.toString()),
      hash
    )

    // Error en la URL (enlace expirado, inválido, etc.)
    if (params.error || params.error_description) {
      const msg =
        params.error_description ||
        params.error ||
        "El enlace no es válido o ya expiró."
      setErrorMessage(translateAuthError(msg, "password-reset"))
      setVerifying(false)
      const t = setTimeout(() => {
        router.replace(recuperarHref)
      }, REDIRECT_DELAY_MS)
      return () => clearTimeout(t)
    }

    const supabase = createClient()

    async function run() {
      if (params.code && params.type === "recovery") {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          params.code
        )
        if (error) {
          const msg = translateAuthError(error.message, "password-reset")
          setErrorMessage(msg)
          toast.error(msg)
          setTimeout(() => router.replace(recuperarHref), REDIRECT_DELAY_MS)
          setVerifying(false)
          return
        }
        if (!data.session) {
          setErrorMessage("No se pudo verificar el enlace. Solicitá uno nuevo.")
          setVerifying(false)
          return
        }
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        )
        setCodeExchanged(true)
        setVerifying(false)
        return
      }

      // Sin code: puede ser recarga tras intercambio. Comprobar si ya hay sesión.
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setCodeExchanged(true)
      } else {
        setErrorMessage(
          "No hay un enlace de recuperación válido. Solicitá uno nuevo."
        )
      }
      setVerifying(false)
    }

    run()
  }, [searchParams, router, recuperarHref])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    if (!password || !confirmPassword) {
      const msg = "Completá la contraseña y la confirmación"
      setErrorMessage(msg)
      toast.error(msg)
      return
    }
    if (password.length < 6) {
      const msg = "La contraseña debe tener al menos 6 caracteres"
      setErrorMessage(msg)
      toast.error(msg)
      return
    }
    if (password !== confirmPassword) {
      const msg = "Las contraseñas no coinciden"
      setErrorMessage(msg)
      toast.error(msg)
      return
    }
    if (loading) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      const msg = translateAuthError(error.message, "password-reset")
      setErrorMessage(msg)
      toast.error(msg)
      return
    }
    setSuccess(true)
    toast.success("Contraseña actualizada")
    const t = setTimeout(() => router.push(loginHref), SUCCESS_REDIRECT_MS)
    return () => clearTimeout(t)
  }

  const variants = {
    fade: fadeInUpVariants(Boolean(reducedMotion)),
    stagger: staggerContainerVariants(Boolean(reducedMotion)),
    item: staggerItemVariants(Boolean(reducedMotion)),
  }

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

  const inputClassWithToggle =
    "w-full pr-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
  const toggleButtonClass =
    "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:pointer-events-none"

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
            {success ? "Listo" : "Elegí una nueva contraseña"}
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
              {verifying && (
                <p className="text-center text-white/80">Verificando enlace…</p>
              )}

              {!verifying && errorMessage && !codeExchanged && (
                <div className="space-y-4 text-center">
                  <div
                    id={errorId}
                    role="alert"
                    className="rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-4 py-3"
                  >
                    {errorMessage}
                  </div>
                  <p className="text-sm text-white/60">
                    Serás redirigido para solicitar un nuevo enlace en unos
                    segundos, o{" "}
                    <Link
                      href={recuperarHref}
                      className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                    >
                      solicitá uno ahora
                    </Link>
                    .
                  </p>
                </div>
              )}

              {!verifying && codeExchanged && !success && (
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
                        htmlFor={passwordId}
                        className="text-white/90 font-medium"
                      >
                        Nueva contraseña
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id={passwordId}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (errorMessage) setErrorMessage(null)
                          }}
                          autoComplete="new-password"
                          disabled={loading}
                          aria-invalid={isPasswordInvalid}
                          aria-describedby={hasError ? errorId : undefined}
                          className={inputClassWithToggle}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          aria-pressed={showPassword}
                          disabled={loading}
                          className={toggleButtonClass}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" aria-hidden />
                          ) : (
                            <Eye className="h-5 w-5" aria-hidden />
                          )}
                        </button>
                      </div>
                    </motion.div>
                    <motion.div variants={variants.item}>
                      <Label
                        htmlFor={confirmPasswordId}
                        className="text-white/90 font-medium"
                      >
                        Confirmar contraseña
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id={confirmPasswordId}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            if (errorMessage) setErrorMessage(null)
                          }}
                          autoComplete="new-password"
                          disabled={loading}
                          aria-invalid={isConfirmInvalid}
                          aria-describedby={hasError ? errorId : undefined}
                          className={inputClassWithToggle}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((p) => !p)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          aria-pressed={showConfirmPassword}
                          disabled={loading}
                          className={toggleButtonClass}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" aria-hidden />
                          ) : (
                            <Eye className="h-5 w-5" aria-hidden />
                          )}
                        </button>
                      </div>
                      <p className="mt-1.5 text-sm text-white/60">
                        Mínimo 6 caracteres.
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
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-base h-11 rounded-lg"
                  >
                    {loading ? "Guardando…" : "Guardar contraseña"}
                  </Button>
                </form>
              )}

              {success && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-white/90"
                >
                  Contraseña actualizada. Redirigiendo al inicio de sesión…
                </motion.p>
              )}

              <p className="mt-6 text-center text-white/70 text-sm">
                <Link
                  href={recuperarHref}
                  className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                >
                  Solicitar nuevo enlace
                </Link>
                {" · "}
                <Link
                  href={loginHref}
                  className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                >
                  Inicio de sesión
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

export default function RestablecerPage() {
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
      <RestablecerContent />
    </Suspense>
  )
}
