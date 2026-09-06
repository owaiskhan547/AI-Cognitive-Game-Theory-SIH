import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const chips = [
  "Help me remember something",
  "Suggest a game",
  "What's on my schedule?",
  "Who is in this photo?",
]

export function AssistantCard() {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground">AI Assistant</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            Your gentle companion for daily reminders, memory cues, and a calm conversation whenever you need it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Link
                key={chip}
                to="/patient/assistant"
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-300 hover:border-primary/40 hover:text-primary"
              >
                {chip}
              </Link>
            ))}
          </div>
          <Link
            to="/patient/assistant"
            className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Talk to Assistant
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="relative mx-auto flex w-full max-w-xs flex-col items-center lg:mx-0">
          <div className="mb-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200">
            How can I help you today?
          </div>
          <svg viewBox="0 0 160 180" className="h-40 w-36" aria-hidden>
            <ellipse cx="80" cy="168" rx="42" ry="8" fill="#111" />
            <rect x="48" y="78" width="64" height="70" rx="22" fill="#6b7280" />
            <rect x="56" y="86" width="48" height="40" rx="12" fill="#9ca3af" />
            <circle cx="72" cy="104" r="6" fill="#111" />
            <circle cx="88" cy="104" r="6" fill="#111" />
            <circle cx="73" cy="103" r="2" fill="#A3E635" />
            <circle cx="89" cy="103" r="2" fill="#A3E635" />
            <rect x="70" y="116" width="20" height="6" rx="3" fill="#374151" />
            <circle cx="80" cy="58" r="28" fill="#6b7280" />
            <circle cx="80" cy="54" r="18" fill="#9ca3af" />
            <path d="M80 18c0-8 10-10 12-2 3 12-6 16-12 22-6-6-15-10-12-22 2-8 12-6 12 2Z" fill="#A3E635" />
            <rect x="34" y="96" width="14" height="28" rx="7" fill="#6b7280" />
            <rect x="112" y="96" width="14" height="28" rx="7" fill="#6b7280" />
          </svg>
        </div>
      </div>
    </section>
  )
}
