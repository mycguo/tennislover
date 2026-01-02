'use client'

import { useState, KeyboardEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { sendMessage } from '@/app/(authenticated)/messages/actions'

interface MessageInputProps {
  recipientId: string
  listingId?: string | null
  onMessageSent?: () => void
}

const MAX_MESSAGE_LENGTH = 2000

export function MessageInput({
  recipientId,
  listingId,
  onMessageSent
}: MessageInputProps) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!content.trim() || sending) return

    setSending(true)
    const result = await sendMessage(recipientId, content, listingId)

    if (result.error) {
      alert(result.error)
      setSending(false)
      return
    }

    // Clear input and call callback
    setContent('')
    setSending(false)
    onMessageSent?.()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
              setContent(e.target.value)
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="resize-none"
          rows={2}
          disabled={sending}
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <Button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          size="icon"
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
        <p className="text-xs text-muted-foreground">
          {content.length}/{MAX_MESSAGE_LENGTH}
        </p>
      </div>
    </div>
  )
}
