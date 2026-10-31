import Link from "next/link";
import { FaArrowLeft, FaGlobeAmericas } from "react-icons/fa";

export default function CharacterNotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center px-5 py-16">
      <section className="relative max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-lime-300/15 shadow-[0_0_70px_rgba(151,206,76,0.13)]"
        />
        <div className="relative">
          <FaGlobeAmericas
            aria-hidden="true"
            className="mx-auto text-lime-200"
            size={46}
          />
          <p className="mt-5 text-xs font-bold tracking-[0.2em] text-lime-200/80">
            COORDENADAS NO ENCONTRADAS
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">404</h1>
          <h2 className="mt-3 text-xl font-bold text-white">
            Este personaje se perdió en otra dimensión.
          </h2>
          <p className="mt-3 leading-7 text-slate-400">
            El portal no encuentra esas coordenadas. Puede que el personaje no
            exista o haya cambiado de universo.
          </p>
          <Link
            href="/rickandmorty"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 font-bold text-[#10170b] transition hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
          >
            <FaArrowLeft aria-hidden="true" size={12} />
            Volver a explorar
          </Link>
        </div>
      </section>
    </main>
  );
}
