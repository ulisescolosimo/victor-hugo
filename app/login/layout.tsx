import type { Metadata } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Accedé a tu cuenta de El Último Mundial para ver tus aportes y gestionar tu participación en el proyecto.",
  openGraph: {
    title: "Iniciar sesión | El Último Mundial",
    description:
      "Accedé a tu cuenta para ver tus aportes y participar en la transmisión del Mundial 2026.",
    url: `${siteUrl}/login`,
  },
  alternates: { canonical: `${siteUrl}/login` },
  robots: { index: false, follow: true },
}

export default function LoginLayout({
  children,
}: { children: React.ReactNode }) {
  return children
}
