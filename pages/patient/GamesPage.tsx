import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockGames } from "@/lib/mock-data"
import { Brain } from "lucide-react"

export default function PatientGamesPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Brain Games" 
        subtitle="Keep your mind active and engaged"
        backHref="/patient/dashboard"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {mockGames.map((game) => (
          <Card key={game.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-sm">
                  {game.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold">{game.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between gap-6">
              <p className="text-lg text-muted-foreground">
                {game.description}
              </p>
              <Button size="xl" className="w-full rounded-xl text-lg h-16">
                Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
