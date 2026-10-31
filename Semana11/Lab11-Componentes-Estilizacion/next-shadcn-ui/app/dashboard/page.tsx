"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"

const stats = [
  {
    title: "Total Proyectos",
    value: "12",
    note: "+2 desde el mes pasado",
    color: "from-violet-500 to-indigo-500",
    icon: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </>
    ),
  },
  {
    title: "Tareas Completadas",
    value: "143",
    note: "+19% desde la semana pasada",
    color: "from-emerald-500 to-teal-500",
    icon: <path d="M20 6 9 17l-5-5" />,
  },
  {
    title: "Horas Trabajadas",
    value: "324h",
    note: "+12h desde ayer",
    color: "from-amber-500 to-orange-500",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    title: "Miembros Activos",
    value: "8",
    note: "+1 nuevo miembro",
    color: "from-pink-500 to-rose-500",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
]

const activities = [
  { user: "María García", action: "completó la tarea", task: "Diseño de UI", time: "Hace 5 min" },
  { user: "Juan Pérez", action: "comentó en", task: "API Backend", time: "Hace 1 hora" },
  { user: "Ana López", action: "creó un nuevo", task: "Proyecto Mobile", time: "Hace 2 horas" },
  { user: "Carlos Ruiz", action: "actualizó", task: "Documentación", time: "Hace 3 horas" },
]

const projects = [
  { title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", status: "En progreso", progress: 65, team: 5 },
  { title: "Mobile App", description: "Aplicación móvil con React Native", status: "En revisión", progress: 90, team: 3 },
  { title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", status: "Planificado", progress: 20, team: 4 },
  { title: "API Gateway", description: "Microservicios con Node.js", status: "En progreso", progress: 45, team: 6 },
  { title: "Design System", description: "Librería de componentes reutilizables", status: "Completado", progress: 100, team: 2 },
  { title: "Marketing Website", description: "Sitio web institucional", status: "En progreso", progress: 75, team: 3 },
]

const members = [
  { name: "María García", role: "Frontend Developer", email: "maria@example.com", status: "Activo" },
  { name: "Juan Pérez", role: "Backend Developer", email: "juan@example.com", status: "Activo" },
  { name: "Ana López", role: "UI/UX Designer", email: "ana@example.com", status: "Ausente" },
  { name: "Carlos Ruiz", role: "DevOps Engineer", email: "carlos@example.com", status: "Activo" },
  { name: "Laura Martínez", role: "Project Manager", email: "laura@example.com", status: "Activo" },
]

const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-sky-100 text-sky-700",
]

const progressColor = (status: string) => {
  switch (status) {
    case "Completado":
      return "from-emerald-400 to-emerald-600"
    case "En revisión":
      return "from-sky-400 to-indigo-500"
    case "Planificado":
      return "from-amber-400 to-orange-500"
    default:
      return "from-violet-500 to-fuchsia-500"
  }
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-lg">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-2">Panel de control</p>
          <h1 className="text-4xl font-bold mb-2">Dashboard de Proyectos</h1>
          <p className="text-white/80">Gestiona tus proyectos y tareas con shadcn/ui</p>
          <div className="mt-6">
            <ProjectForm />
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white shadow-sm border">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className={`h-1.5 bg-gradient-to-r ${stat.color}`} />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${stat.color} text-white`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4"
                      >
                        {stat.icon}
                      </svg>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg p-2 hover:bg-violet-50 transition-colors">
                      <Avatar>
                        <AvatarFallback className={avatarColors[i % avatarColors.length]}>
                          {activity.user[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} <span className="font-medium text-violet-700">{activity.task}</span>
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Card key={i} className="border-0 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          project.status === "Completado"
                            ? "default"
                            : project.status === "En revisión"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${progressColor(project.status)} transition-all`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {project.team} miembros
                        </div>
                        <Button size="sm" variant="ghost" className="text-violet-700 hover:text-violet-800 hover:bg-violet-50">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((member, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-xl hover:border-violet-300 hover:bg-violet-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className={avatarColors[i % avatarColors.length]}>
                            {initials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.status === "Activo" ? "default" : "secondary"}>
                          {member.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Tasks */}
          <TabsContent value="tasks">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configuración en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}