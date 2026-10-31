import { Badge } from "@/components/ui/badge"

const tasks = [
  {
    name: "Diseñar la página de inicio",
    project: "E-commerce Platform",
    assignee: "María García",
    priority: "Alta",
    status: "En progreso",
  },
  {
    name: "Implementar autenticación",
    project: "Mobile App",
    assignee: "Juan Pérez",
    priority: "Urgente",
    status: "Pendiente",
  },
  {
    name: "Revisar componentes UI",
    project: "Design System",
    assignee: "Ana López",
    priority: "Media",
    status: "Completada",
  },
  {
    name: "Configurar endpoints",
    project: "API Gateway",
    assignee: "Carlos Ruiz",
    priority: "Baja",
    status: "En progreso",
  },
]

const priorityClasses: Record<string, string> = {
  Baja: "bg-slate-100 text-slate-700",
  Media: "bg-sky-100 text-sky-700",
  Alta: "bg-amber-100 text-amber-700",
  Urgente: "bg-rose-100 text-rose-700",
}

const statusClasses: Record<string, string> = {
  Pendiente: "bg-slate-100 text-slate-700",
  "En progreso": "bg-violet-100 text-violet-700",
  Completada: "bg-emerald-100 text-emerald-700",
}

export function TasksTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="px-3 py-3 font-medium">Tarea</th>
            <th scope="col" className="px-3 py-3 font-medium">Proyecto</th>
            <th scope="col" className="px-3 py-3 font-medium">Asignado a</th>
            <th scope="col" className="px-3 py-3 font-medium">Prioridad</th>
            <th scope="col" className="px-3 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.name} className="border-b last:border-0 hover:bg-violet-50/50">
              <th scope="row" className="px-3 py-4 font-medium text-slate-900">
                {task.name}
              </th>
              <td className="px-3 py-4 text-muted-foreground">{task.project}</td>
              <td className="px-3 py-4 text-muted-foreground">{task.assignee}</td>
              <td className="px-3 py-4">
                <Badge className={priorityClasses[task.priority]}>{task.priority}</Badge>
              </td>
              <td className="px-3 py-4">
                <Badge className={statusClasses[task.status]}>{task.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
