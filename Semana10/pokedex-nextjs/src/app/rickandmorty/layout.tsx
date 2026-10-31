import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FaFlask, FaSearch } from "react-icons/fa";

export const metadata: Metadata = {
  title: {
    default: "Rick & Morty | Multiverso",
    template: "%s | Rick & Morty",
  },
  description:
    "Explora personajes, mundos y episodios en una experiencia interactiva del multiverso.",
};

export default function RickAndMortyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rm-universe relative min-h-screen flex-1 overflow-hidden bg-[#080b12] text-white">
      <div aria-hidden="true" className="rm-stars pointer-events-none fixed inset-0" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080b12]/75 backdrop-blur-xl">
        <nav
          aria-label="Navegación de Rick y Morty"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        >
          <Link
            href="/rickandmorty"
            className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300/30 bg-lime-300/10 text-lime-300 transition group-hover:rotate-12">
              <FaFlask aria-hidden="true" size={20} />
            </span>
            <span>
              <span className="block text-sm font-black tracking-wide sm:text-base">
                RICK & MORTY
              </span>
              <span className="block text-[10px] tracking-[0.22em] text-lime-200/70">
                MULTIVERSE ARCHIVE
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-5">
            <Link
              href="/rickandmorty"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-lime-200 focus-visible:outline-2 focus-visible:outline-lime-300"
            >
              Personajes
            </Link>
            <Link
              href="/rickandmorty/search"
              className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-sm font-semibold text-lime-100 transition hover:border-lime-300/70 hover:bg-lime-300/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            >
              <FaSearch aria-hidden="true" size={13} />
              <span className="hidden sm:inline">Buscar</span>
            </Link>
          </div>
        </nav>
      </header>
      <div className="relative z-10">{children}</div>
      <footer className="relative z-10 border-t border-white/10 px-5 py-8 text-center text-xs text-slate-500">
        Una ventana al multiverso · Los datos de personajes provienen de la API
        de Rick and Morty.
      </footer>
    </div>
  );
}
