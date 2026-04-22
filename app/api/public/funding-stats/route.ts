import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

/** Alineado con el objetivo publicado en la sección (primera etapa). */
const DEFAULT_GOAL_USD = 250_000

const CACHE = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
}

const DEFAULT_PAYMENTS_PAGE_SIZE = 5
const MAX_PAYMENTS_PAGE_SIZE = 50

function toNum(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const n = Number.parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

type PublicFundingRecent = {
  amountUsd: number
  quantity: number
  at: string
}

type PublicFundingStatsPayload = {
  goalUsd: number
  totalUsd: number
  totalUnits: number
  paymentCount: number
  progressPercent: number
  payments: PublicFundingRecent[]
  paymentsPage: number
  paymentsPageSize: number
  configured: boolean
}

function parsePaymentsPagination(searchParams: URLSearchParams) {
  const pageRaw = parseInt(searchParams.get("paymentsPage") ?? "1", 10)
  const sizeRaw = parseInt(
    searchParams.get("paymentsPageSize") ?? String(DEFAULT_PAYMENTS_PAGE_SIZE),
    10
  )
  const paymentsPageSize = Math.min(
    MAX_PAYMENTS_PAGE_SIZE,
    Math.max(1, Number.isFinite(sizeRaw) ? sizeRaw : DEFAULT_PAYMENTS_PAGE_SIZE)
  )
  const paymentsPage = Math.max(1, Number.isFinite(pageRaw) ? pageRaw : 1)
  return { paymentsPage, paymentsPageSize }
}

export async function GET(request: NextRequest) {
  const { paymentsPage: pageRequested, paymentsPageSize } = parsePaymentsPagination(
    request.nextUrl.searchParams
  )

  const envGoal =
    process.env.PUBLIC_FUNDING_GOAL_USD ?? process.env.NEXT_PUBLIC_FUNDING_GOAL_USD
  const goalUsd = toNum(envGoal) || DEFAULT_GOAL_USD

  let admin
  try {
    admin = createAdminClient()
  } catch (err) {
    console.error("public/funding-stats: sin cliente admin", err)
    const body: PublicFundingStatsPayload = {
      goalUsd,
      totalUsd: 0,
      totalUnits: 0,
      paymentCount: 0,
      progressPercent: 0,
      payments: [],
      paymentsPage: 1,
      paymentsPageSize,
      configured: false,
    }
    return NextResponse.json(body, { status: 200, headers: CACHE })
  }

  let totalUsd = 0
  let totalUnits = 0

  const { data: aggRows, error: aggError } = await admin
    .from("payments")
    .select("total_usd:amount_usd.sum(), total_units:quantity.sum()")
    .eq("status", "approved")

  if (!aggError && aggRows?.length) {
    const agg = (aggRows as { total_usd: unknown; total_units: unknown }[])[0]
    totalUsd = toNum(agg?.total_usd)
    totalUnits = Math.round(toNum(agg?.total_units))
  } else {
    if (aggError) {
      console.warn("public/funding-stats: aggregate no disponible, sumando por páginas:", aggError.message)
    }
    const pageSize = 1000
    for (let from = 0; ; from += pageSize) {
      const { data: chunk, error: chunkError } = await admin
        .from("payments")
        .select("amount_usd, quantity")
        .eq("status", "approved")
        .order("id", { ascending: true })
        .range(from, from + pageSize - 1)

      if (chunkError) {
        console.error("public/funding-stats chunk:", chunkError)
        return NextResponse.json(
          { error: "No se pudieron cargar las estadísticas" },
          { status: 500, headers: CACHE }
        )
      }
      if (!chunk?.length) break
      for (const r of chunk) {
        totalUsd += toNum(r.amount_usd)
        totalUnits += Math.round(toNum(r.quantity)) || 0
      }
      if (chunk.length < pageSize) break
    }
  }

  const { count: paymentCount, error: countError } = await admin
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")

  if (countError) {
    console.error("public/funding-stats count:", countError)
    return NextResponse.json(
      { error: "No se pudieron cargar las estadísticas" },
      { status: 500, headers: CACHE }
    )
  }

  const totalApproved = paymentCount ?? 0
  const listTotalPages = Math.max(1, Math.ceil(totalApproved / paymentsPageSize))
  const paymentsPage = Math.min(pageRequested, listTotalPages)
  const from = (paymentsPage - 1) * paymentsPageSize
  const to = from + paymentsPageSize - 1

  const { data: pageRows, error: pageError } = await admin
    .from("payments")
    .select("amount_usd, quantity, approved_at, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(from, to)

  if (pageError) {
    console.error("public/funding-stats payments page:", pageError)
    return NextResponse.json(
      { error: "No se pudieron cargar las estadísticas" },
      { status: 500, headers: CACHE }
    )
  }

  const payments: PublicFundingRecent[] = (pageRows ?? []).map((row) => {
    const at =
      (row as { approved_at?: string | null; created_at?: string }).approved_at ??
      (row as { created_at: string }).created_at
    return {
      amountUsd: toNum((row as { amount_usd: unknown }).amount_usd),
      quantity: Math.max(1, Math.round(toNum((row as { quantity: unknown }).quantity)) || 1),
      at,
    }
  })

  const progressPercent =
    goalUsd > 0 ? Math.min(100, Math.round((totalUsd / goalUsd) * 1000) / 10) : 0

  const body: PublicFundingStatsPayload = {
    goalUsd,
    totalUsd,
    totalUnits,
    paymentCount: totalApproved,
    progressPercent,
    payments,
    paymentsPage,
    paymentsPageSize,
    configured: true,
  }

  return NextResponse.json(body, { headers: CACHE })
}
