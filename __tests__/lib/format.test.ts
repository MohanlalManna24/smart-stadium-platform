import { ZONE_STATUS_META, TRANSPORT_STATUS_META, SEVERITY_META, INCIDENT_LABEL, ZONE_TYPE_LABEL } from '@/lib/format'

describe('Format Metadata', () => {
  describe('ZONE_STATUS_META', () => {
    it('should define all zone statuses', () => {
      expect(ZONE_STATUS_META).toHaveProperty('clear')
      expect(ZONE_STATUS_META).toHaveProperty('moderate')
      expect(ZONE_STATUS_META).toHaveProperty('busy')
      expect(ZONE_STATUS_META).toHaveProperty('critical')
    })

    it('should have consistent structure for each status', () => {
      Object.values(ZONE_STATUS_META).forEach(meta => {
        expect(meta).toHaveProperty('label')
        expect(meta).toHaveProperty('dot')
        expect(meta).toHaveProperty('text')
        expect(meta).toHaveProperty('bg')
        expect(meta).toHaveProperty('ring')
        expect(typeof meta.label).toBe('string')
        expect(typeof meta.dot).toBe('string')
        expect(meta.dot).toMatch(/^bg-/)
      })
    })

    it('should use appropriate colors for severity', () => {
      expect(ZONE_STATUS_META.clear.text).toContain('chart-1')
      expect(ZONE_STATUS_META.critical.text).toContain('destructive')
    })
  })

  describe('TRANSPORT_STATUS_META', () => {
    it('should define all transport statuses', () => {
      expect(TRANSPORT_STATUS_META).toHaveProperty('good')
      expect(TRANSPORT_STATUS_META).toHaveProperty('moderate')
      expect(TRANSPORT_STATUS_META).toHaveProperty('delayed')
      expect(TRANSPORT_STATUS_META).toHaveProperty('disrupted')
    })
  })

  describe('SEVERITY_META', () => {
    it('should define all incident severity levels', () => {
      expect(SEVERITY_META).toHaveProperty('low')
      expect(SEVERITY_META).toHaveProperty('medium')
      expect(SEVERITY_META).toHaveProperty('high')
    })
  })

  describe('INCIDENT_LABEL', () => {
    it('should map all incident types to labels', () => {
      expect(INCIDENT_LABEL).toHaveProperty('medical')
      expect(INCIDENT_LABEL).toHaveProperty('crowd')
      expect(INCIDENT_LABEL).toHaveProperty('security')
      expect(INCIDENT_LABEL.medical).toBe('Medical')
      expect(INCIDENT_LABEL.crowd).toBe('Crowd')
    })
  })

  describe('ZONE_TYPE_LABEL', () => {
    it('should map all zone types to labels', () => {
      expect(ZONE_TYPE_LABEL).toHaveProperty('gate')
      expect(ZONE_TYPE_LABEL).toHaveProperty('concession')
      expect(ZONE_TYPE_LABEL).toHaveProperty('medical')
      expect(ZONE_TYPE_LABEL.gate).toBe('Gate')
    })
  })
})
