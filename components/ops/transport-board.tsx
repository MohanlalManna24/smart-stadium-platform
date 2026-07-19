"use client"

import { Bus, Car, ParkingSquare, TramFront, Footprints } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TRANSPORT_STATUS_META } from "@/lib/format"
import type { TransportOption } from "@/lib/types"

const MODE_ICON = {
  rail: TramFront,
  bus: Bus,
  rideshare: Car,
  parking: ParkingSquare,
  pedestrian: Footprints,
}

export function TransportBoard({ transport }: { transport: TransportOption[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Transport & Egress</CardTitle>
        <CardDescription>Inbound and outbound capacity by mode</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {transport.map((t) => {
          const Icon = MODE_ICON[t.mode]
          const meta = TRANSPORT_STATUS_META[t.status]
          return (
            <div key={t.id} className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{t.name}</span>
                  <span className={cn("ml-auto flex items-center gap-1 text-xs font-medium", meta.text)}>
                    <span className={cn("size-1.5 rounded-full", meta.dot)} />
                    {meta.label}
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", meta.dot)}
                    style={{ width: `${Math.min(100, t.loadPct)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t.detail}
                  {t.etaMin > 0 && ` · ~${t.etaMin} min`}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
