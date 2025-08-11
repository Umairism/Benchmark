# Changelog

All notable changes to the Benchmark Club project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced profile system with O-Level subjects
- Social media links integration
- Public profile viewing system
- Profile discovery through articles and comments

## [2.0.0] - 2025-08-11

### Added
- **Complete Backend Migration to Supabase**
  - Migrated from localStorage to Supabase database
  - Real-time data synchronization
  - Row Level Security (RLS) implementation
  - Secure authentication system

- **Enhanced Profile System**
  - O-Level subjects selection (20 subjects available)
  - Social media links (Facebook, Twitter, Instagram, LinkedIn, GitHub, YouTube)
  - Public profile viewing at `/user/:userId`
  - Profile picture upload with Supabase Storage
  - Bio, likes, dislikes, and interests sections
  - Dynamic add/remove functionality for lists

- **User Discovery Features**
  - Clickable author names in articles
  - Clickable usernames in comments
  - Direct navigation to user profiles
  - Contact integration with email and social media

- **Database Schema Updates**
  - New profile fields: subjects, social_media, bio, likes, dislikes, interests
  - Proper indexing for performance
  - Storage bucket for profile pictures
  - Comprehensive RLS policies

### Changed
- **Breaking**: Faculty field replaced with O-Level subjects array
- **Breaking**: User interface updated with new profile fields
- All database operations now async with proper error handling
- Updated authentication to use Supabase Auth
- Improved responsive design for profile pages

### Fixed
- CORS errors in production deployment
- Authentication state management
- Database connection issues
- Profile picture upload functionality

### Security
- Implemented Row Level Security for all tables
- Secure file upload policies
- User privacy controls
- Protected routes implementation

## [1.0.0] - 2025-08-08

### Added
- **Initial Release**
  - Basic article publishing system
  - User authentication with localStorage
  - Comment system for articles
  - Anonymous confessions feature
  - Admin panel for content management
  - Responsive design with Tailwind CSS

- **Core Features**
  - Article creation and editing
  - User registration and login
  - Role-based access control (User/Admin)
  - Article categories and tags
  - Featured articles system
  - Basic user profiles

- **UI Components**
  - Modern header with navigation
  - Article cards with featured layouts
  - Comment sections with threaded discussions
  - Authentication forms
  - Admin dashboard
  - Responsive footer

### Technical Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons
- LocalStorage for data persistence

## [0.1.0] - 2025-08-05

### Added
- Initial project setup
- Basic React application structure
- Tailwind CSS configuration
- TypeScript configuration
- Basic routing setup

---

## Types of Changes
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities
