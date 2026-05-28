"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsPanel } from "@/components/metrics-panel"
import { EquipmentCard, Equipment } from "@/components/equipment-card"
import { AddEquipmentModal } from "@/components/add-equipment-modal"

// Sample data
const initialEquipment: Equipment[] = [
  {
    id: "eq-1",
    name: "Assembly Line 1",
    components: [
      { id: "c1", name: "Battery", daysRemaining: 42, totalDays: 50, alertThreshold: 5 },
      { id: "c2", name: "Wheels", daysRemaining: 14, totalDays: 60, alertThreshold: 7 },
      { id: "c3", name: "Motor", daysRemaining: 28, totalDays: 90, alertThreshold: 10 },
      { id: "c4", name: "Gearbox", daysRemaining: 5, totalDays: 45, alertThreshold: 5 },
    ],
  },
  {
    id: "eq-2",
    name: "Paint Booth A",
    components: [
      { id: "c5", name: "Nozzles", daysRemaining: 8, totalDays: 30, alertThreshold: 5 },
      { id: "c6", name: "Filters", daysRemaining: 3, totalDays: 14, alertThreshold: 3 },
      { id: "c7", name: "Pump", daysRemaining: 55, totalDays: 120, alertThreshold: 14 },
    ],
  },
  {
    id: "eq-3",
    name: "Robot Arm",
    components: [
      { id: "c8", name: "Gripper", daysRemaining: 18, totalDays: 30, alertThreshold: 5 },
      { id: "c9", name: "Servo", daysRemaining: 67, totalDays: 180, alertThreshold: 14 },
      { id: "c10", name: "Belts", daysRemaining: 12, totalDays: 45, alertThreshold: 7 },
      { id: "c11", name: "Sensors", daysRemaining: 2, totalDays: 60, alertThreshold: 7 },
      { id: "c12", name: "Controller", daysRemaining: 88, totalDays: 365, alertThreshold: 30 },
    ],
  },
  {
    id: "eq-4",
    name: "CNC Machine B2",
    components: [
      { id: "c13", name: "Spindle", daysRemaining: 21, totalDays: 90, alertThreshold: 14 },
      { id: "c14", name: "Coolant", daysRemaining: 6, totalDays: 30, alertThreshold: 5 },
      { id: "c15", name: "Tool Holder", daysRemaining: 35, totalDays: 60, alertThreshold: 7 },
    ],
  },
  {
    id: "eq-5",
    name: "Conveyor System",
    components: [
      { id: "c16", name: "Drive Belt", daysRemaining: 45, totalDays: 120, alertThreshold: 14 },
      { id: "c17", name: "Rollers", daysRemaining: 78, totalDays: 180, alertThreshold: 21 },
      { id: "c18", name: "Tensioner", daysRemaining: 9, totalDays: 45, alertThreshold: 7 },
    ],
  },
  {
    id: "eq-6",
    name: "Inspection Station",
    components: [
      { id: "c20", name: "Camera", daysRemaining: 25, totalDays: 90, alertThreshold: 10 },
      { id: "c21", name: "LED Array", daysRemaining: 156, totalDays: 365, alertThreshold: 30 },
    ],
  },
]

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function getHealthStatus(daysRemaining: number, totalDays: number): "healthy" | "warning" | "critical" {
  const percentage = (daysRemaining / totalDays) * 100
  if (percentage <= 10) return "critical"
  if (percentage <= 30) return "warning"
  return "healthy"
}

export default function PMDashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allComponents = equipment.flatMap((eq) => eq.components)
  const criticalCount = allComponents.filter(
    (c) => getHealthStatus(c.daysRemaining, c.totalDays) === "critical"
  ).length
  const warningCount = allComponents.filter(
    (c) => getHealthStatus(c.daysRemaining, c.totalDays) === "warning"
  ).length

  const upcomingAlerts = allComponents
    .filter((c) => c.daysRemaining <= c.alertThreshold)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)

  const nextEmailReminder =
    upcomingAlerts.length > 0 ? `${upcomingAlerts[0].daysRemaining}d` : "None"

  const handleResetComponent = (equipmentId: string, componentId: string) => {
    setEquipment((prev) =>
      prev.map((eq) => {
        if (eq.id === equipmentId) {
          return {
            ...eq,
            components: eq.components.map((comp) => {
              if (comp.id === componentId) {
                return { ...comp, daysRemaining: comp.totalDays }
              }
              return comp
            }),
          }
        }
        return eq
      })
    )
  }

  const handleAddEquipment = (newEquipment: {
    name: string
    tasks: { componentName: string; resetIntervalDays: number; alertThresholdDays: number }[]
  }) => {
    const equipmentEntry: Equipment = {
      id: `eq-${generateId()}`,
      name: newEquipment.name,
      components: newEquipment.tasks.map((task) => ({
        id: `c-${generateId()}`,
        name: task.componentName,
        daysRemaining: task.resetIntervalDays,
        totalDays: task.resetIntervalDays,
        alertThreshold: task.alertThresholdDays,
      })),
    }
    setEquipment((prev) => [...prev, equipmentEntry])
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Metrics */}
        <MetricsPanel
          metrics={{
            totalEquipment: equipment.length,
            criticalComponents: criticalCount,
            warningComponents: warningCount,
            nextEmailReminder,
          }}
        />

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Your Equipment</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage maintenance schedules
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {equipment.map((eq) => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              onResetComponent={handleResetComponent}
            />
          ))}
        </div>

        {equipment.length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="max-w-sm mx-auto">
              <p className="text-muted-foreground mb-4">
                No equipment added yet. Start by adding your first piece of equipment.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="rounded-xl border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          </div>
        )}
      </main>

      <AddEquipmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleAddEquipment}
      />
    </div>
  )
}
