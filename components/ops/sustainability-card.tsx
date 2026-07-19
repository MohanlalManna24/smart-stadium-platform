"use client"

import { Leaf, Zap, Droplets, Recycle, Factory } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Sustainability } from "@/lib/types"

function Row({
  icon: Icon,
  label,
  value,
  pct,
  good,
}: {
  icon: typeof Zap
  label: string
  value: string
  pct?: number
  good?: boolean
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
        <span className="ml-auto font-mono text-sm font-semibold tabular-nums">{value}</span>
      </div>
      {pct !== undefined && (
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", good ? "bg-chart-1" : "bg-accent")}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function SustainabilityCard({ data }: { data: Sustainability }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="size-4 text-chart-1" />
          Sustainability
        </CardTitle>
        <CardDescription>Matchday resource footprint</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Row icon={Zap} label="Renewable energy" value={`${data.renewablePct}%`} pct={data.renewablePct} good />
        <Row icon={Recycle} label="Waste diverted" value={`${data.wasteDivertedPct}%`} pct={data.wasteDivertedPct} good />
        <Row icon={Droplets} label="Water use" value={`${data.waterLitersK}k L`} />
        <Row icon={Zap} label="Energy draw" value={`${(data.energyKwh / 1000).toFixed(1)}k kWh`} />
        <Row icon={Factory} label="Carbon (est.)" value={`${data.carbonTonnes}t CO₂`} />
      </CardContent>
    </Card>
  )
}
