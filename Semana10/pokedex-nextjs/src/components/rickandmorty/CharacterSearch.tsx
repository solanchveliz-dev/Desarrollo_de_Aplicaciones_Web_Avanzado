"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import type { Character, CharacterResponse } from "@/types/character";
import CharacterGrid from "@/components/rickandmorty/CharacterGrid";
import CharacterSkeleton from "@/components/rickandmorty/CharacterSkeleton";

type StatusFilter = "" | "alive" | "dead" | "unknown";
type GenderFilter = "" | "female" | "male" | "genderless" | "unknown";

interface SearchFilters {
  name: string;
  status: StatusFilter;
  type: string;
  gender: GenderFilter;
}

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: "Todos", value: "" },
  { label: "Vivo", value: "alive" },
  { label: "Muerto", value: "dead" },
  { label: "Desconocido", value: "unknown" },
];

const genderOptions: { label: string; value: GenderFilter }[] = [
  { label: "Todos", value: "" },
  { label: "Femenino", value: "female" },
  { label: "Masculino", value: "male" },
  { label: "Sin género", value: "genderless" },
  { label: "Desconocido", value: "unknown" },
];

function FilterChips<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            name={name}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 ${
              value === option.value
                ? "border-lime-300/50 bg-lime-300/15 text-lime-100 shadow-[0_0_18px_rgba(151,206,76,0.1)]"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function CharacterSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    status: "",
    type: "",
    gender: "",
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function updateTextFilter(
    event: ChangeEvent<HTMLInputElement>,
    field: "name" | "type",
  ) {
    setLoading(true);
    setError(null);
    setFilters((current) => ({ ...current, [field]: event.target.value }));
  }

  function updateFilters(update: (current: SearchFilters) => SearchFilters) {
    setLoading(true);
    setError(null);
    setFilters(update);
  }

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      const query = new URLSearchParams();
      if (filters.name.trim()) query.set("name", filters.name.trim());
      if (filters.status) query.set("status", filters.status);
      if (filters.type.trim()) query.set("type", filters.type.trim());
      if (filters.gender) query.set("gender", filters.gender);

      try {
        const url = `/api/rickandmorty/character${query.size ? `?${query.toString()}` : ""}`;
        const response = await fetch(url, { signal: controller.signal });

        if (response.status === 404) {
          setCharacters([]);
          setError(null);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const details: { error?: string } = await response.json();
          throw new Error(
            details.error ?? `La búsqueda falló (${response.status}).`,
          );
        }

        const data: CharacterResponse = await response.json();
        setCharacters(data.results);
        setError(null);
      } catch (caughtError: unknown) {
        if (controller.signal.aborted) return;
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Ocurrió un error al buscar personajes.",
        );
        setCharacters([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [filters]);

  return (
    <div>
      <section
        aria-label="Filtros de búsqueda"
        className="mb-8 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-7"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Nombre
            </span>
            <input
              type="search"
              value={filters.name}
              onChange={(event) => updateTextFilter(event, "name")}
              placeholder="Ej. Rick Sanchez"
              className="w-full rounded-xl border border-white/10 bg-[#080b12]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/15"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Tipo
            </span>
            <input
              type="search"
              value={filters.type}
              onChange={(event) => updateTextFilter(event, "type")}
              placeholder="Ej. Genetic experiment"
              className="w-full rounded-xl border border-white/10 bg-[#080b12]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60 focus:ring-2 focus:ring-cyan-200/15"
            />
          </label>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <FilterChips
            name="status"
            label="Estado"
            options={statusOptions}
            value={filters.status}
            onChange={(status) =>
              updateFilters((current) => ({ ...current, status }))
            }
          />
          <FilterChips
            name="gender"
            label="Género"
            options={genderOptions}
            value={filters.gender}
            onChange={(gender) =>
              updateFilters((current) => ({ ...current, gender }))
            }
          />
        </div>
      </section>

      <div className="mb-5 flex min-h-6 items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">Resultados</h2>
        {!loading && !error && (
          <p aria-live="polite" className="text-sm text-slate-400">
            {characters.length} personaje{characters.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {loading ? (
        <CharacterSkeleton count={8} />
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6 text-rose-100"
        >
          <h3 className="font-bold">No se pudo completar la búsqueda</h3>
          <p className="mt-2 text-sm text-rose-100/75">{error}</p>
        </div>
      ) : characters.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center">
          <p aria-live="polite" className="text-2xl font-bold text-white">
            No encontramos personajes en esta dimensión.
          </p>
          <p className="mt-3 text-slate-400">
            Prueba con otro nombre o cambia los filtros.
          </p>
        </div>
      ) : (
        <CharacterGrid characters={characters} />
      )}
    </div>
  );
}
