import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-black bg-cover bg-center bg-no-repeat min-h-[100vh]"
      style={{
        backgroundImage: "url(/images/stadium-background.jpg)",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 w-full h-full bg-gradient-to-r from-black/70 via-black/40 to-black/70 min-h-[100vh]"></div>
      
      {/* Content Container */}
      <div className="relative z-50 flex flex-col h-[90vh] min-h-[90vh]">
        {/* Hero Content */}
        <div className="relative flex flex-1 justify-center pb-0 h-full">
          <div className="container mx-auto px-4 max-w-6xl w-full pb-12 lg:pb-16 self-end">
            {/* Left Content */}
            <div className="relative">
                <h1
                  className="mb-6 text-white uppercase text-[100px] leading-[83%] tracking-normal"
                  style={{
                    fontFamily: '"BBH Sans Hegarty", "Arial", sans-serif',
                    fontWeight: 400,
                    fontStyle: "normal",
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
                  <Button
                    size="lg"
                    className="px-8 text-white uppercase hover:opacity-90 text-xl leading-[107%] tracking-normal font-medium"
                    style={{
                      background: 'linear-gradient(90deg, #CA0091 0%, #500062 100%)',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    Quiero aportar 18 USD
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white bg-transparent px-8 text-white uppercase text-xl leading-[107%] tracking-normal font-medium"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    Cómo funciona
                  </Button>
                </div>

                {/* Verification Checkmarks */}
                <div className="relative z-40 flex flex-wrap gap-x-6 gap-y-3">
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
          </div>
        </div>

      {/* Right Image - Posicionada relativo a la sección completa, pegada al fondo */}
      <div className="absolute bottom-0 z-20 hidden w-3/4 lg:block" style={{ right: '-60px' }}>
        <div className="relative w-full" style={{ height: '100vh', minHeight: '100vh' }}>
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
    </section>
  )
}
