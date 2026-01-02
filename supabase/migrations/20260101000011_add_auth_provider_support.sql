-- Add auth_provider column to users table to track authentication method
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'supabase' CHECK (auth_provider IN ('supabase', 'auth0-wechat'));

-- Add external_id column to store Auth0 sub or other provider IDs
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS external_id TEXT;

-- Create index for external_id lookups
CREATE INDEX IF NOT EXISTS users_external_id_idx ON public.users(external_id);

-- Update the handle_new_user function to be compatible with both providers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if this is a Supabase auth user
  -- Auth0 users will be created via the API
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.users (id, email, full_name, avatar_url, auth_provider)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      'supabase'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON COLUMN public.users.auth_provider IS 'Authentication provider: supabase (Google OAuth via Supabase) or auth0-wechat (WeChat via Auth0)';
COMMENT ON COLUMN public.users.external_id IS 'External provider user ID (e.g., Auth0 sub)';
