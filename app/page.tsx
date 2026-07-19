"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { FanExperience } from "@/components/fan/fan-experience"
import { OpsDashboard } from "@/components/ops/ops-dashboard"
import { useLiveData } from "@/lib/use-live-data"

export default function Page() {
  const [mode, setMode] = useState<"fan" | "ops">("fan")
  const [venueId, setVenueId] = useState("metlife")
  const { venue, metrics, lastUpdated, resolveIncident, dispatchStaff } = useLiveData(venueId)

  return (
    <div className="min-h-dvh bg-background">
      <AppHeader
        mode={mode}
        onModeChange={(v) => setMode(v as "fan" | "ops")}
        venueId={venueId}
        onVenueChange={setVenueId}
        lastUpdated={lastUpdated}
      />

      <main>
        {mode === "fan" ? (
          <FanExperience venue={venue} />
        ) : (
          <div className="mx-auto max-w-6xl px-4 py-6">
            <OpsDashboard
              venue={venue}
              metrics={metrics}
              onDispatch={dispatchStaff}
              onResolve={resolveIncident}
            />
          </div>
        )}
      </main>

      <footer className="border-t py-6">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground text-pretty">
          PitchOps 26 — GenAI-powered smart stadium operations &amp; fan experience. Demo data for
          FIFA World Cup 2026 venues. AI responses are grounded in live venue telemetry.
        </p>
      </footer>
    </div>
  )
}
