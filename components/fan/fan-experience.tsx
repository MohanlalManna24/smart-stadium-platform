"use client"

import { useMemo, useState } from "react"
import { MatchCard } from "./match-card"
import { ServicesGrid } from "./services-grid"
import { AssistantChat } from "@/components/assistant-chat"
import { Button } from "@/components/ui/button"
import type { Venue } from "@/lib/types"
import { buildSnapshot } from "@/lib/stadium-data"
import { LANGUAGES } from "@/lib/format"
import { Globe } from "lucide-react"

const FAN_SUGGESTIONS = [
  "Which gate has the shortest line right now?",
  "I use a wheelchair — what's the accessible route in?",
  "Where can I grab food without a long wait?",
  "When should I leave to catch transport home?",
]

export function FanExperience({ venue }: { venue: Venue }) {
  const [language, setLanguage] = useState<string>("English")
  const snapshot = useMemo(() => buildSnapshot(venue), [venue])

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col gap-6">
        <MatchCard venue={venue} />

        <section aria-labelledby="lang-heading" className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-primary" aria-hidden="true" />
            <h2 id="lang-heading" className="text-sm font-semibold">
              Assistant language
            </h2>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Select assistant language"
          >
            {LANGUAGES.map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant={language === lang ? "default" : "outline"}
                onClick={() => setLanguage(lang)}
                aria-pressed={language === lang}
              >
                {lang}
              </Button>
            ))}
          </div>
        </section>

        <ServicesGrid venue={venue} />
      </div>

      <div className="flex min-h-[560px] flex-col lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
        <AssistantChat
          mode="fan"
          snapshot={snapshot}
          language={language}
          title="Fan Concierge"
          subtitle={`Navigation & accessibility • ${language}`}
          suggestions={FAN_SUGGESTIONS}
          className="min-h-0 flex-1"
        />
      </div>
    </div>
  )
}
