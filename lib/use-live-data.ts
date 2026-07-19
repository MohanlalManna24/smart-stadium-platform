"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Trend, Venue, Zone } from "./types"
import { getVenue, zoneStatus } from "./stadium-data"

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n))
}

function nextTrend(current: Trend, delta: number): Trend {
  if (delta > 1.2) return "rising"
  if (delta < -1.2) return "falling"
  return current
}

/** Deterministic-ish jitter that nudges occupancy toward its own pressure. */
function jitterZone(zone: Zone): Zone {
  // Busier zones tend to keep rising slightly; quiet zones drift down.
  const pressure = (zone.occupancyPct - 60) / 40 // -1.5 .. 1
  const delta = (Math.random() - 0.5) * 6 + pressure * 1.4
  const occupancyPct = clamp(zone.occupancyPct + delta)
  const waitBase = zone.type === "gate" || zone.type === "concession" ? 0.4 : 0.15
  const waitMin = Math.max(0, Math.round(zone.waitMin + delta * waitBase))
  return {
    ...zone,
    occupancyPct,
    waitMin,
    trend: nextTrend(zone.trend, delta),
  }
}

export interface LiveMetrics {
  attendancePct: number
  criticalZones: number
  busyZones: number
  avgGateWait: number
  activeIncidents: number
  availableStaff: number
  deployedStaff: number
  renewablePct: number
  wasteDivertedPct: number
  /** 0-100 composite operational pressure score. */
  operationalPressure: number
}

export function computeMetrics(venue: Venue): LiveMetrics {
  const gates = venue.zones.filter((z) => z.type === "gate")
  const avgGateWait = gates.length
    ? Math.round(gates.reduce((s, z) => s + z.waitMin, 0) / gates.length)
    : 0
  const criticalZones = venue.zones.filter((z) => zoneStatus(z.occupancyPct) === "critical").length
  const busyZones = venue.zones.filter((z) => zoneStatus(z.occupancyPct) === "busy").length
  const activeIncidents = venue.incidents.filter(
    (i) => i.status === "active" || i.status === "dispatched",
  ).length
  const availableStaff = venue.staff.reduce((s, t) => s + t.available, 0)
  const deployedStaff = venue.staff.reduce((s, t) => s + t.deployed, 0)
  const attendancePct = Math.round((venue.attendance / venue.capacity) * 100)

  const highSeverity = venue.incidents.filter(
    (i) => i.severity === "high" && (i.status === "active" || i.status === "dispatched"),
  ).length
  const operationalPressure = clamp(
    Math.round(
      criticalZones * 16 +
        busyZones * 7 +
        activeIncidents * 6 +
        highSeverity * 10 +
        Math.max(0, avgGateWait - 10) * 1.5,
    ),
  )

  return {
    attendancePct,
    criticalZones,
    busyZones,
    avgGateWait,
    activeIncidents,
    availableStaff,
    deployedStaff,
    renewablePct: venue.sustainability.renewablePct,
    wasteDivertedPct: venue.sustainability.wasteDivertedPct,
    operationalPressure,
  }
}

/**
 * Simulates a live telemetry feed for the selected venue.
 * Occupancy, wait times and transport load are updated on an interval to
 * emulate the real-time signals a stadium control room would ingest.
 */
export function useLiveData(venueId: string, intervalMs = 4000) {
  const [venue, setVenue] = useState<Venue>(() => structuredClone(getVenue(venueId)))
  const [lastUpdated, setLastUpdated] = useState<number>(() => Date.now())
  const venueRef = useRef(venue)
  venueRef.current = venue

  // Reset when the venue changes.
  useEffect(() => {
    setVenue(structuredClone(getVenue(venueId)))
    setLastUpdated(Date.now())
  }, [venueId])

  useEffect(() => {
    const timer = setInterval(() => {
      setVenue((prev) => {
        const zones = prev.zones.map(jitterZone)
        const transport = prev.transport.map((t) => {
          const delta = (Math.random() - 0.5) * 7
          const loadPct = clamp(t.loadPct + delta)
          let status = t.status
          if (loadPct >= 90) status = "disrupted"
          else if (loadPct >= 78) status = "delayed"
          else if (loadPct >= 60) status = "moderate"
          else status = "good"
          return { ...t, loadPct, status }
        })
        const attendance = Math.min(
          prev.capacity,
          prev.attendance + Math.round((Math.random() - 0.3) * 40),
        )
        return { ...prev, zones, transport, attendance }
      })
      setLastUpdated(Date.now())
    }, intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  const metrics = useMemo(() => computeMetrics(venue), [venue])

  const resolveIncident = useCallback((incidentId: string) => {
    setVenue((prev) => ({
      ...prev,
      incidents: prev.incidents.map((i) =>
        i.id === incidentId ? { ...i, status: "resolved" as const } : i,
      ),
    }))
  }, [])

  const dispatchStaff = useCallback((incidentId: string) => {
    setVenue((prev) => ({
      ...prev,
      incidents: prev.incidents.map((i) =>
        i.id === incidentId && i.status === "active"
          ? { ...i, status: "dispatched" as const }
          : i,
      ),
    }))
  }, [])

  return { venue, metrics, lastUpdated, resolveIncident, dispatchStaff }
}
