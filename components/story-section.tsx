export function StorySection() {
  return (
    <section className="bg-black py-16 px-4 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <div className="grid md:grid-cols-2 items-center">
            {/* Image Side */}
            <div className="relative h-[500px] md:h-full">
              <img
                src="/images/victor-hugo-gesture.png"
                alt="Victor Hugo"
                className="absolute bottom-0 left-0 h-full w-full object-contain object-bottom scale-x-[-1]"
              />
            </div>

            {/* Text Side */}
            <div className="p-8 md:p-12 space-y-6">
              <p className="text-white/90 text-lg leading-relaxed">
                Durante el Mundial 2026 (México, Estados Unidos y Canadá),{" "}
                <span className="font-bold text-white">Victor Hugo</span> —la voz más icónica del fútbol argentino—
                podría relatar por última vez los partidos de la Selección.
              </p>
              <p className="text-white/90 text-lg leading-relaxed">
                Queremos lograrlo entre todos:{" "}
                <span className="font-bold text-white">
                  financiar colectivamente los derechos oficiales de transmisión radial y, si llegamos a la segunda
                  meta, llevar a Víctor Hugo y su equipo a los estadios.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
