# 🎓 Benchmark Club

A modern, feature-rich club management platform built with React, TypeScript, and Supabase. Designed specifically for student organizations to share knowledge, manage content, and build community connections.

![Benchmark Club](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7)

## 🌟 Features

### 📝 Content Management
- **Article Publishing**: Create, edit, and publish articles with rich content
- **Anonymous Confessions**: Secure confession system for club members
- **Comment System**: Interactive discussions on articles
- **Content Moderation**: Admin tools for content management

### 👥 User Management
- **Secure Authentication**: Powered by Supabase Auth
- **Role-Based Access**: User and Admin roles with different permissions
- **Public Profiles**: Comprehensive user profiles with social media integration
- **Profile Customization**: O-Level subjects, interests, likes/dislikes

### 🎨 Modern Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Adaptive UI components
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design patterns

### 🔐 Security & Performance
- **Row Level Security**: Database-level security with Supabase RLS
- **Real-time Updates**: Live data synchronization
- **Image Storage**: Secure file uploads with Supabase Storage
- **Performance Optimized**: Lazy loading and code splitting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Umairism/Benchmark.git
   cd Benchmark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Go to your Supabase Dashboard
   - Run the SQL scripts in `supabase/schema.sql`
   - Enable Row Level Security
   - Set up Storage buckets

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
Benchmark/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Articles/      # Article-related components
│   │   ├── Auth/          # Authentication components
│   │   ├── Debug/         # Development tools
│   │   └── Layout/        # Layout components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles
├── supabase/              # Database migrations and schema
└── docs/                  # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icon library

### Backend
- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Row Level Security

### Deployment
- **Netlify**: Frontend hosting and CI/CD
- **Supabase Cloud**: Managed backend services

## 📊 Database Schema

### Core Tables
- **users**: User profiles and authentication data
- **articles**: Published content and blog posts
- **comments**: User discussions on articles
- **confessions**: Anonymous confession system

### Key Features
- UUID primary keys for security
- Automatic timestamps with triggers
- Comprehensive indexing for performance
- Row Level Security policies

## 🔐 Authentication & Authorization

### User Roles
- **User**: Can read content, comment, create confessions, manage own profile
- **Admin**: Full access to content moderation and user management

### Security Features
- Email/password authentication via Supabase
- Row Level Security on all tables
- Secure file uploads with access controls
- CSRF protection and secure headers

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### Performance
- Code splitting and lazy loading
- Image optimization
- Efficient re-rendering with React optimization

## 🚀 Deployment

### Production Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository
   - Set environment variables
   - Configure build settings
   - Enable automatic deployments

3. **Configure Supabase**
   - Update Auth settings for production domain
   - Configure CORS settings
   - Set up proper RLS policies

### Environment Variables
```env
# Production
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Development
VITE_SUPABASE_URL=your_development_supabase_url
VITE_SUPABASE_ANON_KEY=your_development_anon_key
```

## 📖 User Guide

### For Students
1. **Sign Up**: Create an account with your email
2. **Profile Setup**: Add your O-Level subjects and interests
3. **Browse Content**: Read articles and join discussions
4. **Share Thoughts**: Comment on articles or submit confessions
5. **Connect**: View other students' profiles and social media

### For Admins
1. **Content Management**: Approve, edit, or remove content
2. **User Management**: Monitor user activity and manage accounts
3. **Analytics**: Track engagement and platform usage
4. **Moderation**: Review and moderate user-generated content

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/Umairism/Benchmark/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/Umairism/Benchmark/discussions)
- **Support**: Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the student community
- Special thanks to the open-source community
- Powered by Supabase and the modern web stack

## 📧 Contact

- **Project Maintainer**: Umair
- **GitHub**: [@Umairism](https://github.com/Umairism)
- **Project Link**: [https://github.com/Umairism/Benchmark](https://github.com/Umairism/Benchmark)

---

**Empowering student communities through technology** 🚀
