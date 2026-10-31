import { dateFromOffset } from "@/lib/dates"
import type { Activity, Member, Project, Settings, Task } from "@/lib/types"

export const initialProjects: Project[] = [
  { id: "project-1", name: "Plataforma E-commerce", description: "Desarrollo de tienda online con pagos integrados.", category: "Desarrollo Web", priority: "Alta", status: "Activo", progress: 75, startDate: dateFromOffset(-60), endDate: dateFromOffset(21), memberIds: ["member-1", "member-2"] },
  { id: "project-2", name: "App Móvil de Gestión", description: "Aplicación para gestión de tareas y equipos.", category: "Desarrollo Mobile", priority: "Alta", status: "Activo", progress: 60, startDate: dateFromOffset(-35), endDate: dateFromOffset(35), memberIds: ["member-3", "member-5"] },
  { id: "project-3", name: "Dashboard Analytics", description: "Panel de análisis de datos empresariales.", category: "Desarrollo Web", priority: "Media", status: "Activo", progress: 45, startDate: dateFromOffset(-28), endDate: dateFromOffset(45), memberIds: ["member-4", "member-6"] },
  { id: "project-4", name: "Proyecto Innovación", description: "Soluciones tecnológicas para el futuro.", category: "Diseño", priority: "Media", status: "Pausado", progress: 25, startDate: dateFromOffset(-90), endDate: dateFromOffset(60), memberIds: [] },
  { id: "project-5", name: "Campaña de Lanzamiento", description: "Estrategia de marketing para el nuevo producto.", category: "Marketing", priority: "Urgente", status: "Activo", progress: 30, startDate: dateFromOffset(-14), endDate: dateFromOffset(14), memberIds: ["member-7"] },
  { id: "project-6", name: "Sistema de Diseño", description: "Componentes y guías para una experiencia consistente.", category: "Diseño", priority: "Baja", status: "Completado", progress: 100, startDate: dateFromOffset(-120), endDate: dateFromOffset(-14), memberIds: [] },
  { id: "project-7", name: "Portal de Clientes", description: "Autoservicio y soporte para clientes.", category: "Desarrollo Web", priority: "Media", status: "Activo", progress: 10, startDate: dateFromOffset(-7), endDate: dateFromOffset(80), memberIds: ["member-8"] },
]

export const initialMembers: Member[] = [
  { userId: "member-1", role: "Administrador", name: "Solanch Veliz", email: "solanch@guaimer.com", position: "Líder de proyecto", birthdate: "1993-06-18", phone: "987654321", projectId: "project-1", isActive: true },
  { userId: "member-2", role: "Desarrollador", name: "Ana Torres", email: "ana.torres@guaimer.com", position: "Frontend", birthdate: "1995-03-12", phone: "987654322", projectId: "project-1", isActive: true },
  { userId: "member-3", role: "Diseñador", name: "Carlos Mendoza", email: "carlos.mendoza@guaimer.com", position: "UI/UX", birthdate: "1992-11-04", phone: "987654323", projectId: "project-2", isActive: true },
  { userId: "member-4", role: "Analista", name: "Lucía Fernández", email: "lucia.fernandez@guaimer.com", position: "Datos", birthdate: "1997-08-21", phone: "987654324", projectId: "project-3", isActive: true },
  { userId: "member-5", role: "Desarrollador", name: "Diego Rojas", email: "diego.rojas@guaimer.com", position: "Backend", birthdate: "1990-01-30", phone: "987654325", projectId: "project-2", isActive: true },
  { userId: "member-6", role: "Diseñador", name: "Valeria Cruz", email: "valeria.cruz@guaimer.com", position: "Producto", birthdate: "1996-05-16", phone: "987654326", projectId: "project-3", isActive: true },
  { userId: "member-7", role: "Analista", name: "Jorge Castillo", email: "jorge.castillo@guaimer.com", position: "Marketing", birthdate: "1994-09-09", phone: "987654327", projectId: "project-5", isActive: false },
  { userId: "member-8", role: "Desarrollador", name: "Camila Reyes", email: "camila.reyes@guaimer.com", position: "Full stack", birthdate: "1998-12-02", phone: "987654328", projectId: "project-7", isActive: true },
]

export const initialTasks: Task[] = [
  { id: "task-1", description: "Diseñar landing page", projectId: "project-1", status: "En proceso", priority: "Alta", userId: "member-2", dateline: dateFromOffset(2) },
  { id: "task-2", description: "Implementar API de pagos", projectId: "project-1", status: "Pendiente", priority: "Urgente", userId: "member-5", dateline: dateFromOffset(4) },
  { id: "task-3", description: "Pruebas de rendimiento", projectId: "project-3", status: "Completada", priority: "Baja", userId: "member-4", dateline: dateFromOffset(-2) },
  { id: "task-4", description: "Crear prototipo interactivo", projectId: "project-2", status: "En proceso", priority: "Media", userId: "member-3", dateline: dateFromOffset(5) },
  { id: "task-5", description: "Configurar autenticación", projectId: "project-2", status: "Pendiente", priority: "Alta", userId: "member-5", dateline: dateFromOffset(7) },
  { id: "task-6", description: "Preparar informe mensual", projectId: "project-3", status: "Pendiente", priority: "Media", userId: "member-4", dateline: dateFromOffset(9) },
  { id: "task-7", description: "Definir guía de estilos", projectId: "project-6", status: "Completada", priority: "Baja", userId: "member-6", dateline: dateFromOffset(-5) },
  { id: "task-8", description: "Planificar campaña digital", projectId: "project-5", status: "En proceso", priority: "Urgente", userId: "member-7", dateline: dateFromOffset(1) },
  { id: "task-9", description: "Desarrollar área de clientes", projectId: "project-7", status: "Pendiente", priority: "Media", userId: "member-8", dateline: dateFromOffset(12) },
  { id: "task-10", description: "Revisar accesibilidad", projectId: "project-1", status: "Completada", priority: "Alta", userId: "member-1", dateline: dateFromOffset(-1) },
  { id: "task-11", description: "Documentar endpoints", projectId: "project-3", status: "En proceso", priority: "Baja", userId: "member-5", dateline: dateFromOffset(15) },
]

export const initialSettings: Settings = {
  profileName: "Solanch Veliz",
  profileEmail: "solanch@guaimer.com",
  language: "Español",
  theme: "Claro",
  timezone: "(GMT-05:00) Lima",
  itemsPerPage: 5,
  emailNotifications: true,
  taskReminders: true,
  projectUpdates: false,
  securityAlerts: true,
  githubIntegration: false,
  slackIntegration: false,
  googleCalendarIntegration: true,
}

export const initialActivities: Activity[] = [
  { id: "activity-1", action: "completó una tarea", entity: "Diseñar landing page", createdAt: new Date().toISOString() },
  { id: "activity-2", action: "actualizó el progreso de", entity: "Plataforma E-commerce", createdAt: new Date(Date.now() - 3_600_000).toISOString() },
  { id: "activity-3", action: "se unió al equipo", entity: "Camila Reyes", createdAt: new Date(Date.now() - 7_200_000).toISOString() },
  { id: "activity-4", action: "completó una tarea", entity: "Pruebas de rendimiento", createdAt: new Date(Date.now() - 14_400_000).toISOString() },
  { id: "activity-5", action: "creó el proyecto", entity: "Portal de Clientes", createdAt: new Date(Date.now() - 86_400_000).toISOString() },
]
