export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 42 38" aria-hidden="true" className="size-9 shrink-0 text-violet-400">
        <path d="M4 5 18 29 24 19 31 30 39 5H29L24 20 18 5Z" fill="currentColor" />
        <path d="M19 5h20l-4 8H23Z" fill="currentColor" opacity=".72" />
      </svg>
      {!compact && <span className="text-xl font-bold tracking-tight text-white">Guaimer</span>}
    </div>
  )
}
