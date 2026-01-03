-- Create events table for tennis events
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT CHECK (event_type IN ('tournament', 'social_play', 'clinic', 'league', 'meetup', 'other')) NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  skill_level TEXT CHECK (skill_level IN ('all', 'beginner', 'intermediate', 'advanced', 'professional')),
  fee DECIMAL(10, 2),
  contact_email TEXT,
  contact_phone TEXT,
  external_link TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX events_organizer_id_idx ON public.events(organizer_id);
CREATE INDEX events_event_type_idx ON public.events(event_type);
CREATE INDEX events_status_idx ON public.events(status);
CREATE INDEX events_start_date_idx ON public.events(start_date DESC);
CREATE INDEX events_location_idx ON public.events(location);

-- RLS Policies
-- Everyone can view upcoming and ongoing events
CREATE POLICY "Everyone can view active events"
  ON public.events FOR SELECT
  USING (status IN ('upcoming', 'ongoing'));

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

-- Organizers can update their own events
CREATE POLICY "Organizers can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Organizers can delete their own events
CREATE POLICY "Organizers can delete own events"
  ON public.events FOR DELETE
  USING (auth.uid() = organizer_id);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('registered', 'waitlist', 'cancelled')) DEFAULT 'registered',
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  notes TEXT,
  UNIQUE(event_id, user_id)
);

-- Enable RLS on event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create indexes for event_registrations
CREATE INDEX event_registrations_event_id_idx ON public.event_registrations(event_id);
CREATE INDEX event_registrations_user_id_idx ON public.event_registrations(user_id);

-- RLS Policies for event_registrations
-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Event organizers can view registrations for their events
CREATE POLICY "Organizers can view event registrations"
  ON public.event_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_registrations.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Authenticated users can register for events
CREATE POLICY "Users can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can cancel their own registrations
CREATE POLICY "Users can cancel own registrations"
  ON public.event_registrations FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own registrations
CREATE POLICY "Users can delete own registrations"
  ON public.event_registrations FOR DELETE
  USING (auth.uid() = user_id);
