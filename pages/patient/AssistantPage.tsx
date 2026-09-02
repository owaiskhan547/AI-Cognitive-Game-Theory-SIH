import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PatientAssistantPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Assistant" 
        subtitle="Your personal cognitive care companion"
        backHref="/patient/dashboard"
      />
      
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Ready to talk?</h2>
            <p className="text-xl text-muted-foreground">
              The AI assistant is here to chat, answer questions, or just keep you company.
            </p>
          </div>
          
          <div className="w-full p-8 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center gap-4 bg-background">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center animate-pulse">
              <Mic className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-lg font-medium">Tap the microphone to speak</p>
          </div>

          <Button size="xl" className="w-full rounded-xl text-lg h-16 mt-4">
            Start Conversation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
