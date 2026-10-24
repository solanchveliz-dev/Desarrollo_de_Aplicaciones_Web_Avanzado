"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import type { Character } from "@/types/character";
import StatusBadge from "@/components/rickandmorty/StatusBadge";

interface CharacterCardProps {
  character: Character;
  index?: number;
}

export default function CharacterCard({
  character,
  index = 0,
}: CharacterCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientY - bounds.top) / bounds.height - 0.5;
    const y = (event.clientX - bounds.left) / bounds.width - 0.5;
    setTilt({ x: x * -8, y: y * 8 });
  }

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        animationDelay: `${Math.min(index % 20, 10) * 55}ms`,
      }}
      className={`rm-reveal group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:border-lime-300/40 hover:shadow-[0_18px_50px_-25px_rgba(151,206,76,0.35)] ${character.status === "Alive" ? "hover:shadow-[0_18px_50px_-25px_rgba(151,206,76,0.45)]" : ""} ${character.status === "Dead" ? "hover:shadow-[0_18px_50px_-25px_rgba(251,113,133,0.35)]" : ""}`}
    >
      <Link
        href={`/rickandmorty/${character.id}`}
        className="block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={character.image}
            alt={`Retrato de ${character.name}`}
            width={480}
            height={480}
            loading="lazy"
            unoptimized
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#080b12] via-transparent to-transparent" />
          <div className="absolute left-4 top-4">
            <StatusBadge status={character.status} />
          </div>
          <span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
            #{String(character.id).padStart(3, "0")}
          </span>
        </div>
        <div className="p-5 pt-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-lime-200/70">
            {character.species}
            {character.type ? ` · ${character.type}` : ""}
          </p>
          <h2 className="mt-2 line-clamp-1 text-xl font-bold text-white transition-colors group-hover:text-lime-200">
            {character.name}
          </h2>
          <p className="mt-2 line-clamp-1 text-sm text-slate-400">
            <span className="text-slate-500">Última ubicación: </span>
            {character.location.name}
          </p>
        </div>
      </Link>
    </article>
  );
}
