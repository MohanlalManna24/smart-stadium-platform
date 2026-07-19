import type { VenueSnapshot, ZoneStatus } from "@/lib/types"

export interface OpsBriefing {
  headline: string
  overallRisk: "low" | "elevated" | "high" | "severe"
  confidence: number
  priorities: {
    title: string
    detail: string
    severity: "low" | "medium" | "high"
    category: "crowd" | "transport" | "accessibility" | "safety" | "sustainability" | "guest-experience"
  }[]
  fanImpact: string
  /** Marks that this briefing was produced by the local engine, not the live model. */
  source?: "fallback"
}

type SnapZone = VenueSnapshot["zones"][number]

const STATUS_RANK: Record<ZoneStatus, number> = { clear: 0, moderate: 1, busy: 2, critical: 3 }

function byType(snapshot: VenueSnapshot, ...types: SnapZone["type"][]) {
  return snapshot.zones.filter((z) => types.includes(z.type))
}

function lowestWait(zones: SnapZone[]) {
  return [...zones].sort((a, b) => a.waitMin - b.waitMin)[0]
}

function busiest(zones: SnapZone[]) {
  return [...zones].sort((a, b) => STATUS_RANK[b.status] - STATUS_RANK[a.status] || b.occupancyPct - a.occupancyPct)[0]
}

function fmtWait(min: number) {
  if (min <= 0) return "no wait"
  return `~${min} min wait`
}

/**
 * Deterministic, data-grounded answer used when the live model is unavailable.
 * It reasons over the same snapshot the model would receive, so answers stay accurate.
 */
export function buildFallbackAnswer(
  question: string,
  mode: "fan" | "ops",
  snapshot: VenueSnapshot | undefined,
): string {
  if (!snapshot || snapshot.zones.length === 0) {
    return "I don't have live venue data available right now, so I can't give you specifics. Please try again in a moment."
  }

  const q = question.toLowerCase()
  const gates = byType(snapshot, "gate")
  const restrooms = byType(snapshot, "restroom")
  const concessions = byType(snapshot, "concession")
  const medical = byType(snapshot, "medical")

  const has = (...words: string[]) => words.some((w) => q.includes(w))

  // --- Accessibility ---
  if (has("accessible", "wheelchair", "disab", "step-free", "step free", "mobility", "ramp")) {
    const accessibleZones = snapshot.zones.filter((z) => z.accessible)
    const accGate = lowestWait(accessibleZones.filter((z) => z.type === "gate"))
    const med = medical[0]
    const lines = [
      "Here are the accessible options based on live conditions:",
      accGate ? `- Step-free entry: ${accGate.name}, ${fmtWait(accGate.waitMin)}.` : null,
      med ? `- First aid / medical: ${med.name}, currently ${med.status}.` : null,
      accessibleZones.length ? `- ${accessibleZones.length} zones offer step-free access right now.` : null,
      "Stadium staff in hi-vis can escort you to any accessible service on request.",
    ].filter(Boolean)
    return lines.join("\n")
  }

  // --- Restrooms ---
  if (has("restroom", "toilet", "bathroom", "washroom", "loo")) {
    const best = lowestWait(restrooms)
    if (!best) return "I don't see restroom data in the current snapshot."
    return `The quickest restroom right now is ${best.name} (${best.status}, ${fmtWait(best.waitMin)}). ${
      restrooms.length > 1 ? "Other restrooms are showing longer queues, so head there if you can." : ""
    }`.trim()
  }

  // --- Food / drink ---
  if (has("food", "eat", "hungry", "concession", "drink", "beer", "snack", "restaurant")) {
    const best = lowestWait(concessions)
    if (!best) return "I don't see concession data in the current snapshot."
    return `For the shortest food & drink queue, try ${best.name} — it's ${best.status} with ${fmtWait(best.waitMin)}. Occupancy there is ${best.occupancyPct}% of capacity.`
  }

  // --- Transport / getting home ---
  if (has("transport", "train", "rail", "metro", "subway", "bus", "home", "leave", "depart", "parking", "car", "rideshare", "uber", "taxi")) {
    const t = [...snapshot.transport].sort((a, b) => a.loadPct - b.loadPct)[0]
    if (!t) return "I don't see transport data in the current snapshot."
    return `Your best way out right now is ${t.name} — status ${t.status}, ${t.loadPct}% loaded, about ${t.etaMin} min. I'd recommend heading there to beat the post-match rush.`
  }

  // --- Medical / help ---
  if (has("medical", "first aid", "first-aid", "hurt", "injur", "sick", "unwell", "help")) {
    const med = medical[0]
    return med
      ? `The nearest medical point is ${med.name}, currently ${med.status}. If it's urgent, tell any staff member and they'll radio the medical team immediately.`
      : "Tell any staff member in hi-vis and they'll radio the medical team right away."
  }

  // --- Sustainability ---
  if (has("recycl", "waste", "sustainab", "green", "energy", "carbon", "environment")) {
    const s = snapshot.sustainability
    return `This venue is running at ${s.renewablePct}% renewable energy, has diverted ${s.wasteDivertedPct}% of waste from landfill, and recycling stations are located across every concourse. Match-day footprint is tracking at ${s.carbonTonnes} tonnes CO₂e.`
  }

  // --- Ops-specific: crowd / congestion ---
  if (mode === "ops" && has("congest", "crowd", "busy", "critical", "pressure", "risk", "situation", "overview", "brief")) {
    const hot = busiest(snapshot.zones)
    const relief = lowestWait(gates.filter((g) => g.name !== hot.name))
    const active = snapshot.incidents.filter((i) => i.status === "active" || i.status === "dispatched")
    return [
      `Highest pressure point: ${hot.name} at ${hot.occupancyPct}% occupancy (${hot.status}, ${fmtWait(hot.waitMin)}, trend ${hot.trend}).`,
      relief ? `Recommended action: redirect arriving fans to ${relief.name} (${relief.status}, ${fmtWait(relief.waitMin)}) via digital signage and marshals.` : null,
      active.length ? `Active incidents: ${active.length} — prioritise ${active[0].zone} (${active[0].type}, ${active[0].severity}).` : "No active incidents currently.",
    ].filter(Boolean).join("\n")
  }

  // --- Ops-specific: staffing ---
  if (mode === "ops" && has("staff", "team", "deploy", "reallocat", "resource", "headcount")) {
    const available = [...snapshot.staff].sort((a, b) => b.available - a.available)[0]
    const hot = busiest(snapshot.zones)
    return available
      ? `${available.name} has the most spare capacity (${available.available} available). Consider reallocating them toward ${hot.name}, which is your busiest zone at ${hot.occupancyPct}% occupancy.`
      : "All teams are currently at full deployment."
  }

  // --- Gates / entry / queues (also default for "where do I go") ---
  if (has("gate", "entry", "enter", "queue", "line", "shortest", "quick", "get in", "where")) {
    const best = lowestWait(gates)
    if (!best) return "I don't see gate data in the current snapshot."
    const busy = busiest(gates)
    return [
      `The shortest gate right now is ${best.name} — ${best.status} with ${fmtWait(best.waitMin)} (${best.occupancyPct}% occupancy).`,
      busy && busy.name !== best.name ? `Avoid ${busy.name} if you can; it's ${busy.status} with ${fmtWait(busy.waitMin)}.` : null,
      best.accessible ? "This gate has step-free access." : null,
    ].filter(Boolean).join("\n")
  }

  // --- Default: grounded summary ---
  const bestGate = lowestWait(gates)
  const hot = busiest(snapshot.zones)
  return [
    `Here's the live picture at ${snapshot.venue} for ${snapshot.match}:`,
    `- Attendance: ${snapshot.attendance.toLocaleString()} of ${snapshot.capacity.toLocaleString()}.`,
    bestGate ? `- Quickest gate: ${bestGate.name} (${fmtWait(bestGate.waitMin)}).` : null,
    `- Busiest area: ${hot.name} at ${hot.occupancyPct}% (${hot.status}).`,
    "Ask me about gates, restrooms, food, accessible routes, or transport home.",
  ].filter(Boolean).join("\n")
}

/** Deterministic operational briefing generated from the snapshot. */
export function buildFallbackBriefing(snapshot: VenueSnapshot): OpsBriefing {
  const zones = snapshot.zones
  const critical = zones.filter((z) => z.status === "critical")
  const busy = zones.filter((z) => z.status === "busy")
  const active = snapshot.incidents.filter((i) => i.status === "active" || i.status === "dispatched")
  const highIncidents = active.filter((i) => i.severity === "high")
  const strainedTransport = snapshot.transport.filter((t) => t.status === "delayed" || t.status === "disrupted" || t.loadPct >= 85)
  const gates = zones.filter((z) => z.type === "gate")
  const reliefGate = [...gates].sort((a, b) => a.waitMin - b.waitMin)[0]

  const priorities: OpsBriefing["priorities"] = []

  const hottest = [...zones].sort((a, b) => STATUS_RANK[b.status] - STATUS_RANK[a.status] || b.occupancyPct - a.occupancyPct)[0]
  if (hottest) {
    priorities.push({
      title: `Manage ${hottest.name} density`,
      detail: `${hottest.name} is at ${hottest.occupancyPct}% occupancy (${hottest.status}, ${hottest.waitMin} min wait, trend ${hottest.trend}).${
        reliefGate && reliefGate.name !== hottest.name ? ` Redirect inbound flow to ${reliefGate.name} (${reliefGate.waitMin} min) via signage and marshals.` : ""
      }`,
      severity: hottest.status === "critical" ? "high" : hottest.status === "busy" ? "medium" : "low",
      category: "crowd",
    })
  }

  if (highIncidents.length || active.length) {
    const top = highIncidents[0] ?? active[0]
    priorities.push({
      title: `Resolve ${top.type} incident in ${top.zone}`,
      detail: `${active.length} active incident(s). Priority: ${top.description} (${top.severity}, ${top.status}). Confirm response team on scene and clear a movement corridor.`,
      severity: top.severity === "high" ? "high" : "medium",
      category: top.type === "medical" || top.type === "security" ? "safety" : "crowd",
    })
  }

  if (strainedTransport.length) {
    const t = strainedTransport.sort((a, b) => b.loadPct - a.loadPct)[0]
    priorities.push({
      title: `Ease pressure on ${t.name}`,
      detail: `${t.name} is ${t.status} at ${t.loadPct}% load (ETA ${t.etaMin} min). Pre-position marshals and message fans about alternative egress before full-time.`,
      severity: t.status === "disrupted" ? "high" : "medium",
      category: "transport",
    })
  }

  const inaccessibleBusy = zones.find((z) => !z.accessible && (z.status === "busy" || z.status === "critical"))
  const accessibleGate = gates.find((z) => z.accessible)
  if (inaccessibleBusy && accessibleGate) {
    priorities.push({
      title: "Protect step-free routes",
      detail: `${inaccessibleBusy.name} is congested and not step-free. Keep ${accessibleGate.name} clear as the priority accessible route and staff it to maintain flow.`,
      severity: "medium",
      category: "accessibility",
    })
  }

  const s = snapshot.sustainability
  if (priorities.length < 3) {
    priorities.push({
      title: "Sustain resource efficiency",
      detail: `Running ${s.renewablePct}% renewable with ${s.wasteDivertedPct}% waste diverted. Maintain HVAC setpoints in lower-occupancy zones to hold the ${s.carbonTonnes}t CO₂e footprint.`,
      severity: "low",
      category: "sustainability",
    })
  }

  const risk: OpsBriefing["overallRisk"] = critical.length || highIncidents.length
    ? "high"
    : busy.length >= 2 || active.length || strainedTransport.length
      ? "elevated"
      : "low"

  const headline = critical.length
    ? `${critical.length} zone(s) critical — active crowd management required.`
    : busy.length
      ? `${busy.length} zone(s) busy; conditions manageable with proactive flow control.`
      : "Venue operating within normal parameters across all monitored systems."

  return {
    headline,
    overallRisk: risk,
    confidence: 88,
    priorities: priorities.slice(0, 5),
    fanImpact: reliefGate
      ? `Fans currently face up to ${Math.max(...zones.map((z) => z.waitMin), 0)} min at the busiest points. Directing arrivals to ${reliefGate.name} keeps entry under ${reliefGate.waitMin} min.`
      : "Fan experience is stable with no significant queue impact.",
    source: "fallback",
  }
}
