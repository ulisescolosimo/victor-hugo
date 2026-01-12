'use client'

import { useState } from "react"
import Image from "next/image"
import { Menu, HelpCircle, DollarSign, Info, ChevronRight, X } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Función para manejar el scroll suave
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string, closeMenu: boolean = false) => {
    e.preventDefault()
    
    const scrollToElement = () => {
      const element = document.getElementById(targetId)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
    
    if (closeMenu) {
      // Cerrar el menú primero
      setIsSheetOpen(false)
      // Pequeño delay para que el menú se cierre antes del scroll
      setTimeout(scrollToElement, 300)
    } else {
      scrollToElement()
    }
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-[60]">
      <nav className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl w-full relative z-[60]">
        <div className="flex items-center justify-between py-4 sm:py-5 md:py-6 relative z-[60]">
          {/* Logo - Achicado en mobile */}
          <div className="flex items-center gap-2 relative z-[60]">
            <Image
              src="/images/Rectangle 873.png"
              alt="RELATOR×S"
              width={120}
              height={40}
              className="h-6 sm:h-7 md:h-8 w-auto"
              priority
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-8 lg:flex relative z-[60]">
            <a 
              href="#sobre-proyecto" 
              onClick={(e) => handleSmoothScroll(e, 'sobre-proyecto')}
              className="text-sm text-white transition-colors hover:text-pink-500"
            >
              Sobre el proyecto
            </a>
            <a 
              href="#como-funciona" 
              onClick={(e) => handleSmoothScroll(e, 'como-funciona')}
              className="text-sm text-white transition-colors hover:text-pink-500"
            >
              Cómo funciona
            </a>
            <a 
              href="#financiamiento" 
              onClick={(e) => handleSmoothScroll(e, 'financiamiento')}
              className="text-sm text-white transition-colors hover:text-pink-500"
            >
              Financiamiento
            </a>
          </div>

          {/* Mobile/Tablet Menu Hamburger */}
          <div className="lg:hidden relative z-[70]">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] size-10 text-white hover:bg-white/10 active:bg-white/20 border-0 cursor-pointer touch-manipulation"
                  aria-label="Abrir menú"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                hideCloseButton={true}
                className="bg-gradient-to-b from-black via-black to-black/98 border-l border-white/10 p-0 flex flex-col"
              >
                <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
                  {/* Header mejorado con logo */}
                  <SheetHeader className="px-6 pt-5 pb-6 border-b border-white/10 bg-gradient-to-r from-pink-900/20 via-transparent to-purple-900/20 flex-shrink-0 relative">
                    <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Image
                          src="/images/Rectangle 873.png"
                          alt="RELATOR×S"
                          width={100}
                          height={33}
                          className="h-7 w-auto brightness-0 invert"
                        />
                      </div>
                      <SheetClose asChild>
                        <button
                          type="button"
                          className="rounded-lg p-2 opacity-70 transition-all duration-200 hover:opacity-100 hover:bg-white/10 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none text-white/80 hover:text-white flex-shrink-0"
                          aria-label="Cerrar menú"
                        >
                          <X className="size-5" />
                          <span className="sr-only">Cerrar</span>
                        </button>
                      </SheetClose>
                    </div>
                  </SheetHeader>

                  {/* Navegación mejorada */}
                  <nav className="flex flex-col px-4 py-6 gap-2 flex-1">
                    <a
                      href="#sobre-proyecto"
                      onClick={(e) => handleSmoothScroll(e, 'sobre-proyecto', true)}
                      className="group flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium text-white/90 transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 hover:text-white active:scale-[0.98] active:bg-pink-500/30 cursor-pointer border border-transparent hover:border-white/10 touch-manipulation"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 group-hover:bg-pink-500/20 transition-colors">
                          <Info className="h-5 w-5 text-white/70 group-hover:text-pink-400 transition-colors" />
                        </div>
                        <span className="font-medium">Sobre el proyecto</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                    </a>
                  
                    <a
                      href="#como-funciona"
                      onClick={(e) => handleSmoothScroll(e, 'como-funciona', true)}
                      className="group flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium text-white/90 transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 hover:text-white active:scale-[0.98] active:bg-pink-500/30 cursor-pointer border border-transparent hover:border-white/10 touch-manipulation"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 group-hover:bg-pink-500/20 transition-colors">
                          <HelpCircle className="h-5 w-5 text-white/70 group-hover:text-pink-400 transition-colors" />
                        </div>
                        <span className="font-medium">Cómo funciona</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                    </a>
                  
                    <a
                      href="#financiamiento"
                      onClick={(e) => handleSmoothScroll(e, 'financiamiento', true)}
                      className="group flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium text-white/90 transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 hover:text-white active:scale-[0.98] active:bg-pink-500/30 cursor-pointer border border-transparent hover:border-white/10 touch-manipulation"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 group-hover:bg-pink-500/20 transition-colors">
                          <DollarSign className="h-5 w-5 text-white/70 group-hover:text-pink-400 transition-colors" />
                        </div>
                        <span className="font-medium">Financiamiento</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                    </a>
                  </nav>
                </div>

                {/* Footer del menú con información adicional */}
                <div className="px-4 pb-6 pt-4 border-t border-white/10 flex-shrink-0">
                  <p className="text-xs text-white/50 text-center px-4">
                    El Último Mundial 2026
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}

