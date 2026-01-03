import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tennis Events</h1>
        <Button asChild>
          <Link href="/events/create">Create Event</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">Events Coming Soon</h3>
          <p className="text-gray-600 mb-4">Discover and join local tennis tournaments, clinics, and social events</p>
        </CardContent>
      </Card>
    </div>
  )
}
