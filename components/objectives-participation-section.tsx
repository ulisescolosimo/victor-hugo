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
    "Producir un documental de bajo presupuesto: El último Mundial.",
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
    <section className="relative bg-[#1a2e1a] py-16 md:py-24 overflow-hidden">
      {/* Background images - headphones and microphone */}
      <div className="absolute top-20 right-10 opacity-30 z-0">
        <img src="" alt="" className="w-64 h-auto" />
      </div>
      <div className="absolute bottom-32 right-20 opacity-30 z-0">
        <img src="" alt="" className="w-80 h-auto" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Objetivos del proyecto */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Objetivos del proyecto</h2>
          <div className="space-y-4">
            {objectives.map((objective, index) => (
              <div key={index} className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/10 p-4">
                <p className="text-white text-base md:text-lg leading-relaxed">{objective}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cómo participar */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Cómo participar?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Aporte único */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <p className="text-white/70 text-sm mb-2">Aporte único</p>
              <p className="text-4xl font-bold text-white mb-6">18 USD</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                QUIERO APORTAR 18 USD
              </Button>
            </div>

            {/* Hasta 10 aportes */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <p className="text-white/70 text-sm mb-2">Hasta 10 aportes por persona</p>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex flex-col gap-0">
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="text-white transition-colors disabled:opacity-50 p-0.5"
                    disabled={quantity >= 10}
                  >
                    <ChevronUp className="w-3 h-3 text-white" />
                  </button>
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="text-white transition-colors disabled:opacity-50 p-0.5"
                    disabled={quantity <= 1}
                  >
                    <ChevronDown className="w-3 h-3 text-white" />
                  </button>
                </div>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-12 h-8 text-center text-white bg-transparent border-white/20 focus-visible:border-white/40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none px-2"
                />
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                QUIERO APORTAR {totalAmount} USD
              </Button>
            </div>
          </div>
        </div>

        {/* Metas */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-4">Metas</h3>
          <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed">
            Los fondos se destinan exclusivamente a estos dos objetivos. Una vez cumplida la primer fase, se activará
            la segunda etapa condicional de 200.000 USD para financiar el viaje de Víctor Hugo al Mundial junto a su
            equipo.
          </p>

          {/* Transmisión por AM750 */}
          <p className="text-white/70 text-sm md:text-base mb-8">
            <span className="font-semibold text-white">Transmision por AM750</span>
            <span className="text-white/70"> con apoyo de la Asociación de Relatores del Fútbol Argentino</span>
          </p>

          <div className="space-y-6">
            {phases.map((phase) => (
              <div key={phase.number} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{phase.number}</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">{phase.title}</h4>
                  <p className="text-white text-xl font-semibold mb-1">{phase.amount}</p>
                  <p className="text-white/70 text-sm">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cuántos somos para llegar */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Cuántos somos para llegar</h2>
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/10 p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Mínimo */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Mínimo</h3>
                <p className="text-white/70 text-sm mb-2">1 Aporte por persona</p>
                <p className="text-white/70 text-sm mb-2">Personas necesarias: 11.112 personas</p>
                <p className="text-white/70 text-sm">Recaudación: USD 200.000</p>
              </div>

              {/* Máximo */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Máximo</h3>
                <p className="text-white/70 text-sm mb-2">10 Aportes por persona</p>
                <p className="text-white/70 text-sm mb-2">Personas necesarias: 1.112 personas</p>
                <p className="text-white/70 text-sm">Recaudación: USD 200.000</p>
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
