import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { getEvents } from './actions'
import { EventList } from '@/components/events/EventList'

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tennis Events</h1>
          <p className="text-muted-foreground mt-1">
            Discover and join local tennis tournaments, clinics, and social events
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/events/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <EventList events={events} />
    </div>
  )
}
