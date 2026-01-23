"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Project18Section() {
  // Variantes de animación
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const slideInLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
      },
    },
  }

  const slideInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
      },
    },
  }

  return (
    <section className="relative bg-[#1a1a1a] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 scroll-mt-20 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Columna Izquierda - Contenido Principal */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeftVariants}
          >
            {/* Título con Badge */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white rounded-lg px-4 flex-shrink-0">
                <Image
                  src="/images/P18.png"
                  alt="P18"
                  width={40}
                  height={40}
                  className="w-12 h-12 sm:w-20 sm:h-20 md:w-12 md:h-12 object-contain"
                />
              </div>
              <h2 
                className="text-white uppercase font-black text-[clamp(24px,4vw,32px)] leading-none tracking-normal text-right"
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                }}
              >
                PROYECTO 18
              </h2>
            </div>

            {/* Texto Descriptivo */}
            <div className="space-y-4">
              <p
                className="text-white font-bold text-[clamp(28px,5vw,42px)] leading-none tracking-normal"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Proyecto 18 es un ecosistema de{' '}
                <span
                  className="font-bold text-[50px] leading-none tracking-[-0.05em]"
                  style={{
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Orsai
                </span>{' '}
                <span
                  className="font-normal italic text-[50px] leading-none tracking-normal"
                  style={{
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Tech
                </span>{' '}
                donde las comunidades se crean, se organizan y cumplen objetivos.
              </p>
            </div>

            {/* Botón de Llamada a la Acción */}
            <motion.div
              className="flex justify-start"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUpVariants}
            >
              <Button 
                className="font-semibold text-white text-sm sm:text-base px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 h-10 sm:h-11 md:h-12 bg-gradient-to-r from-[#CA0091] to-[#500062]"
              >
                QUIERO APORTAR 18 USD
              </Button>
            </motion.div>
          </motion.div>

          {/* Columna Derecha - Cards de Referencia */}
          <motion.div
            className="space-y-3 sm:space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRightVariants}
          >
            {/* Card BTChina */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUpVariants}
            >
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md min-h-[160px] sm:min-h-[160px] flex items-center justify-center border-0">
                <div className="text-center space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    BTChina
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Comunidad y proyectos
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card Proyecto Cayetano */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUpVariants}
            >
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md min-h-[160px] sm:min-h-[160px] flex items-center justify-center border-0">
                <div className="text-center space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Proyecto Cayetano
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Iniciativas y colaboraciones
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}