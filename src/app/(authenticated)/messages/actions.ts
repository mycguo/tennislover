'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Conversation, MessageWithProfiles, UserProfile } from '@/types/message'

export async function getConversations(): Promise<Conversation[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  // Get all messages where user is sender or recipient
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!sender_id(id, full_name, avatar_url),
      recipient:users!recipient_id(id, full_name, avatar_url),
      listing:equipment_listings(id, title, images)
    `)
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error || !messages) {
    console.error('Error fetching conversations:', error)
    return []
  }

  // Group messages by conversation partner
  const conversationMap = new Map<string, Conversation>()

  for (const msg of messages) {
    const isCurrentUserSender = msg.sender_id === user.id
    const otherUserId = isCurrentUserSender ? msg.recipient_id : msg.sender_id
    const otherUser = isCurrentUserSender ? msg.recipient : msg.sender

    if (!conversationMap.has(otherUserId)) {
      // Count unread messages from this user
      const unreadCount = messages.filter(
        m => m.sender_id === otherUserId &&
             m.recipient_id === user.id &&
             !m.read
      ).length

      conversationMap.set(otherUserId, {
        other_user_id: otherUserId,
        other_user_name: otherUser?.full_name || 'Unknown User',
        other_user_avatar: otherUser?.avatar_url || null,
        last_message: msg.content,
        last_message_time: msg.created_at,
        unread_count: unreadCount,
        listing_id: msg.listing_id,
        listing_title: msg.listing?.title,
        listing_image: msg.listing?.images?.[0]
      })
    }
  }

  return Array.from(conversationMap.values())
}

export async function getMessages(
  otherUserId: string,
  listingId?: string | null
): Promise<MessageWithProfiles[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  // Build query to get messages between current user and other user
  let query = supabase
    .from('messages')
    .select(`
      *,
      sender:users!sender_id(id, full_name, avatar_url),
      recipient:users!recipient_id(id, full_name, avatar_url),
      listing:equipment_listings(id, title, price, images, category)
    `)
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true })

  // Optionally filter by listing_id for listing-specific conversations
  if (listingId) {
    query = query.eq('listing_id', listingId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function sendMessage(
  recipientId: string,
  content: string,
  listingId?: string | null
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to send messages' }
  }

  // Validate inputs
  if (!content.trim()) {
    return { error: 'Message cannot be empty' }
  }

  if (!recipientId) {
    return { error: 'Recipient is required' }
  }

  // Prevent sending messages to yourself
  if (recipientId === user.id) {
    return { error: 'You cannot send messages to yourself' }
  }

  const { error } = await supabase.from('messages').insert({
    sender_id: user.id,
    recipient_id: recipientId,
    content: content.trim(),
    listing_id: listingId || null,
    read: false
  })

  if (error) {
    console.error('Error sending message:', error)
    return { error: 'Failed to send message' }
  }

  revalidatePath('/messages')
  return { success: true }
}

export async function markAsRead(conversationUserId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('sender_id', conversationUserId)
    .eq('recipient_id', user.id)
    .eq('read', false)

  if (error) {
    console.error('Error marking messages as read:', error)
    return { error: 'Failed to mark messages as read' }
  }

  revalidatePath('/messages')
  return { success: true }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, avatar_url')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}
