"use client"

import { AssistantChat } from "@/components/assistant-chat"
import { OpsMetrics } from "./ops-metrics"
import { ZoneHeatmap } from "./zone-heatmap"
import { IncidentFeed } from "./incident-feed"
import { TransportBoard } from "./transport-board"
import { SustainabilityCard } from "./sustainability-card"
import { AiBriefing } from "./ai-briefing"
import { buildSnapshot } from "@/lib/stadium-data"
import type { LiveMetrics } from "@/lib/use-live-data"
import type { Venue } from "@/lib/types"

const OPS_SUGGESTIONS = [
  "What's my top priority right now?",
  "How should I relieve the busiest gate?",
  "Where can I reallocate staff?",
  "Summarize transport risk for egress.",
]

export function OpsDashboard({
  venue,
  metrics,
  onDispatch,
  onResolve,
}: {
  venue: Venue
  metrics: LiveMetrics
  onDispatch: (id: string) => void
  onResolve: (id: string) => void
}) {
  const snapshot = buildSnapshot(venue)

  return (
    <div className="dark rounded-2xl bg-background p-4 text-foreground ring-1 ring-border sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Control Room · Live
        </span>
        <p className="text-sm text-muted-foreground">
          {venue.name} — {venue.match.homeTeam} vs {venue.match.awayTeam}
        </p>
      </div>

      <div className="space-y-4">
        <OpsMetrics metrics={metrics} />

        <div className="grid gap-4 xl:grid-cols-3">
          <AiBriefing snapshot={snapshot} venueId={venue.id} />
          <ZoneHeatmap zones={venue.zones} />
          <div className="min-h-0 xl:max-h-[560px]">
            <IncidentFeed
              incidents={venue.incidents}
              onDispatch={onDispatch}
              onResolve={onResolve}
            />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <TransportBoard transport={venue.transport} />
          <SustainabilityCard data={venue.sustainability} />
          <AssistantChat
            mode="ops"
            snapshot={snapshot}
            title="Operations Copilot"
            subtitle="Real-time decision support"
            suggestions={OPS_SUGGESTIONS}
            className="h-[440px]"
          />
        </div>
      </div>
    </div>
  )
}
