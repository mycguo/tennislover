-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_listings_updated_at BEFORE UPDATE ON public.equipment_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_exchange_updated_at BEFORE UPDATE ON public.skills_exchange
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment post count
CREATE OR REPLACE FUNCTION increment_posts_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET posts_count = posts_count + 1
  WHERE user_id = NEW.author_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_created
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION increment_posts_count();

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET comments_count = comments_count + 1
  WHERE user_id = NEW.author_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION increment_comments_count();

-- Function to increment listing count
CREATE OR REPLACE FUNCTION increment_listings_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET listings_count = listings_count + 1
  WHERE user_id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_listing_created
  AFTER INSERT ON public.equipment_listings
  FOR EACH ROW EXECUTE FUNCTION increment_listings_count();

-- Function to increment exchange count
CREATE OR REPLACE FUNCTION increment_exchanges_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET exchanges_count = exchanges_count + 1
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_exchange_created
  AFTER INSERT ON public.skills_exchange
  FOR EACH ROW EXECUTE FUNCTION increment_exchanges_count();

-- Function to get posts with like counts and user has liked
CREATE OR REPLACE FUNCTION get_posts_with_metadata(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  title TEXT,
  content TEXT,
  category TEXT,
  image_url TEXT,
  view_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  likes_count BIGINT,
  comments_count BIGINT,
  user_has_liked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.author_id,
    u.full_name,
    u.avatar_url,
    p.title,
    p.content,
    p.category,
    p.image_url,
    p.view_count,
    p.created_at,
    p.updated_at,
    COUNT(DISTINCT pl.id) AS likes_count,
    COUNT(DISTINCT c.id) AS comments_count,
    CASE
      WHEN user_id_param IS NOT NULL THEN
        EXISTS(SELECT 1 FROM public.post_likes WHERE post_id = p.id AND user_id = user_id_param)
      ELSE FALSE
    END AS user_has_liked
  FROM public.posts p
  LEFT JOIN public.users u ON p.author_id = u.id
  LEFT JOIN public.post_likes pl ON p.id = pl.post_id
  LEFT JOIN public.comments c ON p.id = c.post_id
  GROUP BY p.id, u.full_name, u.avatar_url
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
