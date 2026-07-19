"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Venue, ZoneType } from "@/lib/types"
import { zoneStatus } from "@/lib/stadium-data"
import { ZONE_STATUS_META } from "@/lib/format"
import { cn } from "@/lib/utils"
import {
  Accessibility,
  Bus,
  DoorOpen,
  Cross,
  Toilet,
  UtensilsCrossed,
  Wifi,
  Users,
} from "lucide-react"

const iconFor: Record<ZoneType, typeof Wifi> = {
  gate: DoorOpen,
  concession: UtensilsCrossed,
  restroom: Toilet,
  transit: Bus,
  medical: Cross,
  concourse: Users,
  seating: Users,
}

export function ServicesGrid({ venue }: { venue: Venue }) {
  // Show the fan-relevant, queue-bearing zones first, sorted by wait time.
  const zones = venue.zones
    .filter((z) => z.type !== "concourse" && z.type !== "seating")
    .sort((a, b) => b.waitMin - a.waitMin)

  return (
    <section aria-labelledby="services-heading" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id="services-heading" className="text-sm font-semibold">
          Live wait times
        </h2>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wifi className="size-3.5" aria-hidden="true" />
          Free stadium Wi-Fi
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {zones.map((zone) => {
          const Icon = iconFor[zone.type] ?? DoorOpen
          const status = zoneStatus(zone.occupancyPct)
          const meta = ZONE_STATUS_META[status]
          return (
            <Card key={zone.id} className="gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-md",
                      meta.bg,
                    )}
                  >
                    <Icon className={cn("size-4.5", meta.text)} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium leading-tight">
                      {zone.name}
                      {zone.accessible && (
                        <Accessibility
                          className="size-3.5 text-primary"
                          aria-label="Accessible"
                        />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{zone.location}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("shrink-0 border-transparent", meta.bg, meta.text)}
                >
                  {meta.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3">
                <Progress value={zone.occupancyPct} className="h-1.5" />
                <span className="shrink-0 text-xs font-semibold tabular-nums">
                  {zone.waitMin > 0 ? `${zone.waitMin} min` : "No wait"}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
