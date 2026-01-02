-- Add vote_score to comments
ALTER TABLE public.comments ADD COLUMN vote_score INTEGER DEFAULT 0;

-- Create comment_votes table
CREATE TABLE public.comment_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- RLS
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can vote on comments"
  ON public.comment_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comment votes"
  ON public.comment_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment votes"
  ON public.comment_votes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Comment votes are viewable by everyone"
  ON public.comment_votes FOR SELECT
  USING (true);

-- Function to calculate score
CREATE OR REPLACE FUNCTION get_comment_vote_score(comment_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(vote_type), 0)::INTEGER
  FROM public.comment_votes
  WHERE comment_id = comment_uuid;
$$ LANGUAGE SQL STABLE;

-- Trigger Function
CREATE OR REPLACE FUNCTION update_comment_vote_score()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.comments
  SET vote_score = get_comment_vote_score(
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.comment_id
      ELSE NEW.comment_id
    END
  )
  WHERE id = CASE
    WHEN TG_OP = 'DELETE' THEN OLD.comment_id
    ELSE NEW.comment_id
  END;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_comment_vote_score_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.comment_votes
FOR EACH ROW
EXECUTE FUNCTION update_comment_vote_score();
