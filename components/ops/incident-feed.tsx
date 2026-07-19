"use client"

import {
  Activity,
  HeartPulse,
  Shield,
  Users,
  Wrench,
  CloudRain,
  Baby,
  Check,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { INCIDENT_LABEL, SEVERITY_META, timeAgo } from "@/lib/format"
import type { Incident, IncidentType } from "@/lib/types"

const ICONS: Record<IncidentType, typeof Activity> = {
  medical: HeartPulse,
  crowd: Users,
  security: Shield,
  facility: Wrench,
  weather: CloudRain,
  "lost-child": Baby,
}

const STATUS_LABEL: Record<Incident["status"], string> = {
  active: "Active",
  dispatched: "Dispatched",
  monitoring: "Monitoring",
  resolved: "Resolved",
}

export function IncidentFeed({
  incidents,
  onDispatch,
  onResolve,
}: {
  incidents: Incident[]
  onDispatch: (id: string) => void
  onResolve: (id: string) => void
}) {
  const sorted = [...incidents].sort((a, b) => {
    const rank = { active: 0, dispatched: 1, monitoring: 2, resolved: 3 }
    return rank[a.status] - rank[b.status]
  })
  const open = incidents.filter((i) => i.status !== "resolved").length

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          Incident Feed
        </CardTitle>
        <CardDescription>{open} open of {incidents.length} reported this session</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5 overflow-y-auto">
        {sorted.map((incident) => {
          const Icon = ICONS[incident.type]
          const sev = SEVERITY_META[incident.severity]
          const resolved = incident.status === "resolved"
          return (
            <div
              key={incident.id}
              className={cn(
                "rounded-lg border p-3 transition-opacity",
                resolved && "opacity-55",
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md", sev.bg)}>
                  <Icon className={cn("size-4", sev.text)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{INCIDENT_LABEL[incident.type]}</span>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase", sev.bg, sev.text)}>
                      {sev.label}
                    </span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(incident.reportedAt)}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{incident.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {incident.zoneName} · {STATUS_LABEL[incident.status]}
                    </span>
                    {!resolved && (
                      <div className="ml-auto flex gap-1.5">
                        {incident.status === "active" && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => onDispatch(incident.id)}>
                            Dispatch
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onResolve(incident.id)}>
                          <Check className="size-3.5" />
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
