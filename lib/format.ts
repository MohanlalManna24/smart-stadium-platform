import type {
  IncidentSeverity,
  IncidentType,
  TransportStatus,
  ZoneStatus,
  ZoneType,
} from "./types"

export const ZONE_STATUS_META: Record<
  ZoneStatus,
  { label: string; dot: string; text: string; bg: string; ring: string }
> = {
  clear: { label: "Clear", dot: "bg-chart-1", text: "text-chart-1", bg: "bg-chart-1/10", ring: "ring-chart-1/30" },
  moderate: { label: "Moderate", dot: "bg-chart-3", text: "text-chart-3", bg: "bg-chart-3/10", ring: "ring-chart-3/30" },
  busy: { label: "Busy", dot: "bg-accent", text: "text-accent-foreground", bg: "bg-accent/15", ring: "ring-accent/40" },
  critical: { label: "Critical", dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10", ring: "ring-destructive/30" },
}

export const TRANSPORT_STATUS_META: Record<
  TransportStatus,
  { label: string; dot: string; text: string }
> = {
  good: { label: "Good", dot: "bg-chart-1", text: "text-chart-1" },
  moderate: { label: "Moderate", dot: "bg-chart-3", text: "text-chart-3" },
  delayed: { label: "Delayed", dot: "bg-accent", text: "text-accent-foreground" },
  disrupted: { label: "Disrupted", dot: "bg-destructive", text: "text-destructive" },
}

export const SEVERITY_META: Record<
  IncidentSeverity,
  { label: string; text: string; bg: string }
> = {
  low: { label: "Low", text: "text-chart-3", bg: "bg-chart-3/10" },
  medium: { label: "Medium", text: "text-accent-foreground", bg: "bg-accent/15" },
  high: { label: "High", text: "text-destructive", bg: "bg-destructive/10" },
}

export const INCIDENT_LABEL: Record<IncidentType, string> = {
  medical: "Medical",
  crowd: "Crowd",
  security: "Security",
  facility: "Facility",
  weather: "Weather",
  "lost-child": "Guest Assist",
}

export const ZONE_TYPE_LABEL: Record<ZoneType, string> = {
  gate: "Gate",
  concourse: "Concourse",
  concession: "Food & Drink",
  restroom: "Restroom",
  transit: "Transit",
  medical: "Medical",
  seating: "Seating",
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return "just now"
  if (min === 1) return "1 min ago"
  if (min < 60) return `${min} min ago`
  const hr = Math.round(min / 60)
  return `${hr} hr ago`
}

export const LANGUAGES = [
  "English",
  "Español",
  "Français",
  "Português",
  "Deutsch",
  "العربية",
  "日本語",
  "한국어",
] as const
