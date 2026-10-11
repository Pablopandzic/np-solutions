'use client';

import { useState } from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [formEnviado, setFormEnviado] = useState(false);

  const msjWhatsApp = encodeURIComponent(
    'Hola NP Solutions, quiero cotizar un trabajo de grabado láser.'
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      
      {/* 1. BARRA DE NAVEGACIÓN */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2 text-zinc-100 hover:text-white">
            <span className="font-mono text-xs text-orange-500 font-bold">[NP]</span>
            <span className="font-mono font-bold tracking-tight text-lg text-white">NP SOLUTIONS</span>
          </a>

          {/* Menú de escritorio */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <a href="#mopa" className="hover:text-orange-500 transition-colors">Láser MOPA 100W</a>
            <a href="#frentes" className="hover:text-orange-500 transition-colors">Frentes de Tablero</a>
            <a href="#servicios" className="hover:text-orange-500 transition-colors">CNC y Soldadura</a>
            <a href="#capacidades" className="hover:text-orange-500 transition-colors">Capacidades</a>
            <a
              href="#cotizar"
              className="rounded-none bg-orange-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-orange-500 transition-colors"
            >
              Cotizar Plano
            </a>
          </nav>

          {/* Botón menú móvil */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Abrir menú de navegación"
              className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-white border border-zinc-900 rounded-none focus:outline-none"
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

        {/* Desplegable móvil */}
        {menuOpen && (
          <div className="md:hidden border-b border-zinc-900 bg-zinc-950 px-4 pt-2 pb-6 space-y-3 font-mono text-sm">
            <a
              href="#mopa"
              onClick={() => setMenuOpen(false)}
              className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900"
            >
              Láser MOPA 100W
            </a>
            <a
              href="#frentes"
              onClick={() => setMenuOpen(false)}
              className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900"
            >
              Frentes de Tablero
            </a>
            <a
              href="#servicios"
              onClick={() => setMenuOpen(false)}
              className="block text-zinc-300 hover:text-orange-500 py-2 border-b border-zinc-900"
            >
              CNC y Soldadura
            </a>
            <a
              href="#cotizar"
              onClick={() => setMenuOpen(false)}
              className="block text-center bg-orange-600 px-4 py-3 font-bold text-white hover:bg-orange-500 rounded-none mt-4"
            >
              Cotizar Plano
            </a>
          </div>
        )}
      </header>

      {/* 2. HERO PRINCIPAL MOPA */}
      <section className="relative w-full border-b border-zinc-900 bg-zinc-950 py-20 lg:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px), radial-gradient(#27272a 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px'
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
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
                href="#capacidades"
                className="inline-flex items-center justify-center rounded-none border border-zinc-800 bg-zinc-900/50 px-6 py-4 font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors uppercase tracking-wider"
              >
                Ver capacidades del MOPA
              </a>
            </div>

            {/* Ficha técnica resumida */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-zinc-900 pt-6 font-mono text-xs text-zinc-500">
              <div>
                <span className="text-zinc-300 block font-bold">MOPA 100W</span>
                Ancho de pulso ajustable
              </div>
              <div>
                <span className="text-zinc-300 block font-bold">Área de Trabajo</span>
                [COMPLETAR: área de marcado] mm
              </div>
              <div>
                <span className="text-zinc-300 block font-bold">Trazabilidad</span>
                QR, DataMatrix, Barcodes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPACIDADES DEL LÁSER MOPA 100W */}
      <section id="mopa" className="w-full bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Tecnología Especializada</span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-white mb-8">
            Capacidades de Grabado y Marcado
          </h2>

          <div id="capacidades" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            <div className="border border-zinc-900 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-xs mb-2">ACERO INOXIDABLE</div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Marcado oscuro sin remoción</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Identificación permanente sin afectar la resistencia a la corrosión del material. Ideal para industria farmacéutica y alimentaria.
              </p>
            </div>

            <div className="border border-zinc-900 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-xs mb-2">METALES EN GENERAL</div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Grabado Profundo</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Rotulación duradera diseñada para resistir intemperie, abrasión y procesos de pintado en Oil & Gas y minería.
              </p>
            </div>

            <div className="border border-zinc-900 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-xs mb-2">ALUMINIO ANODIZADO</div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Negro de alto contraste</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Grabado de altísima definición y contraste para frentes de tablero, escalas y cartelería técnica visible a distancia.
              </p>
            </div>

            <div className="border border-zinc-900 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-xs mb-2">PLÁSTICOS DE INGENIERÍA</div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Marcado sin quemar (Ablación)</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Rotulación prolija y sin rebaba en materiales como ABS o policarbonato, sin comprometer las propiedades del polímero.
              </p>
            </div>

            <div className="border border-zinc-900 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-xs mb-2">CÓDIGOS 2D / TRAZABILIDAD</div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">QR y DataMatrix</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Marcado inalterable y de alta resolución para sistemas de lectura automática en piezas complejas o de alto tránsito.
              </p>
            </div>

            <div className="border border-zinc-900 bg-zinc-900/10 p-6 rounded-none">
              <div className="text-orange-500 font-bold text-xs mb-2">IDENTIFICACIÓN VISUAL</div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase mb-2">Marcado en Color</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Identificación de piezas mediante códigos de color sobre acero inoxidable [COMPLETAR: variedad de colores probados].
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCTO ESTRELLA: FRENTES DE TABLERO LLAVE EN MANO */}
      <section id="frentes" className="w-full bg-zinc-900/10 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Integración CNC + LÁSER</span>
            <h2 className="font-mono text-3xl font-bold uppercase text-white mb-6">
              Frentes de tablero llave en mano
            </h2>
            <p className="text-base text-zinc-400 font-sans leading-relaxed">
              Mecanizamos con CNC los orificios exactos para pulsadores, selectoras y displays, y grabamos la rotulación con láser en la misma pieza. 
              Garantizamos que el texto y las indicaciones queden perfectamente alineados con cada perforación, eliminando errores de montaje y desvíos.
            </p>
            <p className="text-sm text-zinc-500 font-sans mt-4 leading-relaxed border-l-2 border-orange-500 pl-4">
              <strong>Un solo proveedor:</strong> Evitá traslados, intermediarios y desalineaciones de texto. Nos enviás el plano de distribución de componentes y recibís el frente mecanizado y rotulado listo para instalar.
            </p>

            <div className="mt-8 flex font-mono text-xs">
              <a
                href="#cotizar"
                className="bg-orange-600 px-6 py-4 font-bold text-white hover:bg-orange-500 transition-colors uppercase"
              >
                Cotizar frentes de tablero
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 border border-zinc-800 bg-zinc-950 p-6 rounded-none font-mono text-xs">
            <h3 className="text-zinc-300 font-bold uppercase mb-4 border-b border-zinc-900 pb-2 text-xs">Ficha de especificaciones</h3>
            <ul className="space-y-3 text-zinc-500">
              <li>
                <span className="text-zinc-300 block font-bold">Materiales Disponibles</span>
                Aluminio anodizado, acero inoxidable, policarbonato, acrílico, ABS [COMPLETAR: otros aptos].
              </li>
              <li>
                <span className="text-zinc-300 block font-bold">Espesor Máximo</span>
                [COMPLETAR: espesor máximo en mm] mm.
              </li>
              <li>
                <span className="text-zinc-300 block font-bold">Área de Trabajo</span>
                CNC de [COMPLETAR: área CNC] mm / Láser de [COMPLETAR: área láser] mm.
              </li>
              <li>
                <span className="text-zinc-300 block font-bold">Requisitos de Cotización</span>
                Plano en DXF, DWG o esquema manuscrito con medidas.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CNC Y SOLDADURA DE TERMOPLÁSTICOS */}
      <section id="servicios" className="w-full bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs text-orange-500 font-bold block mb-2 uppercase">Servicios Complementarios</span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-white mb-8">
            CNC y Soldadura de Termoplásticos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
            <div className="border border-zinc-900 p-6 rounded-none bg-zinc-900/5">
              <div className="text-orange-500 font-bold text-xs mb-2">MECANIZADO INDUSTRIAL</div>
              <h3 className="text-base font-bold text-zinc-100 uppercase mb-3">Mecanizado CNC</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                Ruteo y fresado CNC con tolerancias de [±0,0X mm] en plásticos de ingeniería (POM, PEAD, Grilon, ABS) y aluminio. Desarrollo de piezas complejas, utillajes y matrices.
              </p>
              <ul className="text-zinc-500 text-xs space-y-1">
                <li>• Tolerancia real: [±0,0X mm]</li>
                <li>• Plásticos técnicos y metales no ferrosos</li>
                <li>• Fabricación de lotes y prototipos</li>
              </ul>
            </div>

            <div className="border border-zinc-900 p-6 rounded-none bg-zinc-900/5">
              <div className="text-orange-500 font-bold text-xs mb-2">SOLDADURA PLÁSTICA</div>
              <h3 className="text-base font-bold text-zinc-100 uppercase mb-3">Soldadura de Termoplásticos</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                Fabricación y ensamble de piezas especiales, depósitos y tuberías mediante soldadura plástica por extrusión. Solución óptima para fluidos agresivos o corrosivos y estrés mecánico.
              </p>
              <ul className="text-zinc-500 text-xs space-y-1">
                <li>• Ensamble y estanqueidad técnica</li>
                <li>• Polímeros de alta resistencia (PEAD, PP)</li>
                <li>• Apto para industrias química y de procesos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FORMULARIO DE COTIZACIÓN */}
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
              <p className="mt-2 text-sm text-zinc-400">
                Adjuntá tu archivo en PDF, DXF, DWG o STEP. Si no tenés plano formal, mandanos una foto y las medidas generales de la pieza.
              </p>
            </div>

            {formEnviado ? (
              <div className="border border-orange-500 bg-orange-950/20 p-6 text-center rounded-none font-mono">
                <h3 className="text-orange-500 font-bold text-lg mb-2">¡SOLICITUD ENVIADA CON ÉXITO!</h3>
                <p className="text-xs text-zinc-300">
                  Recibimos tus datos y el plano técnico. Nos comunicamos a la brevedad con la cotización formal con membrete.
                </p>
                <button
                  onClick={() => setFormEnviado(false)}
                  className="mt-4 text-xs underline text-orange-500 hover:text-orange-400 focus:outline-none"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormEnviado(true);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre completo"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Razón social o empresa"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Cargo / Área
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Compras, Ingeniería, Mantenimiento"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Correo Corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@empresa.com"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+54 9 ..."
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      País / Provincia *
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue="Argentina"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Servicio Requerido *
                    </label>
                    <select
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
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Material de la Pieza
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Acero AISI 316, Aluminio, ABS"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                      Cantidad Estimada
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 1 prototipo / 500 piezas"
                      className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                    Plazo Deseado de Entrega
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Urgente / 48 hs / [COMPLETAR: plazo estimado]"
                    className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* Adjunto de planos */}
                <div>
                  <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                    Adjuntar Plano Técnico o Esquema (PDF, DXF, DWG, STEP, JPG, PNG)
                  </label>
                  <div className="border border-dashed border-zinc-800 bg-zinc-950/60 p-6 text-center hover:border-orange-500/50 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
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
                    <span className="font-mono text-xs text-zinc-500 mt-2 block">
                      {archivos && archivos.length > 0
                        ? `${archivos.length} archivo(s) seleccionado(s)`
                        : 'Formatos soportados: 2D vector, modelos 3D y capturas con cotas'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-zinc-300 mb-2">
                    Mensaje o Especificaciones Técnicas
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Detallá tolerancias requeridas, tipo de rotulación, profundidad o condiciones de uso..."
                    className="w-full rounded-none border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    Respuesta técnica y comercial formal con membrete.
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-none bg-orange-600 px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-500 transition-colors"
                  >
                    Enviar Solicitud de Cotización
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
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
                href="https://wa.me/5492304302622"
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
            © {new Date().getFullYear()} NP Solutions. Todos los derechos reservados.
          </div>
          <div>
            Pilar · Buenos Aires · República Argentina
          </div>
        </div>
      </footer>

      {/* 8. BOTÓN FLOTANTE DE WHATSAPP */}
      <aside aria-label="Contacto directo por WhatsApp">
        <a
          href={`https://wa.me/5492304302622?text=${msjWhatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp a NP Solutions"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 border border-emerald-500/40 bg-zinc-950/95 px-4 py-3 text-emerald-400 shadow-2xl backdrop-blur transition-transform hover:scale-105 hover:border-emerald-400 hover:text-emerald-300 rounded-none focus:outline-none"
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
            Cotizar por WhatsApp
          </span>
        </a>
      </aside>
    </div>
  );
}
