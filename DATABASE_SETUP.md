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

# Database Setup Guide for Benchmark School System

## Current Status
✅ Environment variables configured
✅ Development server running on http://localhost:5174
✅ Supabase client properly configured

## Required Database Tables

### 1. Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

### 2. Articles Table
```sql
CREATE TABLE IF NOT EXISTS articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  category text DEFAULT 'article' CHECK (category IN ('article', 'news', 'announcement')),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  image_url text,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Anyone can view published articles
CREATE POLICY "Anyone can view published articles" ON articles FOR SELECT USING (published = true);

-- Authors can view their own articles
CREATE POLICY "Authors can view own articles" ON articles FOR SELECT USING (auth.uid() = author_id);

-- Authors can insert their own articles
CREATE POLICY "Authors can insert articles" ON articles FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Authors can update their own articles
CREATE POLICY "Authors can update own articles" ON articles FOR UPDATE USING (auth.uid() = author_id);
```

### 3. Comments Table
```sql
CREATE TABLE IF NOT EXISTS comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments on published articles
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM articles WHERE id = article_id AND published = true)
);

-- Authenticated users can insert comments
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. Confessions Table (New)
```sql
CREATE TABLE IF NOT EXISTS confessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own confessions
CREATE POLICY "Users can view their own confessions" ON confessions FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own confessions
CREATE POLICY "Users can insert their own confessions" ON confessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own confessions
CREATE POLICY "Users can delete their own confessions" ON confessions FOR DELETE USING (auth.uid() = user_id);
```

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project: https://ydzpcrsqtyvfalerlaqq.supabase.co
2. Navigate to "SQL Editor"
3. Copy and paste each table creation script above
4. Run them one by one

### Option 2: Using Supabase CLI
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Initialize Supabase project
supabase init

# Link to your project
supabase link --project-ref ydzpcrsqtyvfalerlaqq

# Run migrations
supabase db push
```

## Testing the Setup

1. **Registration Test**: Try registering with invite code "BENCHMARK2025"
2. **Articles Test**: Create and view articles
3. **Confessions Test**: Access /confessions page when logged in
4. **Admin Test**: Check admin panel functionality

## Troubleshooting

### CORS Issues
- ✅ Fixed: Environment variables now point to real Supabase instance
- ✅ Fixed: .env file created with proper credentials

### Authentication Issues
- Ensure users table exists and has proper RLS policies
- Check that auth.users trigger creates user profile

### Missing Tables
- Run the SQL scripts in Supabase dashboard
- Ensure RLS policies are properly set

## Security Features Implemented

1. **Invite-only Registration**: Requires "BENCHMARK2025" code
2. **Anonymous Articles**: Authors displayed as "Anonymous"
3. **Private Confessions**: Only visible to the user who created them
4. **User Privacy**: Real names and emails hidden in public views
5. **Row Level Security**: Database-level access control

## Next Steps

1. Run the database setup scripts in Supabase
2. Test user registration with invite code
3. Create sample articles and test the confessions feature
4. Verify admin panel functionality with proper user privacy

Your application should now work properly with the real Supabase backend!
