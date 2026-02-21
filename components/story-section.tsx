"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StorySection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }
  // Variantes de animación para la imagen
  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  // Variantes de animación para el texto
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  // Variantes para párrafos con animación escalonada
  const paragraphContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  return (
    <section 
      id="sobre-proyecto"
      className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 scroll-mt-20"
      style={{
        background: `linear-gradient(0deg, #000000, #000000),
          linear-gradient(0deg, rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.54)),
          linear-gradient(179.13deg, rgba(0, 0, 0, 0.54) 0.81%, rgba(255, 255, 255, 0) 99.32%)`
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Image Side */}
            <motion.div
              className="relative h-full min-h-[200px] sm:min-h-[280px] md:min-h-[350px] order-2 md:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageVariants}
            >
              <Image
                src="/images/victor-hugo-gesture.png"
                alt="Victor Hugo"
                fill
                className="object-contain object-bottom scale-x-[-1]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>

            {/* Text Side */}
            <motion.div
              className="p-6 sm:p-8 md:p-10 lg:p-12 space-y-4 sm:space-y-5 md:space-y-6 order-1 md:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={paragraphContainerVariants}
            >
              <motion.p
                className="text-white/90 text-base sm:text-lg md:text-lg leading-relaxed"
                variants={paragraphVariants}
              >
                Durante el Mundial 2026 (México, Estados Unidos y Canadá),{" "}
                <span className="font-bold text-white">Victor Hugo</span> —la voz más icónica del fútbol en habla hispana—
                podría relatar por última vez los partidos de la Selección.
              </motion.p>
              <motion.p
                className="text-white/90 text-base sm:text-lg md:text-lg leading-relaxed"
                variants={paragraphVariants}
              >
                Queremos lograrlo entre todos:{" "}
                <span className="font-bold text-white">
                  financiar colectivamente los derechos oficiales de transmisión radial y, si llegamos a la segunda
                  meta, llevar a Víctor Hugo y su equipo a los estadios.
                </span>
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-5"
                variants={paragraphVariants}
              >
                <Button
                  size="sm"
                  className="w-full sm:w-auto min-w-[160px] px-4 sm:px-5 text-white uppercase hover:opacity-90 text-sm sm:text-base leading-[107%] tracking-normal font-medium"
                  style={{
                    background: 'linear-gradient(90deg, #CA0091 0%, #500062 100%)',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Quiero aportar 18 USD
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto min-w-[160px] border-2 border-white bg-white text-black sm:bg-transparent sm:text-white px-4 sm:px-5 uppercase text-sm sm:text-base leading-[107%] tracking-normal font-medium sm:hover:bg-white sm:hover:text-black"
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
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Video local */}
        <motion.div
          className="mt-8 sm:mt-10 md:mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={textVariants}
        >
          <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl">
            <video
              ref={videoRef}
              src="/video/videoplayback.mp4"
              controls={isPlaying}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.95) contrast(1.05)" }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              Tu navegador no soporta el elemento de video.
            </video>
            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-200 z-10"
                aria-label="Reproducir video"
              >
                <div className="bg-black rounded-full p-4 sm:p-5 md:p-6 shadow-lg hover:scale-110 transition-transform duration-200">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white fill-white ml-1" />
                </div>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
