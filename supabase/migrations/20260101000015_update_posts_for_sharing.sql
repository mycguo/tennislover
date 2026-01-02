-- Add social sharing metadata to posts table
ALTER TABLE public.posts ADD COLUMN share_count INTEGER DEFAULT 0;

-- Function to increment share count
CREATE OR REPLACE FUNCTION increment_post_share_count(post_uuid UUID)
RETURNS void AS $$
  UPDATE public.posts
  SET share_count = share_count + 1
  WHERE id = post_uuid;
$$ LANGUAGE SQL VOLATILE;

-- Add comment_count column for caching (optional, for performance)
ALTER TABLE public.posts ADD COLUMN comment_count INTEGER DEFAULT 0;

-- Function to update comment count cache
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
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

-- Trigger to update comment count cache
CREATE TRIGGER update_post_comment_count_trigger
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comment_count();

-- Update existing posts to have correct comment counts
UPDATE public.posts
SET comment_count = (
  SELECT COUNT(*)
  FROM public.comments
  WHERE comments.post_id = posts.id
);
