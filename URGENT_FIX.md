# 🚨 URGENT FIX REQUIRED

## Problem
Your application is experiencing infinite recursion errors due to Row Level Security (RLS) policies.

## Quick Solution
Run this SQL script in your Supabase dashboard:

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project: ydzpcrsqtyvfalerlaqq
- Navigate to: SQL Editor

### 2. Copy and Run This Script
```sql
-- Fix infinite recursion in RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view user management info" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can update user roles" ON users;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON users;
DROP POLICY IF EXISTS "Admin users can update all profiles" ON users;
DROP FUNCTION IF EXISTS is_admin();

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 3. Refresh Your Application
After running the script, your application should work normally.

---

**This fix will resolve the 500 errors you're seeing.**
