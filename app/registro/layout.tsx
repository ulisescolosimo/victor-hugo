import type { Metadata } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Creá tu cuenta en El Último Mundial para aportar y ser parte de la transmisión del Mundial 2026 con Víctor Hugo Morales.",
  openGraph: {
    title: "Crear cuenta | El Último Mundial",
    description:
      "Registrate para aportar y ser parte de la transmisión del Mundial 2026 relatada por Víctor Hugo Morales.",
    url: `${siteUrl}/registro`,
  },
  alternates: { canonical: `${siteUrl}/registro` },
  robots: { index: true, follow: true },
}

export default function RegistroLayout({
  children,
}: { children: React.ReactNode }) {
  return children
}
