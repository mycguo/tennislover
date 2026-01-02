# Tennis Lover Documentation

Welcome to the Tennis Lover documentation! This folder contains detailed guides for setting up and deploying your tennis community platform.

## 📖 Available Guides

### [OAuth Setup Guide](OAUTH_SETUP.md)
Complete guide for configuring Google OAuth 2.0 authentication:
- Step-by-step Google Cloud Console setup
- Supabase configuration
- Understanding the OAuth2 flow
- Troubleshooting common issues
- Security best practices

**When to use:** Setting up authentication for the first time, or troubleshooting OAuth issues.

### [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
Comprehensive deployment guide for Vercel:
- Pre-deployment checklist
- Environment variables configuration
- Production URL setup
- Testing procedures
- Post-deployment tasks
- Quick reference tables

**When to use:** Deploying to production, or when you need a complete deployment walkthrough.

## 🚀 Quick Links

### For First-Time Setup
1. Start with the main [README.md](../README.md)
2. Follow the Getting Started section
3. Refer to [OAuth Setup Guide](OAUTH_SETUP.md) for detailed OAuth configuration
4. Use [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) when ready to deploy

### For Troubleshooting
- OAuth issues → [OAuth Setup Guide](OAUTH_SETUP.md) (Troubleshooting section)
- Deployment issues → [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) (Troubleshooting section)

## 📁 Project Documentation Structure

```
tennislover/
├── README.md                    # Main project overview & quick start
├── docs/
│   ├── README.md               # This file
│   ├── OAUTH_SETUP.md          # OAuth2 detailed guide
│   └── DEPLOYMENT_CHECKLIST.md # Vercel deployment guide
├── .env.example                # Environment variables template
└── supabase/
    └── migrations/             # Database migration files
```

## 🔑 Key Concepts

### OAuth2 Flow
The application uses a three-step OAuth2 flow:
1. User → Google Login
2. Google → Supabase (`/auth/v1/callback`)
3. Supabase → Your App (`/auth/callback`)

### Environment Variables
Three required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key
- `NEXT_PUBLIC_SITE_URL` - Your app URL (localhost or production)

### Database Migrations
10 migration files create the complete database schema:
- Users, Posts, Comments, Likes
- Equipment Listings, Skills Exchange
- Messages, User Stats
- RLS Policies, Functions, Triggers

## 🆘 Need Help?

1. Check the relevant guide in this folder
2. Review the troubleshooting sections
3. Verify your environment variables
4. Check Supabase logs (Dashboard → Auth → Logs)
5. Check Vercel deployment logs

## 📝 Contributing to Documentation

If you find issues or want to improve the documentation:
1. All documentation uses Markdown
2. Keep guides focused and actionable
3. Include troubleshooting for common issues
4. Add examples where helpful

---

Happy building! 🎾
