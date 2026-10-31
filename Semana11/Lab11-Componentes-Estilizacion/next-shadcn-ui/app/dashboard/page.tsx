"use client"

import { DashboardProvider } from "@/components/DashboardProvider"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  )
}
