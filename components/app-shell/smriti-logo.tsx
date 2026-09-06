import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export function SmritiLogo({
  to = "/",
  compact = false,
  className,
}: {
  to?: string
  compact?: boolean
  className?: string
}) {
  return (
    <Link to={to} className={cn("flex items-center gap-3", className)}>
      <span className="relative flex size-11 shrink-0 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
        <svg viewBox="0 0 48 48" className="relative size-11 text-primary" aria-hidden>
          <path
            fill="currentColor"
            d="M24 6c-4.2 0-7.6 2.6-8.8 6.2C13.4 11 11 12.6 11 16.2c0 1.6.6 3 1.6 4.1C10.6 21.7 9 24.1 9 27c0 4.4 3.2 7.6 7.4 8.4C17.6 39.2 20.6 42 24 42s6.4-2.8 7.6-6.6c4.2-.8 7.4-4 7.4-8.4 0-2.9-1.6-5.3-3.6-6.7 1-.1 1.6-2.5 1.6-4.1 0-3.6-2.4-5.2-4.2-4-1.2-3.6-4.6-6.2-8.8-6.2Z"
          />
          <path
            fill="#111"
            d="M24 14.5c-2.2 0-4 1.4-4.6 3.4-.8-.6-2-1-3.1-.4-1.2.7-1.4 2.2-.8 3.3-1.4.8-2.3 2.2-2.3 3.9 0 2.4 1.9 4.2 4.3 4.4.8 2 2.7 3.4 5 3.4s4.2-1.4 5-3.4c2.4-.2 4.3-2 4.3-4.4 0-1.7-.9-3.1-2.3-3.9.6-1.1.4-2.6-.8-3.3-1.1-.6-2.3-.2-3.1.4-.6-2-2.4-3.4-4.6-3.4Z"
          />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="text-lg font-semibold tracking-tight text-foreground">SmritiCare</span>
          <span className="text-[11px] text-muted-foreground">With You, Always.</span>
        </span>
      )}
    </Link>
  )
}
