"use client"

import { useState } from "react"
import { Bell, Menu, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/Sidebar"
import { useDashboard } from "@/components/DashboardProvider"
import type { DashboardSection } from "@/lib/types"

export function DashboardHeader({
  activeSection,
  onSelect,
}: {
  activeSection: DashboardSection
  onSelect: (section: DashboardSection) => void
}) {
  const { settings, globalSearch, setGlobalSearch, activities } = useDashboard()
  const [mobileOpen, setMobileOpen] = useState(false)
  const initials = settings.profileName.split(" ").map((part) => part[0]).slice(0, 2).join("")

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-violet-100 bg-card/90 px-4 backdrop-blur md:px-8">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-0 bg-[#1e1b4b] p-0 text-white">
          <SheetHeader className="sr-only">
            <SheetTitle>Menú de Guaimer</SheetTitle>
          </SheetHeader>
          <Sidebar activeSection={activeSection} onSelect={(section) => { onSelect(section); setMobileOpen(false) }} />
        </SheetContent>
      </Sheet>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalSearch}
          onChange={(event) => setGlobalSearch(event.target.value)}
          placeholder="Buscar en Guaimer..."
          aria-label="Buscar en Guaimer"
          className="h-10 rounded-full border-violet-100 bg-violet-50/50 pl-9 dark:bg-muted"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
              <Bell className="size-5" />
              {activities.length > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Actividad reciente</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activities.slice(0, 3).map((activity) => (
              <DropdownMenuItem key={activity.id} className="items-start py-2">
                <span className="text-xs leading-relaxed">
                  {activity.action} <strong>{activity.entity}</strong>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar className="size-9">
          <AvatarFallback className="bg-violet-100 font-semibold text-violet-700">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
