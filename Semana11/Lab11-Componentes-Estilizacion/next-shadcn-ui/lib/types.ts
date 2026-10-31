export type ProjectStatus = "Activo" | "Pausado" | "Completado"
export type ProjectPriority = "Baja" | "Media" | "Alta" | "Urgente"
export type TaskStatus = "Pendiente" | "En proceso" | "Completada"
export type ThemePreference = "Claro" | "Oscuro" | "Automático"
export type DashboardSection = "overview" | "projects" | "team" | "tasks" | "settings"

export type Project = {
  id: string
  name: string
  description: string
  category: string
  priority: ProjectPriority
  status: ProjectStatus
  progress: number
  startDate: string
  endDate: string
  memberIds: string[]
}

export type Member = {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string | null
  isActive: boolean
}

export type Task = {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: ProjectPriority
  userId: string
  dateline: string
}

export type Settings = {
  profileName: string
  profileEmail: string
  language: string
  theme: ThemePreference
  timezone: string
  itemsPerPage: number
  emailNotifications: boolean
  taskReminders: boolean
  projectUpdates: boolean
  securityAlerts: boolean
  githubIntegration: boolean
  slackIntegration: boolean
  googleCalendarIntegration: boolean
}

export type Activity = {
  id: string
  action: string
  entity: string
  createdAt: string
}

export type ProjectInput = Omit<Project, "id">
export type MemberInput = Omit<Member, "userId">
export type TaskInput = Omit<Task, "id">
