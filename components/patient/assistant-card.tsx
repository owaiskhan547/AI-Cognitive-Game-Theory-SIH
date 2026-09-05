import { MessageCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function AssistantCard() {
  return (
    <Card className="w-full bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <MessageCircle className="w-7 h-7 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-xl leading-relaxed text-foreground">
          I'm here to help! Tap to start a conversation with your personal companion.
        </p>
        <Button asChild size="xl" className="w-full rounded-xl text-lg h-16">
          <Link to="/patient/assistant">Talk to Assistant</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
