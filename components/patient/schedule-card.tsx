import { Clock, CheckCircle2, Circle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockSchedule } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function ScheduleCard() {
  const todaySchedule = mockSchedule.slice(0, 3)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Clock className="w-7 h-7 text-primary" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {todaySchedule.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center p-4 rounded-xl border border-border/50 bg-secondary/20",
                item.completed && "opacity-60"
              )}
            >
              <div className="w-20 shrink-0 text-lg font-semibold">
                {item.time}
              </div>
              <div className="flex-1 text-lg sm:text-xl font-medium px-4">
                {item.title}
              </div>
              <div className="shrink-0">
                {item.completed ? (
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                ) : (
                  <Circle className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" size="xl" className="w-full rounded-xl text-lg h-16">
          <Link to="/patient/schedule">View Full Schedule</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
