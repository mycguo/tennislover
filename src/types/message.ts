// Core message type matching database schema
export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  listing_id: string | null
  exchange_id: string | null
  content: string
  read: boolean
  created_at: string
}

// Message with user profile information (for display)
export interface MessageWithProfiles extends Message {
  sender: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  recipient: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  listing?: {
    id: string
    title: string
    price: number
    images: string[]
    category: string
  } | null
}

// Conversation type (aggregated view of messages between two users)
export interface Conversation {
  other_user_id: string
  other_user_name: string
  other_user_avatar: string | null
  last_message: string
  last_message_time: string
  unread_count: number
  listing_id: string | null
  listing_title?: string
  listing_image?: string
}

// User profile type (for new conversations)
export interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
}
