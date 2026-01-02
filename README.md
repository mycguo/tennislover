# Tennis Lover 🎾

A vibrant community platform for tennis enthusiasts to connect, share, and grow together. Built with Next.js 14, Supabase, and deployed to Vercel.

## Features

- **Discussion Feed** - Share tips, stories, and engage in tennis discussions
- **Equipment Marketplace** - Buy, sell, and trade tennis gear (Coming Soon)
- **Skills Exchange** - Find coaches, hitting partners, and practice groups (Coming Soon)
- **User Profiles** - Showcase your tennis journey (Coming Soon)
- **Google OAuth** - Secure and fast authentication
- **Real-time Updates** - Powered by Supabase

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Google OAuth via Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Google OAuth credentials (for authentication)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site URL (for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Database Migrations

Go to your Supabase project → SQL Editor and run each migration file in order (01 through 10):

1. Open `supabase/migrations/20260101000001_create_users_table.sql`
2. Copy and paste into SQL Editor
3. Click "Run"
4. Repeat for all 10 migration files in order

### 5. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/auth/callback`
4. In Supabase Dashboard → Authentication → Providers:
   - Enable Google provider
   - Add your Google Client ID and Secret

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application!

## Project Structure

```
src/
├── app/
│   ├── (authenticated)/      # Protected routes (feed, marketplace, etc.)
│   ├── auth/                 # Authentication routes
│   └── page.tsx              # Landing page
├── components/
│   ├── landing/              # Landing page components
│   ├── layout/               # Header, Footer
│   └── ui/                   # shadcn/ui components
└── lib/
    └── supabase/             # Supabase clients
```

## Database Schema

- **users** - User profiles with tennis stats
- **posts** - Discussion posts with categories
- **comments** - Nested comments on posts
- **post_likes** - Like system
- **equipment_listings** - Marketplace items
- **skills_exchange** - Coaching/hitting partner listings
- **messages** - Direct messaging
- **user_stats** - Activity tracking

All tables have Row Level Security (RLS) enabled.

## Deployment to Vercel

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

Update Google OAuth with production URL: `https://your-domain.vercel.app/auth/callback`

## License

MIT License - see LICENSE file for details.
