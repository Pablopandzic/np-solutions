'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent as ReactDragEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

const WHATSAPP_NUMERO = '5492304302622';
const WHATSAPP_VISIBLE = '+54 9 2304 30-2622';
const CORREO = 'adm.npsolutions@gmail.com';
const LIMITE_MB = 4;
const LIMITE_BYTES = LIMITE_MB * 1024 * 1024;
const EXTENSIONES = ['.pdf', '.dxf', '.dwg', '.step', '.stp', '.png', '.jpg', '.jpeg'];

/*
 * LOGO
 * Exportá solo el símbolo "NP" (sin el texto de abajo) en PNG con fondo transparente
 * y guardalo como public/logo-np.png. Mientras no exista, se muestra un "NP" con los colores del logo.
 */
const LOGO = '/logo-np.png';

/*
 * VIDEO DE PORTADA
 * Si grabás un clip del láser trabajando (10 a 20 s, MP4, 720p, sin audio, menos de 5 MB),
 * subilo a public/videos/ y escribí la ruta acá. Ejemplo:  hero: '/videos/laser.mp4'
 * Si queda vacío (''), se muestra la animación de grabado láser.
 */
const VIDEOS = {
  hero: '',
};

/*
 * FOTOS
 * Para usar fotos propias, subilas a la carpeta public/fotos/ del proyecto
 * y escribí acá la ruta. Ejemplo:  inox: '/fotos/inox.jpg'
 * Si un campo queda vacío (''), se muestra la muestra gráfica del material.
 * La foto de "frentes" aparece debajo del tablero interactivo.
 */
const FOTOS = {
  frentes: '',
  funeraria: '',
  inox: '',
  color: '',
  anodizado: '',
  pintada: '',
  plastico: '',
  piedra: '',
};

type EstadoEnvio = 'idle' | 'enviando' | 'ok' | 'error';
type TipoMuestra = 'inox' | 'color' | 'anodizado' | 'pintada' | 'plastico' | 'piedra';
type EstadoTablero = 'detenido' | 'marcha' | 'alarma';

const ENLACES: Array<{ href: string; texto: string; soloMovil?: boolean }> = [
  { href: '#servicios', texto: 'Servicios' },
  { href: '#materiales', texto: 'Materiales' },
  { href: '#frentes', texto: 'Frentes de tablero' },
  { href: '#funeraria', texto: 'Funeraria' },
  { href: '#industrias', texto: 'Industrias' },
  { href: '#proceso', texto: 'Cómo trabajamos', soloMovil: true },
];

const SECCIONES_OBSERVADAS = ['inicio', ...ENLACES.map((e) => e.href.slice(1)), 'cotizar'];

const DATOS_CLAVE: Array<{
  texto: string;
  valor?: string;
  numero?: number;
  desde?: number;
  decimales?: number;
  prefijo?: string;
  sufijo?: string;
}> = [
  { prefijo: '±', numero: 0.1, desde: 2, decimales: 1, sufijo: ' mm', texto: 'Precisión en piezas mecanizadas' },
  { valor: 'Permanente', texto: 'Marcado resistente a la abrasión y la intemperie' },
  { valor: 'Llave en mano', texto: 'Un solo interlocutor para todo el proyecto' },
  { valor: 'Pilar, Bs. As.', texto: 'Taller propio' },
];

const SERVICIOS_ESPECIALIDAD = [
  {
    titulo: 'Grabado y marcado láser',
    texto: 'Textos, logos, números de serie, códigos QR y DataMatrix sobre metal, plástico y piedra, con marcado permanente y alta definición.',
  },
  {
    titulo: 'Mecanizado CNC',
    texto: 'Ruteo, fresado y perforado de plásticos técnicos, aluminio y piedra, con terminación prolija y medidas según plano.',
  },
  {
    titulo: 'Frentes de tablero',
    texto: 'Mecanizado y rotulación en la misma pieza: cada texto queda alineado con su orificio.',
  },
  {
    titulo: 'Trabajos en piedra',
    texto: 'Grabado y mecanizado de letras, fechas y símbolos en granito y mármol, con relleno de pintura.',
  },
];

const SERVICIOS_INTEGRALES = [
  { titulo: 'Corte láser de chapa', texto: 'Piezas planas en acero al carbono, inoxidable y aluminio según tu plano.' },
  { titulo: 'Plegado', texto: 'Gabinetes, soportes y piezas de chapa plegada.' },
  { titulo: 'Torneado', texto: 'Bujes, ejes y piezas de revolución.' },
  { titulo: 'Pintura industrial', texto: 'Terminación de alta calidad para interior y exterior, en el color que necesites.' },
];

const MATERIALES: Array<{
  muestra: TipoMuestra;
  foto: string;
  nombre: string;
  resultado: string;
  descripcion: string;
  usos: string;
}> = [
  {
    muestra: 'inox',
    foto: FOTOS.inox,
    nombre: 'Acero inoxidable',
    resultado: 'Marcado oscuro y grabado profundo',
    descripcion:
      'Marcado por recocido sin quitar material, o grabado con surco para piezas expuestas a la abrasión. Números de serie, códigos QR y DataMatrix.',
    usos: 'Válvulas, equipos de proceso, placas de identificación',
  },
  {
    muestra: 'color',
    foto: FOTOS.color,
    nombre: 'Grabado en color sobre inoxidable',
    resultado: 'Colores por oxidación controlada',
    descripcion:
      'Logramos colores sobre el acero inoxidable sin tintas ni solventes: dorados, violetas, azules y turquesas.',
    usos: 'Identificación visual, logos, piezas decorativas',
  },
  {
    muestra: 'anodizado',
    foto: FOTOS.anodizado,
    nombre: 'Aluminio anodizado',
    resultado: 'Alto contraste, lectura a distancia',
    descripcion:
      'Rotulación nítida y permanente sobre aluminio anodizado, ideal para frentes de tablero, placas y escalas.',
    usos: 'Tableristas, carteles técnicos, placas de características',
  },
  {
    muestra: 'pintada',
    foto: FOTOS.pintada,
    nombre: 'Chapa pintada',
    resultado: 'Grabado que deja el metal a la vista',
    descripcion:
      'Retiramos la pintura con precisión y el texto queda en metal brillante sobre el color de la pieza.',
    usos: 'Gabinetes, puertas de tablero, carcasas',
  },
  {
    muestra: 'plastico',
    foto: FOTOS.plastico,
    nombre: 'Plásticos de ingeniería',
    resultado: 'Marcado nítido y mecanizado CNC',
    descripcion:
      'Marcado sin deformar la pieza en ABS, policarbonato y poliamidas; ruteo y fresado de POM, PEAD, Grilon y acrílico.',
    usos: 'Gabinetes, conectores, piezas técnicas',
  },
  {
    muestra: 'piedra',
    foto: FOTOS.piedra,
    nombre: 'Granito y mármol',
    resultado: 'Grabado y mecanizado en piedra',
    descripcion:
      'Letras, fechas y símbolos grabados o mecanizados en piedra, con relleno de pintura de alta calidad apta para exterior.',
    usos: 'Lápidas, placas recordatorias, señalética',
  },
];

type Material = (typeof MATERIALES)[number];

const FICHA_FRENTES: Array<[string, string]> = [
  ['Materiales', 'Aluminio anodizado, acero inoxidable, policarbonato, acrílico y ABS'],
  ['Tolerancia', '±0,1 mm en el mecanizado'],
  ['Archivos', 'DXF, DWG, PDF con cotas o croquis con la lista de componentes'],
  ['Complementos', 'Corte de chapa, plegado y pintura del gabinete o la placa'],
];

const TRABAJOS_FUNERARIOS = [
  'Lápidas y placas recordatorias',
  'Placas para nichos y columbarios',
  'Señalética y numeración para cementerios',
  'Tercerización de grabado para marmolerías',
];

const INDUSTRIAS = [
  {
    titulo: 'Oil & Gas',
    texto: 'Identificación de bridas, válvulas y placas de equipos con grabado profundo apto para intemperie.',
  },
  {
    titulo: 'Minería',
    texto: 'Rotulación resistente a la abrasión, el polvo y la vibración para equipos y estructuras.',
  },
  {
    titulo: 'Tableristas y energía',
    texto: 'Frentes de tablero mecanizados y rotulados, placas de advertencia y carteles de identificación.',
  },
  {
    titulo: 'Farmacéutica y alimentaria',
    texto: 'Marcado sin remoción de material sobre acero inoxidable para la trazabilidad de piezas y equipos.',
  },
  {
    titulo: 'Industria funeraria',
    texto: 'Lápidas, placas recordatorias y señalética en piedra y metal, con pintura para exterior.',
  },
  {
    titulo: 'Fabricantes de equipos',
    texto: 'Placas de características, números de serie, logos y piezas mecanizadas para producción en serie.',
  },
];

const PASOS = [
  {
    numero: '01',
    titulo: 'Envío del plano',
    texto: 'Mandanos tu archivo en DXF, DWG, STEP o PDF con cotas. Si no tenés plano, una foto con las medidas principales alcanza para empezar.',
  },
  {
    numero: '02',
    titulo: 'Cotización formal',
    texto: 'Te enviamos un presupuesto con plazo de entrega y condiciones comerciales.',
  },
  {
    numero: '03',
    titulo: 'Fabricación',
    texto: 'Grabamos y mecanizamos en nuestro taller de Pilar. Si el proyecto incluye corte, plegado, torneado o pintura, lo resolvemos dentro del mismo pedido.',
  },
  {
    numero: '04',
    titulo: 'Entrega',
    texto: 'Retirás en el taller o coordinamos el envío. Recibís la pieza terminada de un solo proveedor.',
  },
];

const MARQUESINA = [
  'Acero inoxidable',
  'Aluminio anodizado',
  'Chapa pintada',
  'Policarbonato',
  'Acrílico',
  'POM y PEAD',
  'Granito',
  'Mármol',
  'Números de serie',
  'Códigos QR',
  'DataMatrix',
  'Frentes de tablero',
];

const ORIFICIOS = ['MARCHA', 'PARADA', 'RESET', 'AUTO', 'MANUAL', 'ALARMA'] as const;
type Orificio = (typeof ORIFICIOS)[number];

const DURACION_CICLO = 4600;

const CLASE_CAMPO =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/15';
const CLASE_ETIQUETA = 'mb-2 block text-sm font-medium text-slate-700';

function formatearPeso(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

function esArchivoValido(archivo: File) {
  const nombre = archivo.name.toLowerCase();
  return EXTENSIONES.some((ext) => nombre.endsWith(ext));
}

/* ───────────────────────── PÁGINA ───────────────────────── */

export default function Home() {
  return (
    <div className="np-pagina flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased selection:bg-sky-200">
      <style dangerouslySetInnerHTML={{ __html: ESTILOS }} />
      <Encabezado />
      <main>
        <Hero />
        <Marquesina />
        <SeccionServicios />
        <SeccionMateriales />
        <SeccionFrentes />
        <SeccionFuneraria />
        <SeccionIndustrias />
        <SeccionProceso />
        <SeccionCotizacion />
      </main>
      <PiePagina />
      <WhatsAppWidget />
    </div>
  );
}

/* ───────────────────────── 1. ENCABEZADO ───────────────────────── */

function Encabezado() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [conSombra, setConSombra] = useState(false);
  const [activa, setActiva] = useState('');
  const barraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const actualizar = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const avance = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (barraRef.current) barraRef.current.style.transform = `scaleX(${avance})`;
      setConSombra(window.scrollY > 8);
    };
    const alDesplazar = () => {
      if (!frame) frame = window.requestAnimationFrame(actualizar);
    };
    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    window.addEventListener('resize', alDesplazar);
    return () => {
      window.removeEventListener('scroll', alDesplazar);
      window.removeEventListener('resize', alDesplazar);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) setActiva(entrada.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECCIONES_OBSERVADAS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    });
    return () => observador.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
        conSombra ? 'border-slate-200 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          {ENLACES.filter((e) => !e.soloMovil).map((e) => {
            const esActiva = activa === e.href.slice(1);
            return (
              <a
                key={e.href}
                href={e.href}
                aria-current={esActiva ? 'true' : undefined}
                className={`group relative py-1 transition-colors hover:text-slate-900 ${esActiva ? 'text-blue-700' : ''}`}
              >
                {e.texto}
                <span
                  className={`np-grad absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full transition-transform duration-300 ${
                    esActiva ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
          <a href="#cotizar" className="np-btn rounded-lg px-5 py-2.5 font-semibold text-white">
            Cotizar plano
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-700 lg:hidden"
        >
          {menuOpen ? 'Cerrar' : 'Menú'}
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="np-caer border-t border-slate-200 bg-white px-4 pb-6 pt-2 lg:hidden">
          {ENLACES.map((e) => (
            <a
              key={e.href}
              href={e.href}
              onClick={() => setMenuOpen(false)}
              className={`block border-b border-slate-100 py-3 text-base transition-colors hover:text-blue-700 ${
                activa === e.href.slice(1) ? 'font-semibold text-blue-700' : 'text-slate-700'
              }`}
            >
              {e.texto}
            </a>
          ))}
          <a
            href="#cotizar"
            onClick={() => setMenuOpen(false)}
            className="np-btn mt-4 block rounded-lg px-4 py-3 text-center font-semibold text-white"
          >
            Cotizar plano
          </a>
        </div>
      )}

      <div
        ref={barraRef}
        aria-hidden="true"
        className="np-grad absolute inset-x-0 -bottom-px h-0.5 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </header>
  );
}

/* ───────────────────────── 2. PORTADA ───────────────────────── */

function Hero() {
  function moverFoco(e: ReactPointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  }

  return (
    <section id="inicio" onPointerMove={moverFoco} className="relative isolate overflow-hidden bg-[#030a24] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="np-grilla absolute inset-0" />
        <div className="np-orbe absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-blue-600/30 blur-3xl" />
        <div className="np-orbe np-orbe-lento absolute -bottom-48 -right-32 hidden h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-3xl sm:block" />
        <div className="np-foco absolute inset-0" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
        <div className="lg:col-span-6">
          <p className="np-entrada flex items-center gap-3 text-sm font-semibold text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="np-latido absolute inline-flex h-full w-full rounded-full bg-cyan-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            Taller industrial · Pilar, Buenos Aires
          </p>
          <h1
            className="np-entrada mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: '100ms' }}
          >
            Grabado láser y mecanizado CNC <span className="np-texto-grad">para la industria</span>
          </h1>
          <p
            className="np-entrada mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
            style={{ animationDelay: '200ms' }}
          >
            Marcado permanente, frentes de tablero, piezas mecanizadas y trabajos en piedra. Y cuando el proyecto lo
            requiere, también corte, plegado, torneado y pintura: recibís la pieza terminada de un solo proveedor.
          </p>
          <div className="np-entrada mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '300ms' }}>
            <a
              href="#cotizar"
              className="np-btn group inline-flex items-center justify-center gap-2 rounded-lg px-7 py-4 text-sm font-semibold text-white"
            >
              Enviar plano para cotizar
              <Flecha />
            </a>
            <a
              href="#materiales"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-7 py-4 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
            >
              Ver materiales
            </a>
          </div>
        </div>

        <div className="np-entrada relative lg:col-span-6" style={{ animationDelay: '250ms' }}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]">
            <VideoFondo src={VIDEOS.hero} className="h-full w-full object-cover" respaldo={<LaserDemo />} />
          </div>
          <span className="np-flotar absolute -left-4 top-14 hidden rounded-lg border border-white/10 bg-slate-900/85 px-3 py-2 font-mono text-xs text-cyan-200 shadow-xl backdrop-blur sm:block">
            QR · DataMatrix
          </span>
          <span className="np-flotar np-flotar-2 absolute -right-3 bottom-20 hidden rounded-lg border border-white/10 bg-slate-900/85 px-3 py-2 font-mono text-xs text-cyan-200 shadow-xl backdrop-blur sm:block">
            Tolerancia ±0,1 mm
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {DATOS_CLAVE.map((d, i) => (
            <div key={d.texto} className="np-entrada py-6 pr-6" style={{ animationDelay: `${450 + i * 100}ms` }}>
              <p className="font-mono text-lg font-semibold tabular-nums text-white">
                {d.numero !== undefined ? (
                  <>
                    {d.prefijo}
                    <Contador hasta={d.numero} desde={d.desde} decimales={d.decimales} />
                    {d.sufijo}
                  </>
                ) : (
                  d.valor
                )}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{d.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquesina() {
  return (
    <div className="np-marquesina-wrap relative overflow-hidden border-b border-slate-200 bg-white py-5">
      <div className="np-marquesina flex w-max">
        {[0, 1].map((copia) => (
          <ul key={copia} aria-hidden={copia === 1 ? true : undefined} className="flex shrink-0 items-center">
            {MARQUESINA.map((t) => (
              <li
                key={t}
                className="flex items-center gap-6 whitespace-nowrap pr-6 text-sm font-medium uppercase tracking-[0.2em] text-slate-500"
              >
                <span className="np-grad h-1.5 w-1.5 rotate-45" />
                {t}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── 3. SERVICIOS ───────────────────────── */

function SeccionServicios() {
  return (
    <section id="servicios" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Revelar>
          <EncabezadoSeccion
            antetitulo="Qué hacemos"
            titulo="Del plano a la pieza terminada"
            texto="Grabado, mecanizado y fabricación de piezas y conjuntos para la industria. Un solo interlocutor y una sola cotización, desde el primer plano hasta la entrega."
          />
        </Revelar>
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <GrupoServicios titulo="Grabado y mecanizado" nota="Nuestra especialidad" items={SERVICIOS_ESPECIALIDAD} />
          <GrupoServicios titulo="Fabricación integral" nota="Proyecto completo" items={SERVICIOS_INTEGRALES} />
        </div>
      </div>
    </section>
  );
}

function GrupoServicios({
  titulo,
  nota,
  items,
}: {
  titulo: string;
  nota: string;
  items: Array<{ titulo: string; texto: string }>;
}) {
  return (
    <div>
      <Revelar>
        <div className="flex items-center justify-between gap-4 pb-3">
          <h3 className="text-lg font-semibold text-slate-900">{titulo}</h3>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{nota}</span>
        </div>
        <div className="np-grad h-0.5 rounded-full" />
      </Revelar>
      <ul className="divide-y divide-slate-200">
        {items.map((s, i) => (
          <li key={s.titulo}>
            <Revelar retraso={120 + i * 90}>
              <div className="group relative py-5 pl-6">
                <span className="absolute bottom-5 left-0 top-5 w-0.5 rounded-full bg-slate-200" />
                <span className="np-grad absolute bottom-5 left-0 top-5 w-0.5 origin-top scale-y-0 rounded-full transition-transform duration-300 group-hover:scale-y-100" />
                <h4 className="font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">
                  {s.titulo}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.texto}</p>
              </div>
            </Revelar>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── 4. MATERIALES ───────────────────────── */

function SeccionMateriales() {
  return (
    <section id="materiales" className="border-y border-slate-200 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Revelar>
          <EncabezadoSeccion
            antetitulo="Materiales y acabados"
            titulo="Qué podemos grabar y mecanizar"
            texto="Ajustamos el proceso a cada material para lograr el mejor resultado: marcado oscuro en inoxidable, colores, alto contraste en aluminio y grabado en piedra."
          />
        </Revelar>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIALES.map((m, i) => (
            <Revelar key={m.nombre} retraso={(i % 3) * 100} className="h-full">
              <TarjetaMaterial material={m} />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

function TarjetaMaterial({ material: m }: { material: Material }) {
  const ref = useRef<HTMLElement>(null);

  function alMover(e: ReactPointerEvent<HTMLElement>) {
    const el = ref.current;
    if (e.pointerType !== 'mouse' || !el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 7).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
  }

  function alSalir() {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  }

  return (
    <article
      ref={ref}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
      className="np-tarjeta group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <div className="np-barrido aspect-[4/3] overflow-hidden">
        <Foto
          src={m.foto}
          alt={m.nombre}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          respaldo={<Muestra tipo={m.muestra} />}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-slate-900">{m.nombre}</h3>
        <p className="mt-1 text-sm font-medium text-blue-700">{m.resultado}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{m.descripcion}</p>
        <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">{m.usos}</p>
      </div>
    </article>
  );
}

/* ───────────────────────── 5. FRENTES DE TABLERO ───────────────────────── */

function SeccionFrentes() {
  return (
    <section id="frentes" className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Revelar className="lg:col-span-7">
          <EncabezadoSeccion
            antetitulo="Producto llave en mano"
            titulo="Frentes de tablero mecanizados y rotulados"
            texto="Mecanizamos con CNC los orificios para pulsadores, selectoras, displays y luces piloto, y grabamos la rotulación con láser en la misma pieza. Al hacer los dos procesos en el mismo taller, cada texto queda alineado con su orificio."
          />
          <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200 text-sm">
            {FICHA_FRENTES.map(([dato, valor]) => (
              <div key={dato} className="grid grid-cols-3 gap-4 py-3 transition-colors hover:bg-slate-50">
                <dt className="font-medium text-slate-900">{dato}</dt>
                <dd className="col-span-2 text-slate-600">{valor}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 border-l-2 border-blue-600 pl-4 text-sm leading-relaxed text-slate-600">
            Entregamos el frente listo para montar. El armado eléctrico y el cableado quedan a cargo del tablerista.
          </p>
          <a
            href="#cotizar"
            className="np-btn group mt-8 inline-flex items-center gap-2 rounded-lg px-7 py-4 text-sm font-semibold text-white"
          >
            Cotizar frentes de tablero
            <Flecha />
          </a>
        </Revelar>

        <Revelar retraso={150} className="lg:col-span-5">
          <div className="aspect-square min-h-[22rem] overflow-hidden rounded-2xl border border-slate-200 shadow-[0_30px_60px_-30px_rgba(2,6,23,0.6)] sm:aspect-[4/3]">
            <PanelFrente />
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="np-parpadeo h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
            Probá los pulsadores: así queda cada rótulo alineado con su orificio.
          </p>
          {FOTOS.frentes && (
            <div className="mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-slate-200">
              <Foto
                src={FOTOS.frentes}
                alt="Frente de tablero mecanizado y rotulado"
                className="h-full w-full object-cover"
                respaldo={null}
              />
            </div>
          )}
        </Revelar>
      </div>
    </section>
  );
}

/* ───────────────────────── 6. INDUSTRIA FUNERARIA ───────────────────────── */

function SeccionFuneraria() {
  return (
    <section id="funeraria" className="border-y border-stone-200 bg-stone-50 py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Revelar className="lg:col-span-5">
          <div className="group aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 shadow-[0_30px_60px_-30px_rgba(28,25,23,0.5)]">
            <Foto
              src={FOTOS.funeraria}
              alt="Placa de granito grabada"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              respaldo={<Muestra tipo="piedra" />}
            />
          </div>
        </Revelar>

        <Revelar retraso={120} className="lg:col-span-7">
          <EncabezadoSeccion
            antetitulo="Industria funeraria"
            titulo="Lápidas, placas y señalética en piedra y metal"
            texto="Trabajamos para cementerios parque, casas velatorias y marmolerías. Grabamos y mecanizamos letras, fechas y símbolos en granito, mármol, acero inoxidable y aluminio, con terminación en pintura de alta calidad apta para exterior."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {TRABAJOS_FUNERARIOS.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="np-grad mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-slate-600">
            Hacemos piezas unitarias y series, con trato cuidadoso y plazos claros.
          </p>
          <a
            href="#cotizar"
            className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Consultar por trabajos funerarios
            <Flecha />
          </a>
        </Revelar>
      </div>
    </section>
  );
}

/* ───────────────────────── 7. INDUSTRIAS ───────────────────────── */

function SeccionIndustrias() {
  return (
    <section id="industrias" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Revelar>
          <EncabezadoSeccion antetitulo="Sectores" titulo="Industrias a las que proveemos" />
        </Revelar>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIAS.map((ind, i) => (
            <Revelar key={ind.titulo} retraso={(i % 3) * 100} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_48px_-28px_rgba(11,63,192,0.5)]">
                <span
                  aria-hidden="true"
                  className="np-grad absolute inset-x-0 top-0 h-0.5 origin-left scale-x-[0.18] transition-transform duration-500 group-hover:scale-x-100"
                />
                <span className="font-mono text-xs font-semibold text-blue-700">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{ind.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{ind.texto}</p>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 8. CÓMO TRABAJAMOS ───────────────────────── */

function SeccionProceso() {
  const [ref, visible] = useEnPantalla<HTMLOListElement>();
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (!visible || pausado) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setActivo((a) => (a + 1) % PASOS.length), 2800);
    return () => window.clearInterval(t);
  }, [visible, pausado]);

  return (
    <section id="proceso" className="relative isolate overflow-hidden bg-[#030a24] py-24 text-white">
      <div aria-hidden="true" className="np-grilla absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden="true"
        className="np-orbe absolute -right-40 top-0 -z-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Revelar>
          <EncabezadoSeccion oscuro antetitulo="Proceso" titulo="Cómo trabajamos" />
        </Revelar>

        <div className="mt-14 hidden h-px overflow-hidden rounded-full bg-white/10 lg:block">
          <div
            className="np-grad h-full transition-[width] duration-700 ease-out"
            style={{ width: visible ? `${((activo + 1) / PASOS.length) * 100}%` : '0%' }}
          />
        </div>

        <ol ref={ref} className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4">
          {PASOS.map((p, i) => {
            const esActivo = i === activo;
            return (
              <li
                key={p.numero}
                className="h-full"
                onMouseEnter={() => {
                  setActivo(i);
                  setPausado(true);
                }}
                onMouseLeave={() => setPausado(false)}
              >
                <Revelar retraso={i * 140} className="h-full">
                  <div
                    className={`h-full rounded-xl border p-6 transition-colors duration-500 ${
                      esActivo ? 'border-cyan-400/50 bg-white/[0.08]' : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-semibold transition-all duration-500 ${
                        esActivo
                          ? 'np-grad text-white shadow-[0_0_24px_rgba(34,211,238,0.45)]'
                          : 'border border-white/20 text-cyan-300'
                      }`}
                    >
                      {p.numero}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-white">{p.titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.texto}</p>
                  </div>
                </Revelar>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── 9. COTIZACIÓN ───────────────────────── */

function SeccionCotizacion() {
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [estado, setEstado] = useState<EstadoEnvio>('idle');
  const [errorEnvio, setErrorEnvio] = useState('');
  const [arrastrando, setArrastrando] = useState(false);
  const [avisoArchivos, setAvisoArchivos] = useState('');
  const inputArchivosRef = useRef<HTMLInputElement>(null);

  const listaArchivos = archivos ? Array.from(archivos) : [];
  const pesoArchivos = listaArchivos.reduce((total, a) => total + a.size, 0);
  const excedeLimite = pesoArchivos > LIMITE_BYTES;

  async function enviarFormulario(form: HTMLFormElement) {
    if (excedeLimite) {
      setEstado('error');
      setErrorEnvio(
        `Los archivos adjuntos superan los ${LIMITE_MB} MB. Quitá alguno o envialos directamente a ${CORREO}.`
      );
      return;
    }

    setEstado('enviando');
    setErrorEnvio('');

    try {
      const res = await fetch('/api/cotizacion', {
        method: 'POST',
        body: new FormData(form),
      });

      if (res.status === 413) {
        throw new Error(
          `Los archivos son demasiado pesados (máximo ${LIMITE_MB} MB en total). Envialos directamente a ${CORREO}.`
        );
      }

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? 'No pudimos enviar la solicitud. Probá de nuevo en unos minutos.');
      }

      form.reset();
      setArchivos(null);
      setAvisoArchivos('');
      setEstado('ok');
      document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setEstado('error');
      setErrorEnvio(
        err instanceof Error && err.name !== 'TypeError'
          ? err.message
          : 'No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.'
      );
    }
  }

  function quitarArchivos() {
    if (inputArchivosRef.current) inputArchivosRef.current.value = '';
    setArchivos(null);
    setAvisoArchivos('');
  }

  function alSoltar(e: ReactDragEvent<HTMLDivElement>) {
    e.preventDefault();
    setArrastrando(false);
    const input = inputArchivosRef.current;
    const soltados = Array.from(e.dataTransfer.files);
    if (!input || soltados.length === 0) return;

    const validos = soltados.filter(esArchivoValido);
    if (validos.length === 0) {
      setAvisoArchivos('Formato no admitido. Usá PDF, DXF, DWG, STEP, JPG o PNG.');
      return;
    }

    try {
      const transferencia = new DataTransfer();
      validos.forEach((a) => transferencia.items.add(a));
      input.files = transferencia.files;
      setArchivos(input.files);
      setAvisoArchivos(
        validos.length < soltados.length ? 'Algunos archivos se omitieron por tener un formato no admitido.' : ''
      );
    } catch {
      setAvisoArchivos('Tu navegador no permite arrastrar archivos. Usá "Seleccionar archivos".');
    }
  }

  return (
    <section id="cotizar" className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Revelar className="lg:col-span-4">
          <EncabezadoSeccion
            antetitulo="Presupuestos"
            titulo="¿Tenés un plano? Te lo cotizamos."
            texto="Adjuntá tu archivo en PDF, DXF, DWG o STEP. Si no tenés plano formal, mandanos una foto con las medidas generales de la pieza."
          />
          <div className="mt-8 space-y-2 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <ContactoItem icono={<IconoWhatsApp className="h-5 w-5" />} titulo="WhatsApp">
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-blue-700"
              >
                {WHATSAPP_VISIBLE}
              </a>
            </ContactoItem>
            <ContactoItem icono={<IconoCorreo />} titulo="Correo">
              <a href={`mailto:${CORREO}`} className="break-all transition-colors hover:text-blue-700">
                {CORREO}
              </a>
            </ContactoItem>
            <ContactoItem icono={<IconoReloj />} titulo="Horario">
              Lunes a viernes de 08:00 a 18:00 hs
            </ContactoItem>
          </div>
        </Revelar>

        <Revelar retraso={120} className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)] sm:p-10">
            {estado === 'ok' ? (
              <div role="status" className="np-entrada rounded-xl border border-emerald-500/60 bg-emerald-50 p-8 text-center">
                <svg viewBox="0 0 52 52" className="mx-auto h-14 w-14 text-emerald-600" aria-hidden="true">
                  <circle className="np-check-circulo" cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path
                    className="np-check-tilde"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 27l7 7 15-15"
                  />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-emerald-900">Solicitud enviada</h3>
                <p className="mt-2 text-sm text-emerald-800">
                  Recibimos tu solicitud. Te respondemos a la brevedad con una cotización formal.
                </p>
                <button
                  type="button"
                  onClick={() => setEstado('idle')}
                  className="mt-6 text-sm font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-950"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void enviarFormulario(e.currentTarget);
                }}
                className="space-y-6"
              >
                {/* Campo trampa anti-spam */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="f-website">No completar este campo</label>
                  <input type="text" id="f-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-nombre" className={CLASE_ETIQUETA}>
                      Nombre y apellido *
                    </label>
                    <input
                      type="text"
                      id="f-nombre"
                      name="nombre"
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Tu nombre completo"
                      className={CLASE_CAMPO}
                    />
                  </div>

                  <div>
                    <label htmlFor="f-empresa" className={CLASE_ETIQUETA}>
                      Empresa *
                    </label>
                    <input
                      type="text"
                      id="f-empresa"
                      name="empresa"
                      required
                      maxLength={120}
                      autoComplete="organization"
                      placeholder="Razón social o empresa"
                      className={CLASE_CAMPO}
                    />
                  </div>

                  <div>
                    <label htmlFor="f-cargo" className={CLASE_ETIQUETA}>
                      Cargo / área
                    </label>
                    <input
                      type="text"
                      id="f-cargo"
                      name="cargo"
                      maxLength={120}
                      autoComplete="organization-title"
                      placeholder="Ej: Compras, Ingeniería, Mantenimiento"
                      className={CLASE_CAMPO}
                    />
                  </div>

                  <div>
                    <label htmlFor="f-email" className={CLASE_ETIQUETA}>
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="f-email"
                      name="email"
                      required
                      maxLength={160}
                      autoComplete="email"
                      placeholder="nombre@empresa.com"
                      className={CLASE_CAMPO}
                    />
                  </div>

                  <div>
                    <label htmlFor="f-telefono" className={CLASE_ETIQUETA}>
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="f-telefono"
                      name="telefono"
                      required
                      maxLength={60}
                      autoComplete="tel"
                      placeholder="+54 9 ..."
                      className={CLASE_CAMPO}
                    />
                  </div>

                  <div>
                    <label htmlFor="f-ubicacion" className={CLASE_ETIQUETA}>
                      País / provincia *
                    </label>
                    <input
                      type="text"
                      id="f-ubicacion"
                      name="ubicacion"
                      required
                      maxLength={120}
                      defaultValue="Argentina"
                      className={CLASE_CAMPO}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="f-servicio" className={CLASE_ETIQUETA}>
                      Servicio *
                    </label>
                    <select id="f-servicio" name="servicio" required className={CLASE_CAMPO}>
                      <option value="Grabado y marcado láser">Grabado y marcado láser</option>
                      <option value="Frentes de tablero">Frentes de tablero</option>
                      <option value="Mecanizado CNC">Mecanizado CNC</option>
                      <option value="Industria funeraria (piedra y placas)">Industria funeraria</option>
                      <option value="Fabricación integral (corte, plegado, torneado, pintura)">
                        Fabricación integral
                      </option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="f-material" className={CLASE_ETIQUETA}>
                      Material
                    </label>
                    <input
                      type="text"
                      id="f-material"
                      name="material"
                      maxLength={160}
                      placeholder="Ej: Inoxidable, aluminio, granito"
                      className={CLASE_CAMPO}
                    />
                  </div>

                  <div>
                    <label htmlFor="f-cantidad" className={CLASE_ETIQUETA}>
                      Cantidad estimada
                    </label>
                    <input
                      type="text"
                      id="f-cantidad"
                      name="cantidad"
                      maxLength={160}
                      placeholder="Ej: 1 prototipo / 500 piezas"
                      className={CLASE_CAMPO}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="f-plazo" className={CLASE_ETIQUETA}>
                    Plazo deseado de entrega
                  </label>
                  <input
                    type="text"
                    id="f-plazo"
                    name="plazo"
                    maxLength={160}
                    placeholder="Ej: Urgente / 1 semana / sin apuro"
                    className={CLASE_CAMPO}
                  />
                </div>

                <div>
                  <span className={CLASE_ETIQUETA}>Plano, esquema o foto (PDF, DXF, DWG, STEP, JPG, PNG)</span>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!arrastrando) setArrastrando(true);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setArrastrando(false);
                    }}
                    onDrop={alSoltar}
                    className={`group rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                      arrastrando
                        ? 'border-blue-600 bg-blue-50'
                        : excedeLimite
                          ? 'border-red-300 bg-white'
                          : 'border-slate-300 bg-white hover:border-blue-500'
                    }`}
                  >
                    <input
                      ref={inputArchivosRef}
                      type="file"
                      id="file-upload"
                      name="archivos"
                      multiple
                      accept=".pdf,.dxf,.dwg,.step,.stp,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        setArchivos(e.target.files);
                        setAvisoArchivos('');
                      }}
                      className="hidden"
                    />
                    <svg
                      className={`mx-auto h-8 w-8 text-blue-600 transition-transform duration-300 ${
                        arrastrando ? '-translate-y-1' : 'group-hover:-translate-y-1'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                      />
                    </svg>
                    <p className="mt-3 text-sm">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer font-semibold text-blue-700 hover:text-blue-800"
                      >
                        Seleccionar archivos
                      </label>
                      <span className="text-slate-500"> o arrastralos acá</span>
                    </p>
                    <span className={`mt-2 block text-sm ${excedeLimite ? 'text-red-600' : 'text-slate-500'}`}>
                      {listaArchivos.length > 0
                        ? `${listaArchivos.length} archivo(s) seleccionado(s) · ${formatearPeso(pesoArchivos)}${
                            excedeLimite ? ` — supera el máximo de ${LIMITE_MB} MB` : ''
                          }`
                        : 'Planos 2D, modelos 3D o fotos con medidas'}
                    </span>
                    {listaArchivos.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        {listaArchivos.map((a, i) => (
                          <span
                            key={`${a.name}-${i}`}
                            className="max-w-[14rem] truncate rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                          >
                            {a.name}
                          </span>
                        ))}
                        <button
                          type="button"
                          onClick={quitarArchivos}
                          className="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-red-600"
                        >
                          Quitar
                        </button>
                      </div>
                    )}
                    {avisoArchivos && <span className="mt-2 block text-xs text-amber-700">{avisoArchivos}</span>}
                    <span className="mt-2 block text-xs text-slate-400">
                      Máximo {LIMITE_MB} MB en total. Archivos más pesados: envialos a {CORREO}
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="f-mensaje" className={CLASE_ETIQUETA}>
                    Mensaje o especificaciones técnicas
                  </label>
                  <textarea
                    id="f-mensaje"
                    name="mensaje"
                    rows={4}
                    maxLength={5000}
                    placeholder="Detallá tolerancias, tipo de grabado, terminación o condiciones de uso..."
                    className={CLASE_CAMPO}
                  />
                </div>

                {estado === 'error' && errorEnvio && (
                  <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                    {errorEnvio}
                    <span className="mt-2 block text-red-700">
                      Si el problema sigue, escribinos por WhatsApp o a {CORREO}.
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                  <span className="text-xs text-slate-500">Respondemos con una cotización formal.</span>
                  <button
                    type="submit"
                    disabled={estado === 'enviando'}
                    className="np-btn group inline-flex w-full items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {estado === 'enviando' ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar solicitud de cotización
                        <Flecha />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/* ───────────────────────── 10. PIE DE PÁGINA ───────────────────────── */

function PiePagina() {
  return (
    <footer className="mt-auto bg-[#020617] text-sm text-slate-400">
      <div aria-hidden="true" className="np-grad h-px w-full" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Logo claro />
          <p className="mt-4 leading-relaxed">
            Grabado láser, mecanizado CNC y fabricación integral para la industria.
          </p>
          <p className="mt-4">
            CUIT <span className="text-slate-200">30-71924978-3</span>
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Taller</h3>
          <p className="mt-3">Pilar, Buenos Aires, Argentina</p>
          <p className="mt-1">Lunes a viernes de 08:00 a 18:00 hs</p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Contacto</h3>
          <p className="mt-3">
            WhatsApp:{' '}
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 transition-colors hover:text-cyan-300"
            >
              {WHATSAPP_VISIBLE}
            </a>
          </p>
          <p className="mt-1 break-all">
            Correo:{' '}
            <a href={`mailto:${CORREO}`} className="text-slate-200 transition-colors hover:text-cyan-300">
              {CORREO}
            </a>
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Industrias</h3>
          <ul className="mt-3 space-y-1">
            {INDUSTRIAS.map((ind) => (
              <li key={ind.titulo}>{ind.titulo}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            © <AnioActual /> NP Solutions. Todos los derechos reservados.
          </p>
          <p>Pilar · Buenos Aires · República Argentina</p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── COMPONENTES ───────────────────────── */

function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <a href="#" className="group flex items-center gap-3">
      <span className={`flex h-10 items-center ${claro ? 'rounded-lg bg-white px-2 py-1.5' : ''}`}>
        <Foto
          src={LOGO}
          alt=""
          className="h-full w-auto transition-transform duration-300 group-hover:scale-105"
          respaldo={<span className="np-logo-np text-[1.75rem] font-black leading-none tracking-tighter">NP</span>}
        />
      </span>
      <span className="leading-tight">
        <span
          className={`block text-[15px] uppercase tracking-[0.14em] ${claro ? 'text-white' : 'text-slate-700'}`}
        >
          <span className="font-bold">NP</span> Solutions
        </span>
        <span className={`block text-xs ${claro ? 'text-slate-400' : 'text-slate-500'}`}>
          Grabado · Mecanizado · Fabricación
        </span>
      </span>
    </a>
  );
}

function EncabezadoSeccion({
  antetitulo,
  titulo,
  texto,
  oscuro = false,
}: {
  antetitulo: string;
  titulo: string;
  texto?: string;
  oscuro?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`flex items-center gap-3 text-sm font-semibold ${oscuro ? 'text-cyan-300' : 'text-blue-700'}`}>
        <span className="np-grad np-kicker h-0.5 w-8 rounded-full" />
        {antetitulo}
      </p>
      <h2
        className={`mt-4 text-3xl font-semibold tracking-tight sm:text-4xl ${oscuro ? 'text-white' : 'text-slate-900'}`}
      >
        {titulo}
      </h2>
      {texto && (
        <p className={`mt-4 text-lg leading-relaxed ${oscuro ? 'text-slate-300' : 'text-slate-600'}`}>{texto}</p>
      )}
    </div>
  );
}

function ContactoItem({ icono, titulo, children }: { icono: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div className="group -mx-3 flex items-start gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-slate-200 hover:bg-slate-50">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        {icono}
      </span>
      <div>
        <span className="block font-medium text-slate-900">{titulo}</span>
        {children}
      </div>
    </div>
  );
}

function Flecha() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function IconoCorreo() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 1 8 6 8-6"
      />
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7v5l3 2" />
    </svg>
  );
}

function IconoWhatsApp({ className = '' }: { className?: string }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

// Detecta cuándo un elemento entra en pantalla (una sola vez).
function useEnPantalla<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return [ref, visible] as const;
}

// Hace aparecer el contenido con un fundido suave al hacer scroll.
function Revelar({ children, retraso = 0, className = '' }: { children: ReactNode; retraso?: number; className?: string }) {
  const [ref, visible] = useEnPantalla<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`np-revelar ${visible ? 'np-visible' : ''} ${className}`}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      {children}
    </div>
  );
}

// Número que cuenta hasta su valor final cuando aparece en pantalla.
function Contador({ hasta, desde = 0, decimales = 0 }: { hasta: number; desde?: number; decimales?: number }) {
  const [ref, visible] = useEnPantalla<HTMLSpanElement>();
  const [valor, setValor] = useState(hasta);

  useEffect(() => {
    if (!visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const inicio = performance.now();
    const duracion = 1600;
    const avanzar = (ahora: number) => {
      const p = Math.max(0, Math.min(1, (ahora - inicio) / duracion));
      const suavizado = 1 - Math.pow(1 - p, 3);
      setValor(desde + (hasta - desde) * suavizado);
      if (p < 1) frame = window.requestAnimationFrame(avanzar);
    };
    frame = window.requestAnimationFrame(avanzar);
    return () => window.cancelAnimationFrame(frame);
  }, [visible, desde, hasta]);

  return <span ref={ref}>{valor.toFixed(decimales).replace('.', ',')}</span>;
}

// Muestra la foto; si no hay foto o no carga, muestra el respaldo gráfico.
function Foto({
  src,
  alt,
  className,
  respaldo,
}: {
  src: string;
  alt: string;
  className?: string;
  respaldo: ReactNode;
}) {
  const [fallo, setFallo] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFallo(true);
  }, [src]);

  if (!src || fallo) return <>{respaldo}</>;

  return <img ref={ref} src={src} alt={alt} onError={() => setFallo(true)} className={className} />;
}

// Video en bucle; si no hay video o no carga, muestra el respaldo.
function VideoFondo({ src, className, respaldo }: { src: string; className?: string; respaldo: ReactNode }) {
  const [fallo, setFallo] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (video.error) {
      setFallo(true);
      return;
    }
    video.muted = true;
    video.play().catch(() => {});
  }, [src]);

  if (!src || fallo) return <>{respaldo}</>;

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onError={() => setFallo(true)}
      className={className}
    />
  );
}

const FONDO_INOX: CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 3px), linear-gradient(160deg, #e4e4e7 0%, #a1a1aa 40%, #d4d4d8 65%, #a1a1aa 100%)',
};

const FONDO_ANODIZADO: CSSProperties = {
  backgroundImage: 'linear-gradient(150deg, #3f3f46 0%, #18181b 55%, #27272a 100%)',
};

const FONDO_PINTADA: CSSProperties = {
  backgroundImage: 'linear-gradient(150deg, #1e3a5f, #142a46)',
};

const FONDO_GRANITO: CSSProperties = {
  backgroundColor: '#1c1917',
  backgroundImage:
    'radial-gradient(rgba(255,255,255,0.22) 0.8px, transparent 1.3px), radial-gradient(rgba(214,211,209,0.14) 1px, transparent 1.7px), radial-gradient(rgba(120,113,108,0.4) 1.5px, transparent 2.6px), linear-gradient(150deg, #292524, #0c0a09)',
  backgroundSize: '9px 9px, 17px 17px, 23px 23px, 100% 100%',
  backgroundPosition: '0 0, 4px 7px, 11px 3px, 0 0',
};

const TEXTO_METAL: CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, #fafafa, #a1a1aa)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

const TEXTO_COLOR: CSSProperties = {
  backgroundImage: 'linear-gradient(90deg, #b8860b, #9333ea, #2563eb, #0e7490, #b8860b)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

const GRABADOS: Array<{
  material: string;
  texto: string;
  detalle: string;
  fondo: CSSProperties;
  claseTexto?: string;
  estiloTexto?: CSSProperties;
  claseDetalle: string;
}> = [
  {
    material: 'ACERO INOXIDABLE',
    texto: 'AISI 316L',
    detalle: 'S/N 0417-26 · LOTE A12',
    fondo: FONDO_INOX,
    claseTexto: 'text-slate-800',
    claseDetalle: 'text-slate-700',
  },
  {
    material: 'ALUMINIO ANODIZADO',
    texto: 'Q1 · ARRANQUE',
    detalle: 'BOMBA CENTRÍFUGA 7,5 kW',
    fondo: FONDO_ANODIZADO,
    claseTexto: 'text-white',
    claseDetalle: 'text-slate-300',
  },
  {
    material: 'COLOR SOBRE INOX',
    texto: 'GRABADO COLOR',
    detalle: 'OXIDACIÓN CONTROLADA',
    fondo: FONDO_INOX,
    estiloTexto: TEXTO_COLOR,
    claseDetalle: 'text-slate-700',
  },
  {
    material: 'CHAPA PINTADA',
    texto: 'TABLERO TG-01',
    detalle: 'GRABADO A METAL',
    fondo: FONDO_PINTADA,
    estiloTexto: TEXTO_METAL,
    claseDetalle: 'text-slate-300',
  },
];

const CHISPAS: CSSProperties[] = [
  ['-18px', '-14px', '0ms'],
  ['14px', '-18px', '120ms'],
  ['-10px', '16px', '240ms'],
  ['20px', '8px', '360ms'],
  ['4px', '-22px', '180ms'],
].map(([cx, cy, retraso]) => ({ '--cx': cx, '--cy': cy, animationDelay: retraso }) as CSSProperties);

// Animación de la portada: el láser graba distintos materiales en bucle.
function LaserDemo() {
  const [paso, setPaso] = useState(0);
  const indice = paso % GRABADOS.length;
  const g = GRABADOS[indice];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => setPaso((p) => p + 1), DURACION_CICLO);
    return () => window.clearTimeout(t);
  }, [paso]);

  function elegir(j: number) {
    setPaso((p) => {
      const total = GRABADOS.length;
      const delta = (j - (p % total) + total) % total;
      return p + (delta === 0 ? total : delta);
    });
  }

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      {GRABADOS.map((s, i) => (
        <div
          key={s.texto}
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-700"
          style={{ ...s.fondo, opacity: i === indice ? 1 : 0 }}
        />
      ))}
      <div aria-hidden="true" className="np-reflejo" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-slate-950/70 px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] text-cyan-200 backdrop-blur-sm">
        <span className="flex items-center gap-2">
          <span className="np-parpadeo h-1.5 w-1.5 rounded-full bg-cyan-400" />
          MARCADO LÁSER
        </span>
        <span className="text-slate-300">{g.material}</span>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div key={`t${paso}`} className="relative">
          <span
            className={`np-grabado block whitespace-nowrap font-mono text-2xl font-bold tracking-[0.15em] sm:text-4xl ${
              g.claseTexto ?? ''
            }`}
            style={g.estiloTexto}
          >
            {g.texto}
          </span>
          <span className="np-cabezal" aria-hidden="true">
            <span className="np-haz" />
            <span className="np-punto" />
            {CHISPAS.map((estilo, i) => (
              <span key={i} className="np-chispa" style={estilo} />
            ))}
          </span>
        </div>
        <span key={`d${paso}`} className={`np-detalle font-mono text-[11px] tracking-[0.3em] ${g.claseDetalle}`}>
          {g.detalle}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-slate-950/70 px-4 pb-3 pt-2.5 backdrop-blur-sm">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em]">
          <span key={`e${paso}`} className="relative text-cyan-200">
            <span className="np-estado-a">GRABANDO…</span>
            <span className="np-estado-b absolute left-0 top-0 whitespace-nowrap text-emerald-300">✓ LISTO</span>
          </span>
          <div className="flex items-center">
            {GRABADOS.map((s, i) => (
              <button
                key={s.texto}
                type="button"
                onClick={() => elegir(i)}
                aria-label={`Ver grabado en ${s.material.toLowerCase()}`}
                className="p-1.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === indice ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/30'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/10">
          <div key={`p${paso}`} className="np-progreso h-full" style={{ animationDuration: `${DURACION_CICLO}ms` }} />
        </div>
      </div>
    </div>
  );
}

// Muestras gráficas del resultado sobre cada material.
function Muestra({ tipo }: { tipo: TipoMuestra }) {
  const base = 'relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden p-6 text-center';
  const reflejo = <span aria-hidden="true" className="np-reflejo" />;

  if (tipo === 'inox') {
    return (
      <div className={base} style={FONDO_INOX}>
        {reflejo}
        <span className="font-mono text-xl font-bold tracking-[0.2em] text-zinc-800 sm:text-2xl">AISI 316L</span>
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-700">S/N 0417-26 · LOTE A12</span>
      </div>
    );
  }

  if (tipo === 'color') {
    return (
      <div className={base} style={FONDO_INOX}>
        {reflejo}
        <span className="np-color-vivo font-mono text-xl font-bold tracking-[0.2em] sm:text-2xl" style={TEXTO_COLOR}>
          GRABADO COLOR
        </span>
        <div className="flex gap-2">
          {['#b8860b', '#a16207', '#9333ea', '#2563eb', '#0e7490'].map((c) => (
            <span key={c} className="h-6 w-6 rounded-sm border border-black/10" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    );
  }

  if (tipo === 'anodizado') {
    return (
      <div className={base} style={FONDO_ANODIZADO}>
        {reflejo}
        <span className="font-mono text-xl font-bold tracking-[0.2em] text-zinc-100 sm:text-2xl">Q1 · ARRANQUE</span>
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-300">BOMBA CENTRÍFUGA 7,5 kW</span>
      </div>
    );
  }

  if (tipo === 'pintada') {
    return (
      <div className={base} style={FONDO_PINTADA}>
        {reflejo}
        <span className="font-mono text-xl font-bold tracking-[0.2em] sm:text-2xl" style={TEXTO_METAL}>
          TABLERO TG-01
        </span>
        <span className="font-mono text-xs tracking-[0.3em]" style={TEXTO_METAL}>
          GRABADO A METAL
        </span>
      </div>
    );
  }

  if (tipo === 'plastico') {
    return (
      <div className={base} style={{ backgroundImage: 'linear-gradient(150deg, #fafaf9, #e7e5e4)' }}>
        <span className="font-mono text-xl font-bold tracking-[0.2em] text-zinc-700 sm:text-2xl">REF 2210-B</span>
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-500">POM · PEAD · ABS</span>
      </div>
    );
  }

  return (
    <div className={base} style={FONDO_GRANITO}>
      <span className="font-serif text-3xl italic text-stone-100">In memoriam</span>
      <span className="font-serif text-sm tracking-[0.35em]" style={{ color: '#c8a96a' }}>
        1948 — 2026
      </span>
    </div>
  );
}

// Frente de tablero interactivo: los pulsadores encienden luces y cambian la pantalla.
function PanelFrente() {
  const [estado, setEstado] = useState<EstadoTablero>('detenido');
  const [modo, setModo] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (!reset) return;
    const t = window.setTimeout(() => setReset(false), 450);
    return () => window.clearTimeout(t);
  }, [reset]);

  function pulsar(boton: Orificio) {
    if (boton === 'MARCHA' && estado !== 'alarma') setEstado('marcha');
    if (boton === 'PARADA' && estado !== 'alarma') setEstado('detenido');
    if (boton === 'ALARMA') setEstado('alarma');
    if (boton === 'AUTO' || boton === 'MANUAL') setModo(boton);
    if (boton === 'RESET') {
      setReset(true);
      if (estado === 'alarma') setEstado('detenido');
    }
  }

  const luces: Record<Orificio, string> = {
    MARCHA: estado === 'marcha' ? 'np-luz-verde' : '',
    PARADA: estado === 'detenido' ? 'np-luz-roja' : '',
    RESET: reset ? 'np-luz-blanca' : '',
    AUTO: modo === 'AUTO' ? 'np-luz-cian' : '',
    MANUAL: modo === 'MANUAL' ? 'np-luz-cian' : '',
    ALARMA: estado === 'alarma' ? 'np-luz-ambar np-titilar' : '',
  };

  const linea1 =
    estado === 'marcha' ? 'BOMBA 1 · EN MARCHA' : estado === 'alarma' ? 'ALARMA ACTIVA' : 'BOMBA 1 · DETENIDA';
  const linea2 = estado === 'alarma' ? 'PULSE RESET' : `MODO ${modo}`;
  const colorLinea1 =
    estado === 'alarma' ? 'text-amber-300' : estado === 'marcha' ? 'text-emerald-300' : 'text-cyan-200';

  return (
    <div className="relative flex h-full w-full flex-col justify-center gap-7 p-8 sm:p-10" style={FONDO_ANODIZADO}>
      {['left-3 top-3', 'right-3 top-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`absolute ${pos} h-2.5 w-2.5 rounded-full border border-zinc-600 bg-zinc-800`}
        />
      ))}

      <div className="mx-auto w-full max-w-xs">
        <div className="mb-2 text-center font-mono text-[10px] font-bold tracking-[0.3em] text-zinc-100">PANTALLA</div>
        <div
          role="status"
          aria-live="polite"
          className="np-pantalla relative flex h-16 flex-col justify-center overflow-hidden border border-zinc-600 bg-zinc-950 px-3 font-mono text-[11px] tracking-[0.15em]"
        >
          <span className={colorLinea1}>{linea1}</span>
          <span className="mt-1 text-zinc-400">{linea2}</span>
          {estado === 'marcha' && <span aria-hidden="true" className="np-cinta absolute inset-x-0 bottom-0 h-0.5" />}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-y-6">
        {ORIFICIOS.map((t) => (
          <div key={t} className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-100">{t}</span>
            <button
              type="button"
              onClick={() => pulsar(t)}
              aria-label={`Pulsador ${t.toLowerCase()}`}
              className={`np-pulsador h-10 w-10 rounded-full border border-zinc-600 bg-zinc-950 ${luces[t]}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatsAppWidget() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('Hola NP Solutions, quiero cotizar un trabajo.');

  useEffect(() => {
    if (!abierto) return;
    const alPresionarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    window.addEventListener('keydown', alPresionarTecla);
    return () => window.removeEventListener('keydown', alPresionarTecla);
  }, [abierto]);

  const textoLimpio = mensaje.trim();
  const enlace = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoLimpio)}`;

  return (
    <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {abierto && (
        <div
          id="panel-whatsapp"
          role="dialog"
          aria-label="Enviar mensaje por WhatsApp"
          className="np-emerger w-[calc(100vw-3rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <IconoWhatsApp className="h-4 w-4" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-emerald-700 bg-emerald-300" />
              </span>
              <div>
                <div className="text-sm font-semibold">NP Solutions</div>
                <div className="text-xs text-emerald-100">Lun a Vie · 08:00 a 18:00 hs</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat de WhatsApp"
              className="rounded-full p-1 text-emerald-100 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 p-4">
            <div className="np-entrada rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
              Hola, ¿en qué te podemos ayudar? Contanos qué pieza o trabajo necesitás y te respondemos por WhatsApp.
            </div>

            <label htmlFor="mensaje-whatsapp" className="sr-only">
              Tu mensaje
            </label>
            <textarea
              id="mensaje-whatsapp"
              rows={3}
              maxLength={1000}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribí tu mensaje..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
            />

            <a
              href={textoLimpio ? enlace : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!textoLimpio}
              onClick={() => {
                if (textoLimpio) setAbierto(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Enviar por WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="relative">
        {!abierto && <span aria-hidden="true" className="np-pulso absolute inset-0 rounded-full bg-emerald-500" />}
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          aria-controls="panel-whatsapp"
          aria-label={abierto ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp con NP Solutions'}
          className="relative flex items-center gap-3 rounded-full bg-emerald-600 px-4 py-3.5 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40"
        >
          <IconoWhatsApp className="h-5 w-5" />
          <span className="hidden text-sm font-semibold sm:inline">{abierto ? 'Cerrar' : 'WhatsApp'}</span>
        </button>
      </div>
    </aside>
  );
}

function AnioActual() {
  const [anio, setAnio] = useState(2026);

  useEffect(() => {
    setAnio(new Date().getFullYear());
  }, []);

  return <>{anio}</>;
}

/* ───────────────────────── ESTILOS Y ANIMACIONES ───────────────────────── */

const ESTILOS = `
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
.np-pagina section[id] { scroll-margin-top: 72px; }

/* Colores del logo */
.np-grad { background-image: linear-gradient(90deg, #0a2a9a, #0b6fe6 55%, #00c2f5); }
.np-logo-np {
  background-image: linear-gradient(155deg, #0b6fe6 0%, #00c2f5 38%, #0a2a9a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.np-texto-grad {
  background-image: linear-gradient(90deg, #38bdf8, #60a5fa, #22d3ee, #38bdf8);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: np-desplazar 6s linear infinite;
}
.np-color-vivo { background-size: 200% auto; animation: np-desplazar 5s linear infinite; }
@keyframes np-desplazar { to { background-position: 200% center; } }

/* Botón principal */
.np-btn {
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(135deg, #0a2a9a 0%, #0b5fd6 60%, #0b6fe6 100%);
  box-shadow: 0 10px 30px -12px rgba(11, 111, 230, 0.7);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.np-btn:hover { box-shadow: 0 14px 34px -10px rgba(0, 194, 245, 0.6); transform: translateY(-1px); }
.np-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.35) 50%, transparent 70%);
  transform: translateX(-120%);
  transition: transform 0.8s ease;
}
.np-btn:hover::after { transform: translateX(120%); }
.np-btn:disabled { transform: none; box-shadow: none; }

/* Portada */
.np-grilla {
  background-image:
    linear-gradient(rgba(56, 189, 248, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.09) 1px, transparent 1px);
  background-size: 52px 52px;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%);
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%);
  animation: np-grilla 8s linear infinite;
}
@keyframes np-grilla { to { background-position: 52px 52px; } }
.np-foco {
  background: radial-gradient(520px circle at var(--mx, 70%) var(--my, 35%), rgba(56, 189, 248, 0.14), transparent 45%);
}
.np-orbe { animation: np-orbe 16s ease-in-out infinite; }
.np-orbe-lento { animation-duration: 22s; animation-direction: reverse; }
@keyframes np-orbe {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.12); }
}
.np-flotar { animation: np-flotar 6s ease-in-out infinite; }
.np-flotar-2 { animation-delay: -3s; }
@keyframes np-flotar { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.np-latido { animation: np-latido 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; }
@keyframes np-latido { 75%, 100% { transform: scale(2.4); opacity: 0; } }
.np-parpadeo { animation: np-parpadeo 1.6s ease-in-out infinite; }
@keyframes np-parpadeo { 50% { opacity: 0.3; } }
.np-entrada { animation: np-entrada 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
@keyframes np-entrada { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
.np-caer { animation: np-caer 0.25s ease both; }
@keyframes np-caer { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

/* Aparición al hacer scroll */
.np-revelar {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.np-revelar.np-visible { opacity: 1; transform: none; }
.np-kicker { transform-origin: left; }
.np-revelar .np-kicker { transform: scaleX(0); transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s; }
.np-revelar.np-visible .np-kicker { transform: scaleX(1); }

/* Cinta de materiales */
.np-marquesina-wrap {
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.np-marquesina { animation: np-marquesina 45s linear infinite; }
.np-marquesina-wrap:hover .np-marquesina { animation-play-state: paused; }
@keyframes np-marquesina { to { transform: translateX(-50%); } }

/* Tarjetas de materiales */
.np-tarjeta {
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.2s ease-out, box-shadow 0.3s ease, border-color 0.3s ease;
}
.np-tarjeta:hover { border-color: #93c5fd; box-shadow: 0 24px 48px -24px rgba(11, 63, 192, 0.45); }
.np-tarjeta::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: radial-gradient(380px circle at var(--gx, 50%) var(--gy, 50%), rgba(56, 189, 248, 0.13), transparent 45%);
}
.np-tarjeta:hover::before { opacity: 1; }
.np-barrido { position: relative; }
.np-barrido::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  opacity: 0;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, #a5f3fc, transparent);
  box-shadow: 0 0 14px 3px rgba(34, 211, 238, 0.6);
}
.group:hover .np-barrido::after { animation: np-barrido 1.8s ease-in-out infinite; }
@keyframes np-barrido {
  0% { top: 0; opacity: 0; }
  15%, 85% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.np-reflejo {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(105deg, transparent 42%, rgba(255, 255, 255, 0.22) 50%, transparent 58%);
  background-size: 250% 100%;
  background-repeat: no-repeat;
  animation: np-reflejo 7s ease-in-out infinite;
}
@keyframes np-reflejo { 0% { background-position: 100% 0; } 55%, 100% { background-position: 0% 0; } }

/* Grabado láser de la portada */
.np-grabado { animation: np-grabar 2.4s linear both; }
@keyframes np-grabar { 0% { clip-path: inset(0 100% 0 0); } 85%, 100% { clip-path: inset(0 0 0 0); } }
.np-cabezal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  pointer-events: none;
  animation: np-cabezal 2.4s linear both;
}
@keyframes np-cabezal {
  0% { left: 0; opacity: 1; }
  85% { left: 100%; opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
.np-haz {
  position: absolute;
  bottom: 50%;
  left: -1px;
  width: 2px;
  height: 520px;
  background: linear-gradient(to top, #e0f2fe, rgba(56, 189, 248, 0.75) 25%, rgba(56, 189, 248, 0));
  filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.9));
}
.np-punto {
  position: absolute;
  top: 50%;
  left: 0;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #fff 0 22%, #a5f3fc 40%, rgba(56, 189, 248, 0) 70%);
  box-shadow: 0 0 22px 8px rgba(56, 189, 248, 0.55);
}
.np-chispa {
  position: absolute;
  top: 50%;
  left: 0;
  width: 3px;
  height: 3px;
  border-radius: 9999px;
  background: #fef3c7;
  box-shadow: 0 0 6px 1px rgba(253, 224, 71, 0.9);
  animation: np-chispa 0.55s ease-out infinite;
}
@keyframes np-chispa {
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(var(--cx), var(--cy)) scale(0.3); opacity: 0; }
}
.np-detalle { animation: np-aparecer 0.5s ease 2.05s both; }
@keyframes np-aparecer { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.np-progreso {
  transform-origin: left;
  background-image: linear-gradient(90deg, #0b6fe6, #22d3ee);
  animation: np-progreso linear both;
}
@keyframes np-progreso { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.np-estado-a { animation: np-fin 2.05s linear both; }
.np-estado-b { animation: np-inicio 2.05s linear both; }
@keyframes np-fin { 0%, 99% { opacity: 1; } 100% { opacity: 0; } }
@keyframes np-inicio { 0%, 99% { opacity: 0; } 100% { opacity: 1; } }

/* Frente de tablero */
.np-pantalla { background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 3px); }
.np-cinta {
  background-image: repeating-linear-gradient(90deg, #34d399 0 8px, transparent 8px 14px);
  animation: np-cinta 0.7s linear infinite;
}
@keyframes np-cinta { to { background-position: 14px 0; } }
.np-pulsador { cursor: pointer; transition: transform 0.12s ease, box-shadow 0.3s ease; }
.np-pulsador:hover { border-color: #71717a; }
.np-pulsador:active { transform: scale(0.9); }
.np-pulsador:focus-visible { outline: 2px solid #22d3ee; outline-offset: 3px; }
.np-luz-verde {
  border-color: #4ade80;
  background: radial-gradient(circle at 35% 30%, #dcfce7, #22c55e 45%, #14532d);
  box-shadow: 0 0 20px 4px rgba(34, 197, 94, 0.55);
}
.np-luz-roja {
  border-color: #f87171;
  background: radial-gradient(circle at 35% 30%, #fee2e2, #ef4444 45%, #7f1d1d);
  box-shadow: 0 0 20px 4px rgba(239, 68, 68, 0.5);
}
.np-luz-ambar {
  border-color: #fbbf24;
  background: radial-gradient(circle at 35% 30%, #fef3c7, #f59e0b 45%, #78350f);
  box-shadow: 0 0 20px 4px rgba(245, 158, 11, 0.55);
}
.np-luz-cian {
  border-color: #67e8f9;
  background: radial-gradient(circle at 35% 30%, #cffafe, #22d3ee 45%, #155e75);
  box-shadow: 0 0 18px 3px rgba(34, 211, 238, 0.5);
}
.np-luz-blanca {
  border-color: #e2e8f0;
  background: radial-gradient(circle at 35% 30%, #ffffff, #e2e8f0 45%, #64748b);
  box-shadow: 0 0 20px 4px rgba(255, 255, 255, 0.45);
}
.np-titilar { animation: np-titilar 0.9s steps(1) infinite; }
@keyframes np-titilar { 50% { opacity: 0.3; } }

/* Confirmación del formulario */
.np-check-circulo { stroke-dasharray: 151; stroke-dashoffset: 151; animation: np-trazo 0.6s ease-out forwards; }
.np-check-tilde { stroke-dasharray: 32; stroke-dashoffset: 32; animation: np-trazo 0.4s ease-out 0.5s forwards; }
@keyframes np-trazo { to { stroke-dashoffset: 0; } }

/* WhatsApp */
.np-pulso { animation: np-pulso 2.4s cubic-bezier(0, 0, 0.2, 1) infinite; }
@keyframes np-pulso {
  0% { transform: scale(1); opacity: 0.55; }
  80%, 100% { transform: scale(1.35, 1.6); opacity: 0; }
}
.np-emerger { transform-origin: bottom right; animation: np-emerger 0.28s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
@keyframes np-emerger { from { opacity: 0; transform: translateY(8px) scale(0.96); } to { opacity: 1; transform: none; } }

/* Accesibilidad: sin animaciones si el usuario lo pide */
@media (prefers-reduced-motion: reduce) {
  .np-pagina *, .np-pagina *::before, .np-pagina *::after {
    animation: none !important;
    transition: none !important;
  }
  .np-revelar { opacity: 1; transform: none; }
  .np-revelar .np-kicker { transform: none; }
  .np-cabezal, .np-estado-a { display: none; }
  .np-estado-b { opacity: 1; }
  .np-check-circulo, .np-check-tilde { stroke-dashoffset: 0; }
}
`;
