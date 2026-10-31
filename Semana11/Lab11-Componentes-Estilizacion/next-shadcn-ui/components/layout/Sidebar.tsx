"use client"

import type { ComponentType } from "react"
import {
  Bell, BriefcaseBusiness, CheckSquare, LayoutDashboard, Settings2, Users,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Brand } from "@/components/layout/Brand"
import { useDashboard } from "@/components/DashboardProvider"
import type { DashboardSection } from "@/lib/types"

const navigation: { id: DashboardSection; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard },
  { id: "projects", label: "Proyectos", icon: BriefcaseBusiness },
  { id: "team", label: "Equipo", icon: Users },
  { id: "tasks", label: "Tareas", icon: CheckSquare },
  { id: "settings", label: "Configuración", icon: Settings2 },
]

export function Sidebar({
  activeSection,
  onSelect,
}: {
  activeSection: DashboardSection
  onSelect: (section: DashboardSection) => void
}) {
  const { settings } = useDashboard()
  const initials = settings.profileName.split(" ").map((part) => part[0]).slice(0, 2).join("")

  return (
    <div className="flex h-full flex-col bg-[#1e1b4b] px-4 py-5 text-white">
      <div className="px-2 pb-8">
        <Brand />
        <p className="mt-2 pl-11 text-[11px] text-indigo-200/75">Organiza. Colabora. Logra más.</p>
      </div>
      <nav className="flex-1 space-y-1" aria-label="Navegación principal">
        {navigation.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant="ghost"
            className={`w-full justify-start gap-3 rounded-lg px-3 text-sm ${
              activeSection === id
                ? "bg-violet-600 text-white shadow-lg shadow-violet-950/25 hover:bg-violet-500 hover:text-white"
                : "text-indigo-100/80 hover:bg-white/10 hover:text-white"
            }`}
            aria-current={activeSection === id ? "page" : undefined}
            onClick={() => onSelect(id)}
          >
            <Icon className="size-4" />
            {label}
          </Button>
        ))}
      </nav>
      <Separator className="mb-4 bg-white/10" />
      <div className="flex items-center gap-3 px-1">
        <Avatar className="size-9 border border-white/20">
          <AvatarFallback className="bg-violet-500 text-white">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{settings.profileName}</p>
          <p className="text-xs text-indigo-200/70">Administrador</p>
        </div>
        <Bell className="ml-auto size-4 text-indigo-200/60" aria-hidden="true" />
      </div>
    </div>
  )
}
