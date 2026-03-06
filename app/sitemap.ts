import type { MetadataRoute } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

/** Rutas públicas que queremos indexar. */
const publicRoutes = [
  { path: "", changefreq: "weekly" as const, priority: 1 },
  { path: "/registro", changefreq: "monthly" as const, priority: 0.8 },
  { path: "/login", changefreq: "monthly" as const, priority: 0.7 },
  { path: "/miembros", changefreq: "weekly" as const, priority: 0.9 },
  { path: "/recuperar", changefreq: "monthly" as const, priority: 0.5 },
  { path: "/restablecer", changefreq: "monthly" as const, priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map(({ path, changefreq, priority }) => ({
    url: path ? `${baseUrl}${path}` : baseUrl,
    lastModified: new Date(),
    changeFrequency: changefreq,
    priority,
  }))
}
