"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ObjectivesParticipationSection() {
  const [quantity, setQuantity] = useState(3)
  const contributionAmount = 18
  const totalAmount = quantity * contributionAmount

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
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/6ffec3ae67d9dfd1c670aff771877f0f15df6d1c.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-[#1a2e1a]/80 z-0"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Objetivos del proyecto */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Objetivos del proyecto</h2>
          <div className="space-y-4">
            {objectives.map((objective, index) => (
              <div 
                key={index} 
                className="p-4 rounded-[24px] backdrop-blur-[40px] bg-white/5 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)]"
              >
                <p className="text-white text-base md:text-lg leading-relaxed">
                  {typeof objective === 'string' ? objective : (
                    <>
                      {objective.text}
                      <strong>{objective.bold}</strong>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cómo participar */}
        <div className="mb-20">
          <h2 
            className="text-white mb-8 text-left font-montserrat font-black text-[56px] leading-[105%] tracking-normal"
            style={{
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Cómo participar?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-20 max-w-4xl">
            {/* Aporte único */}
            <div 
              className="p-6 text-center flex flex-col relative overflow-hidden rounded-[24px] backdrop-blur-[40px] bg-white/5 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)]"
            >
              {/* Highlight vertical en el lado derecho */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/4 pointer-events-none rounded-r-[24px] bg-gradient-to-l from-white/10 via-white/5 to-transparent"
              />
              <div className="relative z-10 flex flex-col h-full min-h-[150px]">
              <p 
                className="text-white mb-2 text-[36px] leading-[105%] tracking-normal font-light"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Aporte único
              </p>
              <p 
                className="text-white mb-6 text-[36px] leading-[105%] tracking-normal font-bold"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                18 USD
              </p>
              <div className="mt-auto flex items-end">
                <Button 
                  className="w-full font-semibold text-white text-base px-6 py-3 h-12"
                  style={{
                    background: 'linear-gradient(90deg, #CA0091 0%, #500062 100%)',
                  }}
                >
                  QUIERO APORTAR 18 USD
                </Button>
              </div>
              </div>
            </div>

            {/* Hasta 10 aportes */}
            <div 
              className="p-6 text-center flex flex-col relative overflow-hidden rounded-[24px] backdrop-blur-[40px] bg-white/5 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)]"
            >
              {/* Highlight vertical en el lado derecho */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/4 pointer-events-none rounded-r-[24px] bg-gradient-to-l from-white/10 via-white/5 to-transparent"
              />
              <div className="relative z-10 flex flex-col h-full min-h-[150px]">
              <p 
                className="text-white mb-6 text-[36px] leading-[105%] tracking-normal font-light"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Hasta <span className="font-bold">10 aportes <br></br> por persona</span>
              </p>
              <div className="mt-auto flex items-end justify-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-1">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrementar cantidad"
                    className="flex items-center justify-center w-6 h-6 rounded text-white transition-all duration-200 hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent touch-manipulation"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="flex flex-col items-center gap-0 min-w-[45px]">
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
                      className="w-10 h-7 text-center text-white text-sm font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none p-0"
                    />
                    <span className="text-white/60 text-[9px] font-normal leading-tight">
                      {quantity === 1 ? 'aporte' : 'aportes'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    aria-label="Incrementar cantidad"
                    className="flex items-center justify-center w-6 h-6 rounded text-white transition-all duration-200 hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent touch-manipulation"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                </div>
                <Button 
                  className="font-semibold hover:bg-gray-100 bg-white text-black text-base px-6 py-3 h-12 transition-all duration-200 active:scale-95 touch-manipulation"
                >
                  QUIERO APORTAR {totalAmount} USD
                </Button>
              </div>
              </div>
            </div>
          </div>

          {/* Metas y Fases en dos columnas */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Columna izquierda: Metas + Transmisión */}
            <div>
              <h3 
                className="text-white mb-4 text-[36px] leading-[105%] tracking-normal font-black"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Metas
              </h3>
              <p 
                className="text-white mb-8 text-[24px] leading-[128%] tracking-normal font-normal"
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
                  className="text-[24px] leading-[105%] tracking-normal font-black"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Transmision por AM750
                </span>
                <span 
                  className="text-white/70 text-base leading-[118%] tracking-normal font-normal ml-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  <br />
                  {' '}con apoyo de la Asociación de <br /> Relatores del Fútbol Argentino
                </span>
              </p>
            </div>

            {/* Columna derecha: Fases */}
            <div>
              <div className="space-y-6">
                {phases.map((phase) => (
                  <div key={phase.number} className="flex items-start gap-8">
                    <div 
                      className="flex-shrink-0 flex items-center justify-center relative w-20 h-20"
                    >
                      <img 
                        src="/images/Ellipse 49.png" 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      <span 
                        className="relative text-white text-[64px] leading-[128%] tracking-normal text-center font-bold"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {phase.number}
                      </span>
                    </div>
                    <div>
                      <h4 
                        className="text-white mb-1 text-[29px] leading-[128%] tracking-normal font-bold"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {phase.title}
                      </h4>
                      <p 
                        className="text-white mb-1 text-xl leading-[128%] tracking-normal font-normal"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {phase.amount}
                      </p>
                      <p 
                        className="text-white/70 text-xl leading-[128%] tracking-normal font-normal"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {phase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cuántos somos para llegar */}
        <div className="mb-20">
          <div 
            className="p-6 rounded-[24px] backdrop-blur-[40px] bg-white/5 border border-white/20 shadow-[0px_20px_20px_0px_rgba(0,0,0,0.21)] inline-block w-fit"
          >
            <h2 
              className="text-white mb-8 text-left px-3"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 900,
                fontSize: '36px',
                lineHeight: '105%',
                letterSpacing: '0%',
              }}
            >
              Cuántos somos para llegar
            </h2>
            {/* Sección Mínimo */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 pb-6 border-b border-white/20 mb-6 p-4">
              <div className="whitespace-nowrap">
                <h3 
                  className="text-white mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: '18px',
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
                    fontSize: '18px',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  1 Aporte por persona
                </p>
              </div>
              <div className="whitespace-nowrap">
                <h3 
                  className="text-white mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: '18px',
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
                    fontSize: '18px',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  11.112 personas
                </p>
              </div>
              <div className="whitespace-nowrap">
                <h3 
                  className="text-white mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: '18px',
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
                    fontSize: '18px',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  USD 200.000
                </p>
              </div>
            </div>

            {/* Sección Máximo */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 p-4">
              <div className="whitespace-nowrap">
                <h3 
                  className="text-white mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: '18px',
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
                    fontSize: '18px',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  10 Aportes por persona
                </p>
              </div>
              <div className="whitespace-nowrap">
                <h3 
                  className="text-white mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: '18px',
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
                    fontSize: '18px',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  1.112 personas
                </p>
              </div>
              <div className="whitespace-nowrap">
                <h3 
                  className="text-white mb-2"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    fontSize: '18px',
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
                    fontSize: '18px',
                    lineHeight: '105%',
                    letterSpacing: '0%',
                  }}
                >
                  USD 200.000
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipo y Produce */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Equipo */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Equipo</h2>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <div className="mb-6">
                <img src="" alt="RELATORXS logo" className="h-8" />
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  "Alejandro Fabbri",
                  "Alejandro Apo",
                  "Viviana Vila",
                  "Hernán Kodakian",
                  "Matías De Matteo",
                  "Néstor Centra",
                ].map((name, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden border-2 border-white/20">
                      <img src="" alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <p className="text-white text-sm font-semibold">{name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Produce */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Produce</h2>
            <div className="bg-[#1a2e1a] rounded-lg border border-white/10 p-8 flex flex-col items-center justify-center">
              <p className="text-white text-sm mb-2">Produce</p>
              <p className="text-6xl font-bold text-white">Orsai</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
