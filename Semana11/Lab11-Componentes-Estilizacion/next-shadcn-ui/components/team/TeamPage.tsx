"use client"

import { useMemo, useState } from "react"
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { useDashboard } from "@/components/DashboardProvider"
import { FormAlert } from "@/components/FormAlert"
import { PaginationControl } from "@/components/PaginationControl"
import { MemberDetailsDialog } from "@/components/team/MemberDetailsDialog"
import { MemberFormDialog } from "@/components/team/MemberFormDialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { Member } from "@/lib/types"

export function TeamPage() {
  const { members, projects, settings, globalSearch, deleteMember } = useDashboard()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Member | undefined>()
  const [details, setDetails] = useState<Member | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const term = (query || globalSearch).trim().toLocaleLowerCase("es")
  const filtered = useMemo(() => members.filter((member) => {
    const projectName = projects.find((project) => project.id === member.projectId)?.name ?? ""
    return !term || `${member.name} ${member.email} ${member.role} ${member.position} ${projectName}`.toLocaleLowerCase("es").includes(term)
  }), [members, projects, term])
  const pageSize = settings.itemsPerPage
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleMembers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const openNew = () => { setEditing(undefined); setFormOpen(true) }
  const openEdit = (member: Member) => { setDetails(null); setEditing(member); setFormOpen(true) }
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteMember(deleteTarget.userId)
      setNotice(`${deleteTarget.name} se eliminó del equipo.`)
      setDeleteTarget(null)
    } catch {
      setError("No se pudo eliminar al miembro. Inténtalo nuevamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      {notice && <FormAlert message={notice} onClose={() => setNotice("")} />}
      {error && <FormAlert message={error} type="error" onClose={() => setError("")} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Buscar miembros..." className="bg-card pl-9" />
        </div>
        <Button onClick={openNew}><Plus className="size-4" /> Agregar Miembro</Button>
      </div>
      <MemberFormDialog key={`${editing?.userId ?? "nuevo"}-${formOpen}`} member={editing} open={formOpen} onOpenChange={setFormOpen} onSuccess={setNotice} />
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-violet-50/70 hover:bg-violet-50/70">
                  <TableHead>Usuario</TableHead><TableHead>Rol</TableHead><TableHead>Posición</TableHead><TableHead>Proyecto</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleMembers.map((member) => {
                  const project = projects.find((item) => item.id === member.projectId)
                  return (
                    <TableRow key={member.userId}>
                      <TableCell>
                        <div className="flex min-w-[205px] items-center gap-3">
                          <Avatar className="size-9"><AvatarFallback className="bg-violet-100 text-xs font-medium text-violet-700">{member.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                          <div className="min-w-0"><p className="truncate font-medium">{member.name}</p><p className="truncate text-xs text-muted-foreground">{member.email}</p></div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{member.role}</Badge></TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{project?.name ?? <span className="text-muted-foreground">Sin proyecto</span>}</TableCell>
                      <TableCell><Badge className={member.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>{member.isActive ? "Activo" : "Inactivo"}</Badge></TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" aria-label={`Ver ${member.name}`} onClick={() => setDetails(member)}><Eye className="size-4" /></Button>
                          <Button variant="ghost" size="icon-sm" aria-label={`Editar ${member.name}`} onClick={() => openEdit(member)}><Pencil className="size-4" /></Button>
                          <Button variant="ghost" size="icon-sm" aria-label={`Eliminar ${member.name}`} className="text-rose-600 hover:text-rose-700" onClick={() => setDeleteTarget(member)}><Trash2 className="size-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {!visibleMembers.length && <TableRow><TableCell colSpan={6} className="h-28 text-center text-muted-foreground">No se encontraron miembros.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <PaginationControl page={currentPage} pageCount={pageCount} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} />
      <MemberDetailsDialog member={details} open={Boolean(details)} onOpenChange={(open) => !open && setDetails(null)} onEdit={() => details && openEdit(details)} />
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Eliminar miembro?</AlertDialogTitle><AlertDialogDescription>Se eliminará a {deleteTarget?.name} del equipo. Las tareas asignadas quedarán sin responsable.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" disabled={isDeleting} onClick={(event) => { event.preventDefault(); void confirmDelete() }}>
              {isDeleting ? <><Spinner /> Eliminando...</> : "Eliminar miembro"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
