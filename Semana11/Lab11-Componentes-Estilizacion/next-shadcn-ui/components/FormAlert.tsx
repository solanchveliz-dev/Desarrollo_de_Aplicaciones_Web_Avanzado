"use client"

import { X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function FormAlert({
  message,
  type = "success",
  onClose,
}: {
  message: string
  type?: "success" | "error"
  onClose: () => void
}) {
  if (!message) return null
  return (
    <Alert variant={type === "error" ? "destructive" : "default"} className={type === "success" ? "border-violet-200 bg-violet-50 text-violet-950" : ""}>
      <AlertTitle>{type === "success" ? "Operación exitosa" : "Datos inválidos"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      <Button type="button" variant="ghost" size="icon-sm" className="absolute right-2 top-2" onClick={onClose} aria-label="Cerrar mensaje">
        <X className="size-4" />
      </Button>
    </Alert>
  )
}
