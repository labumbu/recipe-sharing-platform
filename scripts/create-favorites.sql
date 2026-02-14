-- SQL script to create favorites table
-- Run this in Supabase SQL Editor

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(recipe_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON favorites(recipe_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for favorites
-- Anyone can view favorites (for public recipe stats)
CREATE POLICY "Anyone can view favorites"
  ON favorites FOR SELECT
  USING (true);

-- Authenticated users can add favorites
CREATE POLICY "Authenticated users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
