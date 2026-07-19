"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Sparkles,
  RefreshCw,
  Users,
  TramFront,
  Accessibility,
  ShieldAlert,
  Leaf,
  Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VenueSnapshot } from "@/lib/types"

interface Priority {
  title: string
  detail: string
  severity: "low" | "medium" | "high"
  category: "crowd" | "transport" | "accessibility" | "safety" | "sustainability" | "guest-experience"
}

interface Briefing {
  headline: string
  overallRisk: "low" | "elevated" | "high" | "severe"
  confidence: number
  priorities: Priority[]
  fanImpact: string
}

const RISK_META: Record<Briefing["overallRisk"], { label: string; cls: string }> = {
  low: { label: "Low risk", cls: "bg-chart-1/15 text-chart-1" },
  elevated: { label: "Elevated", cls: "bg-chart-3/15 text-chart-3" },
  high: { label: "High risk", cls: "bg-accent/20 text-accent-foreground" },
  severe: { label: "Severe", cls: "bg-destructive/15 text-destructive" },
}

const CAT_ICON = {
  crowd: Users,
  transport: TramFront,
  accessibility: Accessibility,
  safety: ShieldAlert,
  sustainability: Leaf,
  "guest-experience": Star,
}

const SEV_DOT = { low: "bg-chart-3", medium: "bg-accent", high: "bg-destructive" }

export function AiBriefing({ snapshot, venueId }: { snapshot: VenueSnapshot; venueId: string }) {
  const snapshotRef = useRef(snapshot)
  snapshotRef.current = snapshot
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const generate = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch("/api/ops-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot: snapshotRef.current }),
      })
      if (!res.ok) throw new Error("failed")
      setBriefing((await res.json()) as Briefing)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  // Regenerate whenever the venue changes.
  useEffect(() => {
    generate()
  }, [generate, venueId])

  return (
    <Card className="h-full border-primary/30 bg-primary/[0.04]">
      <CardHeader className="flex-row items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <div className="flex-1">
          <CardTitle>AI Operations Briefing</CardTitle>
          <CardDescription>Generated from live telemetry</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generate}
          disabled={loading}
          className="gap-1.5"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          {loading ? "Analyzing" : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && !briefing && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not generate the briefing. Try refreshing.
          </p>
        )}

        {briefing && (
          <>
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  RISK_META[briefing.overallRisk].cls,
                )}
              >
                {RISK_META[briefing.overallRisk].label}
              </span>
              <p className="text-sm font-medium leading-relaxed text-pretty">{briefing.headline}</p>
            </div>

            <ol className="space-y-2.5">
              {briefing.priorities.map((p, i) => {
                const Icon = CAT_ICON[p.category] ?? ShieldAlert
                return (
                  <li key={i} className="flex gap-3 rounded-lg border bg-card p-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted font-mono text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className={cn("size-1.5 rounded-full", SEV_DOT[p.severity])} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="size-3.5 text-primary" />
                        <span className="text-sm font-semibold">{p.title}</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{p.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ol>

            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-xs font-medium text-muted-foreground">Fan impact</p>
              <p className="mt-0.5 text-sm leading-relaxed">{briefing.fanImpact}</p>
            </div>

            <p className="text-right text-[11px] text-muted-foreground">
              Model confidence {briefing.confidence}%
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
