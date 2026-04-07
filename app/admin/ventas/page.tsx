"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { SiMercadopago, SiPaypal } from "@icons-pack/react-simple-icons"

type PaymentProvider = "mercadopago" | "paypal" | string | null

type AdminPayment = {
  id: string
  preference_id: string | null
  payment_id: string | null
  external_reference: string
  user_id: string
  user_email: string | null
  user_name: string | null
  amount_usd: number
  amount_ars: number
  currency_id: string
  usd_to_ars_rate: number | null
  quantity: number
  unit_price_usd: number
  title: string | null
  status: string
  payment_url: string | null
  created_at: string
  updated_at: string
  approved_at: string | null
  metadata: unknown
  raw_webhook_payload: unknown
  payment_provider: PaymentProvider
  capture_id: string | null
  paypal_net: number | null
  paypal_fee: number | null
  paypal_raw: unknown
  last_capture_error: string | null
}

type StatsPayload = {
  totalRows: number
  byStatus: Record<string, number>
  approved: {
    totalUsd: number
    totalArs: number
    totalQuantity: number
    paymentCount: number
    byProvider: Record<
      string,
      { payments: number; usd: number; ars: number; quantity: number }
    >
  }
}

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  in_process: "En proceso",
  refunded: "Reembolsado",
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "approved":
      return "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
    case "pending":
    case "in_process":
      return "border-amber-500/50 bg-amber-500/15 text-amber-200"
    case "rejected":
    case "cancelled":
    case "refunded":
      return "border-red-500/50 bg-red-500/15 text-red-200"
    default:
      return "border-zinc-500/50 bg-zinc-500/15 text-zinc-200"
  }
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) {
    return (
      <div>
        <p className="text-xs font-medium text-zinc-500 mb-1">{label}</p>
        <p className="text-sm text-zinc-400">—</p>
      </div>
    )
  }
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2)
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500 mb-1">{label}</p>
      <pre className="text-xs bg-zinc-950/80 border border-white/10 rounded-md p-3 overflow-auto max-h-48 text-zinc-300 whitespace-pre-wrap break-all">
        {text}
      </pre>
    </div>
  )
}

export default function AdminVentasPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StatsPayload | null>(null)
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(25)
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [detail, setDetail] = useState<AdminPayment | null>(null)

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    })
    if (statusFilter !== "all") params.set("status", statusFilter)
    try {
      const res = await fetch("/api/admin/payments?" + params.toString())
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Error al cargar datos")
        setStats(null)
        setPayments([])
        return
      }
      setStats(data.stats as StatsPayload)
      setPayments(data.payments as AdminPayment[])
      setTotalCount(data.totalCount as number)
    } catch {
      setError("Error de red")
      setStats(null)
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, statusFilter])

  useEffect(() => {
    load()
  }, [load])

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "Todos los estados" },
      { value: "approved", label: "Aprobado" },
      { value: "pending", label: "Pendiente" },
      { value: "in_process", label: "En proceso" },
      { value: "rejected", label: "Rechazado" },
      { value: "cancelled", label: "Cancelado" },
      { value: "refunded", label: "Reembolsado" },
    ],
    []
  )

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="relative">
        <Header />
      </div>

      <section className="relative bg-zinc-900/50 py-10 sm:py-14 min-h-[80vh]">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Ventas y pagos
              </h1>
              <p className="text-zinc-400 mt-1 text-sm sm:text-base">
                Estadísticas globales y listado con detalle de cada transacción.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 w-fit"
            >
              <Link href="/">Volver al sitio</Link>
            </Button>
          </div>

          {error && (
            <Alert className="mb-6 border-red-500/40 bg-red-500/10 text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading && !stats ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-xl bg-zinc-800" />
                ))}
              </>
            ) : stats ? (
              <>
                <Card className="border-white/10 bg-zinc-900/90">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-zinc-400">
                      Ventas acreditadas (USD)
                    </CardDescription>
                    <CardTitle className="text-2xl text-white tabular-nums">
                      {stats.approved.totalUsd.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    {stats.approved.paymentCount} pago
                    {stats.approved.paymentCount === 1 ? "" : "s"} aprobado
                    {stats.approved.paymentCount === 1 ? "" : "s"}
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-zinc-900/90">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-zinc-400">
                      Total ARS (aprobados)
                    </CardDescription>
                    <CardTitle className="text-2xl text-white tabular-nums">
                      {Math.round(stats.approved.totalArs).toLocaleString("es-AR")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Suma de amount_ars en pagos aprobados
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-zinc-900/90">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-zinc-400">
                      Aportes (unidades)
                    </CardDescription>
                    <CardTitle className="text-2xl text-white tabular-nums">
                      {stats.approved.totalQuantity}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Cantidad total en pagos aprobados
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-zinc-900/90">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-zinc-400">
                      Registros en base
                    </CardDescription>
                    <CardTitle className="text-2xl text-white tabular-nums">
                      {stats.totalRows}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500 space-y-1">
                    {Object.entries(stats.byStatus).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span>{STATUS_LABELS[k] ?? k}</span>
                        <span className="text-zinc-400">{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>

          {/* Por proveedor */}
          {stats && stats.approved.byProvider && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Object.entries(stats.approved.byProvider).map(([provider, p]) => (
                <Card
                  key={provider}
                  className="border-white/10 bg-gradient-to-br from-zinc-900/95 to-zinc-950/95"
                >
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    {provider === "paypal" ? (
                      <SiPaypal className="size-8 text-[#0070ba]" aria-hidden />
                    ) : (
                      <SiMercadopago className="size-8 text-[#009ee3]" aria-hidden />
                    )}
                    <div>
                      <CardTitle className="text-lg text-white capitalize">
                        {provider === "paypal" ? "PayPal" : "Mercado Pago"}
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        {p.payments} pago{p.payments === 1 ? "" : "s"} · {p.quantity}{" "}
                        aporte{p.quantity === 1 ? "" : "s"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-zinc-300 flex flex-wrap gap-x-6 gap-y-1">
                    <span>
                      USD:{" "}
                      <strong className="text-white tabular-nums">
                        {p.usd.toFixed(2)}
                      </strong>
                    </span>
                    <span>
                      ARS:{" "}
                      <strong className="text-white tabular-nums">
                        {Math.round(p.ars).toLocaleString("es-AR")}
                      </strong>
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Tabla */}
          <Card className="border-white/10 bg-zinc-900/80">
            <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <CardTitle className="text-white">Listado de pagos</CardTitle>
                <CardDescription className="text-zinc-400">
                  Clic en &quot;Ver detalle&quot; para ver todos los campos del registro.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[220px] border-white/15 bg-zinc-950 text-white">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    {statusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? (
                <div className="space-y-2 py-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-zinc-800" />
                  ))}
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-zinc-400">Fecha</TableHead>
                        <TableHead className="text-zinc-400">Usuario</TableHead>
                        <TableHead className="text-zinc-400">Estado</TableHead>
                        <TableHead className="text-zinc-400">Prov.</TableHead>
                        <TableHead className="text-zinc-400 text-right">
                          USD
                        </TableHead>
                        <TableHead className="text-zinc-400 text-right">
                          Cant.
                        </TableHead>
                        <TableHead className="text-zinc-400 w-[120px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.length === 0 ? (
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableCell
                            colSpan={7}
                            className="text-center text-zinc-500 py-10"
                          >
                            No hay pagos con este criterio.
                          </TableCell>
                        </TableRow>
                      ) : (
                        payments.map((p) => (
                          <TableRow
                            key={p.id}
                            className="border-white/10 text-zinc-200"
                          >
                            <TableCell className="whitespace-nowrap text-sm">
                              {formatDate(p.created_at)}
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <span className="block truncate text-sm">
                                {p.user_email ?? "—"}
                              </span>
                              {p.user_name ? (
                                <span className="block truncate text-xs text-zinc-500">
                                  {p.user_name}
                                </span>
                              ) : null}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={statusBadgeClass(p.status)}
                              >
                                {STATUS_LABELS[p.status] ?? p.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {p.payment_provider === "paypal"
                                ? "PayPal"
                                : "MP"}
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-sm">
                              {Number(p.amount_usd).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-sm">
                              {p.quantity}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                                onClick={() => setDetail(p)}
                              >
                                <Eye className="size-4 mr-1" aria-hidden />
                                Detalle
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {totalCount > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10">
                      <p className="text-sm text-zinc-500">
                        Página {page} de {totalPages} · {totalCount} registro
                        {totalCount === 1 ? "" : "s"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={page <= 1 || loading}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="border-white/15 bg-zinc-950 text-white"
                        >
                          <ChevronLeft className="size-4" />
                          Anterior
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={page >= totalPages || loading}
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          className="border-white/15 bg-zinc-950 text-white"
                        >
                          Siguiente
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Detalle del pago</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-zinc-500">ID</p>
                  <p className="font-mono text-xs break-all">{detail.id}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Usuario (auth)</p>
                  <p className="font-mono text-xs break-all">{detail.user_id}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Email</p>
                  <p>{detail.user_email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Nombre</p>
                  <p>{detail.user_name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Estado</p>
                  <Badge
                    variant="outline"
                    className={statusBadgeClass(detail.status)}
                  >
                    {STATUS_LABELS[detail.status] ?? detail.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Proveedor</p>
                  <p>{detail.payment_provider ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Referencia externa</p>
                  <p className="font-mono text-xs break-all">
                    {detail.external_reference}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Preference / Order ID</p>
                  <p className="font-mono text-xs break-all">
                    {detail.preference_id ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Payment ID (MP / PayPal)</p>
                  <p className="font-mono text-xs break-all">
                    {detail.payment_id ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Capture ID</p>
                  <p className="font-mono text-xs break-all">
                    {detail.capture_id ?? "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
                <div>
                  <p className="text-xs text-zinc-500">USD</p>
                  <p className="tabular-nums font-medium">
                    {Number(detail.amount_usd).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">ARS</p>
                  <p className="tabular-nums font-medium">
                    {Number(detail.amount_ars).toLocaleString("es-AR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Cantidad</p>
                  <p className="tabular-nums">{detail.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Unit. USD</p>
                  <p className="tabular-nums">
                    {Number(detail.unit_price_usd).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Moneda</p>
                  <p>{detail.currency_id}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">TC USD→ARS</p>
                  <p className="tabular-nums">
                    {detail.usd_to_ars_rate != null
                      ? Number(detail.usd_to_ars_rate).toFixed(4)
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">PayPal net</p>
                  <p className="tabular-nums">
                    {detail.paypal_net != null
                      ? Number(detail.paypal_net).toFixed(2)
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">PayPal fee</p>
                  <p className="tabular-nums">
                    {detail.paypal_fee != null
                      ? Number(detail.paypal_fee).toFixed(2)
                      : "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-1">Título</p>
                <p>{detail.title ?? "—"}</p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-1">URL de pago</p>
                {detail.payment_url ? (
                  <a
                    href={detail.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:underline break-all text-xs"
                  >
                    {detail.payment_url}
                  </a>
                ) : (
                  <p>—</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-zinc-500">Creado</p>
                  <p>{formatDate(detail.created_at)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Actualizado</p>
                  <p>{formatDate(detail.updated_at)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Aprobado</p>
                  <p>{formatDate(detail.approved_at)}</p>
                </div>
              </div>

              {detail.last_capture_error ? (
                <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-100">
                  <AlertDescription className="text-xs">
                    Error captura: {detail.last_capture_error}
                  </AlertDescription>
                </Alert>
              ) : null}

              <JsonBlock label="metadata" value={detail.metadata} />
              <JsonBlock
                label="raw_webhook_payload"
                value={detail.raw_webhook_payload}
              />
              <JsonBlock label="paypal_raw" value={detail.paypal_raw} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
