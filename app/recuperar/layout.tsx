import type { Metadata } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description:
    "¿Olvidaste tu contraseña? Solicitá el restablecimiento para tu cuenta de El Último Mundial.",
  openGraph: {
    title: "Recuperar contraseña | El Último Mundial",
    description:
      "Solicitá el restablecimiento de tu contraseña para acceder a tu cuenta.",
    url: `${siteUrl}/recuperar`,
  },
  alternates: { canonical: `${siteUrl}/recuperar` },
  robots: { index: false, follow: true },
}

export default function RecuperarLayout({
  children,
}: { children: React.ReactNode }) {
  return children
}
