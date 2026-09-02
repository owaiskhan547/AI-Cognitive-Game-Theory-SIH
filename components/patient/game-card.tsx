import { Gamepad2, Brain } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockGames } from "@/lib/mock-data"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function GameCard() {
  const featuredGames = mockGames.slice(0, 2)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Gamepad2 className="w-7 h-7 text-primary" />
          Brain Games
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{game.name}</h3>
                <p className="text-muted-foreground">{game.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Button asChild size="xl" className="w-full rounded-xl text-lg h-16">
          <Link to="/patient/games">Play Games</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
