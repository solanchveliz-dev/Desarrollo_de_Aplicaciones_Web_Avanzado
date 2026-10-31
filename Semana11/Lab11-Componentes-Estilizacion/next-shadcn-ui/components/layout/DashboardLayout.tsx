"use client"

import { useEffect, useState } from "react"
import { BriefcaseBusiness, CheckSquare, LayoutDashboard, Settings2, Users } from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { OverviewPage } from "@/components/overview/OverviewPage"
import { ProjectsPage } from "@/components/projects/ProjectsPage"
import { TeamPage } from "@/components/team/TeamPage"
import { TasksPage } from "@/components/tasks/TasksPage"
import { SettingsPage } from "@/components/settings/SettingsPage"
import { Spinner } from "@/components/ui/spinner"
import type { DashboardSection } from "@/lib/types"

const sectionInfo = {
  overview: { title: "Resumen", subtitle: "Vista general de tu trabajo en un solo lugar.", icon: LayoutDashboard },
  projects: { title: "Proyectos", subtitle: "Gestiona todos tus proyectos en un solo lugar.", icon: BriefcaseBusiness },
  team: { title: "Equipo", subtitle: "Gestiona los miembros de tu equipo.", icon: Users },
  tasks: { title: "Tareas", subtitle: "Organiza y da seguimiento a tus tareas.", icon: CheckSquare },
  settings: { title: "Configuración", subtitle: "Personaliza tu experiencia en Guaimer.", icon: Settings2 },
} satisfies Record<DashboardSection, { title: string; subtitle: string; icon: typeof LayoutDashboard }>

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650)
    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-violet-700">
          <Spinner className="size-9" />
          <span className="text-sm font-medium">Cargando Guaimer...</span>
        </div>
      </main>
    )
  }

  const page = {
    overview: <OverviewPage onNavigate={setActiveSection} />,
    projects: <ProjectsPage />,
    team: <TeamPage />,
    tasks: <TasksPage />,
    settings: <SettingsPage />,
  }[activeSection]
  const { title, subtitle, icon: Icon } = sectionInfo[activeSection]

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-[250px] shrink-0 lg:block">
        <div className="fixed inset-y-0 w-[250px]">
          <Sidebar activeSection={activeSection} onSelect={setActiveSection} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader activeSection={activeSection} onSelect={setActiveSection} />
        <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Icon className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          {page}
        </main>
      </div>
    </div>
  )
}
