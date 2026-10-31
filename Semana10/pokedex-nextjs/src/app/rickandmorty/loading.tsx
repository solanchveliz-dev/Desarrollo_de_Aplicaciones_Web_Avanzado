// SSG: el fallback de ruta muestra el esqueleto mientras se resuelve el contenido.
import CharacterSkeleton from "@/components/rickandmorty/CharacterSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 sm:px-8">
      <div className="rm-shimmer mb-8 h-12 max-w-xl rounded-2xl" />
      <div className="rm-shimmer mb-10 h-5 max-w-2xl rounded-full" />
      <CharacterSkeleton />
    </main>
  );
}
