"use client"

import { Mail, Pencil, Phone, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDashboard } from "@/components/DashboardProvider"
import { formatDate } from "@/lib/dates"
import type { Member } from "@/lib/types"

export function MemberDetailsDialog({
  member,
  open,
  onOpenChange,
  onEdit,
}: {
  member: Member | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
}) {
  const { projects } = useDashboard()
  if (!member) return null
  const project = projects.find((item) => item.id === member.projectId)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="size-12"><AvatarFallback className="bg-violet-100 font-semibold text-violet-700">{member.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
            <div><DialogTitle>{member.name}</DialogTitle><DialogDescription>{member.role} · {member.position}</DialogDescription></div>
          </div>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="flex items-center gap-2"><Mail className="size-4 text-violet-600" />{member.email}</p>
          <p className="flex items-center gap-2"><Phone className="size-4 text-violet-600" />{member.phone}</p>
          <p className="flex items-center gap-2"><UserRound className="size-4 text-violet-600" />Nacimiento: {formatDate(member.birthdate)}</p>
          <p>Proyecto: <span className="font-medium">{project?.name ?? "Sin proyecto asignado"}</span></p>
          <Badge className={member.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>{member.isActive ? "Activo" : "Inactivo"}</Badge>
        </div>
        <div className="flex justify-end"><Button onClick={onEdit}><Pencil className="size-4" /> Editar miembro</Button></div>
      </DialogContent>
    </Dialog>
  )
}
