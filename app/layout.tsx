import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { JsonLd } from "@/components/seo/json-ld"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "El Último Mundial - Victor Hugo Morales | Transmisión Mundial 2026 por los oyentes",
    template: "%s | El Último Mundial",
  },
  description:
    "Una transmisión hecha por los oyentes, relatada por Víctor Hugo Morales. El Mundial 2026 financiado por la comunidad. Aportá y hacé posible El Último Mundial.",
  keywords: [
    "Victor Hugo Morales",
    "El Último Mundial",
    "Mundial 2026",
    "transmisión deportiva",
    "relato futbol",
    "aporte colectivo",
    "crowdfunding",
    "México USA Canadá 2026",
  ],
  authors: [{ name: "El Último Mundial", url: siteUrl }],
  creator: "El Último Mundial",
  publisher: "El Último Mundial",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: "El Último Mundial",
    title: "El Último Mundial - Victor Hugo Morales | Transmisión Mundial 2026",
    description:
      "Una transmisión hecha por los oyentes, relatada por Víctor Hugo Morales. Aportá y hacé posible El Último Mundial.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "El Último Mundial - Victor Hugo Morales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Último Mundial - Victor Hugo Morales | Transmisión Mundial 2026",
    description:
      "Una transmisión hecha por los oyentes, relatada por Víctor Hugo Morales. Aportá y hacé posible El Último Mundial.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "deportes",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <JsonLd />
        {children}
        <Toaster richColors position="bottom-right" />
        <Analytics />
      </body>
    </html>
  )
}
