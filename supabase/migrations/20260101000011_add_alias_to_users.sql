-- Add alias column to users table
ALTER TABLE public.users ADD COLUMN alias TEXT;

-- Create index for faster alias lookups (optional, for future features)
CREATE INDEX users_alias_idx ON public.users(alias);

-- Add comment to document the column
COMMENT ON COLUMN public.users.alias IS 'User-chosen display name shown instead of real name in posts and comments';
