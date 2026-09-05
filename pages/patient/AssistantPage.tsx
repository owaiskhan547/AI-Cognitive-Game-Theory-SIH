import { useState, useRef, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Send, User, Loader2, AlertCircle } from "lucide-react"
import { assistantRepository } from "@/features/assistant/AssistantRepository"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  time: string
  isError?: boolean
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content: "Hello! I am SmritiCare, your companion. How are you feeling today?",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
]

export default function PatientAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to the newest message smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Focus input on initial mount and after response arrives
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [isLoading])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || isLoading) return

    setErrorMessage(null)
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // 1. Immediately show user's message
    const userMsg: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
      time: timeString,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText("")
    setIsLoading(true)

    try {
      // 2. Request AI response
      const aiResponseText = await assistantRepository.sendMessage(trimmed)

      const assistantMsg: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (error) {
      console.error("Failed to generate AI response:", error)
      const friendlyError = "I'm having a little trouble connecting right now, but I'm right here with you. Please try sending your message again."
      setErrorMessage(friendlyError)

      const errorMsg: Message = {
        id: `${Date.now()}-error`,
        role: "assistant",
        content: friendlyError,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] sm:h-[calc(100vh-140px)] max-w-3xl mx-auto space-y-3 px-2 sm:px-4">
      <PageHeader
        title="AI Assistant"
        subtitle="Your caring companion, SmritiCare"
        backHref="/patient/dashboard"
      />

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 bg-card/60 border border-border/50 rounded-2xl shadow-inner min-h-0">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant"

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
            >
              {isAssistant && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 border ${
                    msg.isError
                      ? "bg-destructive/10 border-destructive/30 text-destructive"
                      : "bg-primary/20 border-primary/40 text-primary"
                  }`}
                >
                  {msg.isError ? <AlertCircle className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed shadow-sm transition-all ${
                  isAssistant
                    ? msg.isError
                      ? "bg-destructive/10 text-destructive-foreground border border-destructive/20 rounded-bl-sm"
                      : "bg-secondary text-secondary-foreground rounded-bl-sm border border-border/40"
                    : "bg-primary text-primary-foreground font-medium rounded-br-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <span
                  className={`block text-[11px] mt-1.5 ${
                    isAssistant ? "text-muted-foreground" : "text-primary-foreground/75 text-right"
                  }`}
                >
                  {msg.time}
                </span>
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 mb-1 text-primary">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          )
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-end gap-2.5 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 mb-1 text-primary">
              <Brain className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-sm border border-border/40 px-4 py-3 text-sm flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-muted-foreground">SmritiCare is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Send Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-1 pb-1">
        <Input
          ref={inputRef}
          type="text"
          placeholder={isLoading ? "SmritiCare is responding..." : "Type a message to SmritiCare..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="h-12 text-base rounded-xl bg-card border-border/60 focus-visible:ring-primary px-4 transition-opacity disabled:opacity-60"
        />
        <Button
          type="submit"
          size="lg"
          disabled={!inputText.trim() || isLoading}
          className="h-12 px-5 rounded-xl font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Sending</span>
            </>
          ) : (
            <>
              <span>Send</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
