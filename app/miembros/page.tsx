"use client"

import { Suspense, useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Loader2,
  XCircle,
  HelpCircle,
  Coins,
  Calendar,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MUNDIAL_DATE = new Date("2026-06-11T12:00:00Z")
const CONTRIBUTION_UNIT_USD = 0.1

type PaymentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "in_process"
  | "refunded"

type Payment = {
  id: string
  status: PaymentStatus
  amount_usd: number
  quantity: number
  created_at: string
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  in_process: "En proceso",
  refunded: "Reembolsado",
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusLabel(status: PaymentStatus): string {
  return STATUS_LABELS[status] ?? status
}

function statusColor(status: PaymentStatus): string {
  switch (status) {
    case "approved":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    case "pending":
    case "in_process":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30"
    case "rejected":
    case "cancelled":
    case "refunded":
      return "bg-red-500/20 text-red-300 border-red-500/30"
    default:
      return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
  }
}

function StatusIcon({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "approved":
      return <CheckCircle className="size-3.5 shrink-0" aria-hidden />
    case "pending":
    case "in_process":
      return <Clock className="size-3.5 shrink-0" aria-hidden />
    case "rejected":
    case "cancelled":
    case "refunded":
      return <XCircle className="size-3.5 shrink-0" aria-hidden />
    default:
      return <HelpCircle className="size-3.5 shrink-0" aria-hidden />
  }
}

function useCountdown(target: Date) {
  const [diff, setDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const tick = () => {
      const now = new Date()
      const total = Math.max(0, target.getTime() - now.getTime())
      setDiff({
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((total % (1000 * 60)) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return { ...diff, mounted }
}

// Wrapper reutilizable con gradiente (Tailwind). Evita inline styles.
function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={
        "rounded-xl border border-white/10 bg-gradient-to-b from-zinc-900/95 via-zinc-800/80 to-zinc-900/95 shadow-xl backdrop-blur-sm " +
        (className ?? "")
      }
    >
      {children}
    </div>
  )
}

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

// Countdown con widths fijas y tabular-nums para evitar saltos
function CountdownBlock({ target }: { target: Date }) {
  const countdown = useCountdown(target)
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (!countdown.mounted) {
    return (
      <div className="flex justify-center gap-3 sm:gap-4" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-8 w-14 sm:h-9 sm:w-16 rounded" />
            <span className="mt-1 text-xs text-zinc-400 uppercase tracking-wider">
              {["días", "horas", "min", "seg"][i]}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const values = [
    { n: countdown.days, label: "días", w: "w-14 sm:w-16" },
    { n: countdown.hours, label: "horas", w: "w-12 sm:w-14" },
    { n: countdown.minutes, label: "min", w: "w-12 sm:w-14" },
    { n: countdown.seconds, label: "seg", w: "w-12 sm:w-14" },
  ]

  return (
    <div
      className="flex flex-wrap justify-center gap-3 sm:gap-4"
      role="timer"
      aria-live={prefersReducedMotion ? "off" : "polite"}
      aria-label="Cuenta regresiva al primer partido del Mundial 2026"
    >
      {values.map(({ n, label, w }) => (
        <div key={label} className="flex flex-col items-center">
          <span
            className={`text-2xl sm:text-3xl font-bold text-white tabular-nums ${w} inline-block text-center`}
          >
            {String(n).padStart(label === "días" ? 3 : 2, "0")}
          </span>
          <span className="mt-1 text-xs text-zinc-400 uppercase tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

// Fila superior: Resumen (izq) + Countdown (der) en desktop; stack en mobile
function SummaryRow({
  totalAportes,
  totalUsd,
  ultimoAporte,
  isLoading,
}: {
  totalAportes: number
  totalUsd: number
  ultimoAporte: string | null
  isLoading: boolean
}) {
  const isActivo = totalAportes >= 1

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeIn} className="min-h-0 flex">
        <GlassCard className="p-6 h-full flex-1 min-h-0">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Resumen de aportes
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-28" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Coins className="size-4 text-zinc-400" aria-hidden />
                <span className="text-zinc-300">
                  <strong className="text-white font-semibold">
                    {totalAportes}
                  </strong>{" "}
                  {totalAportes === 1 ? "aporte" : "aportes"} acreditados
                </span>
              </div>
              <div className="text-zinc-300">
                <strong className="text-white font-semibold">
                  {totalUsd.toFixed(2)} USD
                </strong>{" "}
                total
              </div>
              {ultimoAporte ? (
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Calendar className="size-3.5" aria-hidden />
                  Último: {formatDate(ultimoAporte)}
                </div>
              ) : null}
              <div className="pt-2">
                <Badge
                  variant="outline"
                  className={
                    isActivo
                      ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                      : "border-zinc-500/40 text-zinc-400 bg-zinc-500/10"
                  }
                >
                  {isActivo ? "Activo" : "Sin aportes"}
                </Badge>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeIn} className="min-h-0 flex">
        <GlassCard className="p-6 h-full flex flex-col flex-1 min-h-0">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">
            Mundial FIFA 2026
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Cuenta regresiva hasta el primer partido
          </p>
          <div className="flex-1 flex items-center justify-center min-h-0">
            <CountdownBlock target={MUNDIAL_DATE} />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

function RedirectAlert({
  type,
  text,
}: {
  type: "success" | "failure" | "pending"
  text: string
}) {
  const config = {
    success: {
      className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
      role: "status",
    },
    pending: {
      className: "border-amber-500/40 bg-amber-500/10 text-amber-200",
      role: "status",
    },
    failure: {
      className: "border-red-500/40 bg-red-500/10 text-red-200",
      role: "alert",
    },
  }[type]

  return (
    <Alert
      className={config.className}
      role={config.role as "alert" | "status"}
    >
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  )
}

type HistorialFilter = "todos" | "approved" | "pending" | "rejected"

function filterPayments(
  payments: Payment[],
  filter: HistorialFilter
): Payment[] {
  switch (filter) {
    case "approved":
      return payments.filter((p) => p.status === "approved")
    case "pending":
      return payments.filter(
        (p) => p.status === "pending" || p.status === "in_process"
      )
    case "rejected":
      return payments.filter((p) =>
        ["rejected", "cancelled", "refunded"].includes(p.status)
      )
    default:
      return payments
  }
}

function HistorialList({
  payments,
  loading,
  totalPayments,
}: {
  payments: Payment[]
  loading: boolean
  totalPayments: number
}) {
  if (loading) {
    return (
      <ul className="space-y-2">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <Skeleton className="h-14 w-full rounded-lg" />
          </li>
        ))}
      </ul>
    )
  }
  if (payments.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-white/20 bg-white/5 py-12 px-6 text-center"
        role="status"
      >
        <p className="text-zinc-400 mb-4">
          {totalPayments === 0
            ? "Aún no tenés aportes."
            : "No hay movimientos con este filtro."}
        </p>
        <Button
          asChild
          variant="secondary"
          className="border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          <Link href="#quantity-input">Hacer mi primer aporte</Link>
        </Button>
      </div>
    )
  }
  return (
    <ul className="space-y-2" role="list">
      {payments.map((p) => (
        <li
          key={p.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-zinc-300 font-medium">
              {formatDate(p.created_at)}
            </span>
            <span className="text-zinc-500 text-xs">
              {p.quantity}{" "}
              {p.quantity === 1 ? "aporte" : "aportes"} ·{" "}
              {Number(p.amount_usd).toFixed(2)} USD
              {p.id ? <span className="ml-1">· #{p.id.slice(-6)}</span> : null}
            </span>
          </div>
          <Badge variant="outline" className={"border " + statusColor(p.status)}>
            <StatusIcon status={p.status} />
            <span className="ml-1.5">{statusLabel(p.status)}</span>
          </Badge>
        </li>
      ))}
    </ul>
  )
}

function MiembrosContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [authLoading, setAuthLoading] = useState(true)
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [historialTab, setHistorialTab] = useState<HistorialFilter>("todos")
  const [redirectMessage, setRedirectMessage] = useState<{
    type: "success" | "failure" | "pending"
    text: string
  } | null>(null)

  // Una sola verificación de auth y fetch de payments
  useEffect(() => {
    const client = createClient()
    client.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login?redirect=/miembros")
        return
      }
      setAuthLoading(false)
      client
        .from("payments")
        .select("id, status, amount_usd, quantity, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(
          ({ data }) => {
            setPayments((data as Payment[]) ?? [])
            setPaymentsLoading(false)
          },
          () => setPaymentsLoading(false)
        )
    })
  }, [router])

  // Query params payment / payment_id
  useEffect(() => {
    const payment = searchParams.get("payment")
    const paymentId = searchParams.get("payment_id")
    if (!payment || !paymentId) return
    const messages: Record<
      string,
      { type: "success" | "failure" | "pending"; text: string }
    > = {
      success: {
        type: "success",
        text: "Pago acreditado. Gracias por tu aporte.",
      },
      failure: {
        type: "failure",
        text: "El pago no pudo completarse. Podés intentar de nuevo.",
      },
      pending: {
        type: "pending",
        text: "Tu pago está pendiente. Te avisaremos cuando se acredite.",
      },
    }
    const msg = messages[payment]
    if (msg) {
      setRedirectMessage(msg)
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                status: (payment === "success"
                  ? "approved"
                  : payment === "pending"
                    ? "pending"
                    : p.status) as Payment["status"],
              }
            : p
        )
      )
      window.history.replaceState({}, "", "/miembros")
    }
  }, [searchParams])

  const handlePayWithMercadoPago = useCallback(async () => {
    setPaymentLoading(true)
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRedirectMessage({
          type: "failure",
          text: data.error ?? "Error al crear el pago",
        })
        return
      }
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
        return
      }
      setRedirectMessage({
        type: "failure",
        text: "No se obtuvo la URL de pago.",
      })
    } catch {
      setRedirectMessage({
        type: "failure",
        text: "Error de conexión. Intentá de nuevo.",
      })
    } finally {
      setPaymentLoading(false)
    }
  }, [quantity])

  const approvedPayments = useMemo(
    () => payments.filter((p) => p.status === "approved"),
    [payments]
  )
  const totalAportes = useMemo(
    () => approvedPayments.reduce((acc, p) => acc + p.quantity, 0),
    [approvedPayments]
  )
  const totalUsd = useMemo(
    () => approvedPayments.reduce((acc, p) => acc + Number(p.amount_usd), 0),
    [approvedPayments]
  )
  const ultimoAporte = useMemo(() => {
    if (approvedPayments.length === 0) return null
    return approvedPayments[0].created_at
  }, [approvedPayments])

  const clampQuantity = useCallback((n: number) => Math.min(10, Math.max(1, n)), [])

  if (authLoading) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <div className="relative">
          <Header />
        </div>
        <section className="relative bg-zinc-900/50 min-h-[60vh] flex items-center justify-center">
          <p className="text-zinc-400">Verificando sesión…</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="relative">
        <Header />
      </div>

      <section className="relative bg-zinc-900/50 py-12 sm:py-16 md:py-20 min-h-[80vh]">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl pt-8">
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Zona de miembros
          </motion.h1>

          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <SummaryRow
              totalAportes={totalAportes}
              totalUsd={totalUsd}
              ultimoAporte={ultimoAporte}
              isLoading={paymentsLoading}
            />

            {redirectMessage && (
              <motion.div variants={fadeIn}>
                <RedirectAlert
                  type={redirectMessage.type}
                  text={redirectMessage.text}
                />
              </motion.div>
            )}

            {/* Sección Aportar */}
            <motion.div variants={fadeIn}>
              <Card className="border-white/10 bg-zinc-900/80 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Aportar</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Sumá más aportes cuando quieras. Se cobrará en ARS al tipo de
                    cambio del día.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="quantity-input"
                      className="text-sm font-medium text-zinc-300"
                    >
                      Cantidad de aportes (1–10)
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                        disabled={quantity <= 1 || paymentLoading}
                        aria-label="Menos aportes"
                        className="h-10 w-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                      <Input
                        id="quantity-input"
                        type="number"
                        min={1}
                        max={10}
                        value={quantity}
                        onChange={(e) => {
                          const raw = e.target.value
                          if (raw === "") return
                          const n = parseInt(raw, 10)
                          setQuantity(clampQuantity(isNaN(n) ? 1 : n))
                        }}
                        onBlur={(e) => {
                          const n = parseInt(e.target.value, 10)
                          if (e.target.value === "" || isNaN(n) || n < 1)
                            setQuantity(1)
                          else if (n > 10) setQuantity(10)
                        }}
                        disabled={paymentLoading}
                        aria-describedby="quantity-hint total-usd"
                        className="h-10 w-20 text-center text-white bg-white/5 border-white/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                        disabled={quantity >= 10 || paymentLoading}
                        aria-label="Más aportes"
                        className="h-10 w-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                    </div>
                    <p id="quantity-hint" className="text-xs text-zinc-500">
                      Total:{" "}
                      <span id="total-usd" className="font-medium text-zinc-300">
                        {(quantity * CONTRIBUTION_UNIT_USD).toFixed(2)} USD
                      </span>
                      . Se cobrará en ARS al TC del día.
                    </p>
                  </div>

                  <Button
                    onClick={handlePayWithMercadoPago}
                    disabled={paymentLoading}
                    className="w-full sm:w-auto bg-[#009ee3] hover:bg-[#008cd1] text-white font-semibold h-11 px-6"
                    size="lg"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2
                          className="mr-2 size-4 animate-spin"
                          aria-hidden
                        />
                        Redirigiendo…
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 size-4" aria-hidden />
                        Pagar con Mercado Pago
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Historial de pagos */}
            <motion.div variants={fadeIn}>
              <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">
                    Historial de pagos
                  </h2>
                  <p className="text-sm text-zinc-400 mt-0.5">
                    Todos tus movimientos
                  </p>
                </div>
                <Tabs
                  value={historialTab}
                  onValueChange={(v) =>
                    setHistorialTab(v as HistorialFilter)
                  }
                  className="w-full"
                >
                  <div className="px-6 pt-4">
                    <TabsList className="bg-white/5 border border-white/10 rounded-lg p-1 h-auto flex-wrap gap-1">
                      <TabsTrigger
                        value="todos"
                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-md"
                      >
                        Todos
                      </TabsTrigger>
                      <TabsTrigger
                        value="approved"
                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-md"
                      >
                        Aprobados
                      </TabsTrigger>
                      <TabsTrigger
                        value="pending"
                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-md"
                      >
                        Pendientes
                      </TabsTrigger>
                      <TabsTrigger
                        value="rejected"
                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-md"
                      >
                        Rechazados
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="todos" className="mt-0 p-6 pt-4">
                    <HistorialList
                      payments={filterPayments(payments, "todos")}
                      loading={paymentsLoading}
                      totalPayments={payments.length}
                    />
                  </TabsContent>
                  <TabsContent value="approved" className="mt-0 p-6 pt-4">
                    <HistorialList
                      payments={filterPayments(payments, "approved")}
                      loading={paymentsLoading}
                      totalPayments={payments.length}
                    />
                  </TabsContent>
                  <TabsContent value="pending" className="mt-0 p-6 pt-4">
                    <HistorialList
                      payments={filterPayments(payments, "pending")}
                      loading={paymentsLoading}
                      totalPayments={payments.length}
                    />
                  </TabsContent>
                  <TabsContent value="rejected" className="mt-0 p-6 pt-4">
                    <HistorialList
                      payments={filterPayments(payments, "rejected")}
                      loading={paymentsLoading}
                      totalPayments={payments.length}
                    />
                  </TabsContent>
                </Tabs>
              </GlassCard>
            </motion.div>
          </motion.div>

          <p className="mt-10 text-center">
            <Link
              href="/"
              className="text-sm text-pink-400 hover:text-pink-300 underline-offset-2 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-pink-500/50 rounded"
            >
              Volver al inicio
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function MiembrosPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-950">
          <div className="relative">
            <Header />
          </div>
          <section className="relative bg-zinc-900/50 min-h-[60vh] flex items-center justify-center">
            <p className="text-zinc-400">Cargando…</p>
          </section>
        </main>
      }
    >
      <MiembrosContent />
    </Suspense>
  )
}
