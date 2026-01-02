-- Create labels table with predefined labels
CREATE TABLE public.labels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL, -- Hex color code
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create post_label_assignments junction table
CREATE TABLE public.post_label_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  label_id UUID REFERENCES public.labels(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(post_id, label_id)
);

-- Enable RLS
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_label_assignments ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX post_label_assignments_post_id_idx ON public.post_label_assignments(post_id);
CREATE INDEX post_label_assignments_label_id_idx ON public.post_label_assignments(label_id);

-- RLS Policies for labels
CREATE POLICY "Anyone can view labels"
  ON public.labels FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage labels"
  ON public.labels FOR ALL
  USING (false); -- Will be managed via SQL or admin panel

-- RLS Policies for post_label_assignments
CREATE POLICY "Anyone can view post label assignments"
  ON public.post_label_assignments FOR SELECT
  USING (true);

CREATE POLICY "Post authors can assign labels to their posts"
  ON public.post_label_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Post authors can remove labels from their posts"
  ON public.post_label_assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );

-- Insert predefined labels
INSERT INTO public.labels (name, color, description) VALUES
  ('Beginner', '#10B981', 'For beginners and newcomers to tennis'),
  ('Intermediate', '#3B82F6', 'For intermediate level players'),
  ('Advanced', '#8B5CF6', 'For advanced and competitive players'),
  ('Equipment', '#F59E0B', 'Discussions about tennis equipment'),
  ('Technique', '#EF4444', 'Tips and discussions about technique'),
  ('Strategy', '#EC4899', 'Game strategy and tactics'),
  ('Fitness', '#14B8A6', 'Fitness and conditioning for tennis'),
  ('News', '#6366F1', 'Tennis news and updates'),
  ('Tournament', '#F97316', 'Tournament discussions and results'),
  ('Question', '#84CC16', 'Questions from the community'),
  ('Doubles', '#06B6D4', 'Doubles-specific content'),
  ('Singles', '#A855F7', 'Singles-specific content');
