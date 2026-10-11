'use client';

import { useEffect, useState } from 'react';

const WHATSAPP_NUMERO = '5492304302622';
const LIMITE_MB = 4;
const LIMITE_BYTES = LIMITE_MB * 1024 * 1024;

// Fotos de la página. Para usar fotos propias, guardalas en la carpeta /public/fotos/
// del proyecto y reemplazá cada URL por su ruta, por ejemplo: '/fotos/hero.jpg'
const FOTOS = {
  hero: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
  frentes: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  muestras: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
};

type EstadoEnvio = 'idle' | 'enviando' | 'ok' | 'error';

function formatearPeso(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [estado, setEstado] = useState<EstadoEnvio>('idle');
  const [errorEnvio, setErrorEnvio] = useState('');

  const pesoArchivos = archivos
    ? Array.from(archivos).reduce((total, a) => total + a.size, 0)
    : 0;
  const excedeLimite = pesoArchivos > LIMITE_BYTES;

  async function enviarFormulario(form: HTMLFormElement) {
    if (excedeLimite) {
      setEstado('error');
      setErrorEnvio(
        `Los archivos adjuntos superan los ${LIMITE_MB} MB. Quitá alguno o envialos directamente a adm.npsolutions@gmail.com.`
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
          `Los archivos son demasiado pesados (máximo ${LIMITE_MB} MB en total). Envialos directamente a adm.npsolutions@gmail.com.`
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2 text-zinc-100 hover:text-white">
            <span className="font-mono text-xs text-orange-500 font-bold">[NP]</span>
            <span className="font-mono font-bold tracking-tight text-lg text-white">NP SOLUTIONS</span>
          </a>

          <nav className="hidden xl:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <a href="#mopa" className="hover:text-orange-500 transition-colors">Láser MOPA 100W</a>
            <a href="#frentes" className="hover:text-orange-500 transition-colors">Frentes de Tablero</a>
            <a href="#capacidades" className="hover:text-orange-500 transition-colors">Capacidades</a>
            <a href="#proceso" className="hover:text-orange-500 transition-colors">Cómo Trabajamos</a>
            <a href="#industrias" className="hover:text-orange-500 transition-colors">Industrias</a>
            <a href="#servicios" className="hover:text-orange-500 transition-colors">CNC y Soldadura</a>
            <a
              href="#cotizar"
              className="rounded-none bg-orange-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-orange-500 transition-colors"
            >
              Cotizar Plano
            </a>
          </nav>

          <div className="flex xl:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Abrir menú de navegación"
              className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-white border border-zinc-800 rounded-none focus:outline-none"
            >
              <span className="font-mono text-xs mr-2">{menuOpen ? 'CERRAR' : 'MENÚ'}</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="xl:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-3 font-mono text-sm">
            <a href="#mopa" onClick={() => setMenuOpen(false)} className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900">
              Láser MOPA 100W
            </a>
            <a href="#frentes" onClick={() => setMenuOpen(false)} className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900">
              Frentes de Tablero
            </a>
            <a href="#capacidades" onClick={() => setMenuOpen(false)} className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900">
              Capacidades
            </a>
            <a href="#proceso" onClick={() => setMenuOpen(false)} className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900">
              Cómo Trabajamos
            </a>
            <a href="#industrias" onClick={() => setMenuOpen(false)} className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900">
              Industrias
            </a>
            <a href="#servicios" onClick={() => setMenuOpen(false)} className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900">
              CNC y Soldadura
            </a>
            <a href="#cotizar" onClick={() => setMenuOpen(false)} className="block text-center bg-orange-600 px-4 py-3 font-bold text-white hover:bg-orange-500 rounded-none mt-4">
              Cotizar Plano
            </a>
          </div>
        )}
      </header>

      {/* 2. HERO PRINCIPAL MOPA */}
      <section id="mopa" className="relative w-full border-b border-zinc-800 bg-zinc-950 py-20 lg:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px), radial-gradient(#27272a 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px'
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/80 px-3 py-1 font-mono text-xs uppercase tracking-wider text-orange-500 mb-6 rounded-none">
              <span className="h-2 w-2 bg-orange-500 inline-block animate-pulse" />
              Láser de fibra MOPA 100W · Pilar, Buenos Aires
            </div>

            <h1 className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-none">
              Marcado láser industrial permanente
            </h1>

            <p className="mt-6 text-base sm:text-lg text-zinc-400 font-sans leading-relaxed">
              Rotulación, trazabilidad y frentes de tablero para Oil & Gas, minería, energía y farmacéutica. 
              Grabamos acero inoxidable, aluminio anodizado y plásticos de ingeniería con la pieza completa 
              resuelta en un solo proveedor.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 font-mono text-xs">
              <a
                href="#cotizar"
                className="inline-flex items-center justify-center rounded-none bg-orange-600 px-6 py-4 font-bold text-white hover:bg-orange-500 transition-colors uppercase tracking-wider"
              >
                Enviar plano para cotizar
              </a>
              <a
                href="#muestras"
                className="inline-flex items-center justify-center rounded-none border border-zinc-800 bg-zinc-900/50 px-6 py-4 font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors uppercase tracking-wider"
              >
                Ver placa de muestras
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-zinc-900 pt-6 font-mono text-xs text-zinc-500">
              <div>
                <span className="text-zinc-300 block font-bold">MOPA 100W</span>
                Ancho de pulso ajustable
              </div>
              <div>
                <span className="text-zinc-300 block font-bold">Mecanizado CNC</span>
                Integrado en la misma pieza
              </div>
              <div>
                <span className="text-zinc-300 block font-bold">CUIT 30-71924978-3</span>
                Factura A y alta corporativa
              </div>
            </div>
          </div>

          {/* Macro fotográfico del haz láser en metal */}
          <div className="lg:col-span-5 relative">
            <div className="border border-zinc-800 bg-zinc-900/50 p-2 rounded-none">
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                <img
                  src={FOTOS.hero}
                  alt="Detalle macro de mecanizado y grabado de precisión industrial"
                  className="w-full h-full object-cover filter contrast-125 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] text-zinc-400 bg-zinc-950/90 px-3 py-2 border border-zinc-800 flex justify-between">
                  <span>TECNOLOGÍA MOPA 100W</span>
                  <span className="text-orange-500">PRECISIÓN EN MICRONES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FRANJA DE PRUEBA Y AUTORIDAD TÉCNICA */}
      <section className="w-full border-b border-zinc-800 bg-zinc-900/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center">
          <div className="border-r border-zinc-800/60 last:border-0 pr-4">
            <div className="text-xl sm:text-2xl font-bold text-white">100W MOPA</div>
            <div className="text-[11px] text-zinc-400 uppercase mt-1">Potencia de fibra óptica</div>
          </div>
          <div className="border-r border-zinc-800/60 last:border-0 pr-4">
            <div className="text-xl sm:text-2xl font-bold text-white">0% DESALINEACIÓN</div>
            <div className="text-[11px] text-zinc-400 uppercase mt-1">Mecanizado + Grabado juntos</div>
          </div>
          <div className="border-r border-zinc-800/60 last:border-0 pr-4">
            <div className="text-xl sm:text-2xl font-bold text-white">[±0,0X mm]</div>
            <div className="text-[11px] text-zinc-400 uppercase mt-1">Tolerancia real en CNC</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">PILAR, BS.AS.</div>
            <div className="text-[11px] text-zinc-400 uppercase mt-1">Taller industrial propio</div>
          </div>
        </div>
      </section>

      {/* 4. QUÉ HACE EL MOPA (CAPACIDADES EN LENGUAJE DE COMPRADOR) */}
      <section id="capacidades" className="w-full bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Ventaja Tecnológica</span>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-white">
              Capacidades del láser MOPA según tu necesidad técnica
            </h2>
            <p className="mt-3 text-sm text-zinc-400 font-sans leading-relaxed">
              El ajuste de ancho de pulso del MOPA permite resolver requerimientos que un láser de fibra convencional no logra, 
              garantizando ensayos de corrosión, abrasión y trazabilidad visual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            <div className="border border-zinc-800 bg-zinc-900/20 p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="text-orange-500 font-bold text-xs mb-2">ACERO INOXIDABLE</div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Marcado oscuro sin remover material</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  Identificación molecular permanente (recocido) sin penetrar la capa pasivada ni afectar la resistencia a la corrosión.
                </p>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase border-t border-zinc-800 pt-3">
                Industria: Farmacéutica, Alimentaria y Válvulas
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/20 p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="text-orange-500 font-bold text-xs mb-2">METALES EN GENERAL</div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Grabado profundo para intemperie</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  Surco micrométrico duradero que resiste abrasión severa, barro, lavado químico a presión y capas de pintura posterior.
                </p>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase border-t border-zinc-800 pt-3">
                Industria: Oil & Gas, Minería e Infraestructura
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/20 p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="text-orange-500 font-bold text-xs mb-2">ALUMINIO ANODIZADO</div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Negro de alto contraste</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  Rotulación de altísima definición que contrasta nítidamente a varios metros de distancia en frentes de tablero y placas.
                </p>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase border-t border-zinc-800 pt-3">
                Industria: Tableristas, Distribución Eléctrica
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/20 p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="text-orange-500 font-bold text-xs mb-2">PLÁSTICOS DE INGENIERÍA</div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Marcado sin quemar (Ablación fría)</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  Marcado limpio sin deformación térmica ni carbonización en polímeros como ABS, policarbonato y poliamidas.
                </p>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase border-t border-zinc-800 pt-3">
                Industria: Gabinetes, Cajas estancas, Conectores
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/20 p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="text-orange-500 font-bold text-xs mb-2">CÓDIGOS 2D / TRAZABILIDAD</div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">DataMatrix y Códigos QR legibles</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  Micro-códigos de lectura óptica de alta densidad para seguimiento de número de serie, lote y certificado de material.
                </p>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase border-t border-zinc-800 pt-3">
                Industria: Trazabilidad total de componentes
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/20 p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="text-orange-500 font-bold text-xs mb-2">IDENTIFICACIÓN VISUAL</div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Marcado en Color sobre Inoxidable</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  Generación de capas de óxido de espesor controlado para codificación visual por color sin usar tintas ni solventes.
                </p>
              </div>
              <div className="text-[10px] text-zinc-500 uppercase border-t border-zinc-800 pt-3">
                Industria: Señalética técnica e instrumental
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCTO ESTRELLA: FRENTES DE TABLERO LLAVE EN MANO */}
      <section id="frentes" className="w-full bg-zinc-900/10 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Integración CNC + LÁSER</span>
            <h2 className="font-mono text-3xl font-bold uppercase text-white mb-6">
              Frentes de tablero llave en mano
            </h2>
            <p className="text-base text-zinc-400 font-sans leading-relaxed">
              Mecanizamos con CNC los orificios exactos para pulsadores, selectoras, displays y luces testigo, y grabamos la rotulación con láser en la misma pieza. 
              Un solo proveedor, rotulación perfectamente alineada con cada orificio.
            </p>
            <div className="mt-6 border-l-2 border-orange-500 pl-4 py-1 text-sm text-zinc-400 font-sans leading-relaxed">
              <strong>Cero desalineación y sin intermediarios:</strong> Evitás enviar la chapa a un taller para mecanizar y a otro para pintar o rotular. 
              Nos enviás el esquema con los componentes y te entregamos el panel listo para montar en el gabinete.
            </div>

            <div className="mt-8 flex font-mono text-xs">
              <a
                href="#cotizar"
                className="bg-orange-600 px-6 py-4 font-bold text-white hover:bg-orange-500 transition-colors uppercase"
              >
                Cotizar frentes de tablero
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="border border-zinc-800 bg-zinc-950 p-2 rounded-none">
              <div className="relative aspect-video overflow-hidden bg-zinc-900">
                <img
                  src={FOTOS.frentes}
                  alt="Detalle de mecanizado y frente de panel técnico"
                  loading="lazy"
                  className="w-full h-full object-cover filter contrast-125"
                />
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none font-mono text-xs">
              <h3 className="text-zinc-200 font-bold uppercase mb-4 border-b border-zinc-800 pb-2">Especificaciones de Entrega</h3>
              <ul className="space-y-3 text-zinc-400">
                <li>
                  <span className="text-zinc-200 block font-bold">Materiales Disponibles</span>
                  Aluminio anodizado, acero inoxidable, policarbonato, acrílico, ABS [COMPLETAR: otros aptos].
                </li>
                <li>
                  <span className="text-zinc-200 block font-bold">Área de Trabajo</span>
                  CNC de [COMPLETAR: área CNC] mm · Láser de [COMPLETAR: área láser] mm.
                </li>
                <li>
                  <span className="text-zinc-200 block font-bold">Insumo Requerido</span>
                  Plano en DXF, DWG, PDF con cotas o croquis con la lista de elementos.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLACA DE MUESTRAS / TRABAJOS REALIZADOS */}
      <section id="muestras" className="w-full bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="border border-zinc-800 bg-zinc-900/50 p-2 rounded-none">
              <div className="relative aspect-square overflow-hidden bg-zinc-900">
                <img
                  src={FOTOS.muestras}
                  alt="Placa patrón de pruebas sobre metal con parámetros de grabado"
                  loading="lazy"
                  className="w-full h-full object-cover filter contrast-125"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-mono">
                  <div className="border border-orange-500/80 bg-zinc-950/90 p-4">
                    <span className="text-orange-500 text-xs block font-bold">PATRÓN DE CALIBRACIÓN</span>
                    <span className="text-white text-xs mt-1 block">Validación de pulso, contraste y frecuencia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Comprobación Física</span>
            <h2 className="font-mono text-3xl font-bold uppercase text-white mb-6">
              Placa de muestras y calibración real
            </h2>
            <p className="text-base text-zinc-400 font-sans leading-relaxed">
              En la industria pesada una foto de render no alcanza. Fabricamos y calibramos placas testigo con matrices de grabado sobre los materiales 
              exactos de tu proyecto: distintos anchos de pulso, potencias y frecuencias.
            </p>
            <p className="mt-4 text-sm text-zinc-400 font-sans leading-relaxed">
              ¿Tenés un proyecto seriado o requerimientos de auditoría? Te enviamos una muestra física de grabado sobre tu propio material para que la verifiques 
              en laboratorio o en planta antes de la corrida de producción.
            </p>
            <div className="mt-8">
              <a
                href="#cotizar"
                className="inline-flex font-mono text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 border border-orange-500/40 px-6 py-4 hover:border-orange-500 transition-colors"
              >
                Solicitar muestra para evaluación
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CÓMO TRABAJAMOS (4 PASOS) */}
      <section id="proceso" className="w-full bg-zinc-900/10 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Flujo Técnico</span>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-white">
              Cómo trabajamos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-lg mb-2">01</div>
              <h3 className="text-white font-bold uppercase mb-2">Envío del plano</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Envianos tu archivo en DXF, DWG, STEP o PDF con cotas. Si no tenés plano, una foto con las medidas principales.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-lg mb-2">02</div>
              <h3 className="text-white font-bold uppercase mb-2">Cotización formal</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Te presupuestamos en [COMPLETAR: plazo real, ej: 24 hs] con presupuesto formal, plazo de entrega y condiciones comerciales.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-lg mb-2">03</div>
              <h3 className="text-white font-bold uppercase mb-2">Fabricación y avance</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Mecanizamos y grabamos en nuestro taller de Pilar. Te mostramos el avance técnico de la primera pieza antes de la serie.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-lg mb-2">04</div>
              <h3 className="text-white font-bold uppercase mb-2">Entrega y despacho</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Entregamos o despachamos a [COMPLETAR: zonas reales de despacho y entrega] con embalaje de protección técnica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INDUSTRIAS OBJETIVO */}
      <section id="industrias" className="w-full bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Sectores Clave</span>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-white">
              Industrias a las que proveemos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div className="border border-zinc-800 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold mb-2">OIL & GAS</div>
              <h3 className="text-white font-bold uppercase mb-2 text-sm">Exploración y Cuencas</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Grabado profundo en bridas, válvulas, cupones de corrosión y placas de identificación de equipos de superficie.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold mb-2">TABLERISTAS Y ENERGÍA</div>
              <h3 className="text-white font-bold uppercase mb-2 text-sm">Frentes e Integradores</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Frentes de tablero completos, placas de advertencia de seguridad eléctrica y sinópticos de distribución.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold mb-2">MINERÍA</div>
              <h3 className="text-white font-bold uppercase mb-2 text-sm">Ambientes Abrasivos</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Rotulación indestructible para ambientes con polvillo, vibración constante y exposición a reactivos.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold mb-2">FARMACÉUTICA Y PROCESOS</div>
              <h3 className="text-white font-bold uppercase mb-2 text-sm">Acero Sanitario</h3>
              <p className="text-zinc-400 font-sans leading-relaxed">
                Marcado oscuro sin remoción sobre acero AISI 316L, apto para protocolos CIP/SIP y ambientes limpios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. OTROS SERVICIOS COMPLEMENTARIOS */}
      <section id="servicios" className="w-full bg-zinc-900/10 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Servicios Complementarios</span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-white mb-8">
            CNC y Soldadura de Termoplásticos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
            <div className="border border-zinc-800 p-6 rounded-none bg-zinc-950">
              <div className="text-orange-500 font-bold text-xs mb-2">MECANIZADO INDUSTRIAL</div>
              <h3 className="text-base font-bold text-zinc-100 uppercase mb-3">Mecanizado CNC</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                Ruteo y fresado CNC con tolerancias de [±0,0X mm] en plásticos de ingeniería (POM, PEAD, Grilon, ABS) y aluminio. Desarrollo de piezas complejas, utillajes y matrices.
              </p>
              <ul className="text-zinc-400 text-xs space-y-1">
                <li>• Tolerancia real: [±0,0X mm]</li>
                <li>• Plásticos técnicos y metales no ferrosos</li>
                <li>• Prototipos y corridas cortas de piezas</li>
              </ul>
            </div>

            <div className="border border-zinc-800 p-6 rounded-none bg-zinc-950">
              <div className="text-orange-500 font-bold text-xs mb-2">SOLDADURA PLÁSTICA</div>
              <h3 className="text-base font-bold text-zinc-100 uppercase mb-3">Soldadura de Termoplásticos</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                Fabricación y ensamble de piezas especiales, depósitos y tuberías mediante soldadura plástica por extrusión. Solución óptima para fluidos agresivos o corrosivos y estrés mecánico.
              </p>
              <ul className="text-zinc-400 text-xs space-y-1">
                <li>• Ensamble y estanqueidad técnica</li>
                <li>• Polímeros de alta resistencia (PEAD, PP)</li>
                <li>• Apto para industrias química y de procesos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FORMULARIO DE COTIZACIÓN */}
      <section id="cotizar" className="w-full bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="border border-zinc-800 bg-zinc-900/40 p-6 sm:p-10 rounded-none">
            <div className="border-b border-zinc-800 pb-6 mb-8">
              <span className="font-mono text-xs uppercase tracking-wider text-orange-500 font-bold block mb-2">
                Ingeniería y Presupuestos
              </span>
              <h2 className="font-mono text-2xl sm:text-3xl font-bold text-white uppercase">
                ¿Tenés un plano? Te lo cotizamos.
              </h2>
              <p className="mt-2 text-sm text-zinc-400 font-sans">
                Adjuntá tu archivo en PDF, DXF, DWG o STEP. Si no tenés plano formal, mandanos una foto y las medidas generales de la pieza.
              </p>
            </div>

            {estado === 'ok' ? (
              <div className="border border-orange-500 bg-orange-950/20 p-6 text-center rounded-none font-mono">
                <h3 className="text-orange-500 font-bold text-lg mb-2">¡SOLICITUD ENVIADA CON ÉXITO!</h3>
                <p className="text-xs text-zinc-300">
                  Recibimos tu solicitud. Nos comunicamos a la brevedad con la cotización formal con membrete.
                </p>
                <button
                  type="button"
                  onClick={() => setEstado('idle')}
                  className="mt-4 text-xs underline text-orange-500 hover:text-orange-400 focus:outline-none"
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
                    <label htmlFor="f-nombre" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      id="f-nombre"
                      name="nombre"
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Tu nombre completo"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="f-empresa" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
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
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="f-cargo" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Cargo / Área
                    </label>
                    <input
                      type="text"
                      id="f-cargo"
                      name="cargo"
                      maxLength={120}
                      autoComplete="organization-title"
                      placeholder="Ej: Compras, Ingeniería, Mantenimiento"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="f-email" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Correo Corporativo *
                    </label>
                    <input
                      type="email"
                      id="f-email"
                      name="email"
                      required
                      maxLength={160}
                      autoComplete="email"
                      placeholder="nombre@empresa.com"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="f-telefono" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
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
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="f-ubicacion" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      País / Provincia *
                    </label>
                    <input
                      type="text"
                      id="f-ubicacion"
                      name="ubicacion"
                      required
                      maxLength={120}
                      defaultValue="Argentina"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="f-servicio" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Servicio Requerido *
                    </label>
                    <select
                      id="f-servicio"
                      name="servicio"
                      required
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="laser-mopa">Grabado Láser MOPA 100W</option>
                      <option value="frentes-tablero">Frentes de Tablero (Láser + CNC)</option>
                      <option value="mecanizado-cnc">Mecanizado CNC (Ruteo / Fresado)</option>
                      <option value="soldadura-plastica">Soldadura de Termoplásticos</option>
                      <option value="otro">Desarrollo Integral / Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="f-material" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Material de la Pieza
                    </label>
                    <input
                      type="text"
                      id="f-material"
                      name="material"
                      maxLength={160}
                      placeholder="Ej: Acero AISI 316, Aluminio, ABS"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="f-cantidad" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Cantidad Estimada
                    </label>
                    <input
                      type="text"
                      id="f-cantidad"
                      name="cantidad"
                      maxLength={160}
                      placeholder="Ej: 1 prototipo / 500 piezas"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="f-plazo" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                    Plazo Deseado de Entrega
                  </label>
                  <input
                    type="text"
                    id="f-plazo"
                    name="plazo"
                    maxLength={160}
                    placeholder="Ej: Urgente / 48 hs / [COMPLETAR: plazo estimado]"
                    className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                    Adjuntar Plano Técnico o Esquema (PDF, DXF, DWG, STEP, JPG, PNG)
                  </label>
                  <div className="border border-dashed border-zinc-800 bg-zinc-950/60 p-6 text-center hover:border-orange-500/50 transition-colors">
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
                      className="cursor-pointer font-mono text-xs text-orange-500 hover:text-orange-400 block font-bold"
                    >
                      SELECCIONAR ARCHIVOS DEL DISPOSITIVO
                    </label>
                    <span className={`font-mono text-xs mt-2 block ${excedeLimite ? 'text-red-400' : 'text-zinc-500'}`}>
                      {archivos && archivos.length > 0
                        ? `${archivos.length} archivo(s) seleccionado(s) · ${formatearPeso(pesoArchivos)}${
                            excedeLimite ? ` — supera el máximo de ${LIMITE_MB} MB` : ''
                          }`
                        : 'Formatos soportados: 2D vector, modelos 3D y capturas con cotas'}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600 mt-1 block">
                      Máximo {LIMITE_MB} MB en total. Archivos más pesados: envialos a adm.npsolutions@gmail.com
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="f-mensaje" className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                    Mensaje o Especificaciones Técnicas
                  </label>
                  <textarea
                    id="f-mensaje"
                    name="mensaje"
                    rows={4}
                    maxLength={5000}
                    placeholder="Detallá tolerancias requeridas, tipo de rotulación, profundidad o condiciones de uso..."
                    className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {estado === 'error' && errorEnvio && (
                  <div
                    role="alert"
                    className="border border-red-500/50 bg-red-950/20 p-4 rounded-none font-mono text-xs text-red-300"
                  >
                    {errorEnvio}
                    <span className="block mt-2 text-zinc-400">
                      Si el problema sigue, escribinos por WhatsApp o a adm.npsolutions@gmail.com.
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    Respuesta técnica y comercial formal con membrete.
                  </span>
                  <button
                    type="submit"
                    disabled={estado === 'enviando'}
                    className="w-full sm:w-auto rounded-none bg-orange-600 px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-500 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {estado === 'enviando' ? 'Enviando...' : 'Enviar Solicitud de Cotización'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs text-zinc-400 mt-auto">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold mb-3">
              <span className="text-orange-500">[NP]</span> NP SOLUTIONS
            </div>
            <p className="text-zinc-500 font-sans text-xs leading-relaxed">
              Marcado láser de fibra MOPA 100W, frentes de tablero llave en mano, mecanizado CNC y soldadura de termoplásticos de ingeniería.
            </p>
            <div className="mt-4 text-zinc-300">
              CUIT: <span className="text-white">30-71924978-3</span>
            </div>
          </div>

          <div>
            <div className="text-zinc-200 font-bold uppercase mb-3">Taller y Operaciones</div>
            <p className="text-zinc-400">Pilar, Buenos Aires, Argentina</p>
            <p className="text-zinc-500 mt-2">Lunes a Viernes: 08:00 a 18:00 hs</p>
          </div>

          <div>
            <div className="text-zinc-200 font-bold uppercase mb-3">Contacto Directo</div>
            <p>
              WhatsApp:{' '}
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                +54 9 2304 30-2622
              </a>
            </p>
            <p className="mt-2">
              Correo:{' '}
              <a
                href="mailto:adm.npsolutions@gmail.com"
                className="text-zinc-300 hover:underline"
              >
                adm.npsolutions@gmail.com
              </a>
            </p>
          </div>

          <div>
            <div className="text-zinc-200 font-bold uppercase mb-3">Industrias Objetivo</div>
            <ul className="space-y-1 text-zinc-500">
              <li>Oil & Gas y Minería</li>
              <li>Energía y Tableristas</li>
              <li>Industria Farmacéutica</li>
              <li>Alimentos y Bebidas</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600">
          <div>
            © <AnioActual /> NP Solutions. Todos los derechos reservados.
          </div>
          <div>
            Pilar · Buenos Aires · República Argentina
          </div>
        </div>
      </footer>

      {/* 12. BURBUJA DE WHATSAPP */}
      <WhatsAppWidget />
    </div>
  );
}

function WhatsAppWidget() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState(
    'Hola NP Solutions, quiero cotizar un trabajo de grabado láser.'
  );

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
          className="w-[calc(100vw-3rem)] max-w-sm border border-emerald-500/40 bg-zinc-950/95 shadow-2xl backdrop-blur rounded-none"
        >
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <div className="font-mono">
                <div className="text-xs font-bold text-white">
                  <span className="text-orange-500">[NP]</span> NP SOLUTIONS
                </div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Lun a Vie · 08:00 a 18:00 hs
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat de WhatsApp"
              className="p-1 text-zinc-500 hover:text-white focus:outline-none"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 p-4">
            <div className="border border-zinc-800 bg-zinc-900/60 p-3 font-sans text-xs leading-relaxed text-zinc-300">
              Hola, ¿en qué te podemos ayudar? Escribinos qué pieza o trabajo necesitás y te respondemos por WhatsApp.
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
              className="w-full resize-none rounded-none border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
            />

            <a
              href={textoLimpio ? enlace : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!textoLimpio}
              onClick={() => {
                if (textoLimpio) setAbierto(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-emerald-600 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-emerald-500 aria-disabled:pointer-events-none aria-disabled:opacity-50"
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
        className="flex items-center gap-3 border border-emerald-500/40 bg-zinc-950/95 px-4 py-3 text-emerald-400 shadow-2xl backdrop-blur transition-transform hover:scale-105 hover:border-emerald-400 hover:text-emerald-300 rounded-none focus:outline-none"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 bg-emerald-500" />
        </span>
        <svg
          className="h-5 w-5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span className="font-mono text-xs font-bold uppercase tracking-wider hidden sm:inline">
          {abierto ? 'Cerrar chat' : 'Cotizar por WhatsApp'}
        </span>
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
