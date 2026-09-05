import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Images, Plus } from "lucide-react"
import { mockMemories } from "@/lib/mock-data"

export default function PatientMemoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="My Memories" 
          subtitle="Cherished moments to revisit"
          backHref="/patient/dashboard"
        />
        <Button variant="outline" size="lg" className="rounded-xl hidden sm:flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Memory
        </Button>
      </div>

      <Button variant="outline" size="xl" className="w-full rounded-xl sm:hidden flex items-center gap-2 mb-6">
        <Plus className="w-6 h-6" />
        Add New Memory
      </Button>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {mockMemories.map((memory) => (
          <Card key={memory.id} className="overflow-hidden">
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <Images className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground font-medium">{memory.date}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Memory</span>
              </div>
              <CardTitle className="text-xl">{memory.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                {memory.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
