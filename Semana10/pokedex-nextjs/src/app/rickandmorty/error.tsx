"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

export default function RickAndMortyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div role="alert" className="max-w-lg rounded-3xl border border-rose-300/20 bg-white/5 p-8 text-center backdrop-blur-xl sm:p-10">
        <FaExclamationTriangle
          aria-hidden="true"
          className="mx-auto text-rose-300"
          size={34}
        />
        <p className="mt-5 text-xs font-bold tracking-[0.18em] text-rose-200">
          INTERFERENCIA DIMENSIONAL
        </p>
        <h1 className="mt-3 text-3xl font-black">
          Algo salió mal en el portal.
        </h1>
        <p className="mt-3 text-slate-300">
          No pudimos completar esta operación. Intenta de nuevo o vuelve al
          archivo principal.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 font-bold text-[#10170b] transition hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
          >
            <FaRedo aria-hidden="true" size={13} />
            Reintentar
          </button>
          <Link
            href="/rickandmorty"
            className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-lime-300"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
