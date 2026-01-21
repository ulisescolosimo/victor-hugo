"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import Project18Section from "@/components/project-18-section"

export default function ContactSection() {
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

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const staggerItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
    <>
      {/* Sección Proyecto 18 */}
      <Project18Section />
      
      <section className="relative bg-[#1a1a1a] py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-4 max-w-6xl">
        {/* Heading */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
          Financiado por los oyentes. <br></br> Relatado por Víctor Hugo.
        </motion.h2>

        {/* Main Card */}
        <motion.div
          className="rounded-lg max-w-5xl mx-auto md:ml-auto md:mr-8 relative"
          style={{
            background: 'linear-gradient(137.78deg, rgba(36, 36, 36, 0.862981) 0.8%, rgba(185, 185, 185, 0.5) 52.07%, #000000 98.64%)',
            padding: '2px',
            boxShadow: '0px 20px 20px 0px #00000080'
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <div
            className="rounded-lg p-6 sm:p-8 md:p-12 h-full w-full"
            style={{
              background: 'linear-gradient(118.21deg, #141414 -0.82%, rgba(47, 47, 47, 0.65) 48.44%, rgba(20, 20, 20, 0.25) 100.64%)',
              backdropFilter: 'blur(40px)'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
              {/* Left Section - Text */}
              <motion.div
                className="space-y-3 sm:space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideInLeftVariants}
              >
                <h3 
                  className="text-white font-sans"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(20px, 4vw, 24px)',
                    lineHeight: '106%',
                    letterSpacing: '0%'
                  }}
                >
                  Más que un financiamiento, este proyecto es un acto de gratitud colectiva.
                </h3>
                <p 
                  className="text-white/90 font-sans"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    lineHeight: '144%',
                    letterSpacing: '0%'
                  }}
                >
                  Una oportunidad para que los oyentes agradezcan a Víctor Hugo todo lo que nos dio: <b>su voz,
                  su épica y sus palabras que se convirtieron en parte de nuestra historia.</b>
                </p>
              </motion.div>

              {/* Right Section - Form */}
              <motion.div
                className="space-y-3 sm:space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainerVariants}
              >
                <motion.div variants={staggerItemVariants}>
                  <Input
                    type="text"
                    placeholder="Nombre y apellido"
                    className="bg-white text-black placeholder:text-gray-500 rounded-lg h-11 sm:h-11 md:h-12 px-4 text-base md:text-base"
                  />
                </motion.div>
                <motion.div variants={staggerItemVariants}>
                  <Input
                    type="tel"
                    placeholder="Teléfono"
                    className="bg-white text-black placeholder:text-gray-500 rounded-lg h-11 sm:h-11 md:h-12 px-4 text-base md:text-base"
                  />
                </motion.div>
                <motion.div variants={staggerItemVariants}>
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    className="bg-white text-black placeholder:text-gray-500 rounded-lg h-11 sm:h-11 md:h-12 px-4 text-base md:text-base"
                  />
                </motion.div>
                <motion.div variants={staggerItemVariants}>
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-base sm:text-base md:text-lg h-11 sm:h-11 md:h-12 rounded-lg">
                    Quiero aportar
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}

