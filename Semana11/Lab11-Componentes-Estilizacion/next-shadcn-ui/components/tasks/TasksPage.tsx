"use client"

import { useMemo, useState } from "react"
import { CalendarDays, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { useDashboard } from "@/components/DashboardProvider"
import { FormAlert } from "@/components/FormAlert"
import { PaginationControl } from "@/components/PaginationControl"
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/dates"
import type { Task } from "@/lib/types"

export function TasksPage() {
  const { tasks, projects, members, settings, globalSearch, deleteTask } = useDashboard()
  const [query, setQuery] = useState("")
  const [projectFilter, setProjectFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const term = (query || globalSearch).trim().toLocaleLowerCase("es")
  const filtered = useMemo(() => tasks.filter((task) => {
    const project = projects.find((item) => item.id === task.projectId)?.name ?? ""
    const assignee = members.find((item) => item.userId === task.userId)?.name ?? ""
    const matchesText = !term || `${task.description} ${project} ${assignee}`.toLocaleLowerCase("es").includes(term)
    return matchesText
      && (projectFilter === "all" || task.projectId === projectFilter)
      && (priorityFilter === "all" || task.priority === priorityFilter)
      && (statusFilter === "all" || task.status === statusFilter)
  }), [tasks, projects, members, term, projectFilter, priorityFilter, statusFilter])
  const pageSize = settings.itemsPerPage
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleTasks = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const openNew = () => { setEditing(undefined); setFormOpen(true) }
  const openEdit = (task: Task) => { setEditing(task); setFormOpen(true) }
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteTask(deleteTarget.id)
      setNotice("Tarea eliminada exitosamente.")
      setDeleteTarget(null)
    } catch {
      setError("No se pudo eliminar la tarea. Inténtalo nuevamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      {notice && <FormAlert message={notice} onClose={() => setNotice("")} />}
      {error && <FormAlert message={error} type="error" onClose={() => setError("")} />}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row">
            <div className="relative min-w-48 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Buscar tareas..." className="bg-card pl-9" />
            </div>
            <Select value={projectFilter} onValueChange={(value) => { setProjectFilter(value); setPage(1) }}>
              <SelectTrigger className="bg-card sm:w-52"><SelectValue placeholder="Todos los proyectos" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos los proyectos</SelectItem>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value) => { setPriorityFilter(value); setPage(1) }}>
              <SelectTrigger className="bg-card sm:w-48"><SelectValue placeholder="Todas las prioridades" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todas las prioridades</SelectItem>{(["Baja", "Media", "Alta", "Urgente"] as const).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1) }}>
              <SelectTrigger className="bg-card sm:w-44"><SelectValue placeholder="Todos los estados" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos los estados</SelectItem>{(["Pendiente", "En proceso", "Completada"] as const).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={openNew}><Plus className="size-4" /> Nueva Tarea</Button>
        </div>
      </div>
      <TaskFormDialog key={`${editing?.id ?? "nueva"}-${formOpen}`} task={editing} open={formOpen} onOpenChange={setFormOpen} onSuccess={setNotice} />
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-violet-50/70 hover:bg-violet-50/70">
                  <TableHead>Descripción</TableHead><TableHead>Proyecto</TableHead><TableHead>Prioridad</TableHead><TableHead>Estado</TableHead><TableHead>Fecha límite</TableHead><TableHead>Responsable</TableHead><TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleTasks.map((task) => {
                  const project = projects.find((item) => item.id === task.projectId)
                  const assignee = members.find((item) => item.userId === task.userId)
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="min-w-52 font-medium">{task.description}</TableCell>
                      <TableCell className="min-w-40">{project?.name ?? "Proyecto eliminado"}</TableCell>
                      <TableCell><Badge className={{ Baja: "bg-slate-100 text-slate-700", Media: "bg-sky-100 text-sky-700", Alta: "bg-amber-100 text-amber-700", Urgente: "bg-rose-100 text-rose-700" }[task.priority]}>{task.priority}</Badge></TableCell>
                      <TableCell><Badge className={{ Pendiente: "bg-orange-100 text-orange-700", "En proceso": "bg-blue-100 text-blue-700", Completada: "bg-emerald-100 text-emerald-700" }[task.status]}>{task.status}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap"><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 text-violet-500" />{formatDate(task.dateline)}</span></TableCell>
                      <TableCell className="min-w-36">{assignee?.name ?? <span className="text-muted-foreground">Sin asignar</span>}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" aria-label={`Editar ${task.description}`} onClick={() => openEdit(task)}><Pencil className="size-4" /></Button>
                          <Button variant="ghost" size="icon-sm" aria-label={`Eliminar ${task.description}`} className="text-rose-600 hover:text-rose-700" onClick={() => setDeleteTarget(task)}><Trash2 className="size-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {!visibleTasks.length && <TableRow><TableCell colSpan={7} className="h-28 text-center text-muted-foreground">No se encontraron tareas con estos filtros.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <PaginationControl page={currentPage} pageCount={pageCount} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} />
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle><AlertDialogDescription>Se eliminará “{deleteTarget?.description}”. Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" disabled={isDeleting} onClick={(event) => { event.preventDefault(); void confirmDelete() }}>
              {isDeleting ? <><Spinner /> Eliminando...</> : "Eliminar tarea"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
