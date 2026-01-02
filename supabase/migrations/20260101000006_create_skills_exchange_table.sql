-- Create skills_exchange table
CREATE TABLE public.skills_exchange (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('offering_coaching', 'seeking_coaching', 'hitting_partner', 'practice_group')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skill_level_target TEXT,
  location TEXT,
  availability TEXT,
  hourly_rate DECIMAL(10, 2),
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.skills_exchange ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX skills_exchange_user_id_idx ON public.skills_exchange(user_id);
CREATE INDEX skills_exchange_type_idx ON public.skills_exchange(type);
CREATE INDEX skills_exchange_status_idx ON public.skills_exchange(status);
CREATE INDEX skills_exchange_created_at_idx ON public.skills_exchange(created_at DESC);
