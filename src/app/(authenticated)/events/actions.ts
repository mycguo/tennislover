'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { EventWithOrganizer, CreateEventInput, EventRegistrationWithUser } from '@/types/event'

export async function getEvents(filters?: {
  event_type?: string
  skill_level?: string
  status?: string
}): Promise<EventWithOrganizer[]> {
  const supabase = await createClient()

  let query = supabase
    .from('events')
    .select(`
      *,
      organizer:users!organizer_id(id, full_name, avatar_url)
    `)
    .in('status', ['upcoming', 'ongoing'])
    .order('start_date', { ascending: true })

  if (filters?.event_type && filters.event_type !== 'all') {
    query = query.eq('event_type', filters.event_type)
  }

  if (filters?.skill_level && filters.skill_level !== 'all') {
    query = query.eq('skill_level', filters.skill_level)
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data || []
}

export async function getEvent(id: string): Promise<EventWithOrganizer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:users!organizer_id(id, full_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return null
  }

  return data
}

export async function createEvent(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to create an event' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const event_type = formData.get('event_type') as string
  const location = formData.get('location') as string
  const address = formData.get('address') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const registration_deadline = formData.get('registration_deadline') as string
  const max_participants = formData.get('max_participants') as string
  const skill_level = formData.get('skill_level') as string
  const fee = formData.get('fee') as string
  const contact_email = formData.get('contact_email') as string
  const contact_phone = formData.get('contact_phone') as string
  const external_link = formData.get('external_link') as string

  // Validate required fields
  if (!title || !description || !event_type || !location || !start_date) {
    return { error: 'Please fill in all required fields' }
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        organizer_id: user.id,
        title,
        description,
        event_type,
        location,
        address: address || null,
        start_date,
        end_date: end_date || null,
        registration_deadline: registration_deadline || null,
        max_participants: max_participants ? parseInt(max_participants) : null,
        skill_level: skill_level || 'all',
        fee: fee ? parseFloat(fee) : null,
        contact_email: contact_email || user.email || null,
        contact_phone: contact_phone || null,
        external_link: external_link || null,
        status: 'upcoming'
      })
      .select()
      .single()

    if (error) {
      console.error('Database Error:', error)
      return { error: 'Failed to create event' }
    }

    revalidatePath('/events')
    revalidatePath(`/events/${data.id}`)
    return { success: true, eventId: data.id }
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Something went wrong' }
  }
}

export async function updateEventStatus(eventId: string, status: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('events')
    .update({ status })
    .eq('id', eventId)
    .eq('organizer_id', user.id)

  if (error) {
    console.error('Error updating event status:', error)
    return { error: 'Failed to update event status' }
  }

  revalidatePath('/events')
  revalidatePath(`/events/${eventId}`)
  return { success: true }
}

export async function registerForEvent(eventId: string, notes?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to register for events' }
  }

  // Check if event exists and has space
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('max_participants, current_participants')
    .eq('id', eventId)
    .single()

  if (eventError) {
    return { error: 'Event not found' }
  }

  if (event.max_participants && event.current_participants >= event.max_participants) {
    return { error: 'Event is full' }
  }

  // Register user
  const { error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      user_id: user.id,
      notes: notes || null,
      status: 'registered'
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You are already registered for this event' }
    }
    console.error('Error registering for event:', error)
    return { error: 'Failed to register for event' }
  }

  // Update participant count
  await supabase.rpc('increment', {
    table_name: 'events',
    row_id: eventId,
    column_name: 'current_participants'
  })

  revalidatePath('/events')
  revalidatePath(`/events/${eventId}`)
  return { success: true }
}

export async function cancelRegistration(eventId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('event_registrations')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error canceling registration:', error)
    return { error: 'Failed to cancel registration' }
  }

  // Decrement participant count
  const { data: event } = await supabase
    .from('events')
    .select('current_participants')
    .eq('id', eventId)
    .single()

  if (event && event.current_participants > 0) {
    await supabase
      .from('events')
      .update({ current_participants: event.current_participants - 1 })
      .eq('id', eventId)
  }

  revalidatePath('/events')
  revalidatePath(`/events/${eventId}`)
  return { success: true }
}

export async function getEventRegistrations(eventId: string): Promise<EventRegistrationWithUser[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
      *,
      user:users!user_id(id, full_name, avatar_url)
    `)
    .eq('event_id', eventId)
    .order('registration_date', { ascending: true })

  if (error) {
    console.error('Error fetching registrations:', error)
    return []
  }

  return data || []
}

export async function checkUserRegistration(eventId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { data } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .single()

  return !!data
}
