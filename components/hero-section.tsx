import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section
      className="w-full overflow-hidden bg-black bg-cover bg-center bg-no-repeat"
      style={{
        minHeight: '120vh',
        backgroundImage: "url(/images/stadium-background.jpg)",
        backgroundPosition: "center center",
      }}
    >
      {/* Gradient Overlay */}
      <div className="w-full h-full bg-gradient-to-r from-black/70 via-black/40 to-black/70" style={{ minHeight: '120vh' }}>
        {/* Content Container */}
        <div className="flex h-full flex-col" style={{ minHeight: '120vh' }}>
          {/* Hero Content */}
          <div className="relative flex flex-1 justify-center pb-0">
            <div className="container mx-auto px-4 max-w-6xl w-full pb-12 lg:pb-16 self-end">
              {/* Left Content */}
              <div>
                <h1
                  className="mb-6 text-white uppercase"
                  style={{
                    fontFamily: '"BBH Sans Hegarty", "Arial", sans-serif',
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "150px",
                    lineHeight: "83%",
                    letterSpacing: "0%",
                  }}
                >
                  El
                  <br />
                  Ultimo
                  <br />
                  Mundial
                </h1>

                {/* Subtitle */}
                <p className="mb-8 max-w-xl text-base leading-relaxed text-white lg:text-lg">
                  Llevemos a <strong>Victor Hugo</strong> al Mundial 2026. Financiado por los oyentes.{" "}
                  <strong>Producido por el pueblo.</strong>
                </p>

                {/* CTA Buttons */}
                <div className="mb-10 flex flex-wrap items-center gap-4">
                  <Button size="lg" className="bg-pink-600 px-8 text-sm font-bold uppercase text-white hover:bg-pink-700">
                    Quiero aportar 18 USD
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white bg-transparent px-8 text-sm font-bold uppercase text-white hover:bg-white/10"
                  >
                    Cómo funciona
                  </Button>
                </div>

                {/* Verification Checkmarks */}
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-white lg:text-sm">Aportes verificados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-white lg:text-sm">Reembolsable si no se alcanza la Fase 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-white lg:text-sm">Transparencia en tiempo real</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="absolute bottom-0 z-30 hidden w-3/5 lg:block" style={{ height: '100%', right: '-150px' }}>
              <div className="relative h-full w-full">
                <Image
                  src="/images/victor-hugo-microphone.png"
                  alt="Victor Hugo con micrófono"
                  fill
                  className="object-contain"
                  style={{ objectPosition: "bottom right" }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
