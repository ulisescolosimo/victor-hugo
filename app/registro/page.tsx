"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

function getRedirectPath(redirect: string | null): string {
  if (!redirect) return "/"
  if (redirect.startsWith("/") && !redirect.startsWith("//")) return redirect
  return "/"
}

export default function RegistroPage() {
  const searchParams = useSearchParams()
  const redirectTo = getRedirectPath(searchParams.get("redirect"))
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
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectTo !== "/" ? `${origin}${redirectTo}` : `${origin}/`,
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
    window.location.href = redirectTo
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="relative">
        <Header />
      </div>

      <section className="relative bg-[#1a1a1a] py-12 sm:py-16 md:py-24 min-h-[100vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-4 max-w-6xl pt-12">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-white tracking-tight"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
          >
            Crear cuenta
          </motion.h1>

          <motion.div
            className="rounded-lg max-w-md mx-auto relative"
            style={{
              background: "linear-gradient(137.78deg, rgba(36, 36, 36, 0.862981) 0.8%, rgba(185, 185, 185, 0.5) 52.07%, #000000 98.64%)",
              padding: "2px",
              boxShadow: "0px 20px 20px 0px #00000080",
            }}
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
          >
            <div
              className="rounded-lg p-6 sm:p-8 w-full"
              style={{
                background: "linear-gradient(118.21deg, #141414 -0.82%, rgba(47, 47, 47, 0.65) 48.44%, rgba(20, 20, 20, 0.25) 100.64%)",
                backdropFilter: "blur(40px)",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible" className="space-y-4">
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-nombre" className="text-white/90 font-medium">
                      Nombre
                    </Label>
                    <Input
                      id="reg-nombre"
                      type="text"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      autoComplete="given-name"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-apellido" className="text-white/90 font-medium">
                      Apellido
                    </Label>
                    <Input
                      id="reg-apellido"
                      type="text"
                      placeholder="Tu apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      autoComplete="family-name"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-email" className="text-white/90 font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-password" className="text-white/90 font-medium">
                      Contraseña
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="reg-confirm" className="text-white/90 font-medium">
                      Repetir contraseña
                    </Label>
                    <Input
                      id="reg-confirm"
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                </motion.div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-base h-11 rounded-lg"
                >
                  {loading ? "Creando cuenta…" : "Registrarme"}
                </Button>
              </form>
              <p className="mt-6 text-center text-white/70 text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href={redirectTo !== "/" ? "/login?redirect=" + encodeURIComponent(redirectTo) : "/login"}
                  className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
