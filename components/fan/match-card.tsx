"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Venue } from "@/lib/types"

export function MatchCard({ venue }: { venue: Venue }) {
  const fillPct = Math.round((venue.attendance / venue.capacity) * 100)
  const { match } = venue

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-44 w-full">
        <Image
          src="/stadium-hero.png"
          alt={`${venue.name} filled with fans ahead of kickoff`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 640px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="text-background">
            <p className="text-xs font-medium uppercase tracking-wide opacity-90">{match.stage}</p>
            <h2 className="text-balance text-xl font-bold leading-tight">
              {match.homeTeam} vs {match.awayTeam}
            </h2>
            <p className="mt-0.5 text-xs opacity-90">
              {venue.name} • {venue.city}
            </p>
          </div>
          <Badge className="shrink-0 bg-accent text-accent-foreground">{match.group}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border">
        <Stat label="Kickoff" value={match.kickoff} />
        <Stat label="Weather" value={`${venue.weather}, ${venue.temperatureC}°C`} />
        <Stat label="Stadium fill" value={`${fillPct}%`} />
      </div>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-pretty text-sm font-semibold">{value}</p>
    </div>
  )
}
