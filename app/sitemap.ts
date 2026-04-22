import type { MetadataRoute } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

/** Rutas públicas indexables (coherente con metadata robots en cada layout). */
const publicRoutes = [
  { path: "", changefreq: "weekly" as const, priority: 1 },
  { path: "/registro", changefreq: "monthly" as const, priority: 0.8 },
  { path: "/miembros", changefreq: "weekly" as const, priority: 0.9 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map(({ path, changefreq, priority }) => ({
    url: path ? `${baseUrl}${path}` : baseUrl,
    lastModified: new Date(),
    changeFrequency: changefreq,
    priority,
  }))
}
