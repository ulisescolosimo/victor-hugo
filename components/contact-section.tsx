"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactSection() {
  return (
    <section className="relative bg-[#1a1a1a] py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-12 md:mb-16">
          Financiado por los hinchas. <br></br> Relatado por Víctor Hugo.
        </h2>

        {/* Main Card */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 md:p-12 max-w-5xl mx-auto md:ml-auto md:mr-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Text */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Más que un financiamiento, este proyecto es un acto de gratitud colectiva.
              </h3>
              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                Una oportunidad para que los hinchas y oyentes devuelvan a Víctor Hugo todo lo que él nos dio: su voz,
                su épica y sus palabras que se convirtieron en parte de nuestra historia.
              </p>
            </div>

            {/* Right Section - Form */}
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Nombre y apellido"
                className="bg-white text-black placeholder:text-gray-500 rounded-lg h-12 px-4"
              />
              <Input
                type="tel"
                placeholder="Teléfono"
                className="bg-white text-black placeholder:text-gray-500 rounded-lg h-12 px-4"
              />
              <Input
                type="email"
                placeholder="Correo electrónico"
                className="bg-white text-black placeholder:text-gray-500 rounded-lg h-12 px-4"
              />
              <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg h-12 rounded-lg">
                Quiero aportar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

