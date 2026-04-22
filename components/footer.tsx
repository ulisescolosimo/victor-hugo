import { Mail } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] py-10 sm:py-12 md:py-16 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 md:px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-10 md:gap-0">
          {/* Left Side */}
          <div className="space-y-2">
            <a
              href="https://www.relatores.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mb-3 sm:mb-4 hover:opacity-90 transition-opacity"
              aria-label="Relatores - relatores.com.ar"
            >
              <Image
                src="/images/Rectangle 873.png"
                alt="RELATORXS"
                width={120}
                height={40}
                className="h-6 sm:h-7 md:h-8 w-auto"
              />
            </a>
            <p className="text-white/80 text-sm">El último mundial</p>
            <p className="text-white/60 text-xs">© 2026. Todos los derechos reservados.</p>
          </div>

          {/* Right Side — ícono de contacto */}
          <div className="flex flex-col items-start sm:items-end justify-end md:items-end w-full sm:w-auto">
            <a
              href="mailto:elultimomundialok@gmail.com"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors touch-manipulation active:scale-95"
              aria-label="Contacto: elultimomundialok@gmail.com"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Proyecto 18 + Orsai Tech */}
        <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-white/10 flex flex-col items-center justify-center text-center">
          <p className="text-white/70 text-sm mb-3">Este proyecto forma parte de <a href="https://proyecto18.org" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white font-bold">Proyecto 18</a>.</p>
          <a
            href="https://orsai.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Orsai Tech"
          >
            <img
              src="https://www.proyecto18.org/images/footer/Orsai%20Tech%20(1).png"
              alt="Orsai Tech"
              className="h-[18px] sm:h-[21px] w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}


