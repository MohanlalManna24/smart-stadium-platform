import type { Venue, ZoneStatus, Zone, VenueSnapshot } from "./types"

export function zoneStatus(occupancyPct: number): ZoneStatus {
  if (occupancyPct >= 92) return "critical"
  if (occupancyPct >= 78) return "busy"
  if (occupancyPct >= 55) return "moderate"
  return "clear"
}

function isoMinutesAgo(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString()
}

export const VENUES: Venue[] = [
  {
    id: "metlife",
    name: "MetLife Stadium",
    city: "East Rutherford, NJ",
    country: "United States",
    countryFlag: "US",
    capacity: 82500,
    attendance: 79240,
    weather: "Clear",
    temperatureC: 24,
    match: {
      homeTeam: "Argentina",
      homeCode: "ARG",
      awayTeam: "Brazil",
      awayCode: "BRA",
      stage: "Semi-final",
      kickoff: "20:00",
      group: "Knockout",
    },
    zones: [
      { id: "gate-a", name: "Gate A", type: "gate", location: "West Plaza", capacity: 4200, occupancyPct: 88, waitMin: 18, trend: "rising", accessible: true },
      { id: "gate-b", name: "Gate B", type: "gate", location: "North Plaza", capacity: 4200, occupancyPct: 61, waitMin: 7, trend: "stable", accessible: true },
      { id: "gate-c", name: "Gate C", type: "gate", location: "East Plaza", capacity: 3800, occupancyPct: 94, waitMin: 26, trend: "rising", accessible: false },
      { id: "gate-d", name: "Gate D (Accessible)", type: "gate", location: "South Plaza", capacity: 2600, occupancyPct: 42, waitMin: 4, trend: "falling", accessible: true },
      { id: "conc-100", name: "Concourse 100", type: "concourse", location: "Lower Bowl", capacity: 9000, occupancyPct: 73, waitMin: 0, trend: "rising", accessible: true },
      { id: "conc-200", name: "Concourse 200", type: "concourse", location: "Club Level", capacity: 6000, occupancyPct: 58, waitMin: 0, trend: "stable", accessible: true },
      { id: "food-north", name: "North Food Court", type: "concession", location: "Concourse 100", capacity: 1200, occupancyPct: 91, waitMin: 22, trend: "rising", accessible: true },
      { id: "food-east", name: "East Grill", type: "concession", location: "Concourse 200", capacity: 800, occupancyPct: 64, waitMin: 11, trend: "stable", accessible: true },
      { id: "rest-nw", name: "NW Restrooms", type: "restroom", location: "Concourse 100", capacity: 300, occupancyPct: 82, waitMin: 9, trend: "rising", accessible: true },
      { id: "med-1", name: "Medical Bay 1", type: "medical", location: "Concourse 100", capacity: 40, occupancyPct: 35, waitMin: 3, trend: "stable", accessible: true },
      { id: "transit-rail", name: "Rail Concourse", type: "transit", location: "Frank Lautenberg Station", capacity: 5000, occupancyPct: 47, waitMin: 12, trend: "stable", accessible: true },
    ],
    transport: [
      { id: "njt", name: "NJ Transit Rail", mode: "rail", status: "moderate", loadPct: 68, detail: "Meadowlands line, trains every 10 min", etaMin: 12 },
      { id: "bus", name: "Coach Bus Loop", mode: "bus", status: "good", loadPct: 41, detail: "Port Authority express service", etaMin: 8 },
      { id: "rideshare", name: "Rideshare Zone", mode: "rideshare", status: "delayed", loadPct: 84, detail: "Lot G pickup, surge pricing active", etaMin: 22 },
      { id: "parking", name: "Parking Lots", mode: "parking", status: "moderate", loadPct: 76, detail: "Lots A-D, 24% spaces remaining", etaMin: 0 },
    ],
    sustainability: {
      energyKwh: 48200,
      renewablePct: 63,
      waterLitersK: 910,
      wasteDivertedPct: 71,
      carbonTonnes: 18.4,
    },
    staff: [
      { id: "s1", name: "Gate Team West", deployed: 24, available: 6, zoneId: "gate-a" },
      { id: "s2", name: "Gate Team East", deployed: 22, available: 3, zoneId: "gate-c" },
      { id: "s3", name: "Medical Response", deployed: 14, available: 8, zoneId: "med-1" },
      { id: "s4", name: "Wayfinding & Accessibility", deployed: 18, available: 10, zoneId: "gate-d" },
      { id: "s5", name: "Transit Marshals", deployed: 16, available: 5, zoneId: "transit-rail" },
    ],
    incidents: [
      { id: "i1", type: "crowd", severity: "high", status: "active", zoneId: "gate-c", zoneName: "Gate C", description: "Entry queue exceeding 25 min with rising density on East Plaza.", reportedAt: isoMinutesAgo(6) },
      { id: "i2", type: "medical", severity: "medium", status: "dispatched", zoneId: "conc-100", zoneName: "Concourse 100", description: "Fan reporting dizziness near Section 118, medic en route.", reportedAt: isoMinutesAgo(12) },
      { id: "i3", type: "facility", severity: "low", status: "monitoring", zoneId: "rest-nw", zoneName: "NW Restrooms", description: "Two fixtures out of service, cleaning crew notified.", reportedAt: isoMinutesAgo(28) },
    ],
  },
  {
    id: "sofi",
    name: "SoFi Stadium",
    city: "Inglewood, CA",
    country: "United States",
    countryFlag: "US",
    capacity: 70240,
    attendance: 68010,
    weather: "Sunny",
    temperatureC: 28,
    match: {
      homeTeam: "Mexico",
      homeCode: "MEX",
      awayTeam: "Germany",
      awayCode: "GER",
      stage: "Quarter-final",
      kickoff: "17:00",
      group: "Knockout",
    },
    zones: [
      { id: "gate-1", name: "Entry 1", type: "gate", location: "American Airlines Plaza", capacity: 3800, occupancyPct: 79, waitMin: 14, trend: "rising", accessible: true },
      { id: "gate-3", name: "Entry 3", type: "gate", location: "Southeast", capacity: 3400, occupancyPct: 55, waitMin: 6, trend: "stable", accessible: true },
      { id: "gate-5", name: "Entry 5 (Accessible)", type: "gate", location: "Northwest", capacity: 2400, occupancyPct: 38, waitMin: 3, trend: "falling", accessible: true },
      { id: "conc-main", name: "Main Concourse", type: "concourse", location: "Level 1", capacity: 8500, occupancyPct: 66, waitMin: 0, trend: "rising", accessible: true },
      { id: "food-plaza", name: "Plaza Cantina", type: "concession", location: "Main Concourse", capacity: 1000, occupancyPct: 87, waitMin: 19, trend: "rising", accessible: true },
      { id: "rest-se", name: "SE Restrooms", type: "restroom", location: "Level 1", capacity: 260, occupancyPct: 69, waitMin: 6, trend: "stable", accessible: true },
      { id: "med-2", name: "First Aid Center", type: "medical", location: "Main Concourse", capacity: 35, occupancyPct: 22, waitMin: 2, trend: "stable", accessible: true },
      { id: "transit-metro", name: "Metro K Line", type: "transit", location: "Downtown Inglewood", capacity: 4200, occupancyPct: 58, waitMin: 15, trend: "rising", accessible: true },
    ],
    transport: [
      { id: "metro", name: "Metro K Line", mode: "rail", status: "good", loadPct: 52, detail: "Downtown Inglewood, shuttle connection", etaMin: 15 },
      { id: "shuttle", name: "Event Shuttle", mode: "bus", status: "moderate", loadPct: 63, detail: "Free shuttle from Metro station", etaMin: 10 },
      { id: "rideshare-la", name: "Rideshare Zone", mode: "rideshare", status: "moderate", loadPct: 71, detail: "Lot L pickup", etaMin: 16 },
      { id: "parking-la", name: "Parking", mode: "parking", status: "good", loadPct: 58, detail: "40% spaces remaining", etaMin: 0 },
    ],
    sustainability: {
      energyKwh: 41800,
      renewablePct: 78,
      waterLitersK: 720,
      wasteDivertedPct: 82,
      carbonTonnes: 12.1,
    },
    staff: [
      { id: "ss1", name: "Gate Team North", deployed: 20, available: 8, zoneId: "gate-1" },
      { id: "ss2", name: "Medical Response", deployed: 12, available: 9, zoneId: "med-2" },
      { id: "ss3", name: "Accessibility Team", deployed: 14, available: 7, zoneId: "gate-5" },
      { id: "ss4", name: "Transit Marshals", deployed: 12, available: 6, zoneId: "transit-metro" },
    ],
    incidents: [
      { id: "si1", type: "weather", severity: "medium", status: "monitoring", zoneId: "gate-1", zoneName: "Entry 1", description: "High heat index, hydration stations being restocked near exposed entries.", reportedAt: isoMinutesAgo(9) },
      { id: "si2", type: "lost-child", severity: "medium", status: "dispatched", zoneId: "conc-main", zoneName: "Main Concourse", description: "Unaccompanied minor reported, guest services responding.", reportedAt: isoMinutesAgo(4) },
    ],
  },
  {
    id: "azteca",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    countryFlag: "MX",
    capacity: 83264,
    attendance: 81500,
    weather: "Partly cloudy",
    temperatureC: 21,
    match: {
      homeTeam: "Mexico",
      homeCode: "MEX",
      awayTeam: "France",
      awayCode: "FRA",
      stage: "Group Stage",
      kickoff: "19:00",
      group: "Group A",
    },
    zones: [
      { id: "az-gate-n", name: "Puerta Norte", type: "gate", location: "North", capacity: 4600, occupancyPct: 90, waitMin: 24, trend: "rising", accessible: true },
      { id: "az-gate-s", name: "Puerta Sur", type: "gate", location: "South", capacity: 4600, occupancyPct: 72, waitMin: 12, trend: "rising", accessible: true },
      { id: "az-gate-acc", name: "Puerta Accesible", type: "gate", location: "East", capacity: 2200, occupancyPct: 44, waitMin: 5, trend: "stable", accessible: true },
      { id: "az-conc", name: "Concourse Nivel 1", type: "concourse", location: "Level 1", capacity: 10000, occupancyPct: 80, waitMin: 0, trend: "rising", accessible: true },
      { id: "az-food", name: "Zona de Comida", type: "concession", location: "Nivel 1", capacity: 1400, occupancyPct: 93, waitMin: 27, trend: "rising", accessible: true },
      { id: "az-rest", name: "Sanitarios Norte", type: "restroom", location: "Nivel 1", capacity: 320, occupancyPct: 88, waitMin: 12, trend: "rising", accessible: true },
      { id: "az-med", name: "Servicio Médico", type: "medical", location: "Nivel 1", capacity: 45, occupancyPct: 40, waitMin: 4, trend: "stable", accessible: true },
      { id: "az-transit", name: "Metro Line 12", type: "transit", location: "Estadio Azteca", capacity: 6000, occupancyPct: 74, waitMin: 18, trend: "rising", accessible: false },
    ],
    transport: [
      { id: "metro-mx", name: "Tren Ligero", mode: "rail", status: "delayed", loadPct: 88, detail: "Estadio Azteca station, heavy load", etaMin: 20 },
      { id: "bus-mx", name: "Metrobús", mode: "bus", status: "moderate", loadPct: 69, detail: "Line 3 connection", etaMin: 12 },
      { id: "rideshare-mx", name: "Rideshare Zone", mode: "rideshare", status: "disrupted", loadPct: 92, detail: "Calzada de Tlalpan congestion", etaMin: 30 },
      { id: "parking-mx", name: "Estacionamiento", mode: "parking", status: "delayed", loadPct: 90, detail: "10% spaces remaining", etaMin: 0 },
    ],
    sustainability: {
      energyKwh: 52600,
      renewablePct: 44,
      waterLitersK: 1080,
      wasteDivertedPct: 58,
      carbonTonnes: 24.7,
    },
    staff: [
      { id: "az1", name: "Equipo Puerta Norte", deployed: 26, available: 4, zoneId: "az-gate-n" },
      { id: "az2", name: "Respuesta Médica", deployed: 16, available: 7, zoneId: "az-med" },
      { id: "az3", name: "Equipo Accesibilidad", deployed: 15, available: 9, zoneId: "az-gate-acc" },
      { id: "az4", name: "Marshals de Transporte", deployed: 18, available: 3, zoneId: "az-transit" },
    ],
    incidents: [
      { id: "az-i1", type: "crowd", severity: "high", status: "active", zoneId: "az-gate-n", zoneName: "Puerta Norte", description: "Aglomeración creciente en Puerta Norte, tiempos de espera > 24 min.", reportedAt: isoMinutesAgo(5) },
      { id: "az-i2", type: "facility", severity: "medium", status: "dispatched", zoneId: "az-food", zoneName: "Zona de Comida", description: "Falla de terminal de pago en dos puestos de comida.", reportedAt: isoMinutesAgo(15) },
      { id: "az-i3", type: "security", severity: "low", status: "monitoring", zoneId: "az-gate-s", zoneName: "Puerta Sur", description: "Verificación de boletos duplicados en curso.", reportedAt: isoMinutesAgo(22) },
    ],
  },
]

export function getVenue(id: string): Venue {
  return VENUES.find((v) => v.id === id) ?? VENUES[0]
}

/** Build a compact snapshot for the AI from a full venue object. */
export function buildSnapshot(venue: Venue): VenueSnapshot {
  return {
    venue: venue.name,
    city: venue.city,
    match: `${venue.match.homeTeam} vs ${venue.match.awayTeam} (${venue.match.stage})`,
    kickoff: venue.match.kickoff,
    attendance: venue.attendance,
    capacity: venue.capacity,
    weather: `${venue.weather}, ${venue.temperatureC}°C`,
    zones: venue.zones.map((z: Zone) => ({
      name: z.name,
      type: z.type,
      status: zoneStatus(z.occupancyPct),
      occupancyPct: Math.round(z.occupancyPct),
      waitMin: z.waitMin,
      trend: z.trend,
      accessible: z.accessible,
    })),
    transport: venue.transport.map((t) => ({
      name: t.name,
      status: t.status,
      loadPct: Math.round(t.loadPct),
      etaMin: t.etaMin,
    })),
    incidents: venue.incidents.map((i) => ({
      type: i.type,
      severity: i.severity,
      status: i.status,
      zone: i.zoneName,
      description: i.description,
    })),
    sustainability: venue.sustainability,
    staff: venue.staff.map((s) => ({ name: s.name, deployed: s.deployed, available: s.available })),
  }
}
