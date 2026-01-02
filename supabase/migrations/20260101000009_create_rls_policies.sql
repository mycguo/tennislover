-- Users policies
CREATE POLICY "Users can view all profiles"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Anyone can view comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- Post likes policies
CREATE POLICY "Anyone can view likes"
  ON public.post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Equipment listings policies
CREATE POLICY "Anyone can view available listings"
  ON public.equipment_listings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create listings"
  ON public.equipment_listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings"
  ON public.equipment_listings FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete own listings"
  ON public.equipment_listings FOR DELETE
  USING (auth.uid() = seller_id);

-- Skills exchange policies
CREATE POLICY "Anyone can view active exchanges"
  ON public.skills_exchange FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create exchanges"
  ON public.skills_exchange FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exchanges"
  ON public.skills_exchange FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exchanges"
  ON public.skills_exchange FOR DELETE
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update messages (mark as read)"
  ON public.messages FOR UPDATE
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can delete own sent messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- User stats policies
CREATE POLICY "Anyone can view user stats"
  ON public.user_stats FOR SELECT
  USING (true);

CREATE POLICY "System can update user stats"
  ON public.user_stats FOR UPDATE
  USING (true);
