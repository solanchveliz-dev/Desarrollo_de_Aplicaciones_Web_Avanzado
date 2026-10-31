import type { CharacterStatus } from "@/types/character";

const statusStyles: Record<CharacterStatus, string> = {
  Alive: "bg-lime-400 shadow-[0_0_12px_#97ce4c]",
  Dead: "bg-rose-400 shadow-[0_0_12px_#fb7185]",
  unknown: "bg-slate-400 shadow-[0_0_12px_#94a3b8]",
};

interface StatusBadgeProps {
  status: CharacterStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-semibold text-slate-100">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${statusStyles[status]} ${status === "unknown" ? "" : "animate-pulse"}`}
      />
      {status}
    </span>
  );
}
