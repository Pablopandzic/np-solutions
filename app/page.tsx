'use client';

import { useEffect, useState } from 'react';

const WHATSAPP_NUMERO = '5492304302622';
const LIMITE_MB = 4;
const LIMITE_BYTES = LIMITE_MB * 1024 * 1024;

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

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
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

          <div className="flex md:hidden">
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
          <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-3 font-mono text-sm">
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
      <section className="relative w-full border-b border-zinc-800 bg-zinc-950 py-20 lg:py-28 overflow-hidden">
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
              <div className="relative aspect-4/3 overflow-hidden bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80"
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
      <section className="w-full border-b border-zinc-850 bg-zinc-900/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center">
          <div className="border-r border-zinc-850/60 last:border-0 pr-4">
            <div className="text-
