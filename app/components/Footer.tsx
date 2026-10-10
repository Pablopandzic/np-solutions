import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="contacto"
      className="scroll-mt-24 border-t border-zinc-800 bg-zinc-950 shadow-none"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:gap-8 lg:px-8 lg:py-16">
        <div>
          <p className="rounded-none text-lg font-bold tracking-tight text-white">
            NP SOLUTIONS
          </p>
          <p className="mt-3 text-sm font-normal text-zinc-400">
            CUIT 30-71924978-3
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Ubicación
          </p>
          <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-400">
            Pilar, Buenos Aires, Argentina
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Contacto
          </p>
          <ul className="mt-3 space-y-2 text-sm font-normal">
            <li>
              <Link
                href="https://wa.me/5492304302622"
                className="rounded-none text-zinc-400 transition-colors hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                +54 9 2304 30-2622
              </Link>
            </li>
            <li>
              <Link
                href="mailto:adm.npsolutions@gmail.com"
                className="rounded-none text-zinc-400 transition-colors hover:text-white"
              >
                adm.npsolutions@gmail.com
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-xs text-zinc-500">
            © NP Solutions. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
