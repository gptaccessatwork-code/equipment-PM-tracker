"use client"

import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type HealthStatus = "healthy" | "warning" | "critical"

interface PMComponentRowProps {
  name: string
  daysRemaining: number
  totalDays: number
  onReset: () => void
}

function getHealthStatus(daysRemaining: number, totalDays: number): HealthStatus {
  const percentage = (daysRemaining / totalDays) * 100
  if (percentage <= 10) return "critical"
  if (percentage <= 30) return "warning"
  return "healthy"
}

function getStatusStyles(status: HealthStatus) {
  switch (status) {
    case "critical":
      return {
        bg: "bg-rose-100",
        fill: "bg-rose-400",
        text: "text-rose-600",
        badge: "bg-rose-50 text-rose-600",
      }
    case "warning":
      return {
        bg: "bg-amber-100",
        fill: "bg-amber-400",
        text: "text-amber-600",
        badge: "bg-amber-50 text-amber-600",
      }
    case "healthy":
      return {
        bg: "bg-emerald-100",
        fill: "bg-emerald-400",
        text: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-600",
      }
  }
}

export function PMComponentRow({ name, daysRemaining, totalDays, onReset }: PMComponentRowProps) {
  const status = getHealthStatus(daysRemaining, totalDays)
  const percentage = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100))
  const styles = getStatusStyles(status)

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      {/* Component Name */}
      <span className="text-sm font-medium text-foreground min-w-[90px] truncate">
        {name}
      </span>

      {/* Progress Bar */}
      <div className={cn("flex-1 h-2 rounded-full overflow-hidden", styles.bg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", styles.fill)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Days Badge */}
      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full min-w-[60px] text-center", styles.badge)}>
        {daysRemaining}d left
      </span>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
        title={`Reset maintenance for ${name}`}
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Reset {name} maintenance</span>
      </Button>
    </div>
  )
}
