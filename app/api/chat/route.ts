import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import type { VenueSnapshot } from "@/lib/types"

export const maxDuration = 30

const MODEL = "openai/gpt-4.1-mini"

interface ChatBody {
  messages: UIMessage[]
  mode?: "fan" | "ops"
  language?: string
  snapshot?: VenueSnapshot
}

function snapshotText(snapshot?: VenueSnapshot): string {
  if (!snapshot) return "No live venue data is currently available."
  return JSON.stringify(snapshot, null, 2)
}

function systemPrompt(body: ChatBody): string {
  const shared = `You are part of "PitchOps", a smart-stadium assistant for the FIFA World Cup 2026.
You are given a real-time JSON snapshot of the currently selected venue. Always ground your
answers in this data. Never invent gates, zones, wait times, incidents or transport that are
not present in the snapshot. If asked about something not in the data, say so plainly.

LIVE VENUE SNAPSHOT:
${snapshotText(body.snapshot)}

Formatting rules:
- Be concise and skimmable. Prefer short paragraphs and tight bullet lists.
- Reference concrete numbers from the snapshot (wait times, occupancy %, load %).
- Never use markdown tables. Use "- " bullets.`

  if (body.mode === "ops") {
    return `${shared}

ROLE: You are the Operations Copilot for venue control-room staff (duty managers, safety
officers, transport marshals). Your job is real-time decision support.
- Lead with the single most important action when pressure is high.
- Quantify risk using the snapshot (critical/busy zones, active incidents, gate waits, transport load).
- Recommend concrete, proportionate actions: redirect fans between gates, reallocate staff from
  zones with available headcount, open/close lanes, stagger concourse flow, coordinate transport.
- Flag accessibility and safety implications explicitly.
- When you recommend moving fans, name a specific less-busy alternative gate/zone from the data.`
  }

  const language = body.language && body.language !== "English"
    ? `\n\nIMPORTANT: The fan's preferred language is ${body.language}. Respond entirely in ${body.language}.`
    : ""

  return `${shared}

ROLE: You are the Fan Concierge, a warm and helpful multilingual guide for supporters at the match.
- Help with wayfinding (which gate/entry to use), the shortest queues, food, restrooms, accessible
  routes and services, transport home, and general match-day questions.
- When a fan wants to enter or reach something, recommend the option with the lowest wait/occupancy
  from the snapshot, and mention the wait time so they can decide.
- For accessibility requests, prioritise zones and gates where "accessible" is true and mention
  step-free routes and the medical/first-aid location.
- Be encouraging and celebratory about the tournament, but keep answers practical.${language}`
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatBody

  const result = streamText({
    model: MODEL,
    system: systemPrompt(body),
    messages: await convertToModelMessages(body.messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.log("[v0] chat stream error:", error instanceof Error ? error.message : String(error))
        return "Something went wrong reaching the assistant."
      },
    }),
  })
}
