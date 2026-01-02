# Tennis Lover 🎾

A vibrant community platform for tennis enthusiasts to connect, share, and grow together. Built with Next.js 14, Supabase, and deployed to Vercel.

## Features

- **Discussion Feed** - Share tips, stories, and engage in tennis discussions
- **Equipment Marketplace** - Buy, sell, and trade tennis gear (Coming Soon)
- **Skills Exchange** - Find coaches, hitting partners, and practice groups (Coming Soon)
- **User Profiles** - Showcase your tennis journey (Coming Soon)
- **Dual Authentication** - Sign in with Google OAuth or WeChat (via Auth0)
- **Real-time Updates** - Powered by Supabase

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**:
  - Google OAuth via Supabase
  - WeChat OAuth via Auth0 (optional)
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

### 5. Configure Google OAuth 2.0

**Step 1: Set up Google OAuth credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen if needed
6. Select "Web application" as the application type
7. Add **Authorized redirect URIs**:
   - For Supabase Auth: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Replace `your-project-ref` with your actual Supabase project reference ID
   - (You can find this in your Supabase project URL)
8. Click "Create" and copy your Client ID and Client Secret

**Step 2: Configure Supabase**

1. Go to your Supabase Dashboard → Authentication → Providers
2. Find "Google" and toggle it on
3. Paste your Google Client ID
4. Paste your Google Client Secret
5. Click "Save"

**Important:** The OAuth2 flow works like this:
- User clicks "Sign in with Google" → Redirects to Google
- Google authenticates → Redirects to Supabase: `https://your-project-ref.supabase.co/auth/v1/callback`
- Supabase processes auth → Redirects to your app: `http://localhost:3000/auth/callback`
- Your app exchanges code for session

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application!

## 📚 Documentation

For detailed guides, check the `docs/` folder:

- **[OAuth Setup Guide](docs/OAUTH_SETUP.md)** - Google OAuth2 configuration with troubleshooting
- **[Auth0 + WeChat Setup](docs/AUTH0_WECHAT_SETUP.md)** - WeChat login via Auth0 (optional)
- **[Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)** - Step-by-step Vercel deployment guide

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

For complete deployment instructions, see **[docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)**

### Quick Deploy

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Update Supabase URL Configuration with your Vercel URL
5. Deploy!

**Note:** The Google OAuth redirect URI (`https://your-project-ref.supabase.co/auth/v1/callback`) stays the same for both development and production.

## License

MIT License - see LICENSE file for details.
