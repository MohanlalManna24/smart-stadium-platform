import { generateText, Output } from "ai"
import { z } from "zod"
import type { VenueSnapshot } from "@/lib/types"

export const maxDuration = 30

const MODEL = "openai/gpt-4.1-mini"

const briefingSchema = z.object({
  headline: z.string().describe("A single-sentence summary of the current operational picture."),
  overallRisk: z.enum(["low", "elevated", "high", "severe"]),
  confidence: z.number().min(0).max(100).describe("Confidence in this assessment, 0-100."),
  priorities: z
    .array(
      z.object({
        title: z.string().describe("Short action title, e.g. 'Relieve Gate C congestion'."),
        detail: z.string().describe("One concrete, data-grounded recommendation."),
        severity: z.enum(["low", "medium", "high"]),
        category: z.enum([
          "crowd",
          "transport",
          "accessibility",
          "safety",
          "sustainability",
          "guest-experience",
        ]),
      }),
    )
    .min(3)
    .max(5),
  fanImpact: z.string().describe("How current conditions affect the fan experience, one or two sentences."),
})

export async function POST(req: Request) {
  const { snapshot } = (await req.json()) as { snapshot: VenueSnapshot }

  const { output } = await generateText({
    model: MODEL,
    output: Output.object({ schema: briefingSchema }),
    system: `You are the operations intelligence engine for "PitchOps", a smart-stadium platform
for the FIFA World Cup 2026. Analyse the real-time venue snapshot and produce a prioritised
operational briefing for control-room staff.

Rules:
- Ground every statement in the snapshot data. Cite concrete numbers (occupancy %, wait minutes,
  transport load %, incident counts).
- Rank priorities by risk to safety and fan experience. The highest-severity, time-sensitive issue
  comes first.
- Recommendations must be specific and actionable: name the exact gate/zone/transport option and,
  where relevant, a less-busy alternative to redirect flow to.
- Consider crowd density, gate queues, active incidents, transport strain, accessibility, and
  sustainability.
- Set overallRisk to reflect the worst credible near-term outcome, not the average.`,
    prompt: `Here is the current venue snapshot:\n\n${JSON.stringify(snapshot, null, 2)}\n\nProduce the operational briefing.`,
  })

  return Response.json(output)
}
