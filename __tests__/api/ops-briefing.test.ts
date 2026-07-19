import { opsBriefingRequestSchema } from "@/lib/api-schemas"
import { buildSnapshot, getVenue } from "@/lib/stadium-data"

describe("Ops briefing validation", () => {
  it("accepts a full venue snapshot", () => {
    const venue = getVenue("metlife")
    const snapshot = buildSnapshot(venue)

    const parsed = opsBriefingRequestSchema.parse({ snapshot })

    expect(parsed.snapshot.venue).toBe("MetLife Stadium")
    expect(parsed.snapshot.zones).toHaveLength(venue.zones.length)
    expect(parsed.snapshot.transport.length).toBeGreaterThan(0)
  })

  it("rejects malformed snapshot payloads", () => {
    expect(() => opsBriefingRequestSchema.parse({ snapshot: { venue: "Stadium" } })).toThrow()
  })
})