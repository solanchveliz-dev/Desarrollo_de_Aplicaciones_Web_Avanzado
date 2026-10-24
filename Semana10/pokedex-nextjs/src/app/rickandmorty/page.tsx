// SSR paginado; las respuestas de personajes se reutilizan con force-cache.
import Link from "next/link";
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import CharacterGrid from "@/components/rickandmorty/CharacterGrid";
import CountUp from "@/components/rickandmorty/CountUp";
import { getCharacters } from "@/lib/rickandmorty";

interface CharacterListPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

function getPageNumber(pageValue: string | string[] | undefined): number {
  const value = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function RickAndMortyPage({
  searchParams,
}: CharacterListPageProps) {
  const { page: requestedPage } = await searchParams;
  const requestedPageNumber = getPageNumber(requestedPage);
  const firstPage = await getCharacters(1);
  const page = Math.min(requestedPageNumber, firstPage.info.pages);
  const data =
    page === 1 ? firstPage : await getCharacters(page);

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
      <section className="relative isolate grid min-h-[520px] items-center overflow-hidden py-16 sm:min-h-[600px] sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          aria-hidden="true"
          className="rm-portal pointer-events-none absolute right-[-8rem] top-1/2 -z-10 h-[28rem] w-[28rem] -translate-y-1/2 opacity-80 sm:right-[-5rem] sm:h-[38rem] sm:w-[38rem] lg:right-0"
        />
        <div className="relative z-10 max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/5 px-4 py-2 text-xs font-bold tracking-[0.17em] text-lime-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300 shadow-[0_0_12px_#97ce4c]" />
            TRANSMISIÓN INTERDIMENSIONAL ACTIVA
          </p>
          <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-white drop-shadow-[0_0_30px_rgba(151,206,76,0.18)] sm:text-7xl lg:text-8xl">
            El multiverso
            <span className="mt-2 block bg-linear-to-r from-lime-200 via-[#97ce4c] to-cyan-200 bg-clip-text text-transparent">
              no tiene límites.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Cada dimensión esconde una historia. Explora el archivo de
            personajes, descubre sus mundos y encuentra tu próxima aventura.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#personajes"
              className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-6 py-3 font-bold text-[#10170b] shadow-[0_0_28px_rgba(151,206,76,0.25)] transition hover:-translate-y-0.5 hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200"
            >
              <FaArrowDown aria-hidden="true" size={13} />
              Explorar
            </a>
            <Link
              href="/rickandmorty/search"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-cyan-200/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
            >
              <FaSearch aria-hidden="true" size={13} />
              Buscar personajes
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <span className="text-4xl font-black tabular-nums text-white sm:text-5xl">
              <CountUp value={data.info.count} />
              <span className="text-lime-300">+</span>
            </span>
            <span className="max-w-28 text-xs font-semibold uppercase leading-5 tracking-[0.14em] text-slate-400">
              seres registrados en el archivo
            </span>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative hidden min-h-[420px] lg:block"
        >
          <div className="absolute right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-lime-200/20 shadow-[0_0_100px_20px_rgba(57,255,20,0.12),inset_0_0_50px_rgba(151,206,76,0.15)]" />
          <div className="absolute right-[4.5rem] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border-[10px] border-lime-300/15 blur-[1px]" />
          <div className="absolute right-[6.5rem] top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,45,28,0.85)_0%,rgba(57,255,20,0.12)_48%,rgba(0,0,0,0)_72%)] blur-sm" />
          <span className="absolute right-[13.5rem] top-[22%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_15px_#67e8f9]" />
          <span className="absolute right-8 top-[65%] h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_12px_#c4b5fd]" />
          <span className="absolute right-[18rem] top-[70%] h-1 w-1 rounded-full bg-lime-200 shadow-[0_0_10px_#bef264]" />
          <div className="absolute right-0 top-[14%] rounded-2xl border border-white/10 bg-[#10131d]/80 px-4 py-3 shadow-xl backdrop-blur">
            <p className="text-[10px] font-bold tracking-[0.18em] text-slate-500">
              PORTAL STATUS
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-lime-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />
              OPEN · DIM  C-137
            </p>
          </div>
        </div>
      </section>

      <section id="personajes" className="scroll-mt-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-lime-200/70">
              EXPLORACIÓN DE CAMPO · PÁGINA {page}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Habitantes del multiverso
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {data.info.count.toLocaleString("es-ES")} registros
          </p>
        </div>

        <CharacterGrid characters={data.results} />

        <nav
          aria-label="Paginación de personajes"
          className="mt-12 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:px-6"
        >
          {data.info.prev ? (
            <Link
              href={`/rickandmorty?page=${page - 1}#personajes`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-lime-300/40 hover:text-lime-200 focus-visible:outline-2 focus-visible:outline-lime-300"
            >
              <FaArrowLeft aria-hidden="true" size={12} />
              <span className="hidden sm:inline">Anterior</span>
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-slate-400">
            Página <strong className="text-white">{page}</strong> de{" "}
            <strong className="text-white">{data.info.pages}</strong>
          </span>
          {data.info.next ? (
            <Link
              href={`/rickandmorty?page=${page + 1}#personajes`}
              className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-4 py-2.5 text-sm font-bold text-[#10170b] transition hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <FaArrowRight aria-hidden="true" size={12} />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </section>
    </main>
  );
}
