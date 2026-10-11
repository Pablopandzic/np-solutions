'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const WHATSAPP_NUMERO = '5492304302622';
const WHATSAPP_VISIBLE = '+54 9 2304 30-2622';
const CORREO = 'adm.npsolutions@gmail.com';
const LIMITE_MB = 4;
const LIMITE_BYTES = LIMITE_MB * 1024 * 1024;

/*
 * FOTOS
 * Para usar fotos propias, subilas a la carpeta public/fotos/ del proyecto
 * y escribí acá la ruta. Ejemplo:  inox: '/fotos/inox.jpg'
 * Si un campo queda vacío (''), se muestra la muestra gráfica del material.
 */
const FOTOS = {
  hero: 'https://images.unsplash.com/photo-1615286922420-c6b348ffbd62?auto=format&fit=crop&w=1400&q=80',
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

const ENLACES: Array<{ href: string; texto: string; soloMovil?: boolean }> = [
  { href: '#servicios', texto: 'Servicios' },
  { href: '#materiales', texto: 'Materiales' },
  { href: '#frentes', texto: 'Frentes de tablero' },
  { href: '#funeraria', texto: 'Funeraria' },
  { href: '#industrias', texto: 'Industrias' },
  { href: '#proceso', texto: 'Cómo trabajamos', soloMovil: true },
];

const DATOS_CLAVE = [
  { valor: 'MOPA 100 W', texto: 'Láser de fibra con pulso ajustable' },
  { valor: '±0,1 mm', texto: 'Tolerancia estándar en router CNC Difra' },
  { valor: '1 proveedor', texto: 'Corte, plegado, torneado y pintura con aliados' },
  { valor: 'Pilar, Bs. As.', texto: 'Taller propio' },
];

const SERVICIOS_PROPIOS = [
  {
    titulo: 'Grabado y marcado láser',
    texto: 'Láser de fibra MOPA para textos, logos, números de serie, códigos QR y DataMatrix sobre metal, plástico y piedra.',
  },
  {
    titulo: 'Mecanizado CNC',
    texto: 'Router CNC Difra para ruteo, fresado y perforado de plásticos técnicos, aluminio y piedra, con tolerancia estándar de ±0,1 mm.',
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

const SERVICIOS_ALIADOS = [
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
      'El láser MOPA genera colores sobre el acero inoxidable sin tintas ni solventes: dorados, violetas, azules y turquesas.',
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
      'El láser retira la pintura con precisión y deja el texto en metal brillante sobre el color de la pieza.',
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

const FICHA_FRENTES: Array<[string, string]> = [
  ['Materiales', 'Aluminio anodizado, acero inoxidable, policarbonato, acrílico y ABS'],
  ['Tolerancia', '±0,1 mm en el mecanizado (router CNC Difra)'],
  ['Archivos', 'DXF, DWG, PDF con cotas o croquis con la lista de componentes'],
  ['Con aliados', 'Corte láser de chapa, plegado y pintura del gabinete o la placa'],
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
    texto: 'Grabamos y mecanizamos en nuestro taller de Pilar. Si la pieza necesita corte, plegado, torneado o pintura, lo coordinamos con nuestros aliados.',
  },
  {
    numero: '04',
    titulo: 'Entrega',
    texto: 'Retirás en el taller o coordinamos el envío. Recibís la pieza terminada de un solo proveedor.',
  },
];

const CLASE_CAMPO =
  'w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600';
const CLASE_ETIQUETA = 'mb-2 block text-sm font-medium text-zinc-700';

function formatearPeso(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [estado, setEstado] = useState<EstadoEnvio>('idle');
  const [errorEnvio, setErrorEnvio] = useState('');

  const pesoArchivos = archivos ? Array.from(archivos).reduce((total, a) => total + a.size, 0) : 0;
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

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 antialiased selection:bg-orange-200">
      {/* 1. ENCABEZADO */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-600 lg:flex">
            {ENLACES.filter((e) => !e.soloMovil).map((e) => (
              <a key={e.href} href={e.href} className="transition-colors hover:text-zinc-900">
                {e.texto}
              </a>
            ))}
            <a
              href="#cotizar"
              className="bg-orange-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Cotizar plano
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="inline-flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-900 lg:hidden"
          >
            {menuOpen ? 'Cerrar' : 'Menú'}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="square" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="square" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-zinc-200 bg-white px-4 pb-6 pt-2 lg:hidden">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-zinc-100 py-3 text-base text-zinc-700 hover:text-orange-700"
              >
                {e.texto}
              </a>
            ))}
            <a
              href="#cotizar"
              onClick={() => setMenuOpen(false)}
              className="mt-4 block bg-orange-600 px-4 py-3 text-center font-semibold text-white hover:bg-orange-700"
            >
              Cotizar plano
            </a>
          </div>
        )}
      </header>

      {/* 2. PRESENTACIÓN */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="lg:col-span-6">
            <p className="flex items-center gap-3 text-sm font-semibold text-orange-700">
              <span className="h-px w-8 bg-orange-600" />
              Taller industrial · Pilar, Buenos Aires
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Grabado láser y mecanizado CNC para la industria
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              Marcado permanente, frentes de tablero, piezas mecanizadas y trabajos en piedra. Lo que no hacemos en
              nuestro taller lo resolvemos con aliados estratégicos: corte láser, plegado, torneado y pintura.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#cotizar"
                className="inline-flex items-center justify-center bg-orange-600 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Enviar plano para cotizar
              </a>
              <a
                href="#materiales"
                className="inline-flex items-center justify-center border border-zinc-300 px-7 py-4 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-900"
              >
                Ver materiales
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
              <Foto
                src={FOTOS.hero}
                alt="Láser grabando una pieza"
                className="h-full w-full object-cover"
                respaldo={<Muestra tipo="inox" />}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {DATOS_CLAVE.map((d) => (
              <div key={d.valor} className="py-6 pr-6">
                <p className="font-mono text-lg font-semibold text-zinc-900">{d.valor}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{d.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICIOS */}
      <section id="servicios" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EncabezadoSeccion
            antetitulo="Qué hacemos"
            titulo="Del plano a la pieza terminada"
            texto="Grabamos y mecanizamos en nuestro taller de Pilar. Para los procesos que no hacemos internamente trabajamos con aliados estratégicos y coordinamos todo nosotros: un solo interlocutor, una sola cotización."
          />
          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <GrupoServicios titulo="En nuestro taller" nota="Pilar, Buenos Aires" items={SERVICIOS_PROPIOS} />
            <GrupoServicios titulo="Con nuestra red de aliados" nota="Coordinado por nosotros" items={SERVICIOS_ALIADOS} />
          </div>
        </div>
      </section>

      {/* 4. MATERIALES */}
      <section id="materiales" className="border-y border-zinc-200 bg-zinc-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EncabezadoSeccion
            antetitulo="Materiales y acabados"
            titulo="Qué podemos grabar y mecanizar"
            texto="El láser de fibra MOPA permite ajustar el pulso a cada material: marcado oscuro en inoxidable, colores, alto contraste en aluminio y grabado en piedra."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MATERIALES.map((m) => (
              <article key={m.nombre} className="flex flex-col border border-zinc-200 bg-white">
                <div className="aspect-[4/3] overflow-hidden">
                  <Foto
                    src={m.foto}
                    alt={m.nombre}
                    className="h-full w-full object-cover"
                    respaldo={<Muestra tipo={m.muestra} />}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-zinc-900">{m.nombre}</h3>
                  <p className="mt-1 text-sm font-medium text-orange-700">{m.resultado}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">{m.descripcion}</p>
                  <p className="mt-5 border-t border-zinc-100 pt-4 text-xs text-zinc-500">{m.usos}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FRENTES DE TABLERO */}
      <section id="frentes" className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <EncabezadoSeccion
              antetitulo="Producto llave en mano"
              titulo="Frentes de tablero mecanizados y rotulados"
              texto="Mecanizamos con CNC los orificios para pulsadores, selectoras, displays y luces piloto, y grabamos la rotulación con láser en la misma pieza. Al hacer los dos procesos en el mismo taller, cada texto queda alineado con su orificio."
            />
            <dl className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200 text-sm">
              {FICHA_FRENTES.map(([dato, valor]) => (
                <div key={dato} className="grid grid-cols-3 gap-4 py-3">
                  <dt className="font-medium text-zinc-900">{dato}</dt>
                  <dd className="col-span-2 text-zinc-600">{valor}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-l-2 border-orange-600 pl-4 text-sm leading-relaxed text-zinc-600">
              Entregamos el frente listo para montar. El armado eléctrico y el cableado quedan a cargo del tablerista.
            </p>
            <a
              href="#cotizar"
              className="mt-8 inline-flex bg-orange-600 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Cotizar frentes de tablero
            </a>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-square overflow-hidden bg-zinc-800 sm:aspect-[4/3]">
              <Foto
                src={FOTOS.frentes}
                alt="Frente de tablero mecanizado y rotulado"
                className="h-full w-full object-cover"
                respaldo={<PanelFrente />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. INDUSTRIA FUNERARIA */}
      <section id="funeraria" className="border-y border-stone-200 bg-stone-50 py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] overflow-hidden bg-stone-200">
              <Foto
                src={FOTOS.funeraria}
                alt="Placa de granito grabada"
                className="h-full w-full object-cover"
                respaldo={<Muestra tipo="piedra" />}
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <EncabezadoSeccion
              antetitulo="Industria funeraria"
              titulo="Lápidas, placas y señalética en piedra y metal"
              texto="Trabajamos para cementerios parque, casas velatorias y marmolerías. Grabamos y mecanizamos letras, fechas y símbolos en granito, mármol, acero inoxidable y aluminio, con terminación en pintura de alta calidad apta para exterior."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {TRABAJOS_FUNERARIOS.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-zinc-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-orange-600" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-zinc-600">
              Hacemos piezas unitarias y series, con trato cuidadoso y plazos claros.
            </p>
            <a
              href="#cotizar"
              className="mt-8 inline-flex bg-zinc-900 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              Consultar por trabajos funerarios
            </a>
          </div>
        </div>
      </section>

      {/* 7. INDUSTRIAS */}
      <section id="industrias" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EncabezadoSeccion antetitulo="Sectores" titulo="Industrias a las que proveemos" />
          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIAS.map((i) => (
              <div key={i.titulo} className="border-t-2 border-zinc-900 pt-5">
                <h3 className="text-lg font-semibold text-zinc-900">{i.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{i.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CÓMO TRABAJAMOS */}
      <section id="proceso" className="border-y border-zinc-200 bg-zinc-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EncabezadoSeccion antetitulo="Proceso" titulo="Cómo trabajamos" />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p) => (
              <li key={p.numero} className="border border-zinc-200 bg-white p-6">
                <span className="font-mono text-sm font-semibold text-orange-700">{p.numero}</span>
                <h3 className="mt-3 text-lg font-semibold text-zinc-900">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 9. COTIZACIÓN */}
      <section id="cotizar" className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <EncabezadoSeccion
              antetitulo="Presupuestos"
              titulo="¿Tenés un plano? Te lo cotizamos."
              texto="Adjuntá tu archivo en PDF, DXF, DWG o STEP. Si no tenés plano formal, mandanos una foto con las medidas generales de la pieza."
            />
            <div className="mt-8 space-y-5 border-t border-zinc-200 pt-8 text-sm text-zinc-600">
              <p>
                <span className="block font-medium text-zinc-900">WhatsApp</span>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMERO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-700"
                >
                  {WHATSAPP_VISIBLE}
                </a>
              </p>
              <p>
                <span className="block font-medium text-zinc-900">Correo</span>
                <a href={`mailto:${CORREO}`} className="hover:text-orange-700">
                  {CORREO}
                </a>
              </p>
              <p>
                <span className="block font-medium text-zinc-900">Horario</span>
                Lunes a viernes de 08:00 a 18:00 hs
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border border-zinc-200 bg-zinc-50 p-6 sm:p-10">
              {estado === 'ok' ? (
                <div className="border border-emerald-600 bg-emerald-50 p-8 text-center">
                  <h3 className="text-xl font-semibold text-emerald-900">Solicitud enviada</h3>
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
                    <div className="border border-dashed border-zinc-300 bg-white p-6 text-center transition-colors hover:border-orange-600">
                      <input
                        type="file"
                        id="file-upload"
                        name="archivos"
                        multiple
                        accept=".pdf,.dxf,.dwg,.step,.stp,.png,.jpg,.jpeg"
                        onChange={(e) => setArchivos(e.target.files)}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-sm font-semibold text-orange-700 hover:text-orange-800"
                      >
                        Seleccionar archivos
                      </label>
                      <span className={`mt-2 block text-sm ${excedeLimite ? 'text-red-600' : 'text-zinc-500'}`}>
                        {archivos && archivos.length > 0
                          ? `${archivos.length} archivo(s) seleccionado(s) · ${formatearPeso(pesoArchivos)}${
                              excedeLimite ? ` — supera el máximo de ${LIMITE_MB} MB` : ''
                            }`
                          : 'Planos 2D, modelos 3D o fotos con medidas'}
                      </span>
                      <span className="mt-1 block text-xs text-zinc-400">
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
                    <div role="alert" className="border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                      {errorEnvio}
                      <span className="mt-2 block text-red-700">
                        Si el problema sigue, escribinos por WhatsApp o a {CORREO}.
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-6 sm:flex-row">
                    <span className="text-xs text-zinc-500">Respondemos con una cotización formal.</span>
                    <button
                      type="submit"
                      disabled={estado === 'enviando'}
                      className="w-full bg-orange-600 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {estado === 'enviando' ? 'Enviando...' : 'Enviar solicitud de cotización'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 10. PIE DE PÁGINA */}
      <footer className="mt-auto bg-zinc-900 text-sm text-zinc-400">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
          <div>
            <Logo claro />
            <p className="mt-4 leading-relaxed">
              Grabado láser, mecanizado CNC y fabricación integral con aliados estratégicos.
            </p>
            <p className="mt-4">
              CUIT <span className="text-zinc-200">30-71924978-3</span>
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
                className="text-zinc-200 hover:text-white"
              >
                {WHATSAPP_VISIBLE}
              </a>
            </p>
            <p className="mt-1 break-all">
              Correo:{' '}
              <a href={`mailto:${CORREO}`} className="text-zinc-200 hover:text-white">
                {CORREO}
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white">Industrias</h3>
            <ul className="mt-3 space-y-1">
              {INDUSTRIAS.map((i) => (
                <li key={i.titulo}>{i.titulo}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <p>
              © <AnioActual /> NP Solutions. Todos los derechos reservados.
            </p>
            <p>Pilar · Buenos Aires · República Argentina</p>
          </div>
        </div>
      </footer>

      {/* 11. BURBUJA DE WHATSAPP */}
      <WhatsAppWidget />
    </div>
  );
}

/* ───────────────────────── COMPONENTES ───────────────────────── */

function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <a href="#" className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center bg-orange-600 text-sm font-bold tracking-tight text-white">
        NP
      </span>
      <span className="leading-tight">
        <span className={`block text-base font-semibold tracking-tight ${claro ? 'text-white' : 'text-zinc-900'}`}>
          NP Solutions
        </span>
        <span className={`block text-xs ${claro ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Grabado · Mecanizado · Fabricación
        </span>
      </span>
    </a>
  );
}

function EncabezadoSeccion({ antetitulo, titulo, texto }: { antetitulo: string; titulo: string; texto?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 text-sm font-semibold text-orange-700">
        <span className="h-px w-8 bg-orange-600" />
        {antetitulo}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{titulo}</h2>
      {texto && <p className="mt-4 text-lg leading-relaxed text-zinc-600">{texto}</p>}
    </div>
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
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-zinc-900 pb-3">
        <h3 className="text-lg font-semibold text-zinc-900">{titulo}</h3>
        <span className="text-xs text-zinc-500">{nota}</span>
      </div>
      <ul className="divide-y divide-zinc-200">
        {items.map((s) => (
          <li key={s.titulo} className="py-5">
            <h4 className="font-semibold text-zinc-900">{s.titulo}</h4>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">{s.texto}</p>
          </li>
        ))}
      </ul>
    </div>
  );
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

const FONDO_INOX: CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 3px), linear-gradient(160deg, #e4e4e7 0%, #a1a1aa 40%, #d4d4d8 65%, #a1a1aa 100%)',
};

const FONDO_ANODIZADO: CSSProperties = {
  backgroundImage: 'linear-gradient(150deg, #3f3f46 0%, #18181b 55%, #27272a 100%)',
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
  backgroundImage: 'linear-gradient(90deg, #b8860b, #9333ea, #2563eb, #0e7490)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

// Muestras gráficas del resultado sobre cada material.
function Muestra({ tipo }: { tipo: TipoMuestra }) {
  const base = 'flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center';

  if (tipo === 'inox') {
    return (
      <div className={base} style={FONDO_INOX}>
        <span className="font-mono text-xl font-bold tracking-[0.2em] text-zinc-800 sm:text-2xl">AISI 316L</span>
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-700">S/N 0417-26 · LOTE A12</span>
      </div>
    );
  }

  if (tipo === 'color') {
    return (
      <div className={base} style={FONDO_INOX}>
        <span className="font-mono text-xl font-bold tracking-[0.2em] sm:text-2xl" style={TEXTO_COLOR}>
          COLOR MOPA
        </span>
        <div className="flex gap-2">
          {['#b8860b', '#a16207', '#9333ea', '#2563eb', '#0e7490'].map((c) => (
            <span key={c} className="h-6 w-6 border border-black/10" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    );
  }

  if (tipo === 'anodizado') {
    return (
      <div className={base} style={FONDO_ANODIZADO}>
        <span className="font-mono text-xl font-bold tracking-[0.2em] text-zinc-100 sm:text-2xl">Q1 · ARRANQUE</span>
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-300">BOMBA CENTRÍFUGA 7,5 kW</span>
      </div>
    );
  }

  if (tipo === 'pintada') {
    return (
      <div className={base} style={{ backgroundImage: 'linear-gradient(150deg, #1e3a5f, #142a46)' }}>
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

// Ilustración de un frente de tablero: orificios mecanizados y textos grabados.
function PanelFrente() {
  const orificios = ['MARCHA', 'PARADA', 'RESET', 'AUTO', 'MANUAL', 'ALARMA'];

  return (
    <div className="flex h-full w-full flex-col justify-center gap-7 p-8 sm:p-10" style={FONDO_ANODIZADO}>
      <div className="mx-auto w-full max-w-xs">
        <div className="mb-2 text-center font-mono text-[10px] font-bold tracking-[0.3em] text-zinc-100">
          PANTALLA
        </div>
        <div className="h-14 border border-zinc-600 bg-zinc-950" />
      </div>
      <div className="grid grid-cols-3 gap-y-6">
        {orificios.map((t) => (
          <div key={t} className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-100">{t}</span>
            <span className="h-10 w-10 rounded-full border border-zinc-600 bg-zinc-950" />
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
    <aside
      aria-label="Contacto directo por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {abierto && (
        <div
          id="panel-whatsapp"
          role="dialog"
          aria-label="Enviar mensaje por WhatsApp"
          className="w-[calc(100vw-3rem)] max-w-sm border border-zinc-200 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
            <div>
              <div className="text-sm font-semibold">NP Solutions</div>
              <div className="text-xs text-emerald-100">Lun a Vie · 08:00 a 18:00 hs</div>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat de WhatsApp"
              className="p-1 text-emerald-100 hover:text-white focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 p-4">
            <div className="bg-zinc-100 p-3 text-sm leading-relaxed text-zinc-700">
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
              className="w-full resize-none border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />

            <a
              href={textoLimpio ? enlace : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!textoLimpio}
              onClick={() => {
                if (textoLimpio) setAbierto(false);
              }}
              className="flex w-full items-center justify-center bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              Enviar por WhatsApp
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls="panel-whatsapp"
        aria-label={abierto ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp con NP Solutions'}
        className="flex items-center gap-3 bg-emerald-600 px-4 py-3.5 text-white shadow-lg transition-colors hover:bg-emerald-700 focus:outline-none"
      >
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span className="hidden text-sm font-semibold sm:inline">{abierto ? 'Cerrar' : 'WhatsApp'}</span>
      </button>
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
