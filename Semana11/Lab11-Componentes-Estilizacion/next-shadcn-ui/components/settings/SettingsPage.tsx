"use client"

import { useState } from "react"
import { Check, RotateCcw, Save, ShieldCheck } from "lucide-react"
import { useDashboard } from "@/components/DashboardProvider"
import { FormAlert } from "@/components/FormAlert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { initialSettings } from "@/lib/data"
import type { Settings, ThemePreference } from "@/lib/types"

const themeOptions: ThemePreference[] = ["Claro", "Oscuro", "Automático"]

export function SettingsPage() {
  const { settings, saveSettings } = useDashboard()
  const [draft, setDraft] = useState<Settings>(() => settings)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const save = async () => {
    if (!draft.profileName.trim()) return setError("El nombre completo es obligatorio.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.profileEmail.trim())) return setError("Ingresa un correo electrónico válido.")
    if (![5, 10, 15].includes(draft.itemsPerPage)) return setError("Selecciona una cantidad válida de elementos por página.")
    setError("")
    setIsSaving(true)
    try {
      const savedSettings = { ...draft, profileName: draft.profileName.trim(), profileEmail: draft.profileEmail.trim() }
      await saveSettings(savedSettings)
      setDraft(savedSettings)
      setMessage("Los cambios se guardaron exitosamente.")
    } catch {
      setError("No se pudieron guardar los cambios. Inténtalo nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const reset = async () => {
    setError("")
    setIsSaving(true)
    try {
      await saveSettings(initialSettings)
      setDraft(initialSettings)
      setMessage("La configuración se restableció.")
    } catch {
      setError("No se pudo restablecer la configuración.")
    } finally {
      setIsSaving(false)
    }
  }

  const changePassword = async () => {
    setPasswordError("")
    setPasswordMessage("")
    if (password.length < 8) return setPasswordError("La contraseña debe tener al menos 8 caracteres.")
    if (password !== confirmPassword) return setPasswordError("Las contraseñas no coinciden.")
    setIsChangingPassword(true)
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 900))
      setPassword("")
      setConfirmPassword("")
      setPasswordMessage("La contraseña se actualizó correctamente (simulación).")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const booleanSetting = (key: keyof Settings) => draft[key] as boolean
  const integrations = [
    { name: "GitHub", description: "Sincroniza repositorios y actividad de desarrollo.", key: "githubIntegration" as const },
    { name: "Slack", description: "Recibe notificaciones de proyectos en tus canales.", key: "slackIntegration" as const },
    { name: "Google Calendar", description: "Sincroniza fechas límite y reuniones del equipo.", key: "googleCalendarIntegration" as const },
  ]

  return (
    <div className="space-y-5">
      {message && <FormAlert message={message} onClose={() => setMessage("")} />}
      {error && <FormAlert message={error} type="error" onClose={() => setError("")} />}
      <Tabs defaultValue="general">
        <TabsList className="h-auto flex-wrap bg-white shadow-sm">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 grid gap-5 xl:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>Información del Perfil</CardTitle><CardDescription>Actualiza la información personal de tu cuenta.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="profile-name">Nombre completo</Label><Input id="profile-name" value={draft.profileName} onChange={(event) => update("profileName", event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="profile-email">Correo electrónico</Label><Input id="profile-email" type="email" value={draft.profileEmail} onChange={(event) => update("profileEmail", event.target.value)} /></div>
              <div className="space-y-2"><Label>Idioma</Label><Select value={draft.language} onValueChange={(value) => update("language", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Español">Español</SelectItem><SelectItem value="English">English</SelectItem></SelectContent></Select></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>Preferencias</CardTitle><CardDescription>Personaliza la apariencia y el comportamiento del dashboard.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <div><Label>Tema de la aplicación</Label><div className="mt-2 flex flex-wrap gap-2">{themeOptions.map((theme) => <Button key={theme} variant={draft.theme === theme ? "default" : "outline"} size="sm" onClick={() => update("theme", theme)}>{draft.theme === theme && <Check className="size-3.5" />}{theme}</Button>)}</div></div>
              <div className="space-y-2"><Label>Zona horaria</Label><Select value={draft.timezone} onValueChange={(value) => update("timezone", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="(GMT-05:00) Lima">(GMT-05:00) Lima</SelectItem><SelectItem value="(GMT-05:00) Bogotá">(GMT-05:00) Bogotá</SelectItem><SelectItem value="(GMT-03:00) Buenos Aires">(GMT-03:00) Buenos Aires</SelectItem><SelectItem value="(GMT+00:00) Londres">(GMT+00:00) Londres</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Tareas por página</Label><Select value={String(draft.itemsPerPage)} onValueChange={(value) => update("itemsPerPage", Number(value))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[5, 10, 15].map((size) => <SelectItem key={size} value={String(size)}>{size} por página</SelectItem>)}</SelectContent></Select></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>Preferencias de notificación</CardTitle><CardDescription>Elige qué actualizaciones quieres recibir.</CardDescription></CardHeader>
            <CardContent className="divide-y">
              {[
                { key: "emailNotifications" as const, title: "Notificaciones por correo", description: "Recibe un resumen de actividad en tu correo." },
                { key: "taskReminders" as const, title: "Recordatorios de tareas", description: "Avisos antes de las fechas límite." },
                { key: "projectUpdates" as const, title: "Actualizaciones de proyectos", description: "Cambios en proyectos a los que perteneces." },
                { key: "securityAlerts" as const, title: "Alertas de seguridad", description: "Avisos sobre actividad importante de tu cuenta." },
              ].map(({ key, title, description }) => (
                <div key={key} className="flex items-center justify-between gap-4 py-4">
                  <div><p className="text-sm font-medium">{title}</p><p className="text-sm text-muted-foreground">{description}</p></div>
                  <Switch checked={booleanSetting(key)} onCheckedChange={(checked) => update(key, checked)} aria-label={title} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardHeader><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><ShieldCheck className="size-5" /></div><div><CardTitle>Seguridad de la cuenta</CardTitle><CardDescription>Cambia tu contraseña (simulación local).</CardDescription></div></div></CardHeader>
            <CardContent className="max-w-xl space-y-4">
              {passwordMessage && <FormAlert message={passwordMessage} onClose={() => setPasswordMessage("")} />}
              {passwordError && <FormAlert message={passwordError} type="error" onClose={() => setPasswordError("")} />}
              <div className="space-y-2"><Label htmlFor="new-password">Nueva contraseña</Label><Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="confirm-password">Confirmar contraseña</Label><Input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
              <Button onClick={() => void changePassword()} disabled={isChangingPassword}>{isChangingPassword ? <><Spinner /> Actualizando...</> : "Cambiar contraseña"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 grid gap-4 lg:grid-cols-3">
          {integrations.map(({ name, description, key }) => (
            <Card key={key} className="border-0 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base">{name}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
              <CardContent className="flex items-center justify-between"><span className="text-sm font-medium">{booleanSetting(key) ? "Conectado" : "Desconectado"}</span><Switch checked={booleanSetting(key)} onCheckedChange={(checked) => update(key, checked)} aria-label={`Conectar ${name}`} /></CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => void reset()} disabled={isSaving}><RotateCcw className="size-4" /> Restablecer</Button>
        <Button onClick={() => void save()} disabled={isSaving}>{isSaving ? <><Spinner /> Guardando...</> : <><Save className="size-4" /> Guardar cambios</>}</Button>
      </div>
    </div>
  )
}
