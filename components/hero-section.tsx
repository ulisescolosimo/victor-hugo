"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export function HeroSection() {
  // Variantes de animación para el título
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  // Variantes de animación para elementos con delay
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  // Variantes para la imagen
  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.4, 0, 0.2, 1] as const,
        delay: 0.3,
      },
    },
  }

  // Variantes para los checkmarks con animación escalonada
  const checkmarkContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  }

  const checkmarkItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }
  return (
    <section
      className="relative w-full overflow-hidden bg-black bg-cover bg-center bg-no-repeat min-h-[100vh] sm:min-h-screen"
      style={{
        backgroundImage: "url(/images/stadium-background.jpg)",
      }}
    >
      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 z-10 w-full h-full bg-gradient-to-r from-black/70 via-black/40 to-black/70 min-h-[100vh] sm:min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      ></motion.div>
      
      {/* Content Container */}
      <div className="relative z-50 flex flex-col min-h-[100vh] sm:min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-0 lg:h-[90vh] lg:min-h-[90vh]">
        {/* Hero Content */}
        <div className="relative flex flex-1 justify-center items-center sm:items-end pb-0 h-full">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl w-full pb-8 sm:pb-12 md:pb-16 lg:pb-16 self-center sm:self-end">
            {/* Left Content */}
            <div className="relative w-full">
                <motion.h1
                  className="mb-4 sm:mb-5 md:mb-6 text-white uppercase leading-[83%] tracking-normal text-[36px] sm:text-[48px] md:text-[64px] lg:text-[80px] xl:text-[100px]"
                  style={{
                    fontFamily: '"BBH Sans Hegarty", "Arial", sans-serif',
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                  initial="hidden"
                  animate="visible"
                  variants={titleVariants}
                >
                  El
                  <br />
                  Ultimo
                  <br />
                  Mundial
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="mb-6 sm:mb-7 md:mb-8 max-w-xl text-sm sm:text-base md:text-base lg:text-lg leading-relaxed text-white"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ delay: 0.2 }}
                >
                  Llevemos a <strong>Victor Hugo</strong> al Mundial 2026. Financiado por los oyentes.{" "}
                  <br className="block sm:hidden" />
                  <strong>Producido por el pueblo.</strong>
                </motion.p>

                {/* CTA Buttons */}
                <div className="mb-8 sm:mb-9 md:mb-10 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="w-auto min-w-[200px] sm:w-auto px-6 sm:px-8 text-white uppercase hover:opacity-90 text-base sm:text-lg md:text-xl leading-[107%] tracking-normal font-medium"
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
                    asChild
                    className="w-auto min-w-[200px] sm:w-auto border-2 border-white bg-white text-black sm:bg-transparent sm:text-white px-6 sm:px-8 uppercase text-base sm:text-lg md:text-xl leading-[107%] tracking-normal font-medium sm:hover:bg-white sm:hover:text-black"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    <a 
                      href="#como-funciona"
                      onClick={(e) => {
                        e.preventDefault()
                        const element = document.getElementById('como-funciona')
                        if (element) {
                          const headerOffset = 80
                          const elementPosition = element.getBoundingClientRect().top
                          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          })
                        }
                      }}
                    >
                      Cómo funciona
                    </a>
                  </Button>
                </div>

                {/* Verification Checkmarks */}
                <div className="relative z-40 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-x-4 md:gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shrink-0">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                    <span 
                      className="text-sm sm:text-sm md:text-base text-white"
                      style={{
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      Aportes verificados
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shrink-0">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                    <span 
                      className="text-sm sm:text-sm md:text-base text-white"
                      style={{
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      Reembolsable si no se alcanza la Fase 1
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shrink-0">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                    <span 
                      className="text-sm sm:text-sm md:text-base text-white"
                      style={{
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      Transparencia en tiempo real
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Right Image - Posicionada relativo a la sección completa, pegada al fondo */}
      {/* Mobile: visible, Tablet: visible con ajuste, Desktop: posición original */}
      <motion.div
        className="absolute bottom-0 z-20 right-[-60%] md:right-0 lg:right-[-60px] w-[180%] md:w-2/3 lg:w-3/4"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <div className="relative w-full h-[95vh] sm:h-[85vh] md:h-[70vh] lg:h-[100vh] min-h-[95vh] sm:min-h-[85vh] md:min-h-[70vh] lg:min-h-[100vh]">
          <Image
            src="/images/victor-hugo-microphone.png"
            alt="Victor Hugo con micrófono"
            fill
            className="object-contain"
            style={{ objectPosition: "bottom right" }}
            priority
          />
          {/* Overlay oscuro solo en mobile */}
          <div className="absolute inset-0 bg-black/25 md:bg-transparent pointer-events-none"></div>
        </div>
      </motion.div>
    </section>
  )
}
