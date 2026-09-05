import type { ChatMessage } from './types'

/**
 * In-memory conversation manager for managing chat message history.
 */
export class ConversationManager {
  private messages: ChatMessage[] = []

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Adds a user message to memory with a unique id, role 'user', and current Date.
   */
  addUserMessage(content: string): ChatMessage {
    const message: ChatMessage = {
      id: this.generateId(),
      role: 'user',
      content,
      createdAt: new Date(),
    }
    this.messages.push(message)
    return message
  }

  /**
   * Adds an assistant message to memory with a unique id, role 'assistant', and current Date.
   */
  addAssistantMessage(content: string): ChatMessage {
    const message: ChatMessage = {
      id: this.generateId(),
      role: 'assistant',
      content,
      createdAt: new Date(),
    }
    this.messages.push(message)
    return message
  }

  /**
   * Returns all stored messages without modifying internal data.
   */
  getConversation(): ChatMessage[] {
    return [...this.messages]
  }

  /**
   * Returns only the latest messages (default limit: 6).
   */
  getRecentConversation(limit: number = 6): ChatMessage[] {
    return this.messages.slice(-limit)
  }

  /**
   * Removes every stored message from memory.
   */
  clearConversation(): void {
    this.messages = []
  }
}
