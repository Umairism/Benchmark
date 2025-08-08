# Supabase Database Setup Guide

This guide will help you set up Supabase as the online database for the Benchmark School System.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed on your system

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `benchmark-school-system`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase/schema.sql` from this project
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- Users table with authentication
- Articles table for blog posts
- Comments table for article discussions
- Confessions table for anonymous posts
- Proper indexes and triggers for performance

## Step 3: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **API Key (anon public)**: Your anonymous public key

## Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_MODE=production
   ```

## Step 5: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the browser console and look for:
   ```
   Database mode: Supabase (Online)
   ```

3. If you see `localStorage (Offline)`, check your environment variables and internet connection.

## Step 6: Row Level Security (Optional but Recommended)

For production use, enable Row Level Security (RLS) on your tables:

1. In Supabase dashboard, go to **Authentication** > **Policies**
2. Enable RLS on each table
3. Create policies based on your security requirements

Example policy for articles (read access):
```sql
CREATE POLICY "Anyone can read published articles" ON articles
FOR SELECT USING (published = true);
```

## Step 7: Authentication Setup (Future Enhancement)

This project currently uses a simple email/password system. For production, consider:

1. Setting up Supabase Auth providers (Google, GitHub, etc.)
2. Implementing proper password hashing
3. Adding email verification
4. Setting up password reset flows

## Hybrid Mode

The application automatically detects whether Supabase is available:

- **Online Mode**: Uses Supabase for data storage
- **Offline Mode**: Falls back to localStorage
- **Sync Feature**: Can sync local data to Supabase when connection is restored

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure your API keys haven't expired

### Schema Issues
- Make sure you ran the complete `schema.sql` file
- Check for any SQL errors in the Supabase dashboard
- Verify all tables were created properly

### Performance
- The schema includes optimized indexes
- Consider enabling database caching in Supabase settings
- Monitor query performance in the Supabase dashboard

## Next Steps

1. Set up automated backups in Supabase
2. Configure monitoring and alerts
3. Set up staging and production environments
4. Implement proper authentication flows
5. Add data validation and sanitization
6. Set up automated testing with your database

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the browser console for error messages
3. Verify your environment configuration
4. Test with a simple query in the Supabase SQL editor

## Security Notes

- Never commit your `.env` file to version control
- Use different databases for development/staging/production
- Regularly rotate your API keys
- Enable RLS policies for production use
- Monitor database usage and set up billing alerts
