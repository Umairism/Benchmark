# API Documentation

This document describes the API endpoints and data structures used in the Benchmark Club application.

## 🏗️ Architecture Overview

The Benchmark Club uses Supabase as the backend service, providing:
- PostgreSQL database with Row Level Security
- Real-time subscriptions
- Authentication services
- File storage
- Auto-generated REST API

## 🔐 Authentication

All API requests require authentication through Supabase Auth.

### Authentication Headers
```http
Authorization: Bearer <jwt_token>
apikey: <supabase_anon_key>
```

### User Object
```typescript
interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'user';
  subjects?: string[];
  profile_picture?: string;
  bio?: string;
  likes?: string[];
  dislikes?: string[];
  interests?: string[];
  social_media?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  created_at: string;
  updated_at: string;
}
```

## 📝 Articles API

### Get All Articles
```http
GET /rest/v1/articles?published=eq.true&order=created_at.desc
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Article Title",
    "content": "Full article content...",
    "excerpt": "Brief description...",
    "category": "news",
    "author_id": "uuid",
    "author_name": "Author Name",
    "published": true,
    "featured": false,
    "image_url": "https://...",
    "tags": ["tag1", "tag2"],
    "created_at": "2025-08-11T...",
    "updated_at": "2025-08-11T..."
  }
]
```

### Get Article by ID
```http
GET /rest/v1/articles?id=eq.{article_id}
```

### Create Article
```http
POST /rest/v1/articles
Content-Type: application/json

{
  "title": "New Article",
  "content": "Article content...",
  "excerpt": "Brief description...",
  "category": "news",
  "author_id": "user_uuid",
  "author_name": "Author Name",
  "published": true,
  "featured": false,
  "tags": ["tag1", "tag2"]
}
```

### Update Article
```http
PATCH /rest/v1/articles?id=eq.{article_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "published": true
}
```

### Delete Article
```http
DELETE /rest/v1/articles?id=eq.{article_id}
```

## 💬 Comments API

### Get Comments for Article
```http
GET /rest/v1/comments?article_id=eq.{article_id}&order=created_at.asc
```

**Response:**
```json
[
  {
    "id": "uuid",
    "article_id": "uuid",
    "user_id": "uuid",
    "user_name": "Commenter Name",
    "content": "Comment content...",
    "created_at": "2025-08-11T...",
    "updated_at": "2025-08-11T..."
  }
]
```

### Create Comment
```http
POST /rest/v1/comments
Content-Type: application/json

{
  "article_id": "article_uuid",
  "user_id": "user_uuid",
  "user_name": "User Name",
  "content": "Comment content..."
}
```

### Update Comment
```http
PATCH /rest/v1/comments?id=eq.{comment_id}
Content-Type: application/json

{
  "content": "Updated comment content..."
}
```

### Delete Comment
```http
DELETE /rest/v1/comments?id=eq.{comment_id}
```

## 🔮 Confessions API

### Get All Confessions
```http
GET /rest/v1/confessions?order=created_at.desc
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "content": "Confession content...",
    "created_at": "2025-08-11T...",
    "updated_at": "2025-08-11T..."
  }
]
```

### Create Confession
```http
POST /rest/v1/confessions
Content-Type: application/json

{
  "user_id": "user_uuid",
  "content": "Confession content..."
}
```

### Update Confession
```http
PATCH /rest/v1/confessions?id=eq.{confession_id}
Content-Type: application/json

{
  "content": "Updated confession content..."
}
```

### Delete Confession
```http
DELETE /rest/v1/confessions?id=eq.{confession_id}
```

## 👥 Users API

### Get All Users (Public Profiles)
```http
GET /rest/v1/users?select=id,full_name,email,subjects,bio,likes,dislikes,interests,social_media,profile_picture,created_at
```

### Get User by ID
```http
GET /rest/v1/users?id=eq.{user_id}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "User Name",
  "role": "user",
  "subjects": ["Mathematics", "Physics"],
  "profile_picture": "https://...",
  "bio": "User bio...",
  "likes": ["Reading", "Coding"],
  "dislikes": ["Spam"],
  "interests": ["Technology", "Science"],
  "social_media": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  },
  "created_at": "2025-08-11T...",
  "updated_at": "2025-08-11T..."
}
```

### Update User Profile
```http
PATCH /rest/v1/users?id=eq.{user_id}
Content-Type: application/json

{
  "full_name": "Updated Name",
  "bio": "Updated bio...",
  "subjects": ["Mathematics", "Computer Science"],
  "likes": ["Reading", "Gaming"],
  "dislikes": ["Spam", "Loud noises"],
  "interests": ["AI", "Web Development"],
  "social_media": {
    "github": "https://github.com/newusername",
    "twitter": "https://twitter.com/newusername"
  }
}
```

## 📁 Storage API

### Upload Profile Picture
```http
POST /storage/v1/object/profile-pictures/{user_id}/{filename}
Content-Type: image/*
Authorization: Bearer <jwt_token>

[Binary image data]
```

**Response:**
```json
{
  "Key": "profile-pictures/user_id/filename.jpg"
}
```

### Get Public URL
```http
GET /storage/v1/object/public/profile-pictures/{user_id}/{filename}
```

### Delete File
```http
DELETE /storage/v1/object/profile-pictures/{user_id}/{filename}
Authorization: Bearer <jwt_token>
```

## 🔄 Real-time Subscriptions

### Subscribe to Articles
```javascript
const subscription = supabase
  .channel('articles')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'articles'
  }, (payload) => {
    console.log('Article change:', payload);
  })
  .subscribe();
```

### Subscribe to Comments
```javascript
const subscription = supabase
  .channel('comments')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'comments',
    filter: `article_id=eq.${articleId}`
  }, (payload) => {
    console.log('Comment change:', payload);
  })
  .subscribe();
```

## 🔒 Row Level Security Policies

### Users Table
- **SELECT**: All users can view public profile information
- **UPDATE**: Users can only update their own profile
- **INSERT**: Handled by Supabase Auth
- **DELETE**: Handled by Supabase Auth

### Articles Table
- **SELECT**: Anyone can view published articles, authors can view their own unpublished articles
- **INSERT**: Authenticated users can create articles
- **UPDATE**: Authors can update their own articles
- **DELETE**: Authors can delete their own articles

### Comments Table
- **SELECT**: Anyone can view comments
- **INSERT**: Authenticated users can create comments
- **UPDATE**: Comment authors can update their own comments
- **DELETE**: Comment authors can delete their own comments

### Confessions Table
- **SELECT**: All users can view confessions
- **INSERT**: Authenticated users can create confessions
- **UPDATE**: Confession authors can update their own confessions
- **DELETE**: Confession authors can delete their own confessions

## 📊 Query Examples

### Get Featured Articles with Comments Count
```sql
SELECT 
  articles.*,
  COUNT(comments.id) as comment_count
FROM articles
LEFT JOIN comments ON articles.id = comments.article_id
WHERE articles.featured = true AND articles.published = true
GROUP BY articles.id
ORDER BY articles.created_at DESC;
```

### Get User's Articles with Stats
```sql
SELECT 
  articles.*,
  COUNT(comments.id) as comment_count
FROM articles
LEFT JOIN comments ON articles.id = comments.article_id
WHERE articles.author_id = $user_id
GROUP BY articles.id
ORDER BY articles.created_at DESC;
```

### Search Articles
```sql
SELECT * FROM articles
WHERE (title ILIKE '%search_term%' OR content ILIKE '%search_term%')
AND published = true
ORDER BY created_at DESC;
```

## 🚨 Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "code": "401",
  "message": "Invalid JWT token"
}
```

**403 Forbidden**
```json
{
  "code": "403",
  "message": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "code": "PGRST116",
  "message": "The result contains 0 rows"
}
```

**409 Conflict**
```json
{
  "code": "23505",
  "message": "duplicate key value violates unique constraint"
}
```

## 📈 Rate Limiting

Supabase provides built-in rate limiting:
- 100 requests per minute for anonymous users
- 1000 requests per minute for authenticated users
- Higher limits available with paid plans

## 🔧 SDK Usage Examples

### JavaScript/TypeScript Client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Get articles
const { data: articles, error } = await supabase
  .from('articles')
  .select('*')
  .eq('published', true)
  .order('created_at', { ascending: false });

// Create article
const { data, error } = await supabase
  .from('articles')
  .insert({
    title: 'New Article',
    content: 'Content...',
    author_id: user.id
  });

// Upload file
const { data, error } = await supabase.storage
  .from('profile-pictures')
  .upload(`${user.id}/avatar.jpg`, file);
```

## 📝 Notes

- All timestamps are in ISO 8601 format with timezone
- UUIDs are used for all primary keys
- Array fields (tags, subjects, likes, etc.) are stored as PostgreSQL arrays
- Social media data is stored as JSONB for flexibility
- File uploads require authentication
- Real-time subscriptions work across all tables

---

For more detailed information, refer to the [Supabase API Documentation](https://supabase.com/docs/reference/api).
