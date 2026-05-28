"use client"

import { Box, AlertTriangle, AlertCircle, Bell } from "lucide-react"

interface MetricsData {
  totalEquipment: number
  criticalComponents: number
  warningComponents: number
  nextEmailReminder: string
}

interface MetricsPanelProps {
  metrics: MetricsData
}

function MetricCard({
  icon: Icon,
  label,
  value,
  variant = "default",
}: {
  icon: React.ElementType
  label: string
  value: string | number
  variant?: "default" | "warning" | "critical" | "accent"
}) {
  const variantStyles = {
    default: {
      bg: "bg-primary/8",
      icon: "text-primary",
      value: "text-foreground",
    },
    warning: {
      bg: "bg-amber-50",
      icon: "text-amber-500",
      value: "text-amber-600",
    },
    critical: {
      bg: "bg-rose-50",
      icon: "text-rose-500",
      value: "text-rose-600",
    },
    accent: {
      bg: "bg-sky-50",
      icon: "text-sky-500",
      value: "text-sky-600",
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl ${styles.bg}`}>
          <Icon className={`h-5 w-5 ${styles.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className={`text-2xl font-semibold ${styles.value}`}>{value}</p>
        </div>
      </div>
    </div>
  )
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={Box}
        label="Total Equipment"
        value={metrics.totalEquipment}
        variant="default"
      />
      <MetricCard
        icon={AlertCircle}
        label="Needs Attention"
        value={metrics.criticalComponents}
        variant="critical"
      />
      <MetricCard
        icon={AlertTriangle}
        label="Upcoming"
        value={metrics.warningComponents}
        variant="warning"
      />
      <MetricCard
        icon={Bell}
        label="Next Reminder"
        value={metrics.nextEmailReminder}
        variant="accent"
      />
    </div>
  )
}
