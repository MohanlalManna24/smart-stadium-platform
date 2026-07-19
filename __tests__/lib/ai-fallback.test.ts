import { buildFallbackAnswer, buildFallbackBriefing } from "@/lib/ai-fallback"
import { buildSnapshot, getVenue } from "@/lib/stadium-data"

describe("AI fallback engine", () => {
  const venue = getVenue("metlife")
  const snapshot = buildSnapshot(venue)

  it("returns grounded fan guidance for gates", () => {
    const answer = buildFallbackAnswer("Which gate has the shortest line?", "fan", snapshot)

    expect(answer).toContain("gate")
    expect(answer).toContain("wait")
    expect(answer).toContain("Gate")
  })

  it("returns accessibility-aware guidance", () => {
    const answer = buildFallbackAnswer("I need an accessible route", "fan", snapshot)

    expect(answer).toContain("accessible")
    expect(answer).toContain("step-free")
  })

  it("produces a structured ops briefing", () => {
    const briefing = buildFallbackBriefing(snapshot)

    expect(briefing.source).toBe("fallback")
    expect(briefing.priorities.length).toBeGreaterThanOrEqual(3)
    expect(briefing.headline.length).toBeGreaterThan(0)
  })
})