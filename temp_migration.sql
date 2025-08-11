-- Add new profile columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subjects TEXT[],
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS likes TEXT[],
ADD COLUMN IF NOT EXISTS dislikes TEXT[],
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS social_media JSONB;

-- Remove old faculty column if it exists
ALTER TABLE users DROP COLUMN IF EXISTS faculty;

-- Update RLS policies to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
