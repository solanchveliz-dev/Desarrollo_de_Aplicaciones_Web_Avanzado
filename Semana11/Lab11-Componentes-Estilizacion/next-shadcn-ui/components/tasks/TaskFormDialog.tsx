"use client"

import { useState, type FormEvent } from "react"
import { Save } from "lucide-react"
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboard } from "@/components/DashboardProvider"
import { dateFromOffset } from "@/lib/dates"
import type { Task, TaskInput } from "@/lib/types"

export function TaskFormDialog({
  task,
  open,
  onOpenChange,
  onSuccess,
}: {
  task?: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}) {
  const { projects, members, createTask, updateTask } = useDashboard()
  const makeInitialForm = (): TaskInput => task ? {
    description: task.description,
    projectId: task.projectId,
    status: task.status,
    priority: task.priority,
    userId: task.userId,
    dateline: task.dateline,
  } : {
    description: "",
    projectId: projects[0]?.id ?? "",
    status: "Pendiente",
    priority: "Media",
    userId: members.find((member) => member.isActive)?.userId ?? "",
    dateline: dateFromOffset(7),
  }
  const [form, setForm] = useState<TaskInput>(makeInitialForm)
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.description.trim()) return setError("La descripción de la tarea es obligatoria.")
    if (!projects.some((project) => project.id === form.projectId)) return setError("Selecciona un proyecto válido.")
    if (!form.userId || !members.some((member) => member.userId === form.userId && member.isActive)) return setError("Asigna la tarea a un miembro activo.")
    if (!form.dateline) return setError("Selecciona la fecha límite.")
    setError("")
    setIsSaving(true)
    try {
      const input = { ...form, description: form.description.trim() }
      if (task) {
        await updateTask(task.id, input)
        onSuccess("Tarea actualizada exitosamente.")
      } else {
        await createTask(input)
        onSuccess("Tarea creada exitosamente.")
      }
      onOpenChange(false)
    } catch {
      setError("No se pudo guardar la tarea. Inténtalo nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <form noValidate onSubmit={submit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
            <DialogDescription>Define el proyecto, la prioridad y la fecha límite.</DialogDescription>
          </DialogHeader>
          {error && <FormAlert message={error} type="error" onClose={() => setError("")} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="task-description">Descripción *</Label>
              <Input id="task-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={140} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Proyecto *</Label>
              <Select value={form.projectId} onValueChange={(projectId) => setForm({ ...form, projectId })}>
                <SelectTrigger><SelectValue placeholder="Selecciona un proyecto" /></SelectTrigger>
                <SelectContent>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridad *</Label>
              <Select value={form.priority} onValueChange={(priority: TaskInput["priority"]) => setForm({ ...form, priority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Baja", "Media", "Alta", "Urgente"] as const).map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado *</Label>
              <Select value={form.status} onValueChange={(status: TaskInput["status"]) => setForm({ ...form, status })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Pendiente", "En proceso", "Completada"] as const).map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Responsable *</Label>
              <Select value={form.userId} onValueChange={(userId) => setForm({ ...form, userId })}>
                <SelectTrigger><SelectValue placeholder="Selecciona un miembro" /></SelectTrigger>
                <SelectContent>{members.filter((member) => member.isActive).map((member) => <SelectItem key={member.userId} value={member.userId}>{member.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha límite *</Label>
              <DatePicker value={form.dateline} onChange={(dateline) => setForm({ ...form, dateline })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancelar</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? <><Spinner /> Guardando...</> : <><Save className="size-4" /> {task ? "Guardar cambios" : "Crear tarea"}</>}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
