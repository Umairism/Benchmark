-- Add profile customization fields to users table
ALTER TABLE users 
ADD COLUMN subjects TEXT[],
ADD COLUMN profile_picture TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN likes TEXT[],
ADD COLUMN dislikes TEXT[],
ADD COLUMN interests TEXT[],
ADD COLUMN social_media JSONB;

-- Remove old faculty column if it exists
ALTER TABLE users DROP COLUMN IF EXISTS faculty;

-- Update RLS policies to allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create storage bucket for profile pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile pictures
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view profile pictures" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can update their own profile pictures" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
