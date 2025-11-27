import { Play, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] py-12 md:py-16 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0">
          {/* Left Side */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-white fill-white" />
              <span className="text-xl font-bold text-white">RELATORXS</span>
            </div>
            <p className="text-white/80 text-sm">VHM al mundial</p>
            <p className="text-white/60 text-xs">© 2025. Todos los derechos reservados.</p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Links */}
            <div className="flex gap-6">
              <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                Términos y condiciones
              </a>
              <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                Privacidad
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              {/* YouTube */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                aria-label="YouTube"
              >
                <Play className="w-5 h-5 text-white fill-white" />
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5 text-white fill-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

