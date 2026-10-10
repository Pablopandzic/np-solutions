"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#mecanizado-cnc", label: "Mecanizado CNC" },
  { href: "#grabado-laser", label: "Grabado Láser" },
  { href: "#soldadura-plastica", label: "Soldadura Plástica" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-none text-lg font-bold tracking-tight text-zinc-900 sm:text-xl"
        >
          NP SOLUTIONS
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex lg:gap-8"
          aria-label="Principal"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-none text-sm font-normal text-zinc-900 transition-colors hover:text-blue-600"
            >
              {label}
            </Link>
          ))}
          <Link
            href="#contacto"
            className="rounded-none bg-blue-600 px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-none transition-colors hover:bg-blue-700"
          >
            Contacto
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-none border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-900 shadow-none lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Cerrar" : "Menú"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-zinc-200 bg-white px-4 py-4 shadow-none lg:hidden"
          aria-label="Principal móvil"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block rounded-none px-2 py-3 text-sm font-normal text-zinc-900 hover:bg-zinc-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="#contacto"
                className="block rounded-none bg-blue-600 px-4 py-3 text-center text-sm font-bold tracking-wide text-white shadow-none hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
