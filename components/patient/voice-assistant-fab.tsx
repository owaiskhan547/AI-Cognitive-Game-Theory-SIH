import { Mic } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export function VoiceAssistantFab({
  href = "/patient/assistant",
  label = "If you are lost, take help",
}: {
  href?: string
  label?: string
}) {
  const [highlighted, setHighlighted] = useState(false)

  useEffect(() => {
    const highlight = () => {
      setHighlighted(true)
      const timeout = window.setTimeout(() => setHighlighted(false), 8000)
      return () => window.clearTimeout(timeout)
    }

    window.addEventListener("smriti:highlight-voice-assistant", highlight)
    return () => window.removeEventListener("smriti:highlight-voice-assistant", highlight)
  }, [])

  return (
    <aside aria-label="Quick voice help" className="fixed bottom-6 right-6 z-40">
      <Link
        to={href}
        aria-label={`${label} - Open voice assistant`}
        title={label}
        className="group flex flex-col items-end animate-fab-float focus-visible:outline-none"
      >
        {/* Help message bubble displayed above the moving icon */}
        <div className="relative mb-2.5 flex items-center gap-2 rounded-full border border-primary/50 bg-black/95 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_14px_rgba(163,230,53,0.3)] backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_4px_28px_rgba(163,230,53,0.45)]">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="whitespace-nowrap font-semibold tracking-wide text-zinc-100">
            {label}
          </span>
          {/* Pointer caret pointing down to the button center */}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 right-6 size-2.5 rotate-45 border-b border-r border-primary/50 bg-black"
          />
        </div>

        {/* Circular Floating Button & Moving Icon */}
        <div
          className={`relative flex size-14 items-center justify-center rounded-full border bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(163,230,53,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/95 group-hover:shadow-[0_8px_36px_rgba(163,230,53,0.7)] group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black ${
            highlighted
              ? "scale-115 border-white ring-4 ring-primary/40 shadow-[0_0_0_12px_rgba(163,230,53,0.25),0_8px_40px_rgba(163,230,53,0.85)] animate-pulse"
              : "border-primary/60"
          }`}
        >
          <Mic className="size-6 animate-mic-wiggle text-primary-foreground transition-transform duration-200" />
        </div>
      </Link>
    </aside>
  )
}

