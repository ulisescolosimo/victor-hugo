"use client"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackGaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | null | undefined>
) {
  if (typeof window === "undefined") return
  if (typeof window.gtag !== "function") return
  window.gtag("event", eventName, params ?? {})
}

