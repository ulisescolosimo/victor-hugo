"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function ObjectivesParticipationSection() {
  const [quantity, setQuantity] = useState(3)
  const contributionAmount = 18
  const totalAmount = quantity * contributionAmount

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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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

  const objectives = [
    "Comprar los derechos oficiales de transmisión radial del Mundial 2026.",
    "Que Víctor Hugo narre los 8 partidos de la Selección Argentina.",
    { text: "Producir un documental de bajo presupuesto: ", bold: "El último Mundial." },
    "Homenajear la carrera de Víctor Hugo que marcó a generaciones.",
    "Involucrar a la comunidad en cada paso.",
  ]

  const phases = [
    {
      number: 1,
      title: "FASE 01",
      amount: "200.000 USD",
      description: "Financiación de derechos de transmisión.",
    },
    {
      number: 2,
      title: "FASE 02",
      amount: "200.000 USD",
      description: "Logística, viaje y cobertura.",
    },
    {
      number: 3,
      title: "FASE 03",
      amount: "200.000 USD",
      description: "Transmisión, Documental y legado",
    },
  ]

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(10, value))
    setQuantity(newQuantity)
  }

  return (
    <section 
      className="relative py-12 sm:py-16 md:py-24 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/6ffec3ae67d9dfd1c670aff771877f0f15df6d1c.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-[#1a2e1a]/80 z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 max-w-6xl">
        {/* Objetivos del proyecto */}
        <motion.div
          className="mb-12 sm:mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            Objetivos del proyecto
          </motion.h2>
          <motion.div
            className="space-y-3 sm:space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
          >
            {objectives.map((objective, index) => (
              <motion.div
                key={index}
                className="p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)]"
                variants={staggerItemVariants}
              >
                <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  {typeof objective === 'string' ? objective : (
                    <>
                      {objective.text}
                      <strong>{objective.bold}</strong>
                    </>
                  )}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Cómo participar */}
        <motion.div
          id="como-funciona"
          className="mb-12 sm:mb-16 md:mb-20 scroll-mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <motion.h2
            className="text-white mb-6 sm:mb-8 text-left font-montserrat font-black text-[32px] sm:text-[42px] md:text-[56px] leading-[105%] tracking-normal"
            style={{
              fontFamily: 'Montserrat, sans-serif',
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            Cómo participar?
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-12 sm:mb-16 md:mb-20 max-w-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
          >
            {/* Aporte único */}
            <motion.div
              className="p-4 sm:p-5 md:p-6 text-center flex flex-col relative overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)]"
              variants={staggerItemVariants}
            >
              {/* Highlight vertical en el lado derecho */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/4 pointer-events-none rounded-r-[16px] sm:rounded-r-[20px] md:rounded-r-[24px] bg-gradient-to-l from-white/10 via-white/5 to-transparent"
              />
              <div className="relative z-10 flex flex-col h-full min-h-[120px] sm:min-h-[140px] md:min-h-[150px]">
              <p 
                className="text-white mb-2 text-[24px] sm:text-[30px] md:text-[36px] leading-[105%] tracking-normal font-light"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Aporte único
              </p>
              <p 
                className="text-white mb-4 sm:mb-5 md:mb-6 text-[24px] sm:text-[30px] md:text-[36px] leading-[105%] tracking-normal font-bold"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                18 USD
              </p>
              <div className="mt-auto flex items-end">
                <Button 
                  className="w-full font-semibold text-white text-sm sm:text-base px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 h-10 sm:h-11 md:h-12"
                  style={{
                    background: 'linear-gradient(90deg, #CA0091 0%, #500062 100%)',
                  }}
                >
                  QUIERO APORTAR 18 USD
                </Button>
              </div>
              </div>
            </motion.div>

            {/* Hasta 10 aportes */}
            <motion.div
              className="p-4 sm:p-5 md:p-6 text-center flex flex-col relative overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)]"
              variants={staggerItemVariants}
            >
              {/* Highlight vertical en el lado derecho */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/4 pointer-events-none rounded-r-[16px] sm:rounded-r-[20px] md:rounded-r-[24px] bg-gradient-to-l from-white/10 via-white/5 to-transparent"
              />
              <div className="relative z-10 flex flex-col h-full min-h-[120px] sm:min-h-[140px] md:min-h-[150px]">
              <p 
                className="text-white mb-4 sm:mb-5 md:mb-6 text-[20px] sm:text-[28px] md:text-[36px] leading-[105%] tracking-normal font-light"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Hasta <span className="font-bold">10 aportes <br></br> por persona</span>
              </p>
              <div className="mt-auto flex flex-col md:flex-row items-stretch md:items-end justify-center gap-3 md:gap-3">
                <div className="flex items-center justify-center gap-1.5 md:gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-1 md:p-1 w-full md:w-auto">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrementar cantidad"
                    className="flex items-center justify-center w-6 h-6 md:w-6 md:h-6 rounded text-white transition-all duration-200 hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent touch-manipulation"
                  >
                    <ChevronLeft className="w-3 h-3 md:w-3 md:h-3 md:hidden" />
                    <ChevronDown className="w-3 h-3 md:w-3 md:h-3 hidden md:block" />
                  </button>
                  <div className="flex flex-col items-center gap-0 min-w-[45px] md:min-w-[45px]">
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === '') return
                        handleQuantityChange(parseInt(val) || 1)
                      }}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value)
                        if (!val || val < 1) handleQuantityChange(1)
                        else if (val > 10) handleQuantityChange(10)
                      }}
                      aria-label="Cantidad de aportes"
                      className="w-10 md:w-10 h-7 md:h-7 text-center text-white text-lg md:text-sm font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none p-0"
                    />
                    <span className="text-white/60 text-md md:text-[9px] font-normal leading-tight">
                      {quantity === 1 ? 'aporte' : 'aportes'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    aria-label="Incrementar cantidad"
                    className="flex items-center justify-center w-6 h-6 md:w-6 md:h-6 rounded text-white transition-all duration-200 hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent touch-manipulation"
                  >
                    <ChevronRight className="w-3 h-3 md:w-3 md:h-3 md:hidden" />
                    <ChevronUp className="w-3 h-3 md:w-3 md:h-3 hidden md:block" />
                  </button>
                </div>
                <Button 
                  className="font-semibold hover:bg-gray-100 bg-white text-black text-sm md:text-base px-4 md:px-6 py-3 md:py-3 h-12 md:h-12 transition-all duration-200 active:scale-95 touch-manipulation w-full md:w-auto"
                >
                  QUIERO APORTAR {totalAmount} USD
                </Button>
              </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Metas y Fases en dos columnas */}
          <motion.div
            id="financiamiento"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 scroll-mt-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
          >
            {/* Columna izquierda: Metas + Transmisión */}
            <motion.div variants={slideInLeftVariants}>
              <h3 
                className="text-white mb-3 sm:mb-4 text-[28px] sm:text-[32px] md:text-[36px] leading-[105%] tracking-normal font-black"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Metas
              </h3>
              <p 
                className="text-white mb-6 sm:mb-7 md:mb-8 text-[18px] sm:text-[20px] md:text-[24px] leading-[128%] tracking-normal font-normal"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Los fondos se destinan exclusivamente a estos dos objetivos. Una vez cumplida la primer fase, se activará
                la segunda etapa condicional de 200.000 USD para financiar el viaje de Víctor Hugo al Mundial junto a su
                equipo.
              </p>

              {/* Transmisión por AM750 */}
              <p className="text-white">
                <span 
                  className="text-[20px] sm:text-[22px] md:text-[24px] leading-[105%] tracking-normal font-black"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Transmision por AM750
                </span>
                <span 
                  className="text-white/70 text-sm sm:text-base leading-[118%] tracking-normal font-normal ml-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  <br />
                  {' '}con apoyo de la Asociación de <br /> Relatores del Fútbol Argentino
                </span>
              </p>
            </motion.div>

            {/* Columna derecha: Fases */}
            <motion.div variants={slideInRightVariants}>
              <motion.div
                className="space-y-5 sm:space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainerVariants}
              >
                {phases.map((phase) => (
                  <motion.div
                    key={phase.number}
                    className="flex items-start gap-4 sm:gap-6 md:gap-8"
                    variants={staggerItemVariants}
                  >
                    <div 
                      className="flex-shrink-0 flex items-center justify-center relative w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20"
                    >
                      <img 
                        src="/images/Ellipse 49.png" 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      <span 
                        className="relative text-white text-[48px] sm:text-[56px] md:text-[64px] leading-[128%] tracking-normal text-center font-bold"
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      >
                        {phase.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="text-white mb-1 text-[24px] sm:text-[26px] md:text-[29px] leading-[128%] tracking-normal font-bold"
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      >
                        {phase.title}
                      </h4>
                      <p 
                        className="text-white mb-1 text-lg sm:text-xl leading-[128%] tracking-normal font-normal"
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      >
                        {phase.amount}
                      </p>
                      <p 
                        className="text-white/70 text-base sm:text-lg md:text-xl leading-[128%] tracking-normal font-normal"
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      >
                        {phase.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cuántos somos para llegar */}
        <motion.div
          className="mb-12 sm:mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUpVariants}
        >
          <motion.div
            className="p-4 sm:p-5 md:p-6 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)] block w-full md:w-3/4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2 
              className="text-white mb-6 sm:mb-7 md:mb-8 text-left px-2 sm:px-3"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(24px, 5vw, 36px)',
                lineHeight: '105%',
                letterSpacing: '0%',
              }}
            >
              Cuántos somos para llegar
            </h2>
            {/* Sección Mínimo */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-12 pb-4 sm:pb-5 md:pb-6 border-b border-white/20 mb-4 sm:mb-5 md:mb-6 py-2 mx-2 sm:mx-3 md:mx-4">
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-white mb-1.5 sm:mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  Mínimo
                </h3>
                <p 
                  className="text-white"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  1 Aporte por persona
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-white mb-1.5 sm:mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  Personas necesarias
                </h3>
                <p 
                  className="text-white"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  11.112 personas
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-white mb-1.5 sm:mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  Recaudación
                </h3>
                <p 
                  className="text-white"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  USD 200.000
                </p>
              </div>
            </div>

            {/* Sección Máximo */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-12 p-2 sm:p-3 md:p-4">
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-white mb-1.5 sm:mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  Máximo
                </h3>
                <p 
                  className="text-white"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  10 Aportes por persona
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-white mb-1.5 sm:mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  Personas necesarias
                </h3>
                <p 
                  className="text-white"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  1.112 personas
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-white mb-1.5 sm:mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  Recaudación
                </h3>
                <p 
                  className="text-white"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  USD 200.000
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Equipo y Produce */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5 md:gap-4 items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainerVariants}
        >
          {/* Equipo */}
          <motion.div className="md:col-span-3" variants={slideInLeftVariants}>
            <div className="rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)] p-4 sm:p-5 md:p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 sm:mb-7 md:mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Equipo</h2>
                <Image
                  src="/images/Rectangle 873.png"
                  alt="RELATORXS logo"
                  width={120}
                  height={40}
                  className="h-6 sm:h-7 md:h-8 w-auto flex-shrink-0"
                />
              </div>
              <motion.div
                className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-between"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainerVariants}
              >
                {[
                  { firstName: "Alejandro", lastName: "Fabbri", image: "/images/alejandrofabbri.jpg" },
                  { firstName: "Alejandro", lastName: "Apo", image: "/images/alejandroapo.png" },
                  { firstName: "Viviana", lastName: "Vila", image: "/images/vivianavila.png" },
                  { firstName: "Hernán", lastName: "Kodakian", image: "/images/kodakian.jpg" },
                  { firstName: "Matías", lastName: "De Matteo", image: "/images/dematteo.png" },
                  { firstName: "Néstor", lastName: "Centra", image: "/images/nestorcentra.png" },
                ].map((person, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-[calc(50%-0.5rem)] sm:min-w-0 max-w-[120px] sm:max-w-none"
                    variants={staggerItemVariants}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-full bg-gray-700 overflow-hidden border-2 border-white/20">
                      <img src={person.image} alt={`${person.firstName} ${person.lastName}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <p className="text-white text-sm sm:text-base font-semibold whitespace-pre-line">
                        {person.firstName}
                        {"\n"}
                        {person.lastName}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Produce */}
          <motion.div className="md:col-span-1" variants={slideInRightVariants}>
            <div className="rounded-[16px] sm:rounded-[20px] md:rounded-[24px] backdrop-blur-[10px] bg-white/10 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)] p-4 sm:p-5 md:p-4 h-full flex flex-col">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-7 md:mb-8 sm:px-4 sm:px-6 md:px-8 pt-1 sm:pt-2">Produce</h2>
              <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8">
                <img src="/images/logo orsai.png" alt="Orsai" className="max-w-24 sm:max-w-28 h-auto pb-8 sm:pb-12 md:pb-16" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
