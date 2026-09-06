"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Sunrise, Sunset } from "lucide-react"

export function GreetingCard({
  name,
  quote = "A calmer mind, a brighter tomorrow.",
}: {
  name: string
  quote?: string
}) {
  const [greeting, setGreeting] = useState("Good day")
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning")
  const [dateLabel, setDateLabel] = useState("")

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    if (hour < 12) {
      setGreeting("Good morning")
      setTimeOfDay("morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
      setTimeOfDay("afternoon")
    } else {
      setGreeting("Good evening")
      setTimeOfDay("evening")
    }
    setDateLabel(now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }))
  }, [])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
          {timeOfDay === "morning" && <Sunrise className="size-6" />}
          {timeOfDay === "afternoon" && <Sun className="size-6" />}
          {timeOfDay === "evening" && <Moon className="size-6" />}
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            {greeting}, {name}!
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{dateLabel}</p>
        </div>
      </div>
      <p className="font-script text-xl text-primary sm:text-2xl">{quote}</p>
    </div>
  )
}
