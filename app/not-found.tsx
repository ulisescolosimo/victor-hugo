import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-black via-black to-[#1a1a1a]">
      <div className="relative flex-1">
        <Header />
        
        {/* Contenido principal centrado */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl pt-32 pb-20 sm:pt-40 sm:pb-24 md:pt-48 md:pb-32">
          <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 md:space-y-10">
            {/* Número 404 grande */}
            <div className="relative">
              <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                404
              </h1>
              <div className="absolute inset-0 text-8xl sm:text-9xl md:text-[12rem] font-bold text-white/5 blur-2xl">
                404
              </div>
            </div>

            {/* Mensaje principal */}
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Página no encontrada
              </h2>
              <p className="text-white/70 text-base sm:text-lg md:text-xl leading-relaxed">
                Lo sentimos, la página que estás buscando no existe o ha sido movida. 
                Parece que esta página se perdió en el camino al Mundial 2026.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium px-8 py-6 text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Volver al inicio
                </Link>
              </Button>
              
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
