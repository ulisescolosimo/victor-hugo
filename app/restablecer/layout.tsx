import type { Metadata } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

export const metadata: Metadata = {
  title: "Nueva contraseña",
  description:
    "Definí una nueva contraseña para acceder a tu cuenta de El Último Mundial.",
  openGraph: {
    title: "Restablecer contraseña | El Último Mundial",
    description:
      "Ingresá tu nueva contraseña para recuperar el acceso a tu cuenta.",
    url: `${siteUrl}/restablecer`,
  },
  alternates: { canonical: `${siteUrl}/restablecer` },
  robots: { index: false, follow: true },
}

export default function RestablecerLayout({
  children,
}: { children: React.ReactNode }) {
  return children
}
