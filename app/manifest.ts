import type { MetadataRoute } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "El Último Mundial - Victor Hugo Morales",
    short_name: "El Último Mundial",
    description:
      "Una transmisión hecha por los oyentes, relatada por Víctor Hugo Morales. El Mundial 2026 financiado por la comunidad.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "es",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  }
}
