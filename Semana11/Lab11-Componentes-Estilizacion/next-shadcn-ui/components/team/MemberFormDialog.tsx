"use client"

import { useState, type FormEvent } from "react"
import { Save } from "lucide-react"
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboard } from "@/components/DashboardProvider"
import type { Member, MemberInput } from "@/lib/types"

const blankMember = (): MemberInput => ({
  role: "Desarrollador",
  name: "",
  email: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: null,
  isActive: true,
})

const memberToInput = (member: Member): MemberInput => ({
  role: member.role,
  name: member.name,
  email: member.email,
  position: member.position,
  birthdate: member.birthdate,
  phone: member.phone,
  projectId: member.projectId,
  isActive: member.isActive,
})

export function MemberFormDialog({
  member,
  open,
  onOpenChange,
  onSuccess,
}: {
  member?: Member
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}) {
  const { members, projects, createMember, updateMember } = useDashboard()
  const [form, setForm] = useState<MemberInput>(() => member ? memberToInput(member) : blankMember())
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = form.email.trim().toLocaleLowerCase()
    if (!form.name.trim()) return setError("El nombre es obligatorio.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Ingresa un correo electrónico válido.")
    if (members.some((item) => item.email.toLocaleLowerCase() === email && item.userId !== member?.userId)) return setError("Ya existe un miembro con ese correo.")
    if (!/^\d{9}$/.test(form.phone)) return setError("El teléfono debe tener exactamente 9 dígitos.")
    if (!form.birthdate) return setError("Selecciona la fecha de nacimiento.")
    if (!form.position.trim()) return setError("La posición es obligatoria.")

    setError("")
    setIsSaving(true)
    try {
      const input = { ...form, name: form.name.trim(), email, position: form.position.trim() }
      if (member) {
        await updateMember(member.userId, input)
        onSuccess("Miembro actualizado exitosamente.")
      } else {
        await createMember(input)
        onSuccess("Miembro agregado exitosamente.")
      }
      onOpenChange(false)
    } catch {
      setError("No se pudo guardar el miembro. Inténtalo nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <form noValidate onSubmit={submit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>{member ? "Editar miembro" : "Agregar miembro"}</DialogTitle>
            <DialogDescription>Completa la información del perfil y su asignación al equipo.</DialogDescription>
          </DialogHeader>
          {error && <FormAlert message={error} type="error" onClose={() => setError("")} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="member-name">Nombre completo *</Label>
              <Input id="member-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Correo electrónico *</Label>
              <Input id="member-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-phone">Teléfono *</Label>
              <Input id="member-phone" inputMode="numeric" maxLength={9} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value.replace(/\D/g, "").slice(0, 9) })} placeholder="987654321" />
            </div>
            <div className="space-y-2">
              <Label>Rol *</Label>
              <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Administrador", "Desarrollador", "Diseñador", "Analista", "Invitado"].map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-position">Posición *</Label>
              <Input id="member-position" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} placeholder="Frontend, UX, Datos..." />
            </div>
            <div className="space-y-2">
              <Label>Proyecto</Label>
              <Select value={form.projectId ?? "none"} onValueChange={(value) => setForm({ ...form, projectId: value === "none" ? null : value })}>
                <SelectTrigger><SelectValue placeholder="Sin proyecto" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin proyecto</SelectItem>
                  {projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha de nacimiento *</Label>
              <DatePicker value={form.birthdate} onChange={(birthdate) => setForm({ ...form, birthdate })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
              <div><Label htmlFor="member-active">Miembro activo</Label><p className="text-xs text-muted-foreground">Permite asignar tareas a este miembro.</p></div>
              <Switch id="member-active" checked={form.isActive} onCheckedChange={(isActive) => setForm({ ...form, isActive })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancelar</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? <><Spinner /> Guardando...</> : <><Save className="size-4" /> {member ? "Guardar cambios" : "Agregar miembro"}</>}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
