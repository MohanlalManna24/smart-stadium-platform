// Test utilities and helpers
export const createMockVenueSnapshot = (overrides = {}) => ({
  venue: 'MetLife Stadium',
  city: 'East Rutherford, NJ',
  match: 'Argentina vs Brazil',
  kickoff: '20:00',
  attendance: 79240,
  capacity: 82500,
  weather: 'Clear, 24°C',
  zones: [
    {
      name: 'Gate A',
      type: 'gate' as const,
      occupancyPct: 45,
      waitMin: 10,
      status: 'moderate' as const,
      trend: 'stable' as const,
      accessible: true,
    },
  ],
  transport: [],
  incidents: [],
  sustainability: {
    energyKwh: 48200,
    renewablePct: 63,
    waterLitersK: 910,
    wasteDivertedPct: 71,
    carbonTonnes: 18.4,
  },
  staff: [],
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
  status: 'active' as const,
  zoneId: 'zone-1',
  zoneName: 'North Concourse',
  description: 'High congestion',
  reportedAt: new Date().toISOString(),
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
