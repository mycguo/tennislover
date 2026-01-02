-- Create post_images table for multiple images per post
CREATE TABLE public.post_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  display_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX post_images_post_id_idx ON public.post_images(post_id);
CREATE INDEX post_images_display_order_idx ON public.post_images(post_id, display_order);

-- RLS Policies
CREATE POLICY "Anyone can view post images"
  ON public.post_images FOR SELECT
  USING (true);

CREATE POLICY "Post authors can add images to their posts"
  ON public.post_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Post authors can update their post images"
  ON public.post_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Post authors can delete their post images"
  ON public.post_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );
