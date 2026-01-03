export type EventType = 'tournament' | 'social_play' | 'clinic' | 'league' | 'meetup' | 'other'
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type SkillLevel = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'professional'
export type RegistrationStatus = 'registered' | 'waitlist' | 'cancelled'

export interface Event {
  id: string
  organizer_id: string
  title: string
  description: string
  event_type: EventType
  location: string
  address?: string
  start_date: string
  end_date?: string
  registration_deadline?: string
  max_participants?: number
  current_participants: number
  skill_level?: SkillLevel
  fee?: number
  contact_email?: string
  contact_phone?: string
  external_link?: string
  image_url?: string
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface EventWithOrganizer extends Event {
  organizer: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export interface EventRegistration {
  id: string
  event_id: string
  user_id: string
  status: RegistrationStatus
  registration_date: string
  notes?: string
}

export interface EventRegistrationWithUser extends EventRegistration {
  user: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export interface CreateEventInput {
  title: string
  description: string
  event_type: EventType
  location: string
  address?: string
  start_date: string
  end_date?: string
  registration_deadline?: string
  max_participants?: number
  skill_level?: SkillLevel
  fee?: number
  contact_email?: string
  contact_phone?: string
  external_link?: string
  image_url?: string
}
