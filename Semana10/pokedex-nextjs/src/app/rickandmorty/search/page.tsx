// CSR: los filtros en tiempo real se resuelven en el navegador con debounce.
import type { Metadata } from "next";
import CharacterSearch from "@/components/rickandmorty/CharacterSearch";

export const metadata: Metadata = {
  title: "Buscar personajes",
  description:
    "Encuentra personajes por nombre, estado, tipo y género en el multiverso.",
};

export default function SearchPage() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-9 max-w-3xl">
        <p className="text-xs font-bold tracking-[0.2em] text-cyan-200">
          FRECUENCIA DE BÚSQUEDA · CSR
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
          Encuentra tu
          <span className="block bg-linear-to-r from-cyan-200 to-lime-200 bg-clip-text text-transparent">
            próxima dimensión.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Combina nombre, tipo, estado y género. Los resultados se actualizan
          mientras exploras.
        </p>
      </div>
      <CharacterSearch />
    </main>
  );
}
