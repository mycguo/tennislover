import { CreateEventForm } from '@/components/events/CreateEventForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" asChild>
        <Link href="/events">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>

      <CreateEventForm />
    </div>
  )
}
