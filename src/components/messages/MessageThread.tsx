'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getMessages, getUserProfile, markAsRead } from '@/app/(authenticated)/messages/actions'
import { MessageWithProfiles, UserProfile } from '@/types/message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { MessageInput } from './MessageInput'
import { ListingContext } from './ListingContext'

interface MessageThreadProps {
  otherUserId: string
  currentUserId: string
  listingId?: string | null
  onBack?: () => void
}

export function MessageThread({
  otherUserId,
  currentUserId,
  listingId,
  onBack
}: MessageThreadProps) {
  const [messages, setMessages] = useState<MessageWithProfiles[]>([])
  const [otherUserProfile, setOtherUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Initial data fetch
  useEffect(() => {
    async function loadThread() {
      setLoading(true)

      // Fetch messages and user profile in parallel
      const [messagesData, profileData] = await Promise.all([
        getMessages(otherUserId, listingId),
        getUserProfile(otherUserId)
      ])

      setMessages(messagesData)
      setOtherUserProfile(profileData)
      setLoading(false)

      // Mark messages as read
      await markAsRead(otherUserId)

      // Scroll to bottom after messages load
      setTimeout(scrollToBottom, 100)
    }

    loadThread()
  }, [otherUserId, listingId])

  // Realtime subscription for new messages in this thread
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${otherUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${otherUserId}`
        },
        async () => {
          // Refetch messages when new message from other user
          const updatedMessages = await getMessages(otherUserId, listingId)
          setMessages(updatedMessages)
          await markAsRead(otherUserId)
          scrollToBottom()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${currentUserId}`
        },
        async () => {
          // Refetch messages when current user sends (for optimistic update)
          const updatedMessages = await getMessages(otherUserId, listingId)
          setMessages(updatedMessages)
          scrollToBottom()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [otherUserId, currentUserId, listingId, supabase])

  // Get the first message's listing for context (if exists)
  const listingData = messages.find(m => m.listing_id)?.listing

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUserProfile?.avatar_url || undefined} />
          <AvatarFallback>{otherUserProfile?.full_name?.[0] || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">
            {otherUserProfile?.full_name || 'Unknown User'}
          </p>
        </div>
      </div>

      {/* Listing Context (if applicable) */}
      {listingData && <ListingContext listing={listingData} />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender_id === currentUserId

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage
                    src={message.sender.avatar_url || undefined}
                  />
                  <AvatarFallback>
                    {message.sender.full_name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        recipientId={otherUserId}
        listingId={listingId}
        onMessageSent={scrollToBottom}
      />
    </div>
  )
}
