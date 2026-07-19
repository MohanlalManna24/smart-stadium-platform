import { z } from "zod"

const MAX_CHAT_MESSAGES = 20
const MAX_MESSAGE_PARTS = 16
const MAX_TEXT_LENGTH = 4000
const MAX_LANGUAGE_LENGTH = 32
const MAX_SNAPSHOT_ZONES = 24
const MAX_SNAPSHOT_TRANSPORT = 12
const MAX_SNAPSHOT_INCIDENTS = 20
const MAX_SNAPSHOT_STAFF = 16

const messagePartSchema = z.object({
  type: z.string().min(1),
}).passthrough()

const chatMessageSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  parts: z.array(messagePartSchema).min(1).max(MAX_MESSAGE_PARTS),
}).passthrough()

const zoneSnapshotSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  status: z.string().min(1),
  occupancyPct: z.number().min(0).max(100),
  waitMin: z.number().min(0),
  trend: z.string().min(1),
  accessible: z.boolean(),
}).passthrough()

const transportSnapshotSchema = z.object({
  name: z.string().min(1),
  status: z.string().min(1),
  loadPct: z.number().min(0).max(100),
  etaMin: z.number().min(0),
}).passthrough()

const incidentSnapshotSchema = z.object({
  type: z.string().min(1),
  severity: z.string().min(1),
  status: z.string().min(1),
  zone: z.string().min(1),
  description: z.string().min(1),
}).passthrough()

const sustainabilitySnapshotSchema = z.object({
  energyKwh: z.number().nonnegative(),
  renewablePct: z.number().min(0).max(100),
  waterLitersK: z.number().nonnegative(),
  wasteDivertedPct: z.number().min(0).max(100),
  carbonTonnes: z.number().nonnegative(),
})

const staffSnapshotSchema = z.object({
  name: z.string().min(1),
  deployed: z.number().nonnegative(),
  available: z.number().nonnegative(),
}).passthrough()

const venueSnapshotSchema = z.object({
  venue: z.string().min(1),
  city: z.string().min(1).optional(),
  match: z.string().min(1),
  kickoff: z.string().min(1),
  attendance: z.number().nonnegative(),
  capacity: z.number().positive(),
  weather: z.string().min(1),
  zones: z.array(zoneSnapshotSchema).max(MAX_SNAPSHOT_ZONES),
  transport: z.array(transportSnapshotSchema).max(MAX_SNAPSHOT_TRANSPORT),
  incidents: z.array(incidentSnapshotSchema).max(MAX_SNAPSHOT_INCIDENTS),
  sustainability: sustainabilitySnapshotSchema,
  staff: z.array(staffSnapshotSchema).max(MAX_SNAPSHOT_STAFF),
}).passthrough()

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(MAX_CHAT_MESSAGES),
  mode: z.enum(["fan", "ops"]).default("fan"),
  language: z.string().min(1).max(MAX_LANGUAGE_LENGTH).optional(),
  snapshot: venueSnapshotSchema.optional(),
})

export const opsBriefingRequestSchema = z.object({
  snapshot: venueSnapshotSchema,
})

export function parseChatRequest(input: unknown) {
  return chatRequestSchema.parse(input)
}

export function parseOpsBriefingRequest(input: unknown) {
  return opsBriefingRequestSchema.parse(input)
}
