"use client"

import { Pencil } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/dates"
import type { Project } from "@/lib/types"
import { useDashboard } from "@/components/DashboardProvider"

export function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
  onEdit,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
}) {
  const { members, tasks } = useDashboard()
  if (!project) return null
  const assignedMembers = members.filter((member) => project.memberIds.includes(member.userId))
  const projectTasks = tasks.filter((task) => task.projectId === project.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <DialogTitle>{project.name}</DialogTitle>
              <DialogDescription className="mt-1">{project.description}</DialogDescription>
            </div>
            <Badge variant={project.status === "Activo" ? "default" : "secondary"}>{project.status}</Badge>
          </div>
        </DialogHeader>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-violet-50 p-3"><p className="text-muted-foreground">Categoría</p><p className="mt-1 font-medium">{project.category}</p></div>
            <div className="rounded-lg bg-violet-50 p-3"><p className="text-muted-foreground">Prioridad</p><p className="mt-1 font-medium">{project.priority}</p></div>
            <div className="rounded-lg bg-violet-50 p-3"><p className="text-muted-foreground">Fecha de inicio</p><p className="mt-1 font-medium">{formatDate(project.startDate)}</p></div>
            <div className="rounded-lg bg-violet-50 p-3"><p className="text-muted-foreground">Fecha de término</p><p className="mt-1 font-medium">{formatDate(project.endDate)}</p></div>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm"><span>Progreso</span><span className="font-semibold">{project.progress}%</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-violet-100">
              <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
          <section>
            <h3 className="mb-3 text-sm font-semibold">Equipo asignado ({assignedMembers.length})</h3>
            {assignedMembers.length ? (
              <div className="flex flex-wrap gap-2">
                {assignedMembers.map((member) => (
                  <div key={member.userId} className="flex items-center gap-2 rounded-full border px-2 py-1">
                    <Avatar className="size-7"><AvatarFallback className="bg-violet-100 text-xs text-violet-700">{member.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">Aún no hay miembros asignados.</p>}
          </section>
          <section>
            <h3 className="mb-3 text-sm font-semibold">Tareas del proyecto ({projectTasks.length})</h3>
            {projectTasks.length ? (
              <ul className="space-y-2">
                {projectTasks.map((task) => <li key={task.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"><span>{task.description}</span><Badge variant="outline">{task.status}</Badge></li>)}
              </ul>
            ) : <p className="text-sm text-muted-foreground">Este proyecto todavía no tiene tareas.</p>}
          </section>
          <div className="flex justify-end">
            <Button onClick={onEdit}><Pencil className="size-4" /> Editar proyecto</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
