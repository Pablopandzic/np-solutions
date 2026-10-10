export function IntegrationBanner() {
  return (
    <section
      className="w-full bg-zinc-900 shadow-none"
      aria-labelledby="integracion-heading"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <h3
            id="integracion-heading"
            className="rounded-none text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl lg:text-3xl"
          >
            INTEGRACIÓN INDUSTRIAL Y PROYECTOS LLAVE EN MANO
          </h3>
          <p className="mt-6 text-sm font-normal leading-relaxed text-zinc-300 sm:text-base">
            Nuestra capacidad operativa se expande mediante una red consolidada
            de partners estratégicos de primer nivel en tornería de gran escala,
            corte y plegado. Centralizamos la ingeniería para entregar soluciones
            metalmecánicas definitivas a los sectores de Oil &amp; Gas, Energía y
            Minería.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4" aria-label="Logos de partners">
          {[1, 2, 3].map((slot) => (
            <li
              key={slot}
              className="flex min-h-24 items-center justify-center rounded-none border border-white/20 bg-white/10 shadow-none sm:min-h-28"
            >
              <span className="sr-only">Partner {slot}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
