"use client"

import { AlertTriangle, Gauge, Timer, TrendingUp, Users, UserCog } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LiveMetrics } from "@/lib/use-live-data"

function pressureMeta(p: number) {
  if (p >= 70) return { label: "Severe", color: "text-destructive", bar: "bg-destructive" }
  if (p >= 45) return { label: "High", color: "text-accent", bar: "bg-accent" }
  if (p >= 22) return { label: "Elevated", color: "text-chart-3", bar: "bg-chart-3" }
  return { label: "Nominal", color: "text-chart-1", bar: "bg-chart-1" }
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: typeof Users
  label: string
  value: string
  hint?: string
  tone?: "default" | "warn" | "bad" | "good"
}) {
  const toneClass = {
    default: "text-foreground",
    warn: "text-accent",
    bad: "text-destructive",
    good: "text-chart-1",
  }[tone]
  return (
    <Card className="gap-0 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={cn("mt-2 font-mono text-2xl font-semibold tabular-nums", toneClass)}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  )
}

export function OpsMetrics({ metrics }: { metrics: LiveMetrics }) {
  const p = pressureMeta(metrics.operationalPressure)
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      <Card className="col-span-2 gap-0 p-4 xl:col-span-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Gauge className="size-4" />
          <span className="text-xs font-medium">Operational Pressure</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={cn("font-mono text-2xl font-semibold tabular-nums", p.color)}>
            {metrics.operationalPressure}
          </span>
          <span className={cn("text-xs font-semibold", p.color)}>{p.label}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all duration-700", p.bar)}
            style={{ width: `${metrics.operationalPressure}%` }}
          />
        </div>
      </Card>
      <Metric
        icon={Users}
        label="Attendance"
        value={`${metrics.attendancePct}%`}
        hint="of capacity"
      />
      <Metric
        icon={AlertTriangle}
        label="Active Incidents"
        value={String(metrics.activeIncidents)}
        hint="open + dispatched"
        tone={metrics.activeIncidents > 2 ? "bad" : metrics.activeIncidents > 0 ? "warn" : "good"}
      />
      <Metric
        icon={TrendingUp}
        label="Critical Zones"
        value={String(metrics.criticalZones)}
        hint={`${metrics.busyZones} busy`}
        tone={metrics.criticalZones > 0 ? "bad" : metrics.busyZones > 1 ? "warn" : "good"}
      />
      <Metric
        icon={Timer}
        label="Avg Gate Wait"
        value={`${metrics.avgGateWait}m`}
        hint="entry queues"
        tone={metrics.avgGateWait > 20 ? "bad" : metrics.avgGateWait > 12 ? "warn" : "good"}
      />
      <Metric
        icon={UserCog}
        label="Staff Available"
        value={String(metrics.availableStaff)}
        hint={`${metrics.deployedStaff} deployed`}
      />
    </div>
  )
}
