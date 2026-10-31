// ISR: cada ficha se prerenderiza para todos los IDs y se revalida cada 10 días.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaDna,
  FaGlobeAmericas,
  FaMapMarkerAlt,
  FaMars,
  FaRegIdBadge,
  FaTv,
} from "react-icons/fa";
import StatusBadge from "@/components/rickandmorty/StatusBadge";
import {
  getAllCharacterIds,
  getCharacter,
  getEpisodes,
} from "@/lib/rickandmorty";

export const revalidate = 864000;

interface CharacterDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const ids = await getAllCharacterIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: CharacterDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) {
    return { title: "Personaje no encontrado" };
  }

  return {
    title: character.name,
    description: `Ficha de ${character.name}: ${character.species} de ${character.origin.name}.`,
  };
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const character = await getCharacter(id);
  if (!character) notFound();

  const episodes = await getEpisodes(
    character.episode.map((url) => Number(url.split("/").at(-1))),
  );

  const facts = [
    {
      label: "Especie",
      value: character.species,
      icon: FaDna,
      accent: "text-lime-200",
    },
    {
      label: "Tipo",
      value: character.type || "Sin tipo",
      icon: FaRegIdBadge,
      accent: "text-cyan-200",
    },
    {
      label: "Género",
      value: character.gender,
      icon: FaMars,
      accent: "text-violet-200",
    },
    {
      label: "Origen",
      value: character.origin.name,
      icon: FaGlobeAmericas,
      accent: "text-emerald-200",
    },
    {
      label: "Última ubicación",
      value: character.location.name,
      icon: FaMapMarkerAlt,
      accent: "text-rose-200",
    },
    {
      label: "Fecha de registro",
      value: formatDate(character.created),
      icon: FaCalendarAlt,
      accent: "text-amber-200",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/rickandmorty"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-lime-300/40 hover:text-lime-200 focus-visible:outline-2 focus-visible:outline-lime-300"
      >
        <FaArrowLeft aria-hidden="true" size={12} />
        Volver al archivo
      </Link>

      <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="relative grid gap-8 overflow-hidden p-6 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:p-14">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-36 h-[30rem] w-[30rem] rounded-full bg-lime-300/5 blur-[100px]"
          />
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-5">
            <div className="absolute aspect-square w-[90%] animate-[spin_45s_linear_infinite] rounded-full border border-dashed border-lime-300/40 shadow-[0_0_45px_rgba(151,206,76,0.16)] motion-reduce:animate-none" />
            <div className="absolute aspect-square w-[78%] rounded-full border-[12px] border-lime-300/10 shadow-[inset_0_0_45px_rgba(151,206,76,0.22),0_0_45px_rgba(57,255,20,0.12)]" />
            <div className="absolute aspect-square w-[70%] rounded-full bg-[radial-gradient(circle,rgba(57,255,20,0.12)_0%,rgba(0,0,0,0)_72%)]" />
            <Image
              src={character.image}
              alt={`Retrato de ${character.name}`}
              width={640}
              height={640}
              priority
              unoptimized
              sizes="(max-width: 768px) 90vw, 40vw"
              className="relative z-10 aspect-square w-[74%] rounded-full object-cover shadow-2xl"
            />
            <span className="absolute right-[8%] top-[18%] z-20 h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_18px_#67e8f9]" />
            <span className="absolute bottom-[17%] left-[9%] z-20 h-2 w-2 rounded-full bg-violet-200 shadow-[0_0_16px_#c4b5fd]" />
          </div>

          <div className="relative flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={character.status} />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                REGISTRO #{String(character.id).padStart(3, "0")}
              </span>
            </div>
            <p className="mt-6 text-xs font-bold tracking-[0.2em] text-lime-200/70">
              FICHA HOLOGRÁFICA · DIMENSIÓN C-137
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              {character.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Perfil interdimensional de {character.name}, originario de{" "}
              {character.origin.name}.
            </p>

            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {facts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div
                    key={fact.label}
                    className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/5"
                  >
                    <dt className={`flex items-center gap-2 text-xs font-semibold text-slate-400 ${fact.accent}`}>
                      <Icon aria-hidden="true" />
                      <span className="text-slate-400">{fact.label}</span>
                    </dt>
                    <dd className="mt-2 break-words text-sm font-bold text-white">
                      {fact.value}
                    </dd>
                  </div>
                );
              })}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <FaRegIdBadge aria-hidden="true" className="text-lime-200" />
                  URL del personaje
                </dt>
                <dd className="mt-2 break-all text-xs text-slate-300">
                  <a
                    href={character.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-white/20 underline-offset-4 transition hover:text-lime-200"
                  >
                    {character.url}
                  </a>
                </dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <FaTv aria-hidden="true" className="text-cyan-200" />
                  Apariciones
                </dt>
                <dd className="mt-2 text-sm font-bold text-white">
                  {character.episode.length} episodio
                  {character.episode.length === 1 ? "" : "s"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <section className="border-t border-white/10 px-6 py-8 sm:px-10 lg:px-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-cyan-200/70">
                REGISTRO DE APARICIONES
              </p>
              <h2 className="mt-2 text-2xl font-black">Episodios</h2>
            </div>
            <span className="text-xs text-slate-500">
              Desliza para explorar
            </span>
          </div>
          <ul className="flex snap-x gap-3 overflow-x-auto pb-3">
            {episodes.map((episode) => (
              <li
                key={episode.id}
                className="min-w-56 snap-start rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs font-bold tracking-[0.12em] text-lime-200">
                  {episode.episode}
                </p>
                <p className="mt-2 line-clamp-2 font-semibold text-white">
                  {episode.name}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {episode.air_date}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
