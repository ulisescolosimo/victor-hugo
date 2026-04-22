"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

const MEMBROS_PATH = "/miembros"

function getMembrosUrl(quantity: number) {
  const q = Math.min(10, Math.max(1, quantity))
  return `${MEMBROS_PATH}?quantity=${q}`
}

export function HeroSection() {
  const router = useRouter()
  const [authChecking, setAuthChecking] = useState(false)

  const goToAportar = useCallback(async () => {
    setAuthChecking(true)
    try {
      const client = createClient()
      const { data: { user } } = await client.auth.getUser()
      const targetUrl = getMembrosUrl(1)
      if (!user) {
        router.push("/registro?redirect=" + encodeURIComponent(targetUrl))
        return
      }
      router.push(targetUrl)
    } finally {
      setAuthChecking(false)
    }
  }, [router])
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
      className="relative w-full overflow-hidden bg-black bg-cover bg-center bg-no-repeat min-h-[80vh] sm:min-h-screen border-b border-white/20"
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
      <div className="relative z-50 flex flex-col min-h-[85vh] sm:min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-10 lg:h-[90vh] lg:min-h-[90vh]">
        {/* Hero Content */}
        <div className="relative flex flex-1 justify-center items-end pb-0 h-full">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl w-full pb-6 sm:pb-12 md:pb-16 lg:pb-16 self-end">
            {/* Left Content */}
            <div className="relative w-full">
              <motion.h1
                className="mb-4 sm:mb-5 md:mb-6 block w-fit max-w-full"
                initial="hidden"
                animate="visible"
                variants={titleVariants}
              >
                <Image
                  src="/images/hero-text.png"
                  alt="El Último Mundial"
                  width={1435}
                  height={575}
                  className="h-auto w-[min(100%,300px)] sm:w-[min(100%,410px)] md:w-[min(100%,480px)] lg:w-[min(100%,460px)] xl:w-[min(100%,650px)]"
                  priority
                  sizes="(max-width: 640px) min(100vw - 2rem, 160px), (max-width: 768px) 210px, (max-width: 1024px) 280px, (max-width: 1280px) 360px, 450px"
                />
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mb-6 sm:mb-7 md:mb-8 max-w-xl text-base sm:text-lg md:text-2xl leading-relaxed text-white"
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                transition={{ delay: 0.2 }}
                style={{
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 12px rgba(0, 0, 0, 0.7)'
                }}
              >
                Llevemos a Víctor Hugo al Mundial 2026.{" "}
                <br className="block" />
                Financiado por los oyentes.
              </motion.p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
                <Button
                  size="lg"
                  type="button"
                  onClick={goToAportar}
                  disabled={authChecking}
                  className="cursor-pointer w-full sm:w-auto sm:min-w-[180px] px-4 py-3 sm:px-6 md:px-7 text-white uppercase hover:opacity-90 text-sm sm:text-base md:text-lg leading-[107%] tracking-normal font-medium disabled:opacity-70 disabled:pointer-events-none h-11 sm:h-12 md:h-12"
                  style={{
                    background: 'linear-gradient(90deg, #CA0091 0%, #500062 100%)',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {authChecking ? "Un momento…" : "QUIERO SER PARTE"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="cursor-pointer w-full sm:w-auto sm:min-w-[180px] border-2 border-white bg-white text-black sm:bg-transparent sm:text-white px-4 py-3 sm:px-6 md:px-7 uppercase text-sm sm:text-base md:text-lg leading-[107%] tracking-normal font-medium sm:hover:bg-white sm:hover:text-black h-11 sm:h-12 md:h-12"
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
          {/* Imagen para mobile */}
          <Image
            src="/images/vhm_mobile-removebg-preview.png"
            alt="Victor Hugo con micrófono"
            fill
            className="object-contain sm:hidden"
            style={{ objectPosition: "50% 100%" }}
            priority
          />
          {/* Imagen para tablet y desktop */}
          <Image
            src="/images/victor-hugo-microphone.png"
            alt="Victor Hugo con micrófono"
            fill
            className="hidden sm:block object-contain"
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
