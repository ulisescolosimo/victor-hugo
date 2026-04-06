"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"

/** Activa con ?simulate_purchase=1 (opcional: purchase_value, purchase_currency) */
const SIMULATE_PARAM = "simulate_purchase"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function MetaPixelPurchaseSimulatorInner() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const raw = searchParams.get(SIMULATE_PARAM)
    if (raw !== "1" && raw?.toLowerCase() !== "true") return

    const valueRaw = searchParams.get("purchase_value") ?? "1"
    const currency = (searchParams.get("purchase_currency") ?? "USD").toUpperCase().slice(0, 3)
    const value = Number.parseFloat(valueRaw)
    const payload = {
      value: Number.isFinite(value) ? value : 1,
      currency: currency || "USD",
    }

    let cancelled = false
    let attempts = 0
    const tick = window.setInterval(() => {
      if (cancelled) return
      attempts += 1
      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase", payload)
        window.clearInterval(tick)
      } else if (attempts >= 60) {
        window.clearInterval(tick)
      }
    }, 100)

    return () => {
      cancelled = true
      window.clearInterval(tick)
    }
  }, [searchParams])

  return null
}

export function MetaPixelPurchaseSimulator() {
  return (
    <Suspense fallback={null}>
      <MetaPixelPurchaseSimulatorInner />
    </Suspense>
  )
}
