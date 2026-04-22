import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import Script from "next/script"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { JsonLd } from "@/components/seo/json-ld"
import { MetaPixelPurchaseSimulator } from "@/components/meta-pixel-purchase-simulator"
import { GoogleAnalytics } from "@/components/google-analytics"
import "./globals.css"

const META_PIXEL_ID = "1254030806288360"
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const DEFAULT_SITE_URL = "https://elultimomundial.com"
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).trim()

function getMetadataBase(url: string): URL {
  try {
    return new URL(url)
  } catch {
    return new URL(DEFAULT_SITE_URL)
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(siteUrl),
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
        <Suspense fallback={null}>
          <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        </Suspense>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <JsonLd />
        <MetaPixelPurchaseSimulator />
        {children}
        <Toaster richColors position="bottom-right" />
        <Analytics />
      </body>
    </html>
  )
}
