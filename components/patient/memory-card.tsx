import { Images } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockMemories } from "@/lib/mock-data"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function MemoryCard() {
  const recentMemories = mockMemories.slice(0, 2)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Images className="w-7 h-7 text-primary" />
          My Memories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {recentMemories.map((memory) => (
            <div
              key={memory.id}
              className="p-4 rounded-xl border border-border bg-card flex flex-col gap-2"
            >
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                <Images className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-bold">{memory.title}</h3>
              <p className="text-sm text-muted-foreground">{memory.date}</p>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" size="xl" className="w-full rounded-xl text-lg h-16">
          <Link to="/patient/memories">View All Memories</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
