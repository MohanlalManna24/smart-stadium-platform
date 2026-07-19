export type ZoneType =
  | "gate"
  | "concourse"
  | "concession"
  | "restroom"
  | "transit"
  | "medical"
  | "seating"

export type ZoneStatus = "clear" | "moderate" | "busy" | "critical"
export type Trend = "rising" | "falling" | "stable"

export interface Zone {
  id: string
  name: string
  type: ZoneType
  /** Human-readable location, e.g. "North Concourse, Level 2" */
  location: string
  /** Maximum safe capacity of the zone (people). */
  capacity: number
  /** Current occupancy as a percentage of capacity (0-100). */
  occupancyPct: number
  /** Average queue / wait time in minutes. */
  waitMin: number
  trend: Trend
  /** Whether this zone offers step-free / accessible access. */
  accessible: boolean
}

export type TransportStatus = "good" | "moderate" | "delayed" | "disrupted"

export interface TransportOption {
  id: string
  name: string
  mode: "rail" | "bus" | "rideshare" | "parking" | "pedestrian"
  status: TransportStatus
  /** Load as a percentage of capacity (0-100). */
  loadPct: number
  detail: string
  etaMin: number
}

export type IncidentType =
  | "medical"
  | "crowd"
  | "security"
  | "facility"
  | "weather"
  | "lost-child"
export type IncidentSeverity = "low" | "medium" | "high"
export type IncidentStatus = "active" | "dispatched" | "monitoring" | "resolved"

export interface Incident {
  id: string
  type: IncidentType
  severity: IncidentSeverity
  status: IncidentStatus
  zoneId: string
  zoneName: string
  description: string
  /** ISO timestamp when the incident was reported. */
  reportedAt: string
}

export interface Sustainability {
  energyKwh: number
  renewablePct: number
  waterLitersK: number
  wasteDivertedPct: number
  carbonTonnes: number
}

export interface StaffTeam {
  id: string
  name: string
  deployed: number
  available: number
  zoneId: string
}

export interface MatchInfo {
  homeTeam: string
  homeCode: string
  awayTeam: string
  awayCode: string
  stage: string
  kickoff: string
  group: string
}

export interface Venue {
  id: string
  name: string
  city: string
  country: string
  countryFlag: string
  capacity: number
  /** Current total attendance. */
  attendance: number
  weather: string
  temperatureC: number
  match: MatchInfo
  zones: Zone[]
  transport: TransportOption[]
  sustainability: Sustainability
  staff: StaffTeam[]
  incidents: Incident[]
}

/** Compact snapshot sent to the AI so it can reason over live conditions. */
export interface VenueSnapshot {
  venue: string
  city: string
  match: string
  kickoff: string
  attendance: number
  capacity: number
  weather: string
  zones: {
    name: string
    type: ZoneType
    status: ZoneStatus
    occupancyPct: number
    waitMin: number
    trend: Trend
    accessible: boolean
  }[]
  transport: { name: string; status: TransportStatus; loadPct: number; etaMin: number }[]
  incidents: {
    type: IncidentType
    severity: IncidentSeverity
    status: IncidentStatus
    zone: string
    description: string
  }[]
  sustainability: Sustainability
  staff: { name: string; deployed: number; available: number }[]
}
