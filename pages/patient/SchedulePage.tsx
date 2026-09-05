import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"
import { mockSchedule } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function PatientSchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Today's Schedule" 
        subtitle="Your appointments and activities"
        backHref="/patient/dashboard"
      />
      
      <div className="space-y-4">
        {mockSchedule.map((item) => (
          <Card key={item.id} className={cn("overflow-hidden", item.completed && "opacity-70 bg-secondary/10")}>
            <div className="flex border-l-4 border-primary">
              <CardContent className="p-6 flex-1 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="w-24 shrink-0">
                    <div className="text-2xl font-bold text-foreground">{item.time}</div>
                  </div>
                  <div className="space-y-1 border-l border-border pl-6">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 hidden sm:block">
                  {item.completed ? (
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  ) : (
                    <Circle className="w-10 h-10 text-muted-foreground/30" />
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
