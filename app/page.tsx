import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StorySection } from "@/components/story-section"
import ObjectivesParticipationSection from "@/components/objectives-participation-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  openGraph: {
    title: "El Último Mundial - Victor Hugo Morales | Transmisión Mundial 2026",
    description:
      "Una transmisión hecha por los oyentes, relatada por Víctor Hugo Morales. Aportá y hacé posible El Último Mundial.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://elultimomundial.com",
  },
}

export default function Home() {
  return (
    <main>
      <div className="relative">
        <Header />
        <HeroSection />
      </div>
      <ObjectivesParticipationSection />
      <StorySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
