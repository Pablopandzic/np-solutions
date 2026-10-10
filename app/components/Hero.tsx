import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-zinc-900 shadow-none">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          <h1 className="rounded-none text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            MANUFACTURA AVANZADA Y PRECISIÓN INDUSTRIAL
          </h1>
          <h2 className="mt-6 max-w-3xl text-base font-normal leading-relaxed text-zinc-400 sm:mt-8 sm:text-lg md:text-xl">
            Especialistas en mecanizado CNC, grabado láser de fibra y soldadura
            de termoplásticos para la industria.
          </h2>
          <div className="mt-10 sm:mt-12">
            <Link
              href="#contacto"
              className="inline-block rounded-none bg-blue-600 px-8 py-4 text-sm font-bold tracking-wide text-white shadow-none transition-colors hover:bg-blue-700 sm:px-10 sm:py-5 sm:text-base"
            >
              COTIZAR PROYECTO
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
