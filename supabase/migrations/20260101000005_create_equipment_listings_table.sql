-- Create equipment_listings table
CREATE TABLE public.equipment_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('racquet', 'shoes', 'bag', 'apparel', 'accessories', 'balls')) NOT NULL,
  condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  images TEXT[] DEFAULT '{}',
  location TEXT,
  status TEXT CHECK (status IN ('available', 'pending', 'sold')) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.equipment_listings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX equipment_listings_seller_id_idx ON public.equipment_listings(seller_id);
CREATE INDEX equipment_listings_category_idx ON public.equipment_listings(category);
CREATE INDEX equipment_listings_status_idx ON public.equipment_listings(status);
CREATE INDEX equipment_listings_created_at_idx ON public.equipment_listings(created_at DESC);
