"use client"

import { useMemo, useState } from "react"
import { FolderKanban, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { useDashboard } from "@/components/DashboardProvider"
import { FormAlert } from "@/components/FormAlert"
import { PaginationControl } from "@/components/PaginationControl"
import { ProjectDetailsDialog } from "@/components/projects/ProjectDetailsDialog"
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Project } from "@/lib/types"

export function ProjectsPage() {
  const { projects, members, settings, globalSearch, deleteProject } = useDashboard()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Project | undefined>()
  const [details, setDetails] = useState<Project | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const pageSize = settings.itemsPerPage

  const filtered = useMemo(() => {
    const term = (query || globalSearch).trim().toLocaleLowerCase("es")
    return projects.filter((project) => {
      const matchesTerm = !term || `${project.name} ${project.description} ${project.category}`.toLocaleLowerCase("es").includes(term)
      return matchesTerm && (statusFilter === "Todos" || project.status === statusFilter)
    })
  }, [projects, query, globalSearch, statusFilter])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleProjects = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const openNewProject = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEditProject = (project: Project) => {
    setDetails(null)
    setEditing(project)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    setError("")
    try {
      const removedTasks = await deleteProject(deleteTarget.id)
      setNotice(`Proyecto eliminado. También se eliminaron ${removedTasks} ${removedTasks === 1 ? "tarea asociada" : "tareas asociadas"}.`)
      setDeleteTarget(null)
    } catch {
      setError("No se pudo eliminar el proyecto. Inténtalo nuevamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      {notice && <FormAlert message={notice} onClose={() => setNotice("")} />}
      {error && <FormAlert message={error} type="error" onClose={() => setError("")} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Buscar proyectos..." className="bg-card pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1) }}>
            <SelectTrigger className="bg-card sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Todos", "Activo", "Pausado", "Completado"].map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openNewProject}><Plus className="size-4" /> Nuevo Proyecto</Button>
          <ProjectFormDialog key={`${editing?.id ?? "nuevo"}-${formOpen}`} open={formOpen} onOpenChange={setFormOpen} project={editing} onSuccess={setNotice} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FolderKanban className="mb-3 size-10 text-violet-300" />
            <p className="font-medium">No se encontraron proyectos</p>
            <p className="mt-1 text-sm text-muted-foreground">Prueba con otros filtros o crea un proyecto nuevo.</p>
            <Button className="mt-4" onClick={openNewProject}>Nuevo Proyecto</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => {
            const assignedMembers = members.filter((member) => project.memberIds.includes(member.userId))
            return (
              <Card key={project.id} className="border-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <FolderKanban className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-base">{project.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2 min-h-10">{project.description}</CardDescription>
                    </div>
                    <Badge className={project.status === "Activo" ? "bg-emerald-100 text-emerald-700" : project.status === "Pausado" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}>{project.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Progreso</span><span className="font-semibold text-violet-700">{project.progress}%</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-violet-100">
                      <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {assignedMembers.slice(0, 3).map((member, index) => (
                        <Avatar key={member.userId} className={`size-8 border-2 border-white ${index ? "-ml-2" : ""}`}>
                          <AvatarFallback className="bg-violet-100 text-[10px] text-violet-700">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</AvatarFallback>
                        </Avatar>
                      ))}
                      {assignedMembers.length > 3 && <span className="-ml-2 flex size-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-medium">+{assignedMembers.length - 3}</span>}
                      {!assignedMembers.length && <span className="text-xs text-muted-foreground">Sin miembros</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">{project.category}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <Button variant="link" className="h-auto p-0 text-violet-700" onClick={() => setDetails(project)}>Ver detalles <span aria-hidden="true">→</span></Button>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label={`Editar ${project.name}`} onClick={() => openEditProject(project)}><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon-sm" aria-label={`Eliminar ${project.name}`} className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => setDeleteTarget(project)}><Trash2 className="size-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      <PaginationControl page={currentPage} pageCount={pageCount} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} />

      <ProjectDetailsDialog
        project={details}
        open={Boolean(details)}
        onOpenChange={(open) => !open && setDetails(null)}
        onEdit={() => details && openEditProject(details)}
      />
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este proyecto?</AlertDialogTitle>
            <AlertDialogDescription>Se eliminará “{deleteTarget?.name}” junto con todas sus tareas. Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={(event) => { event.preventDefault(); void confirmDelete() }}
            >
              {isDeleting ? <><Spinner /> Eliminando...</> : "Eliminar proyecto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
