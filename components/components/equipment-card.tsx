"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PMComponentRow } from "@/components/pm-component-row"

export interface PMComponent {
  id: string
  name: string
  daysRemaining: number
  totalDays: number
  alertThreshold: number
}

export interface Equipment {
  id: string
  name: string
  components: PMComponent[]
}

interface EquipmentCardProps {
  equipment: Equipment
  onResetComponent: (equipmentId: string, componentId: string) => void
}

export function EquipmentCard({ equipment, onResetComponent }: EquipmentCardProps) {
  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base font-semibold text-foreground">
          {equipment.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className="flex flex-col gap-2">
          {equipment.components.map((component) => (
            <PMComponentRow
              key={component.id}
              name={component.name}
              daysRemaining={component.daysRemaining}
              totalDays={component.totalDays}
              onReset={() => onResetComponent(equipment.id, component.id)}
            />
          ))}
          {equipment.components.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No components added yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
