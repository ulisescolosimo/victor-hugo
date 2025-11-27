export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4 max-w-6xl w-full">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-pink-500 to-purple-600" />
              <span className="text-xl font-bold text-white">RELATOR×S</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#como-funciona" className="text-sm text-white transition-colors hover:text-pink-500">
              Cómo funciona
            </a>
            <a href="#financiamiento" className="text-sm text-white transition-colors hover:text-pink-500">
              Financiamiento
            </a>
            <a href="#sobre-proyecto" className="text-sm text-white transition-colors hover:text-pink-500">
              Sobre el proyecto
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}

