"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Total = {
  quantity: number
  amountNetUsd: number
}

type Payment = {
  id: string
  created_at: string
  status: string
  payment_provider: "mercadopago" | "paypal" | null
  user_name: string | null
  user_email: string | null
  quantity: number
  amount_usd: number
  amountNetUsd: number
}

type ChartItem = {
  label: string
  quantity: number
  amountNetUsd: number
}

type AdminData = {
  managementFeePercent: number
  totals: { today: Total; week: Total; all: Total }
  chart: ChartItem[]
  payments: Payment[]
}

const chartConfig = {
  amountNetUsd: {
    label: "Monto neto (USD)",
    color: "#22c55e",
  },
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/admin/payments", { cache: "no-store" })
        if (res.status === 401) {
          router.refresh()
          return
        }
        const json = (await res.json()) as AdminData | { error?: string }
        if (!res.ok) {
          setError((json as { error?: string }).error ?? "No se pudo cargar el panel")
          return
        }
        setData(json as AdminData)
      } catch {
        setError("Error de conexión")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.refresh()
  }

  const totals = useMemo(() => data?.totals, [data])
  const approvedPayments = useMemo(
    () => data?.payments.filter((payment) => payment.status === "approved") ?? [],
    [data]
  )
  const pendingAndOtherPayments = useMemo(
    () => data?.payments.filter((payment) => payment.status !== "approved") ?? [],
    [data]
  )

  if (loading) {
    return <div className="px-4 py-10">Cargando panel...</div>
  }

  if (error || !data || !totals) {
    return (
      <div className="px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error ?? "No se pudo cargar información"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Administración de pagos</h1>
        </div>
        <Button variant="secondary" onClick={logout}>Cerrar sesión</Button>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolución (últimos 14 días)</CardTitle>
            <CardDescription>Monto neto diario de pagos aprobados.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={data.chart}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={70} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amountNetUsd" fill="var(--color-amountNetUsd)" radius={6} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen rápido</CardTitle>
            <CardDescription>Totales netos (solo pagos aprobados).</CardDescription>
          </CardHeader>
          <CardContent>
            <section className="grid gap-3">
              <Card className="gap-2 py-4">
                <CardHeader className="px-4 pb-0">
                  <CardDescription className="text-xs uppercase tracking-wide">Hoy</CardDescription>
                  <CardTitle className="text-base">{totals.today.quantity} aportes</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-0 text-lg font-semibold">{formatUsd(totals.today.amountNetUsd)}</CardContent>
              </Card>
              <Card className="gap-2 py-4">
                <CardHeader className="px-4 pb-0">
                  <CardDescription className="text-xs uppercase tracking-wide">Esta semana</CardDescription>
                  <CardTitle className="text-base">{totals.week.quantity} aportes</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-0 text-lg font-semibold">{formatUsd(totals.week.amountNetUsd)}</CardContent>
              </Card>
              <Card className="gap-2 py-4">
                <CardHeader className="px-4 pb-0">
                  <CardDescription className="text-xs uppercase tracking-wide">Todo el periodo</CardDescription>
                  <CardTitle className="text-base">{totals.all.quantity} aportes</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-0 text-lg font-semibold">{formatUsd(totals.all.amountNetUsd)}</CardContent>
              </Card>
            </section>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Listado de pagos</CardTitle>
          <CardDescription>
            Separado por estado. Los totales de arriba ya consideran solo pagos aprobados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="approved">
            <TabsList>
              <TabsTrigger value="approved">Aprobados ({approvedPayments.length})</TabsTrigger>
              <TabsTrigger value="other">Pendientes y otros ({pendingAndOtherPayments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="approved">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Monto neto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.created_at)}</TableCell>
                      <TableCell>{payment.user_name || "-"}</TableCell>
                      <TableCell>{payment.user_email || "-"}</TableCell>
                      <TableCell>{payment.payment_provider || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{payment.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{formatUsd(payment.amountNetUsd)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="other">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Monto neto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAndOtherPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.created_at)}</TableCell>
                      <TableCell>{payment.user_name || "-"}</TableCell>
                      <TableCell>{payment.user_email || "-"}</TableCell>
                      <TableCell>{payment.payment_provider || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{payment.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{formatUsd(payment.amountNetUsd)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
