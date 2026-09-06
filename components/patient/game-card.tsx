import { ArrowRight, Brain, Type } from "lucide-react"
import { Link } from "react-router-dom"
import { mockGames } from "@/lib/mock-data"

const gameIcons = [Brain, Type]

export function GameCard() {
  const featuredGames = mockGames.slice(0, 2)

  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#111827] p-6">
      <h2 className="text-xl font-semibold text-foreground">Brain Games</h2>
      <div className="mt-4 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        {featuredGames.map((game, index) => {
          const Icon = gameIcons[index] || Brain
          return (
            <div key={game.id} className="flex flex-col items-center rounded-2xl border border-white/8 bg-black/30 p-4 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-3 font-semibold">{game.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{game.description}</p>
            </div>
          )
        })}
      </div>
      <Link
        to="/patient/games"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Play Games
        <ArrowRight className="size-4" />
      </Link>
    </section>
  )
}
