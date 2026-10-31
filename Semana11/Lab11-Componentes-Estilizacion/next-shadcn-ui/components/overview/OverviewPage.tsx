"use client"

import { useMemo, useState } from "react"
import { Activity as ActivityIcon, CalendarDays, CheckCircle2, CircleCheck, FolderKanban, ListTodo, Plus, Users } from "lucide-react"
import { es } from "date-fns/locale"
import { useDashboard } from "@/components/DashboardProvider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import type { DashboardSection } from "@/lib/types"

const metricStyle = {
  violet: "bg-violet-50 text-violet-700",
  blue: "bg-blue-50 text-blue-700",
  teal: "bg-teal-50 text-teal-700",
  orange: "bg-orange-50 text-orange-700",
}

function activityTime(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000))
  if (minutes < 1) return "Ahora"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`
  return `Hace ${Math.floor(hours / 24)} días`
}

export function OverviewPage({ onNavigate }: { onNavigate: (section: DashboardSection) => void }) {
  const { projects, members, tasks, activities } = useDashboard()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const activeProjects = projects.filter((project) => project.status === "Activo")
  const completedTasks = tasks.filter((task) => task.status === "Completada")
  const pendingTasks = tasks.filter((task) => task.status !== "Completada")
  const activeMembers = members.filter((member) => member.isActive)
  const dueDates = useMemo(() => tasks.map((task) => {
    const [year, month, day] = task.dateline.split("-").map(Number)
    return new Date(year, month - 1, day)
  }), [tasks])
  const metrics = [
    { title: "Proyectos Activos", value: activeProjects.length, note: `${projects.length} en total`, icon: FolderKanban, color: metricStyle.violet },
    { title: "Tareas Completadas", value: completedTasks.length, note: `${tasks.length ? Math.round(completedTasks.length / tasks.length * 100) : 0}% del total`, icon: CircleCheck, color: metricStyle.blue },
    { title: "Miembros del Equipo", value: activeMembers.length, note: `${members.length} registrados`, icon: Users, color: metricStyle.teal },
    { title: "Tareas Pendientes", value: pendingTasks.length, note: `${tasks.filter((task) => task.status === "En proceso").length} en proceso`, icon: ListTodo, color: metricStyle.orange },
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {metrics.map(({ title, value, note, icon: Icon, color }) => (
          <Card key={title} className="border-0 shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div><p className="text-sm font-medium text-muted-foreground">{title}</p><p className="mt-2 text-3xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>
              <div className={`flex size-12 items-center justify-center rounded-xl ${color}`}><Icon className="size-5" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Proyectos Recientes</CardTitle><CardDescription>Avance de tus proyectos activos</CardDescription></div>
            <Button variant="link" className="text-violet-700" onClick={() => onNavigate("projects")}>Ver todos →</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.slice(0, 4).map((project) => {
              const team = members.filter((member) => project.memberIds.includes(member.userId))
              return (
                <div key={project.id} className="rounded-xl border border-violet-100 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700"><FolderKanban className="size-4" /></span><span className="truncate text-sm font-medium">{project.name}</span></div>
                    <span className="text-xs font-semibold text-violet-700">{project.progress}%</span>
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-violet-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600" style={{ width: `${project.progress}%` }} /></div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{project.category}</span>
                    <div className="flex items-center">
                      {team.slice(0, 3).map((member, index) => <Avatar key={member.userId} className={`size-7 border-2 border-white ${index ? "-ml-2" : ""}`}><AvatarFallback className="bg-violet-100 text-[9px] text-violet-700">{member.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>)}
                      {team.length > 3 && <span className="-ml-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[9px]">+{team.length - 3}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
            {!activeProjects.length && <p className="py-8 text-center text-sm text-muted-foreground">Crea un proyecto para comenzar.</p>}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between">
            <div><CardTitle>Calendario</CardTitle><CardDescription>Fechas límite de tus tareas</CardDescription></div>
            <Button variant="link" className="text-violet-700" onClick={() => onNavigate("tasks")}>Ver calendario →</Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] xl:grid-cols-1 2xl:grid-cols-[1fr_auto]">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              modifiers={{ deadline: dueDates }}
              modifiersClassNames={{ deadline: "bg-violet-200 font-bold text-violet-950" }}
              className="mx-auto"
            />
            <div className="flex flex-col items-center justify-center rounded-xl bg-violet-50 p-4 text-center sm:max-w-44 xl:max-w-none 2xl:max-w-44">
              <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-white text-violet-600"><CalendarDays className="size-5" /></div>
              <p className="text-sm font-semibold">Mantén tus fechas al día</p>
              <p className="mt-1 text-xs text-muted-foreground">Organiza tus tareas y cumple tus plazos.</p>
              <Button size="sm" className="mt-3" onClick={() => onNavigate("tasks")}><Plus className="size-4" /> Nueva tarea</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><ActivityIcon className="size-5" /></div>
          <div><CardTitle>Actividad Reciente</CardTitle><CardDescription>Últimas actualizaciones del equipo</CardDescription></div>
        </CardHeader>
        <CardContent>
          {activities.length ? (
            <div className="space-y-1">
              {activities.slice(0, 5).map((activity, index) => (
                <div key={activity.id} className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-violet-50/60">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${index % 2 ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"}`}><CheckCircle2 className="size-4" /></div>
                  <p className="min-w-0 flex-1 text-sm"><span>{activity.action} </span><span className="font-medium text-violet-800">{activity.entity}</span></p>
                  <Badge variant="outline" className="shrink-0 text-[10px]">{activityTime(activity.createdAt)}</Badge>
                </div>
              ))}
            </div>
          ) : <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"><Spinner /> Cargando actividad...</div>}
        </CardContent>
      </Card>
    </div>
  )
}
