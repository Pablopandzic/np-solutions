function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 12l5 5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function IconCamera({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="6"
        y="14"
        width="36"
        height="26"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M18 14l4-6h8l4 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      <circle cx="24" cy="27" r="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const capabilities = [
  "Nave industrial de diseño ortogonal optimizada para flujos de mecanizado CNC.",
  "Piso técnico de hormigón H21 para estabilización de herramental pesado.",
  "Estaciones de extrusión plástica y grabado láser sectorizadas.",
] as const;

export function Infrastructure() {
  return (
    <section
      className="border-t border-zinc-200 bg-white shadow-none"
      aria-labelledby="infraestructura-heading"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-24">
        <div
          className="flex aspect-[4/3] min-h-64 items-center justify-center rounded-none bg-zinc-200 shadow-none lg:aspect-auto lg:min-h-[22rem]"
          role="img"
          aria-label="Fotografía del taller — próximamente"
        >
          <IconCamera className="h-16 w-16 text-zinc-500" />
        </div>

        <div>
          <h2
            id="infraestructura-heading"
            className="rounded-none text-xl font-bold leading-snug tracking-tight text-zinc-900 sm:text-2xl lg:text-3xl"
          >
            CAPACIDAD OPERATIVA Y TALLER PROPIO
          </h2>
          <ul className="mt-8 space-y-5">
            {capabilities.map((item) => (
              <li key={item} className="flex gap-4">
                <IconCheck className="mt-0.5 h-6 w-6 shrink-0 text-blue-600" />
                <span className="text-sm font-normal leading-relaxed text-zinc-600 sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
