-- Update update_post_vote_score function to use SECURITY DEFINER
-- This is necessary so the trigger can update the posts table even if the user
-- doesn't have permissions to update the post (e.g. they are not the author)
CREATE OR REPLACE FUNCTION update_post_vote_score()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public -- Secure search path
AS $$
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

-- Also update comments trigger function for same reason
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = (
    SELECT COUNT(*)
    FROM public.comments
    WHERE post_id = CASE
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

-- Also update share count function
CREATE OR REPLACE FUNCTION increment_post_share_count(post_uuid UUID)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.posts
  SET share_count = share_count + 1
  WHERE id = post_uuid;
$$ LANGUAGE SQL VOLATILE;

-- Recalculate all scores to fix any inconsistencies
UPDATE public.posts
SET vote_score = (
    SELECT COALESCE(SUM(vote_type), 0)::INTEGER
    FROM public.post_votes
    WHERE post_votes.post_id = posts.id
);
