import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EventWithOrganizer } from '@/types/event'
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

interface EventCardProps {
  event: EventWithOrganizer
}

const eventTypeLabels: Record<string, string> = {
  tournament: 'Tournament',
  social_play: 'Social Play',
  clinic: 'Clinic',
  league: 'League',
  meetup: 'Meetup',
  other: 'Other'
}

const skillLevelLabels: Record<string, string> = {
  all: 'All Levels',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  professional: 'Professional'
}

export function EventCard({ event }: EventCardProps) {
  const isFull = event.max_participants ? event.current_participants >= event.max_participants : false

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
            <Badge variant="secondary" className="shrink-0">
              {eventTypeLabels[event.event_type]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(event.start_date), 'PPP p')}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>

            {event.max_participants && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {event.current_participants} / {event.max_participants} participants
                  {isFull && <Badge variant="destructive" className="ml-2">Full</Badge>}
                </span>
              </div>
            )}

            {event.fee && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>${event.fee.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.organizer?.avatar_url || undefined} />
                <AvatarFallback>{event.organizer?.full_name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {event.organizer?.full_name || 'Unknown'}
              </span>
            </div>

            {event.skill_level && (
              <Badge variant="outline" className="text-xs">
                {skillLevelLabels[event.skill_level]}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
