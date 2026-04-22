import type { MetadataRoute } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
