# Google OAuth 2.0 Setup Guide

This guide walks you through setting up Google OAuth 2.0 authentication for Tennis Lover.

## Understanding the OAuth2 Flow

The authentication flow works in three steps:

```
1. User → Google Login
2. Google → Supabase Auth (OAuth2 callback)
3. Supabase → Your App (code exchange)
```

## Step-by-Step Setup

### Part 1: Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com

2. **Create/Select Project**
   - Create a new project named "Tennis Lover" or use existing

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" (for public app) or "Internal" (for organization only)
   - Fill in:
     - App name: `Tennis Lover`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Skip scopes (default scopes are fine)
   - Add test users if needed
   - Click "Save and Continue"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `Tennis Lover Web Client`
   - **Authorized redirect URIs** (CRITICAL):
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
     Replace `your-project-ref` with your actual Supabase project reference

   - Click "Create"
   - **Copy your Client ID and Client Secret** - you'll need these!

### Part 2: Find Your Supabase Project Reference

Your Supabase project reference is in your project URL:

```
https://abcdefghijklmnop.supabase.co
         ^^^^^^^^^^^^^^^^
         This is your project-ref
```

So your OAuth redirect URI becomes:
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

### Part 3: Configure Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Enable Google Provider**
   - Navigate to: Authentication → Providers
   - Find "Google" in the list
   - Toggle it **ON**

3. **Add Google Credentials**
   - Paste your **Client ID** from Google
   - Paste your **Client Secret** from Google
   - Click **Save**

4. **Configure Site URL** (Optional but recommended)
   - Go to: Authentication → URL Configuration
   - Set "Site URL" to: `http://localhost:3000` (for development)
   - Add "Redirect URLs":
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**` (wildcard for all routes)

## Testing Your Setup

### 1. Create `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test OAuth Flow

1. Visit: http://localhost:3000
2. Click "Continue with Google"
3. You should see Google's login screen
4. After login, you should be redirected back to your app at `/feed`

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** The redirect URI in Google Console doesn't match what Supabase is sending.

**Fix:**
1. Check your Supabase project URL is correct
2. Ensure you used: `https://your-project-ref.supabase.co/auth/v1/callback`
3. Make sure there are no trailing slashes
4. Wait 5 minutes after saving (Google can take time to propagate)

### Error: "Invalid client"

**Cause:** Client ID or Secret is incorrect.

**Fix:**
1. Double-check you copied the entire Client ID and Secret
2. Make sure there are no extra spaces
3. Re-save in Supabase dashboard

### Users can't sign in

**Cause:** OAuth consent screen not published or test users not added.

**Fix:**
1. Go to OAuth consent screen in Google Console
2. If in "Testing" mode, add users to test users list
3. Or publish the app (requires verification for production)

## Production Deployment

When deploying to production (Vercel):

### 1. Update Google Console

Add production redirect URI:
```
https://your-project-ref.supabase.co/auth/v1/callback
```
(Same URL - works for both dev and production!)

### 2. Update Supabase

Go to Authentication → URL Configuration:
- Site URL: `https://your-domain.vercel.app`
- Add Redirect URL: `https://your-domain.vercel.app/auth/callback`

### 3. Update Vercel Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## Security Best Practices

✅ **DO:**
- Keep Client Secret confidential
- Use environment variables (never commit `.env.local`)
- Enable Row Level Security on Supabase tables
- Use HTTPS in production

❌ **DON'T:**
- Commit `.env.local` to Git
- Share your Client Secret publicly
- Use `localhost` URLs in production
- Disable security features

## Need Help?

- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Check Supabase logs: Dashboard → Auth → Logs

---

That's it! Your Google OAuth 2.0 setup is complete. 🎾
