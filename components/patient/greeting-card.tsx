"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, Sunrise, Sunset } from "lucide-react"

export function GreetingCard({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Good day")
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning")

  useEffect(() => {
    const hour = new Date().getHours()
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
  }, [])

  return (
    <div className="flex items-center gap-4 py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        {timeOfDay === "morning" && <Sunrise className="w-8 h-8 text-primary" />}
        {timeOfDay === "afternoon" && <Sun className="w-8 h-8 text-primary" />}
        {timeOfDay === "evening" && <Moon className="w-8 h-8 text-primary" />}
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {greeting}, {name}!
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mt-1">
          Here's your day at a glance.
        </p>
      </div>
    </div>
  )
}
