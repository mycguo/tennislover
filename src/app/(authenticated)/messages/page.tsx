import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { MessagingInterface } from '@/components/messages/MessagingInterface'
import { Card, CardContent } from '@/components/ui/card'

// Force dynamic rendering for searchParams
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    userId?: string
    listingId?: string
  }>
}

export default async function MessagesPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-muted-foreground">Please log in to view messages</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const params = await searchParams

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
      <Suspense
        fallback={
          <Card>
            <CardContent className="py-20 text-center">
              <p className="text-muted-foreground">Loading conversations...</p>
            </CardContent>
          </Card>
        }
      >
        <MessagingInterface
          currentUserId={user.id}
          initialSelectedUserId={params.userId}
          initialListingId={params.listingId}
        />
      </Suspense>
    </div>
  )
}
