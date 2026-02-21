"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
  // Solo permitir rutas internas (empiezan con / y no con //)
  if (redirect.startsWith("/") && !redirect.startsWith("//")) return redirect
  return "/"
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = getRedirectPath(searchParams.get("redirect"))
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error("Completa email y contraseña")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message)
      return
    }
    toast.success("Sesión iniciada")
    router.refresh()
    router.push(redirectTo)
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
            Iniciar sesión
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
                    <Label htmlFor="login-email" className="text-white/90 font-medium">
                      Correo electrónico
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                  <motion.div variants={staggerItemVariants}>
                    <Label htmlFor="login-password" className="text-white/90 font-medium">
                      Contraseña
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg h-11 px-4 focus-visible:ring-pink-500"
                    />
                  </motion.div>
                </motion.div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-base h-11 rounded-lg"
                >
                  {loading ? "Entrando…" : "Entrar"}
                </Button>
              </form>
              <p className="mt-6 text-center text-white/70 text-sm">
                ¿No tenés cuenta?{" "}
                <Link
                  href={redirectTo !== "/" ? "/registro?redirect=" + encodeURIComponent(redirectTo) : "/registro"}
                  className="text-pink-400 hover:text-pink-300 font-medium underline-offset-2 hover:underline"
                >
                  Registrate
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black">
        <div className="relative"><Header /></div>
        <section className="relative bg-[#1a1a1a] min-h-[60vh] flex items-center justify-center">
          <p className="text-white/70">Cargando…</p>
        </section>
      </main>
    }>
      <LoginContent />
    </Suspense>
  )
}
