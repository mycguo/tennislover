import { notFound } from 'next/navigation'
import { getEvent, checkUserRegistration, getEventRegistrations } from '../actions'
import { EventDetail } from '@/components/events/EventDetail'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  const isRegistered = user ? await checkUserRegistration(id) : false
  const registrations = await getEventRegistrations(id)
  const isOrganizer = user?.id === event.organizer_id

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" asChild>
        <Link href="/events">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <EventDetail
        event={event}
        isRegistered={isRegistered}
        isOrganizer={isOrganizer}
        registrations={registrations}
        currentUserId={user?.id}
      />
    </div>
  )
}
