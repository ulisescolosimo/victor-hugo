import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StorySection } from "@/components/story-section"
import ObjectivesParticipationSection from "@/components/objectives-participation-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main>
      <div className="relative">
        <Header />
        <HeroSection />
      </div>
      <StorySection />
      <ObjectivesParticipationSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
