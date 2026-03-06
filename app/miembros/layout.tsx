import type { Metadata } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

export const metadata: Metadata = {
  title: "Aportar al Mundial 2026 - Mercado Pago y PayPal",
  description:
    "Elegí tu aporte y pagá con Mercado Pago o PayPal. Hacé posible la transmisión del Mundial 2026 con Víctor Hugo Morales. Un mundial para todos.",
  keywords: [
    "aporte",
    "aportar",
    "El Último Mundial",
    "Victor Hugo Morales",
    "Mundial 2026",
    "Mercado Pago",
    "PayPal",
    "transmisión futbol",
  ],
  openGraph: {
    title: "Aportar al Mundial 2026 | El Último Mundial",
    description:
      "Aportá con Mercado Pago o PayPal y hacé posible la transmisión con Víctor Hugo Morales. Un mundial para todos.",
    url: `${siteUrl}/miembros`,
  },
  alternates: { canonical: `${siteUrl}/miembros` },
  robots: { index: true, follow: true },
}

export default function MiembrosLayout({
  children,
}: { children: React.ReactNode }) {
  return children
}
