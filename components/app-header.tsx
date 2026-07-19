"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VENUES } from "@/lib/stadium-data"
import { LayoutDashboard, Users } from "lucide-react"

export function AppHeader({
  mode,
  onModeChange,
  venueId,
  onVenueChange,
  lastUpdated,
}: {
  mode: string
  onModeChange: (v: string) => void
  venueId: string
  onVenueChange: (v: string) => void
  lastUpdated: number
}) {
  // Only render the live clock after mount to avoid an SSR/client time mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-mono text-base font-bold" aria-hidden="true">
              P
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">
              PitchOps<span className="text-primary"> 26</span>
            </p>
            <p className="text-[11px] text-muted-foreground">Smart Stadium Intelligence</p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-chart-1" />
            Live
            {mounted && (
              <span className="tabular-nums">
                {" · "}
                {new Date(lastUpdated).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
          </span>

          <Select value={venueId} onValueChange={(v) => v && onVenueChange(v)}>
            <SelectTrigger className="w-[190px]" aria-label="Select venue">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VENUES.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs value={mode} onValueChange={onModeChange}>
            <TabsList>
              <TabsTrigger value="fan" className="gap-1.5">
                <Users className="size-4" />
                <span className="hidden sm:inline">Fan</span>
              </TabsTrigger>
              <TabsTrigger value="ops" className="gap-1.5">
                <LayoutDashboard className="size-4" />
                <span className="hidden sm:inline">Operations</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  )
}
