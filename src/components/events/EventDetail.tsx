'use client'

import { EventWithOrganizer, EventRegistrationWithUser } from '@/types/event'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { registerForEvent, cancelRegistration } from '@/app/(authenticated)/events/actions'
import { useState, useTransition } from 'react'

interface EventDetailProps {
  event: EventWithOrganizer
  isRegistered: boolean
  isOrganizer: boolean
  registrations: EventRegistrationWithUser[]
  currentUserId?: string
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

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  upcoming: 'default',
  ongoing: 'secondary',
  completed: 'outline',
  cancelled: 'destructive'
}

export function EventDetail({
  event,
  isRegistered,
  isOrganizer,
  registrations,
  currentUserId
}: EventDetailProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isFull = event.max_participants
    ? event.current_participants >= event.max_participants
    : false

  const canRegister =
    currentUserId &&
    !isRegistered &&
    !isOrganizer &&
    !isFull &&
    event.status === 'upcoming'

  const handleRegister = () => {
    setError(null)
    startTransition(async () => {
      const result = await registerForEvent(event.id)
      if (result.error) {
        setError(result.error)
      }
    })
  }

  const handleCancelRegistration = () => {
    setError(null)
    startTransition(async () => {
      const result = await cancelRegistration(event.id)
      if (result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <div className="flex gap-2 shrink-0">
            <Badge variant="secondary">{eventTypeLabels[event.event_type]}</Badge>
            <Badge variant={statusColors[event.status]}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
          </div>
        </div>
        {event.skill_level && (
          <Badge variant="outline" className="mb-4">
            {skillLevelLabels[event.skill_level]}
          </Badge>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Registration Actions */}
      {currentUserId && event.status === 'upcoming' && (
        <div className="flex gap-3">
          {canRegister && (
            <Button onClick={handleRegister} disabled={isPending} size="lg">
              {isPending ? 'Registering...' : 'Register for Event'}
            </Button>
          )}
          {isRegistered && !isOrganizer && (
            <Button
              onClick={handleCancelRegistration}
              disabled={isPending}
              variant="outline"
              size="lg"
            >
              {isPending ? 'Canceling...' : 'Cancel Registration'}
            </Button>
          )}
          {isFull && !isRegistered && !isOrganizer && (
            <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">This event is full</span>
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(event.start_date), 'PPPP p')}
                  </p>
                </div>
              </div>

              {event.end_date && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">End Date</p>
                    <p className="text-muted-foreground">
                      {format(new Date(event.end_date), 'PPPP p')}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{event.location}</p>
                  {event.address && (
                    <p className="text-sm text-muted-foreground mt-1">{event.address}</p>
                  )}
                </div>
              </div>

              {event.max_participants && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-muted-foreground">
                        {event.current_participants} / {event.max_participants} registered
                      </p>
                    </div>
                  </div>
                </>
              )}

              {event.fee && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Registration Fee</p>
                      <p className="text-muted-foreground">${event.fee.toFixed(2)}</p>
                    </div>
                  </div>
                </>
              )}

              {event.registration_deadline && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Registration Deadline</p>
                      <p className="text-muted-foreground">
                        {format(new Date(event.registration_deadline), 'PPP p')}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Participants List (only for organizer) */}
          {isOrganizer && registrations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Registered Participants ({registrations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {registrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <Avatar>
                        <AvatarImage src={registration.user?.avatar_url || undefined} />
                        <AvatarFallback>
                          {registration.user?.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{registration.user?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">
                          Registered {format(new Date(registration.registration_date), 'PP')}
                        </p>
                        {registration.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Note: {registration.notes}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">{registration.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizer */}
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={event.organizer?.avatar_url || undefined} />
                  <AvatarFallback>{event.organizer?.full_name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.organizer?.full_name || 'Unknown'}</p>
                  {isOrganizer && (
                    <Badge variant="secondary" className="mt-1">
                      You
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {(event.contact_email || event.contact_phone || event.external_link) && (
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${event.contact_email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {event.contact_email}
                    </a>
                  </div>
                )}
                {event.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${event.contact_phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {event.contact_phone}
                    </a>
                  </div>
                )}
                {event.external_link && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={event.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      External Link
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
