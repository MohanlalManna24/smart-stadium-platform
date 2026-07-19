import '@testing-library/jest-dom'
import { buildSnapshot, getVenue, zoneStatus } from '@/lib/stadium-data'

describe('App Structure Tests', () => {
  it('builds a compact snapshot from the venue model', () => {
    const venue = getVenue('metlife')
    const snapshot = buildSnapshot(venue)

    expect(snapshot.venue).toBe(venue.name)
    expect(snapshot.zones).toHaveLength(venue.zones.length)
    expect(snapshot.transport).toHaveLength(venue.transport.length)
    expect(snapshot.zones.some((zone) => zone.accessible)).toBe(true)
  })

  it('maps zone pressure thresholds consistently', () => {
    expect(zoneStatus(40)).toBe('clear')
    expect(zoneStatus(60)).toBe('moderate')
    expect(zoneStatus(80)).toBe('busy')
    expect(zoneStatus(95)).toBe('critical')
  })
})
