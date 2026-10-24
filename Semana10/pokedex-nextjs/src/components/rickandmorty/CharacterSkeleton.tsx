interface CharacterSkeletonProps {
  count?: number;
}

export default function CharacterSkeleton({
  count = 8,
}: CharacterSkeletonProps) {
  return (
    <div
      aria-label="Cargando personajes"
      aria-busy="true"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
        >
          <div className="rm-shimmer aspect-square" />
          <div className="space-y-3 p-5">
            <div className="rm-shimmer h-3 w-1/3 rounded-full" />
            <div className="rm-shimmer h-6 w-2/3 rounded-full" />
            <div className="rm-shimmer h-4 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
