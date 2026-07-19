"use client"

import { ArrowDownRight, ArrowRight, ArrowUpRight, Accessibility } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ZONE_STATUS_META, ZONE_TYPE_LABEL } from "@/lib/format"
import { zoneStatus } from "@/lib/stadium-data"
import type { Trend, Zone } from "@/lib/types"

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "rising") return <ArrowUpRight className="size-3.5 text-destructive" />
  if (trend === "falling") return <ArrowDownRight className="size-3.5 text-chart-1" />
  return <ArrowRight className="size-3.5 text-muted-foreground" />
}

export function ZoneHeatmap({ zones }: { zones: Zone[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Crowd Density</CardTitle>
        <CardDescription>
          Real-time occupancy by zone. Colour indicates crowd status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {zones.map((zone) => {
            const status = zoneStatus(zone.occupancyPct)
            const meta = ZONE_STATUS_META[status]
            return (
              <div
                key={zone.id}
                className={cn(
                  "flex flex-col gap-2 rounded-lg p-3 ring-1 ring-inset transition-colors",
                  meta.bg,
                  meta.ring,
                )}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{zone.name}</p>
                    <p className="text-[11px] text-muted-foreground">{ZONE_TYPE_LABEL[zone.type]}</p>
                  </div>
                  {zone.accessible && (
                    <Accessibility className="size-3.5 shrink-0 text-chart-3" aria-label="Accessible" />
                  )}
                </div>
                <div className="flex items-end justify-between gap-1">
                  <span className={cn("font-mono text-lg font-semibold tabular-nums", meta.text)}>
                    {Math.round(zone.occupancyPct)}%
                  </span>
                  <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                    <TrendIcon trend={zone.trend} />
                    {zone.waitMin > 0 ? `${zone.waitMin}m wait` : "no wait"}
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-background/60">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", meta.dot)}
                    style={{ width: `${Math.min(100, zone.occupancyPct)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {(["clear", "moderate", "busy", "critical"] as const).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("size-2 rounded-full", ZONE_STATUS_META[s].dot)} />
              {ZONE_STATUS_META[s].label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
