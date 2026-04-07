import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAdminCookieName, isValidAdminSession } from "@/lib/admin-auth"

const MANAGEMENT_FEE_PERCENT = 12
const NET_MULTIPLIER = 1 - MANAGEMENT_FEE_PERCENT / 100

type PaymentRow = {
  id: string
  created_at: string
  status: string
  payment_provider: "mercadopago" | "paypal" | null
  user_name: string | null
  user_email: string | null
  quantity: number
  amount_usd: number
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return Number.parseFloat(value)
  return 0
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date)
  const day = d.getDay()
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  return d
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getAdminCookieName())?.value
  if (!isValidAdminSession(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("payments")
    .select("id, created_at, status, payment_provider, user_name, user_email, quantity, amount_usd")
    .order("created_at", { ascending: false })
    .limit(500)

  if (error) {
    console.error("admin/payments error:", error)
    return NextResponse.json({ error: "No se pudieron obtener los pagos" }, { status: 500 })
  }

  const allRows = (data ?? []) as PaymentRow[]
  const approvedRows = allRows.filter((row) => row.status === "approved")

  const now = new Date()
  const dayStart = startOfDay(now)
  const weekStart = startOfWeek(now)

  const calculateTotals = (rows: PaymentRow[]) =>
    rows.reduce(
      (acc, row) => {
        const gross = toNumber(row.amount_usd)
        const net = Number((gross * NET_MULTIPLIER).toFixed(2))
        acc.quantity += Number(row.quantity) || 0
        acc.amountNetUsd += net
        return acc
      },
      { quantity: 0, amountNetUsd: 0 }
    )

  const totals = {
    today: calculateTotals(approvedRows.filter((row) => new Date(row.created_at) >= dayStart)),
    week: calculateTotals(approvedRows.filter((row) => new Date(row.created_at) >= weekStart)),
    all: calculateTotals(approvedRows),
  }

  const dailyMap = new Map<string, { label: string; quantity: number; amountNetUsd: number }>()
  const last14Start = new Date(dayStart)
  last14Start.setDate(last14Start.getDate() - 13)

  for (let i = 0; i < 14; i += 1) {
    const date = new Date(last14Start)
    date.setDate(last14Start.getDate() + i)
    const key = date.toISOString().slice(0, 10)
    dailyMap.set(key, {
      label: date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
      quantity: 0,
      amountNetUsd: 0,
    })
  }

  for (const row of approvedRows) {
    const created = new Date(row.created_at)
    const key = created.toISOString().slice(0, 10)
    const day = dailyMap.get(key)
    if (!day) continue
    day.quantity += Number(row.quantity) || 0
    day.amountNetUsd += Number((toNumber(row.amount_usd) * NET_MULTIPLIER).toFixed(2))
  }

  return NextResponse.json({
    managementFeePercent: MANAGEMENT_FEE_PERCENT,
    totals: {
      today: { ...totals.today, amountNetUsd: Number(totals.today.amountNetUsd.toFixed(2)) },
      week: { ...totals.week, amountNetUsd: Number(totals.week.amountNetUsd.toFixed(2)) },
      all: { ...totals.all, amountNetUsd: Number(totals.all.amountNetUsd.toFixed(2)) },
    },
    chart: Array.from(dailyMap.values()).map((item) => ({
      ...item,
      amountNetUsd: Number(item.amountNetUsd.toFixed(2)),
    })),
    payments: allRows.map((row) => ({
      ...row,
      amountNetUsd: Number((toNumber(row.amount_usd) * NET_MULTIPLIER).toFixed(2)),
    })),
  })
}
