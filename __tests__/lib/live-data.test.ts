import { computeMetrics } from "@/lib/use-live-data"
import { getVenue } from "@/lib/stadium-data"

describe("Live data metrics", () => {
  it("derives operational metrics from venue state", () => {
    const venue = getVenue("metlife")
    const metrics = computeMetrics(venue)

    expect(metrics.attendancePct).toBe(Math.round((venue.attendance / venue.capacity) * 100))
    expect(metrics.activeIncidents).toBeGreaterThan(0)
    expect(metrics.avgGateWait).toBeGreaterThan(0)
    expect(metrics.operationalPressure).toBeGreaterThanOrEqual(0)
  })
})