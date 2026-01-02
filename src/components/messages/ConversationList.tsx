'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Conversation } from '@/types/message'

interface ConversationListProps {
  conversations: Conversation[]
  selectedUserId: string | null
  onSelectConversation: (userId: string) => void
  currentUserId: string
}

export function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">💬</div>
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start messaging sellers from the marketplace
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y overflow-y-auto h-full">
      {conversations.map((conv) => (
        <button
          key={conv.other_user_id}
          onClick={() => onSelectConversation(conv.other_user_id)}
          className={`w-full p-4 text-left hover:bg-accent transition-colors ${
            selectedUserId === conv.other_user_id ? 'bg-accent' : ''
          }`}
        >
          <div className="flex gap-3">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={conv.other_user_avatar || undefined} />
              <AvatarFallback>{conv.other_user_name[0] || '?'}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-sm truncate">
                  {conv.other_user_name}
                </p>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                  {formatDistanceToNow(new Date(conv.last_message_time), {
                    addSuffix: true
                  })}
                </span>
              </div>

              {conv.listing_title && (
                <p className="text-xs text-muted-foreground mb-1 truncate">
                  Re: {conv.listing_title}
                </p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate flex-1">
                  {conv.last_message}
                </p>
                {conv.unread_count > 0 && (
                  <Badge variant="default" className="ml-2 h-5 px-2">
                    {conv.unread_count}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
