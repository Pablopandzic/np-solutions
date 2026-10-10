function IconCnc({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 4h10v10H4V4zm14 0h10v10H18V4zM4 18h10v10H4V18zm14 14V18h10v10H18z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconLaser({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M16 4v24M4 16h24" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconWelding({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 22h10v6H4v-6zm14 0h10v6H18v-6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 16l4-8 4 8M16 8v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

const services = [
  {
    id: "mecanizado-cnc",
    Icon: IconCnc,
    title: "MECANIZADO CNC DE PRECISIÓN",
    description:
      "Ruteo y fresado industrial con tolerancias milimétricas en aluminios y plásticos de ingeniería. Desarrollo de piezas complejas, utillajes y matrices para sectores de alta exigencia mecánica.",
  },
  {
    id: "grabado-laser",
    Icon: IconLaser,
    title: "GRABADO LÁSER MOPA 100W",
    description:
      "Trazabilidad industrial y grabado profundo en acero inoxidable. Rotulación inalterable, códigos QR y tableros de control diseñados para resistir entornos agresivos (Oil & Gas y Farmacéutica).",
  },
  {
    id: "soldadura-plastica",
    Icon: IconWelding,
    title: "SOLDADURA DE TERMOPLÁSTICOS",
    description:
      "Fabricación y ensamblaje de polímeros mediante soldadura por extrusión. Estructuras, depósitos y tuberías especiales diseñadas para soportar estrés mecánico y fluidos corrosivos.",
  },
] as const;

export function Services() {
  return (
    <section
      id="servicios"
      className="border-t border-zinc-200 bg-white shadow-none"
      aria-labelledby="servicios-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <h2
          id="servicios-heading"
          className="rounded-none text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
        >
          SERVICIOS
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-3 md:gap-6">
          {services.map(({ id, Icon, title, description }) => (
            <li key={id} id={id} className="scroll-mt-24">
              <article className="flex h-full flex-col rounded-none border border-zinc-200 bg-white p-6 shadow-none sm:p-8">
                <Icon className="h-8 w-8 shrink-0 text-blue-600" />
                <h3 className="mt-5 text-base font-bold leading-snug tracking-tight text-zinc-900 sm:text-lg">
                  {title}
                </h3>
                <p className="mt-4 flex-1 text-sm font-normal leading-relaxed text-zinc-600 sm:text-base">
                  {description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
