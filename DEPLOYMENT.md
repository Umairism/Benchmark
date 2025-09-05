# Deployment Guide

This guide covers deploying the Benchmark Club application to production environments.

## 🚀 Deployment Options

### Recommended: Netlify + Supabase

The recommended deployment stack for Benchmark Club:
- **Frontend**: Netlify (CDN, CI/CD, Form handling)
- **Backend**: Supabase (Database, Auth, Storage, APIs)

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository with your code
- [ ] Supabase project set up
- [ ] Netlify account
- [ ] Domain name (optional)
- [ ] Environment variables configured

## 🔧 Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Database Schema Setup

Run the complete schema in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create confessions table
CREATE TABLE confessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add profile fields
ALTER TABLE users 
ADD COLUMN subjects TEXT[],
ADD COLUMN profile_picture TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN likes TEXT[],
ADD COLUMN dislikes TEXT[],
ADD COLUMN interests TEXT[],
ADD COLUMN social_media JSONB;

-- Enable RLS and create policies (see full schema in supabase/schema.sql)
```

### 3. Authentication Setup

1. Go to Authentication → Settings
2. Configure your site URL (your Netlify URL)
3. Add redirect URLs for production
4. Enable email authentication
5. Configure email templates (optional)

### 4. Storage Setup

1. Go to Storage
2. Create a `profile-pictures` bucket
3. Set it to public
4. Configure storage policies (included in schema)

## 🌐 Netlify Deployment

### Method 1: Git-based Deployment (Recommended)

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your Benchmark repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   Go to Site settings → Environment variables and add:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be available at a random URL

## 📈 Post-Deployment Testing

### **Functionality Tests**
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login/logout functions
- [ ] Article creation and editing
- [ ] Comment system works
- [ ] Confessions feature works
- [ ] Profile system works
- [ ] Public profile viewing works

### **Database Tests**
- [ ] Data saves to Supabase
- [ ] Profile updates work
- [ ] Image uploads work
- [ ] Social media links save correctly

## 🔒 Security Considerations

### **Database Security**
- Use Row Level Security (RLS) policies
- Regularly rotate API keys
- Monitor database usage
- Set up billing alerts

### **Application Security**
- Validate all user inputs
- Sanitize data before display
- Implement proper error handling
- Use HTTPS in production

## 🛠️ Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Restart development server after changes
   - Check Netlify environment variables

2. **Supabase Connection Issues**
   - Verify project URL and keys
   - Check CORS settings in Supabase
   - Ensure RLS policies are correct

3. **Build Failures**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall

## 📞 Support Resources

- **Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Vite**: [vitejs.dev](https://vitejs.dev)
- **React**: [reactjs.org](https://reactjs.org)

---

**Ready to deploy?** Follow this guide step by step, and your Benchmark Club will be running smoothly in production! 🚀
