'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getConversations, getUserProfile } from '@/app/(authenticated)/messages/actions'
import { Conversation } from '@/types/message'
import { Card } from '@/components/ui/card'
import { ConversationList } from './ConversationList'
import { MessageThread } from './MessageThread'

interface MessagingInterfaceProps {
  currentUserId: string
  initialSelectedUserId?: string
  initialListingId?: string
}

export function MessagingInterface({
  currentUserId,
  initialSelectedUserId,
  initialListingId
}: MessagingInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMobileThread, setShowMobileThread] = useState(false)
  const supabase = createClient()

  // Fetch conversations
  const fetchConversations = async () => {
    const convos = await getConversations()
    setConversations(convos)
  }

  // Initial load
  useEffect(() => {
    async function loadConversations() {
      setLoading(true)
      await fetchConversations()
      setLoading(false)
    }

    loadConversations()
  }, [])

  // Handle initial selection from URL params
  useEffect(() => {
    async function handleInitialSelection() {
      if (!initialSelectedUserId || loading) return

      // Check if conversation exists
      const existing = conversations.find(
        c => c.other_user_id === initialSelectedUserId
      )

      if (existing) {
        setSelectedConversation(initialSelectedUserId)
        setShowMobileThread(true)
      } else {
        // Fetch user profile to verify user exists
        const profile = await getUserProfile(initialSelectedUserId)
        if (profile) {
          // Set selected even though no messages exist yet
          // MessageThread will handle empty state
          setSelectedConversation(initialSelectedUserId)
          setShowMobileThread(true)
        }
      }
    }

    handleInitialSelection()
  }, [initialSelectedUserId, conversations, loading])

  // Realtime subscription for all messages
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload: any) => {
          // Debounce the refetch to avoid multiple rapid updates
          clearTimeout(timeoutId)
          timeoutId = setTimeout(async () => {
            const convos = await getConversations()
            setConversations(convos)
          }, 300)
        }
      )
      .subscribe()

    return () => {
      clearTimeout(timeoutId)
      supabase.removeChannel(channel)
    }
  }, [currentUserId, supabase])

  if (loading) {
    return (
      <Card>
        <div className="p-20 text-center">
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-3 h-[600px]">
        {/* Left side: Conversation List */}
        <div
          className={`border-r md:col-span-1 md:block ${
            showMobileThread ? 'hidden' : 'block'
          }`}
        >
          <ConversationList
            conversations={conversations}
            selectedUserId={selectedConversation}
            onSelectConversation={(userId) => {
              setSelectedConversation(userId)
              setShowMobileThread(true)
            }}
            currentUserId={currentUserId}
          />
        </div>

        {/* Right side: Message Thread */}
        <div
          className={`md:col-span-2 md:block ${
            !showMobileThread ? 'hidden' : 'block'
          }`}
        >
          {selectedConversation ? (
            <MessageThread
              otherUserId={selectedConversation}
              currentUserId={currentUserId}
              listingId={initialListingId}
              onBack={() => setShowMobileThread(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
