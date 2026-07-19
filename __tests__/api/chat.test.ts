import { chatRequestSchema } from "@/lib/api-schemas"

describe("Chat API validation", () => {
  const validPayload = {
    messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hello" }] }],
    mode: "fan",
    snapshot: {
      venue: "Stadium",
      city: "City",
      match: "Team A vs Team B",
      kickoff: "20:00",
      attendance: 1200,
      capacity: 2000,
      weather: "Clear",
      zones: [],
      transport: [],
      incidents: [],
      sustainability: {
        energyKwh: 12,
        renewablePct: 55,
        waterLitersK: 1,
        wasteDivertedPct: 78,
        carbonTonnes: 3,
      },
      staff: [],
    },
  }

  it("accepts a valid chat payload", () => {
    const parsed = chatRequestSchema.parse(validPayload)
    expect(parsed.mode).toBe("fan")
    expect(parsed.messages).toHaveLength(1)
    expect(parsed.snapshot?.venue).toBe("Stadium")
  })

  it("defaults mode to fan when omitted", () => {
    const parsed = chatRequestSchema.parse({ messages: validPayload.messages })
    expect(parsed.mode).toBe("fan")
  })

  it("rejects empty messages", () => {
    expect(() => chatRequestSchema.parse({ messages: [] })).toThrow()
  })

  it("rejects oversized chat payloads", () => {
    expect(
      () =>
        chatRequestSchema.parse({
          messages: Array.from({ length: 21 }, () => validPayload.messages[0]),
        }),
    ).toThrow()
  })
})
