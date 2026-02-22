"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import Project18Section from "@/components/project-18-section"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ContactSection() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Completa todos los campos")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/miembros` : "",
        data: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
        },
      },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Revisa tu correo para confirmar la cuenta")
    router.push("/miembros")
  }

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
      
      <section className="relative bg-[#1a1a1a] py-12 sm:py-16 md:py-24 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 md:px-4 max-w-6xl">
        {/* Heading */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
          Una transmisión hecha por los oyentes. <br></br> Relatada por Víctor Hugo Morales.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start">
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
                  Este proyecto existe si lo hacemos juntos.
                </h3>
                <div
                  className="text-white/90 font-sans space-y-4"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    lineHeight: '144%',
                    letterSpacing: '0%'
                  }}
                >
                  <p>
                    Llegaste hasta acá porque entendés de qué se trata <strong className="font-bold text-white">El Último Mundial</strong>.
                    No es una compra ni una promesa: es una forma concreta de ser parte de una transmisión que solo puede existir con <strong className="font-bold text-white">una comunidad detrás</strong>.
                  </p>
                  <p>
                    Desde este lugar vas a poder <strong className="font-bold text-white">participar</strong>, <strong className="font-bold text-white">seguir el proyecto de cerca</strong> y <strong className="font-bold text-white">recibir las novedades</strong> a medida que avance.
                  </p>
                </div>
              </motion.div>

              {/* Right Section - Formulario de registro */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-3 sm:space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainerVariants}
              >
                <motion.div variants={staggerItemVariants}>
                  <Label htmlFor="contact-nombre" className="text-white/90 font-medium text-sm">
                    Nombre
                  </Label>
                  <Input
                    id="contact-nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="given-name"
                    className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                  />
                </motion.div>
                <motion.div variants={staggerItemVariants}>
                  <Label htmlFor="contact-apellido" className="text-white/90 font-medium text-sm">
                    Apellido
                  </Label>
                  <Input
                    id="contact-apellido"
                    type="text"
                    placeholder="Tu apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    autoComplete="family-name"
                    className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                  />
                </motion.div>
                <motion.div variants={staggerItemVariants}>
                  <Label htmlFor="contact-email" className="text-white/90 font-medium text-sm">
                    Correo electrónico
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                  />
                </motion.div>
                <motion.div variants={staggerItemVariants}>
                  <Label htmlFor="contact-password" className="text-white/90 font-medium text-sm">
                    Contraseña
                  </Label>
                  <Input
                    id="contact-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                  />
                </motion.div>
                <motion.div variants={staggerItemVariants}>
                  <Label htmlFor="contact-confirm" className="text-white/90 font-medium text-sm">
                    Repetir contraseña
                  </Label>
                  <Input
                    id="contact-confirm"
                    type="password"
                    placeholder="Repetí tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                  />
                </motion.div>
                <motion.div variants={staggerItemVariants}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-base sm:text-base md:text-lg h-11 sm:h-11 md:h-12 rounded-lg"
                  >
                    {loading ? "Un momento…" : "Ser parte"}
                  </Button>
                  <p className="text-white/60 text-sm mt-3 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Al ser parte, vas a poder elegir cómo participar y seguir el proyecto desde adentro.
                  </p>
                </motion.div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}

