"use client"

import { useState, type FormEvent } from "react"
import { Plus, Save } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useDashboard } from "@/components/DashboardProvider"
import { dateFromOffset } from "@/lib/dates"
import type { Project, ProjectInput } from "@/lib/types"

const blankProject = (): ProjectInput => ({
  name: "",
  description: "",
  category: "",
  priority: "Media",
  status: "Activo",
  progress: 0,
  startDate: dateFromOffset(0),
  endDate: dateFromOffset(30),
  memberIds: [],
})

const projectToInput = (project: Project): ProjectInput => ({
  name: project.name,
  description: project.description,
  category: project.category,
  priority: project.priority,
  status: project.status,
  progress: project.progress,
  startDate: project.startDate,
  endDate: project.endDate,
  memberIds: [...project.memberIds],
})

export function ProjectFormDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: {
  project?: Project
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess: (message: string) => void
}) {
  const { members, createProject, updateProject } = useDashboard()
  const [internalOpen, setInternalOpen] = useState(false)
  const [form, setForm] = useState<ProjectInput>(() => project ? projectToInput(project) : blankProject())
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const isOpen = open ?? internalOpen

  const setOpen = (next: boolean) => {
    if (onOpenChange) onOpenChange(next)
    else setInternalOpen(next)
  }

  const toggleMember = (memberId: string, checked: boolean) => {
    setForm((current) => ({
      ...current,
      memberIds: checked
        ? [...new Set([...current.memberIds, memberId])]
        : current.memberIds.filter((id) => id !== memberId),
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim() || !form.description.trim() || !form.category || !form.startDate || !form.endDate) {
      setError("Completa el nombre, la descripción, la categoría y las fechas.")
      return
    }
    if (form.endDate < form.startDate) {
      setError("La fecha de término debe ser posterior a la fecha de inicio.")
      return
    }
    if (form.progress < 0 || form.progress > 100) {
      setError("El progreso debe estar entre 0 y 100.")
      return
    }
    setError("")
    setIsSaving(true)
    try {
      if (project) {
        await updateProject(project.id, form)
        onSuccess("Proyecto actualizado exitosamente.")
      } else {
        await createProject(form)
        onSuccess("Proyecto creado exitosamente.")
      }
      setOpen(false)
    } catch {
      setError("No se pudo guardar el proyecto. Inténtalo nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!project && open === undefined && (
        <DialogTrigger asChild>
          <Button className="shadow-md shadow-violet-200">
            <Plus className="size-4" /> Nuevo Proyecto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>{project ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
            <DialogDescription>Completa la información y asigna los miembros que colaborarán.</DialogDescription>
          </DialogHeader>
          {error && <FormAlert message={error} type="error" onClose={() => setError("")} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="project-name">Nombre del proyecto *</Label>
              <Input id="project-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={80} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="project-description">Descripción *</Label>
              <Textarea id="project-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={180} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select value={form.category} onValueChange={(category) => setForm({ ...form, category })}>
                <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                <SelectContent>
                  {["Desarrollo Web", "Desarrollo Mobile", "Diseño", "Marketing", "Otro"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={form.priority} onValueChange={(priority: ProjectInput["priority"]) => setForm({ ...form, priority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Baja", "Media", "Alta", "Urgente"] as const).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(status: ProjectInput["status"]) => setForm({ ...form, status })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Activo", "Pausado", "Completado"] as const).map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-progress">Progreso (%)</Label>
              <Input id="project-progress" type="number" min={0} max={100} value={form.progress} onChange={(event) => setForm({ ...form, progress: Number(event.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Fecha de inicio *</Label>
              <DatePicker value={form.startDate} onChange={(startDate) => setForm({ ...form, startDate })} />
            </div>
            <div className="space-y-2">
              <Label>Fecha de término *</Label>
              <DatePicker value={form.endDate} onChange={(endDate) => setForm({ ...form, endDate })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Miembros del equipo</Label>
            <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
              {members.length ? members.map((member) => (
                <label key={member.userId} className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-violet-50">
                  <Checkbox checked={form.memberIds.includes(member.userId)} onCheckedChange={(checked) => toggleMember(member.userId, checked === true)} />
                  <Avatar className="size-7"><AvatarFallback className="bg-violet-100 text-xs text-violet-700">{member.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                  <span className="truncate text-sm">{member.name}</span>
                </label>
              )) : <p className="text-sm text-muted-foreground">Agrega miembros desde la sección Equipo.</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <><Spinner /> Guardando...</> : <><Save className="size-4" /> {project ? "Guardar cambios" : "Crear proyecto"}</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
