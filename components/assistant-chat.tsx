"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Sparkles, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { VenueSnapshot } from "@/lib/types"

interface AssistantChatProps {
  mode: "fan" | "ops"
  snapshot: VenueSnapshot
  language?: string
  title: string
  subtitle: string
  suggestions: string[]
  className?: string
}

export function AssistantChat({
  mode,
  snapshot,
  language,
  title,
  subtitle,
  suggestions,
  className,
}: AssistantChatProps) {
  // Keep the latest live snapshot/language in refs so each request grounds
  // the AI in the freshest telemetry without recreating the transport.
  const snapshotRef = useRef(snapshot)
  snapshotRef.current = snapshot
  const languageRef = useRef(language)
  languageRef.current = language

  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            mode,
            language: languageRef.current,
            snapshot: snapshotRef.current,
          },
        }),
      }),
    [mode],
  )

  const { messages, sendMessage, status, stop, error } = useChat({
    transport,
  })

  const busy = status === "submitted" || status === "streaming"
  const statusText = error
    ? "Assistant connection error"
    : busy
      ? "Assistant is generating a reply"
      : messages.length > 0
        ? `${messages.length} messages in conversation`
        : "Ready for your question"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, status])

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <div
      className={cn("flex flex-col overflow-hidden rounded-xl border bg-card", className)}
      aria-busy={busy}
    >
      <div className="flex items-center gap-3 border-b bg-primary/5 px-4 py-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-chart-1" />
          AI online
        </span>
      </div>

      <p id="assistant-chat-status" className="sr-only" aria-live="polite" aria-atomic="true">
        {statusText}
      </p>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto" role="log" aria-live="polite" aria-relevant="additions text">
        <div className="flex flex-col gap-4 p-4">
          {messages.length === 0 && (
            <div className="flex flex-col gap-3 py-6 text-center">
              <p className="text-sm text-muted-foreground text-balance">
                {mode === "ops"
                  ? "Ask the operations copilot for real-time decision support grounded in live venue telemetry."
                  : "Ask me anything about getting around the stadium, the shortest queues, accessibility, or your trip home."}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    aria-label={`Send message: ${s}`}
                    className="rounded-full border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = message.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("")
            const isUser = message.role === "user"
            return (
              <div
                key={message.id}
                className={cn("flex", isUser ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    isUser
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground",
                  )}
                >
                  {text || (
                    <span className="inline-flex gap-1">
                      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-current" />
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Something went wrong reaching the assistant. Please try again.
            </p>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="flex items-center gap-2 border-t p-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              submit(input)
            }
          }}
          placeholder={mode === "ops" ? "Ask for a recommendation..." : "Ask the concierge..."}
          aria-label="Message the assistant"
          aria-describedby="assistant-chat-status"
          className="flex-1"
        />
        {busy ? (
          <Button type="button" variant="secondary" size="icon" onClick={() => stop()} aria-label="Stop">
            <Square className="size-4" />
          </Button>
        ) : (
          <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
