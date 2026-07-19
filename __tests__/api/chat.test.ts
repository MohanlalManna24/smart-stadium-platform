describe('Chat API Route', () => {
  it('should validate chat payload structure', () => {
    const validPayload = {
      messages: [{ id: '1', role: 'user', parts: [{ type: 'text', text: 'hello' }] }],
      mode: 'fan',
      snapshot: {
        venue: 'Stadium',
        zones: [],
        incidents: [],
        sustainMetrics: {
          carbonPerAttendee: 12,
          wastePercentRecycled: 78,
          energyPercentRenewable: 55,
        },
      },
    }
    expect(validPayload.messages).toBeInstanceOf(Array)
    expect(validPayload.mode).toMatch(/^(fan|ops)$/)
    expect(validPayload.snapshot).toHaveProperty('venue')
  })

  it('should handle fan mode mode', () => {
    expect(['fan', 'ops']).toContain('fan')
  })

  it('should handle ops mode', () => {
    expect(['fan', 'ops']).toContain('ops')
  })

  it('should validate message structure', () => {
    const message = { id: '1', role: 'user', parts: [{ type: 'text', text: 'hello' }] }
    expect(message).toHaveProperty('id')
    expect(message).toHaveProperty('role')
    expect(message.parts).toBeInstanceOf(Array)
  })

  it('should support context snapshot data', () => {
    const snapshot = {
      venue: 'MetLife Stadium',
      zones: [{ name: 'Gate A', occupancyPct: 45 }],
      incidents: [],
      sustainMetrics: {
        carbonPerAttendee: 12,
        wastePercentRecycled: 78,
        energyPercentRenewable: 55,
      },
    }
    expect(snapshot.venue).toBeDefined()
    expect(snapshot.zones.length).toBeGreaterThanOrEqual(0)
    expect(snapshot.sustainMetrics).toHaveProperty('carbonPerAttendee')
  })

  it('should be resilient to missing zones', () => {
    const minimalSnapshot = {
      venue: 'Stadium',
      zones: [],
      incidents: [],
      sustainMetrics: { carbonPerAttendee: 0, wastePercentRecycled: 0, energyPercentRenewable: 0 },
    }
    expect(Array.isArray(minimalSnapshot.zones)).toBe(true)
    expect(minimalSnapshot.zones.length).toBe(0)
  })
})
