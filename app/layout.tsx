import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "El Último Mundial - Victor Hugo Morales",
  description: "Una transmisión hecha por los oyentes. Relatada por Víctor Hugo Morales. Un mundial para todos.",
  generator: "v0.app",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "El Último Mundial - Victor Hugo Morales",
    description: "Una transmisión hecha por los oyentes. Relatada por Víctor Hugo Morales. Un mundial para todos.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "El Último Mundial - Victor Hugo Morales",
    description: "Una transmisión hecha por los oyentes. Relatada por Víctor Hugo Morales. Un mundial para todos.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="bottom-right" />
        <Analytics />
      </body>
    </html>
  )
}
