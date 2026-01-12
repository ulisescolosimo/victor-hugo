"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export function StorySection() {
  // Variantes de animación para la imagen
  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
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
        ease: "easeOut",
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
        ease: "easeOut",
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
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Image Side */}
            <motion.div
              className="relative h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] min-h-[200px] md:min-h-[350px] order-2 md:order-1"
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
                <span className="font-bold text-white">Victor Hugo</span> —la voz más icónica del fútbol argentino—
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
