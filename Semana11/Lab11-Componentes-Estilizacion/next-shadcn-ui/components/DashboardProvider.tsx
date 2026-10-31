"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { initialActivities, initialMembers, initialProjects, initialSettings, initialTasks } from "@/lib/data"
import type { Activity, Member, MemberInput, Project, ProjectInput, Settings, Task, TaskInput } from "@/lib/types"

type DashboardContextValue = {
  projects: Project[]
  members: Member[]
  tasks: Task[]
  activities: Activity[]
  settings: Settings
  globalSearch: string
  setGlobalSearch: (value: string) => void
  createProject: (input: ProjectInput) => Promise<void>
  updateProject: (id: string, input: ProjectInput) => Promise<void>
  deleteProject: (id: string) => Promise<number>
  createMember: (input: MemberInput) => Promise<void>
  updateMember: (id: string, input: MemberInput) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  createTask: (input: TaskInput) => Promise<void>
  updateTask: (id: string, input: TaskInput) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  saveSettings: (settings: Settings) => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)
const simulateRequest = () => new Promise<void>((resolve) => setTimeout(resolve, 900))

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState(initialProjects)
  const [members, setMembers] = useState(initialMembers)
  const [tasks, setTasks] = useState(initialTasks)
  const [activities, setActivities] = useState(initialActivities)
  const [settings, setSettings] = useState(initialSettings)
  const [globalSearch, setGlobalSearch] = useState("")

  const addActivity = useCallback((action: string, entity: string) => {
    setActivities((current) => [
      { id: crypto.randomUUID(), action, entity, createdAt: new Date().toISOString() },
      ...current,
    ])
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const applyTheme = () => {
      const dark = settings.theme === "Oscuro" || (settings.theme === "Automático" && media.matches)
      root.classList.toggle("dark", dark)
      root.style.colorScheme = dark ? "dark" : "light"
    }
    applyTheme()
    media.addEventListener("change", applyTheme)
    return () => media.removeEventListener("change", applyTheme)
  }, [settings.theme])

  const createProject = useCallback(async (input: ProjectInput) => {
    await simulateRequest()
    setProjects((current) => [{ ...input, id: crypto.randomUUID() }, ...current])
    addActivity("creó el proyecto", input.name)
  }, [addActivity])

  const updateProject = useCallback(async (id: string, input: ProjectInput) => {
    await simulateRequest()
    setProjects((current) => current.map((project) => project.id === id ? { ...input, id } : project))
    addActivity("editó el proyecto", input.name)
  }, [addActivity])

  const deleteProject = useCallback(async (id: string) => {
    await simulateRequest()
    const project = projects.find((item) => item.id === id)
    const deletedTaskCount = tasks.filter((task) => task.projectId === id).length
    const remainingProjects = projects.filter((item) => item.id !== id)
    setProjects(remainingProjects)
    setTasks((current) => current.filter((task) => task.projectId !== id))
    setMembers((current) => current.map((member) => {
      if (member.projectId !== id) return member
      return { ...member, projectId: remainingProjects.find((project) => project.memberIds.includes(member.userId))?.id ?? null }
    }))
    if (project) addActivity("eliminó el proyecto", project.name)
    return deletedTaskCount
  }, [addActivity, projects, tasks])

  const createMember = useCallback(async (input: MemberInput) => {
    await simulateRequest()
    const member: Member = { ...input, userId: crypto.randomUUID() }
    setMembers((current) => [member, ...current])
    if (member.projectId) {
      setProjects((current) => current.map((project) => project.id === member.projectId
        ? { ...project, memberIds: [...new Set([...project.memberIds, member.userId])] }
        : project))
    }
    addActivity("agregó al equipo a", member.name)
  }, [addActivity])

  const updateMember = useCallback(async (id: string, input: MemberInput) => {
    await simulateRequest()
    const previous = members.find((member) => member.userId === id)
    setMembers((current) => current.map((member) => member.userId === id ? { ...input, userId: id } : member))
    setProjects((current) => current.map((project) => {
      const memberIds = project.memberIds.filter((memberId) => memberId !== id)
      return input.projectId === project.id ? { ...project, memberIds: [...new Set([...memberIds, id])] } : { ...project, memberIds }
    }))
    addActivity("editó el perfil de", input.name || previous?.name || "un miembro")
  }, [addActivity, members])

  const deleteMember = useCallback(async (id: string) => {
    await simulateRequest()
    const member = members.find((item) => item.userId === id)
    setMembers((current) => current.filter((item) => item.userId !== id))
    setProjects((current) => current.map((project) => ({ ...project, memberIds: project.memberIds.filter((memberId) => memberId !== id) })))
    setTasks((current) => current.map((task) => task.userId === id ? { ...task, userId: "" } : task))
    if (member) addActivity("eliminó del equipo a", member.name)
  }, [addActivity, members])

  const createTask = useCallback(async (input: TaskInput) => {
    await simulateRequest()
    setTasks((current) => [{ ...input, id: crypto.randomUUID() }, ...current])
    addActivity("creó la tarea", input.description)
  }, [addActivity])

  const updateTask = useCallback(async (id: string, input: TaskInput) => {
    await simulateRequest()
    setTasks((current) => current.map((task) => task.id === id ? { ...input, id } : task))
    addActivity("editó la tarea", input.description)
  }, [addActivity])

  const deleteTask = useCallback(async (id: string) => {
    await simulateRequest()
    const task = tasks.find((item) => item.id === id)
    setTasks((current) => current.filter((item) => item.id !== id))
    if (task) addActivity("eliminó la tarea", task.description)
  }, [addActivity, tasks])

  const saveSettings = useCallback(async (nextSettings: Settings) => {
    await simulateRequest()
    setSettings(nextSettings)
  }, [])

  const value = useMemo(() => ({
    projects, members, tasks, activities, settings, globalSearch, setGlobalSearch,
    createProject, updateProject, deleteProject, createMember, updateMember,
    deleteMember, createTask, updateTask, deleteTask, saveSettings,
  }), [
    projects, members, tasks, activities, settings, globalSearch, createProject, updateProject,
    deleteProject, createMember, updateMember, deleteMember, createTask, updateTask, deleteTask, saveSettings,
  ])

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  return context
}
