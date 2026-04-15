"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { createClient } from "@/lib/supabase/client"
import { trackGaEvent } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type RedirectType = "success" | "failure" | "pending" | "cancelled"

function statusText(type: RedirectType) {
  if (type === "success") return "Pago acreditado. Gracias por tu aporte."
  if (type === "pending") return "Tu pago quedó pendiente. Te avisaremos cuando se acredite."
  if (type === "cancelled") return "Pago cancelado. Podés intentarlo de nuevo."
  return "No pudimos completar el pago. Podés volver a intentarlo."
}

function ThanksContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentTypeParam = (searchParams.get("payment") ?? "pending") as RedirectType
  const paymentType: RedirectType = ["success", "failure", "pending", "cancelled"].includes(paymentTypeParam)
    ? paymentTypeParam
    : "pending"
  const paymentId = searchParams.get("payment_id") ?? ""
  const checkoutToken = searchParams.get("checkout") ?? ""
  const emailParam = searchParams.get("email") ?? ""
  const paypalOrderToken = searchParams.get("token")

  const [status, setStatus] = useState<RedirectType>(paymentType)
  const [statusMessage, setStatusMessage] = useState(statusText(paymentType))
  const [processingCapture, setProcessingCapture] = useState(false)
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState(emailParam)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const hasTrackedThankYou = useRef(false)
  const hasTrackedSale = useRef(false)

  const canCompleteAccount = useMemo(
    () => status === "success" || status === "pending",
    [status]
  )

  useEffect(() => {
    if (processingCapture) return
    if (!hasTrackedThankYou.current) {
      trackGaEvent("vhm_thankyou_view", {
        payment_status: status,
        payment_id: paymentId || null,
      })
      hasTrackedThankYou.current = true
    }
    if (status === "success" && !hasTrackedSale.current) {
      trackGaEvent("vhm_venta", {
        payment_id: paymentId || null,
      })
      hasTrackedSale.current = true
    }
  }, [processingCapture, status, paymentId])

  useEffect(() => {
    if (!paypalOrderToken) return
    if (!paymentId || !checkoutToken) return

    setProcessingCapture(true)
    fetch("/api/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: paypalOrderToken,
        paymentId,
        checkoutToken,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok) {
          setStatus("success")
          setStatusMessage("Pago acreditado. Gracias por tu aporte.")
        } else {
          setStatus("failure")
          setStatusMessage(data?.error ?? "No pudimos confirmar el pago con PayPal.")
        }
      })
      .catch(() => {
        setStatus("failure")
        setStatusMessage("No pudimos confirmar el pago con PayPal.")
      })
      .finally(() => {
        setProcessingCapture(false)
      })
  }, [paypalOrderToken, paymentId, checkoutToken])

  const handleCompleteAccount = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)

    const normalizedEmail = email.trim().toLowerCase()
    if (!paymentId || !checkoutToken) {
      setFormError("Faltan datos del checkout. Volvé a iniciar el aporte.")
      return
    }
    if (!normalizedEmail) {
      setFormError("Ingresá tu email.")
      return
    }
    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden.")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/checkout/complete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          checkoutToken,
          email: normalizedEmail,
          password,
          nombre,
          apellido,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data?.ok) {
        setFormError(data?.error ?? "No pudimos completar tu cuenta.")
        return
      }

      trackGaEvent("vhm_account_completed", {
        payment_id: paymentId || null,
      })

      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })
      if (signInError) {
        setFormError("Cuenta creada. Iniciá sesión para ver tu zona de miembros.")
        return
      }

      router.push(`/miembros?payment=success&payment_id=${encodeURIComponent(paymentId)}`)
    } catch {
      setFormError("Error de conexión. Intentá nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="relative">
        <Header />
      </div>
      <section className="relative bg-[#101010] py-12 sm:py-16 md:py-20 min-h-[80vh]">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl pt-8">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8 shadow-xl">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Gracias por tu aporte
            </h1>
            <p className="text-white/75 mb-4">
              {processingCapture ? "Confirmando tu pago..." : statusMessage}
            </p>
            {paymentId ? (
              <p className="text-white/45 text-xs mb-6">Referencia: {paymentId}</p>
            ) : null}

            {canCompleteAccount ? (
              <form onSubmit={handleCompleteAccount} className="space-y-4">
                <h2 className="text-white text-lg font-semibold">
                  Completá y activá tu cuenta
                </h2>
                <p className="text-white/65 text-sm">
                  La vamos a usar para enviarte novedades y mostrarte tus aportes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="gracias-nombre" className="text-white/85">Nombre</Label>
                    <Input
                      id="gracias-nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gracias-apellido" className="text-white/85">Apellido</Label>
                    <Input
                      id="gracias-apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gracias-email" className="text-white/85">Email</Label>
                  <Input
                    id="gracias-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="gracias-password" className="text-white/85">Contraseña</Label>
                    <Input
                      id="gracias-password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gracias-confirm" className="text-white/85">Repetir contraseña</Label>
                    <Input
                      id="gracias-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                {formError ? (
                  <p className="text-sm text-red-300">{formError}</p>
                ) : null}
                <Button
                  type="submit"
                  disabled={submitting || processingCapture}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white font-bold"
                >
                  {submitting ? "Activando cuenta..." : "Activar mi cuenta"}
                </Button>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-white/70">
                  Podés volver a intentar desde el inicio cuando quieras.
                </p>
                <Button asChild className="bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold">
                  <Link href="/">Volver al inicio</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default function GraciasPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black">
          <div className="relative">
            <Header />
          </div>
          <section className="relative bg-[#101010] min-h-[60vh] flex items-center justify-center">
            <p className="text-white/70">Cargando...</p>
          </section>
        </main>
      }
    >
      <ThanksContent />
    </Suspense>
  )
}
