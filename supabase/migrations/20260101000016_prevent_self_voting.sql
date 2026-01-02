-- Disallowing users to vote on their own posts
DROP POLICY IF EXISTS "Authenticated users can vote on posts" ON public.post_votes;

CREATE POLICY "Authenticated users can vote on posts"
  ON public.post_votes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    NOT EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_id AND author_id = auth.uid()
    )
  );
