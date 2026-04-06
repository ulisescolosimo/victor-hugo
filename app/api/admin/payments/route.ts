import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isUserAdmin } from "@/lib/admin-role"

type PaymentAgg = {
  status: string
  amount_usd: number | string
  amount_ars: number | string
  quantity: number
  payment_provider: string | null
}

function computeStats(rows: PaymentAgg[]) {
  const byStatus: Record<string, number> = {}
  let approvedUsd = 0
  let approvedArs = 0
  let approvedQuantity = 0
  const byProvider: Record<
    string,
    { payments: number; usd: number; ars: number; quantity: number }
  > = {}

  for (const r of rows) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1
    if (r.status !== "approved") continue
    const usd = Number(r.amount_usd)
    const ars = Number(r.amount_ars)
    approvedUsd += usd
    approvedArs += ars
    approvedQuantity += r.quantity
    const key = r.payment_provider ?? "mercadopago"
    if (!byProvider[key]) {
      byProvider[key] = { payments: 0, usd: 0, ars: 0, quantity: 0 }
    }
    byProvider[key].payments += 1
    byProvider[key].usd += usd
    byProvider[key].ars += ars
    byProvider[key].quantity += r.quantity
  }

  return {
    totalRows: rows.length,
    byStatus,
    approved: {
      totalUsd: approvedUsd,
      totalArs: approvedArs,
      totalQuantity: approvedQuantity,
      paymentCount: byStatus["approved"] ?? 0,
      byProvider,
    },
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id || !(await isUserAdmin(user.id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
  const pageSize = Math.min(100, Math.max(5, parseInt(searchParams.get("pageSize") ?? "25", 10) || 25))
  const statusFilter = searchParams.get("status")?.trim()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let admin
  try {
    admin = createAdminClient()
  } catch {
    return NextResponse.json(
      { error: "Configuración del servidor incompleta" },
      { status: 500 }
    )
  }

  const aggQuery = admin
    .from("payments")
    .select("status, amount_usd, amount_ars, quantity, payment_provider")

  const { data: aggRows, error: aggError } = await aggQuery

  if (aggError) {
    console.error("admin payments stats:", aggError)
    return NextResponse.json({ error: "Error al cargar estadísticas" }, { status: 500 })
  }

  const stats = computeStats((aggRows ?? []) as PaymentAgg[])

  let listQuery = admin
    .from("payments")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  if (statusFilter && statusFilter !== "all") {
    listQuery = listQuery.eq("status", statusFilter)
  }

  const { data: payments, error: listError, count } = await listQuery.range(from, to)

  if (listError) {
    console.error("admin payments list:", listError)
    return NextResponse.json({ error: "Error al listar pagos" }, { status: 500 })
  }

  return NextResponse.json({
    stats,
    payments: payments ?? [],
    page,
    pageSize,
    totalCount: count ?? 0,
  })
}
