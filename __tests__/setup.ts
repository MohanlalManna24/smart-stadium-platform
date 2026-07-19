// Test utilities and helpers
export const createMockVenueSnapshot = (overrides = {}) => ({
  venue: 'MetLife Stadium',
  zones: [
    {
      name: 'Gate A',
      occupancyPct: 45,
      waitMin: 10,
      status: 'moderate' as const,
      accessible: true,
    },
  ],
  incidents: [],
  sustainMetrics: {
    carbonPerAttendee: 12,
    wastePercentRecycled: 78,
    energyPercentRenewable: 55,
  },
  ...overrides,
})

export const createMockMessage = (text: string) => ({
  id: Math.random().toString(36),
  role: 'user' as const,
  parts: [
    {
      type: 'text' as const,
      text,
    },
  ],
})

export const createMockZone = (overrides = {}) => ({
  id: 'zone-1',
  name: 'Gate A',
  type: 'gate' as const,
  location: 'North Entrance',
  capacity: 500,
  occupancyPct: 45,
  waitMin: 10,
  trend: 'rising' as const,
  accessible: true,
  ...overrides,
})

export const createMockIncident = (overrides = {}) => ({
  id: 'inc-1',
  type: 'crowd' as const,
  severity: 'medium' as const,
  location: 'North Concourse',
  description: 'High congestion',
  time: new Date().toISOString(),
  resolved: false,
  ...overrides,
})

export const createMockTransportOption = (overrides = {}) => ({
  id: 'transit-1',
  name: 'NJ Transit Bus',
  mode: 'bus' as const,
  status: 'good' as const,
  loadPct: 65,
  detail: 'Direct to stadium',
  etaMin: 15,
  ...overrides,
})
