/**
 * JSON-LD estructurado para SEO (WebSite + Organization).
 * Ayuda a los buscadores a entender el sitio y puede habilitar rich results.
 */
export function JsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com"

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "El Último Mundial",
    description:
      "Una transmisión hecha por los oyentes, relatada por Víctor Hugo Morales. El Mundial 2026 financiado por la comunidad.",
    url: siteUrl,
    inLanguage: "es-AR",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "Endpoint", url: `${siteUrl}/miembros` },
      "query-input": "required name=quantity",
    },
  }

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "El Último Mundial",
    url: siteUrl,
    description:
      "Proyecto de transmisión del Mundial 2026 relatado por Víctor Hugo Morales, financiado por los oyentes y la comunidad.",
    sameAs: [],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSite),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />
    </>
  )
}
