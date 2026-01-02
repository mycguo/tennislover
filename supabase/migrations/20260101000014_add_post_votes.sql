-- Drop old post_likes table (breaking change)
DROP TABLE IF EXISTS public.post_likes CASCADE;

-- Create post_votes table for upvote/downvote system
CREATE TABLE public.post_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 for downvote, 1 for upvote
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.post_votes ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX post_votes_post_id_idx ON public.post_votes(post_id);
CREATE INDEX post_votes_user_id_idx ON public.post_votes(user_id);

-- RLS Policies
CREATE POLICY "Anyone can view votes"
  ON public.post_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote on posts"
  ON public.post_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.post_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes"
  ON public.post_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Function to calculate vote score for a post
CREATE OR REPLACE FUNCTION get_post_vote_score(post_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(vote_type), 0)::INTEGER
  FROM public.post_votes
  WHERE post_id = post_uuid;
$$ LANGUAGE SQL STABLE;

-- Function to get user's vote on a post
CREATE OR REPLACE FUNCTION get_user_vote(post_uuid UUID, user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT vote_type
  FROM public.post_votes
  WHERE post_id = post_uuid AND user_id = user_uuid;
$$ LANGUAGE SQL STABLE;

-- Add vote_score column to posts for caching (optional, for performance)
ALTER TABLE public.posts ADD COLUMN vote_score INTEGER DEFAULT 0;

-- Function to update vote score cache
CREATE OR REPLACE FUNCTION update_post_vote_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET vote_score = get_post_vote_score(
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.post_id
      ELSE NEW.post_id
    END
  )
  WHERE id = CASE
    WHEN TG_OP = 'DELETE' THEN OLD.post_id
    ELSE NEW.post_id
  END;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vote score cache
CREATE TRIGGER update_post_vote_score_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.post_votes
FOR EACH ROW
EXECUTE FUNCTION update_post_vote_score();
