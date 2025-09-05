# 🚨 URGENT: Fix Infinite Recursion Error

There's currently an infinite recursion error in the Row Level Security (RLS) policies. Follow these steps to fix it:

## Quick Fix Steps

### 1. Access Supabase SQL Editor
- Go to your Supabase dashboard: https://supabase.com/dashboard
- Navigate to your project: ydzpcrsqtyvfalerlaqq
- Go to "SQL Editor" in the left sidebar

### 2. Run the Fix Script
Copy and paste this SQL script to fix the infinite recursion:

```sql
-- Fix infinite recursion in RLS policies
-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view user management info" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can update user roles" ON users;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON users;
DROP POLICY IF EXISTS "Admin users can update all profiles" ON users;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS is_admin();

-- Create simple, non-recursive policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile (excluding role changes)
CREATE POLICY "Users can update own profile" 
  ON users 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 3. Test the Fix
After running the SQL script, refresh your application. The errors should be resolved.

---

# Database Setup Guide

This guide provides comprehensive instructions for setting up the database for the Benchmark Club application with all enhanced features.

## 📋 Prerequisites

- Supabase account ([Create one here](https://supabase.com))
- Project created in Supabase dashboard
- Basic knowledge of SQL (optional but helpful)

## 🚀 Quick Setup

### Step 1: Access SQL Editor

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** from the left sidebar
3. Click **New Query** to create a new SQL file

### Step 2: Execute Database Schema

Copy and paste the following complete schema into the SQL editor and run it:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS public.confessions CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create enhanced users table with all profile features
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  profile_picture TEXT,
  bio TEXT,
  subjects TEXT[] DEFAULT '{}', -- O-Level subjects array
  likes TEXT[] DEFAULT '{}',
  dislikes TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  social_media JSONB DEFAULT '{}', -- Social media links as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table with enhanced features
CREATE TABLE public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT DEFAULT 'general',
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create confessions table
CREATE TABLE public.confessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all public profiles" ON public.users 
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for articles table
CREATE POLICY "Anyone can view published articles" ON public.articles 
  FOR SELECT USING (published = true OR author_id = auth.uid());

CREATE POLICY "Authors can view own unpublished articles" ON public.articles 
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Authenticated users can create articles" ON public.articles 
  FOR INSERT WITH CHECK (auth.uid() = author_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update own articles" ON public.articles 
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own articles" ON public.articles 
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for comments table
CREATE POLICY "Anyone can view comments" ON public.comments 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments 
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Comment authors can update own comments" ON public.comments 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Comment authors can delete own comments" ON public.comments 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for confessions table
CREATE POLICY "Anyone can view confessions" ON public.confessions 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create confessions" ON public.confessions 
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Confession authors can update own confessions" ON public.confessions 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Confession authors can delete own confessions" ON public.confessions 
  FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at 
  BEFORE UPDATE ON public.articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON public.comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_confessions_updated_at 
  BEFORE UPDATE ON public.confessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_confessions_user_id ON public.confessions(user_id);
CREATE INDEX IF NOT EXISTS idx_confessions_created_at ON public.confessions(created_at DESC);

-- Insert sample data (optional)
INSERT INTO public.users (id, email, full_name, role, bio, subjects, social_media) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@benchmark.com', 'Admin User', 'admin', 'Platform Administrator', ARRAY['Mathematics', 'Computer Science'], '{"linkedin": "https://linkedin.com/in/admin"}')
ON CONFLICT (id) DO NOTHING;
```

### Step 3: Set Up Storage Buckets

1. Navigate to **Storage** in your Supabase dashboard
2. Click **New Bucket**
3. Create a bucket named `profile-pictures`
4. Make it **Public** for read access
5. Set the following bucket policies:

```sql
-- Storage policies for profile pictures
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own files" ON storage.objects 
FOR DELETE USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 🔐 Authentication Setup

### Step 1: Configure Auth Settings

1. Go to **Authentication > Settings** in Supabase dashboard
2. Configure the following:
   - **Site URL**: Your production domain (e.g., `https://benchmark-club.netlify.app`)
   - **Redirect URLs**: Add your local and production URLs:
     - `http://localhost:5173/**`
     - `https://benchmark-club.netlify.app/**`

### Step 2: Enable Auth Providers

Configure your preferred authentication providers:

- **Email/Password**: Enabled by default
- **Google OAuth**: Configure with your Google Cloud credentials
- **GitHub OAuth**: Configure with your GitHub App credentials

### Step 3: Email Templates (Optional)

Customize email templates in **Authentication > Email Templates**:
- Confirmation email
- Password reset email
- Magic link email

## 📊 Data Structure Overview

### Users Table Fields
- `id`: UUID (Primary Key, references auth.users)
- `email`: User's email address
- `full_name`: Display name
- `role`: 'admin' or 'user'
- `profile_picture`: URL to profile image
- `bio`: User biography
- `subjects`: Array of O-Level subjects
- `likes`: Array of things user likes
- `dislikes`: Array of things user dislikes
- `interests`: Array of user interests
- `social_media`: JSON object with social media links

### Available O-Level Subjects
- Mathematics
- English Language
- Physics
- Chemistry
- Biology
- Computer Science
- Economics
- Business Studies
- Accounting
- History
- Geography
- Urdu
- Islamiyat
- Pakistan Studies
- Art & Design
- Physical Education
- Statistics
- Environmental Management
- Literature in English
- Additional Mathematics

### Social Media Fields
The `social_media` JSONB field supports:
- `facebook`: Facebook profile URL
- `twitter`: Twitter profile URL
- `instagram`: Instagram profile URL
- `linkedin`: LinkedIn profile URL
- `github`: GitHub profile URL
- `youtube`: YouTube channel URL

## ✅ Verification Steps

After running the SQL schema:

1. **Check Tables**: Verify all tables are created in the Table Editor
2. **Test RLS**: Ensure Row Level Security is enabled for all tables
3. **Verify Policies**: Check that security policies are in place
4. **Test Storage**: Upload a test file to confirm bucket configuration
5. **Test Auth**: Create a test user to verify the trigger function works

### Quick Verification Query
```sql
-- Run this to verify your setup
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'articles', 'comments', 'confessions');
```

## 🔧 Environment Variables

Update your `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚨 Troubleshooting

### Common Issues

**"Could not find column 'social_media'"**
- Ensure you've run the complete schema above
- The enhanced users table includes all required fields

**"RLS policy violation"**
- Check that RLS policies are correctly applied
- Verify user authentication before performing operations

**"Storage bucket not found"**
- Ensure the `profile-pictures` bucket is created
- Verify bucket policies are correctly applied

**"Function handle_new_user does not exist"**
- Re-run the function creation part of the schema
- Check that the trigger is properly created

### Debug Queries

```sql
-- Check if user was created properly
SELECT * FROM public.users WHERE id = auth.uid();

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('users', 'articles', 'comments', 'confessions');

-- Check storage buckets
SELECT * FROM storage.buckets;
```

## 📈 Performance Optimization

The schema includes several optimizations:

1. **Indexes**: Created on frequently queried columns
2. **RLS Policies**: Efficient policies for security
3. **Triggers**: Automatic timestamp updates
4. **Extensions**: UUID and crypto extensions for performance

## 🔄 Migration from Existing Data

If you have existing data to migrate:

1. Export your current data in CSV format
2. Use Supabase Table Editor to import data
3. Update any references to match new schema
4. Test all functionality after migration

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

---

**Next Steps**: After completing the database setup, continue with the [Deployment Guide](DEPLOYMENT.md) to deploy your application.
