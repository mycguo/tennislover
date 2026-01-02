# 🚀 Tennis Lover - Vercel Deployment Checklist

Complete checklist for deploying Tennis Lover to Vercel with OAuth2 authentication.

---

## Prerequisites ✅

- [ ] GitHub repository created and code pushed
- [ ] Supabase project created
- [ ] All 10 database migrations run successfully
- [ ] Google Cloud Console project created
- [ ] Vercel account ready

---

## Part 1: Google OAuth2 Setup

### Step 1: Configure Google Cloud Console

1. **Go to:** https://console.cloud.google.com
2. **Navigate to:** APIs & Services → Credentials
3. **Create OAuth 2.0 Client ID**
4. **Application type:** Web application
5. **Add Authorized redirect URIs:**

   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

   ⚠️ **CRITICAL:**
   - Replace `your-project-ref` with YOUR actual Supabase project reference
   - This is the **ONLY** URL needed in Google Console
   - Works for BOTH development and production
   - Example: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`

6. **Copy:** Client ID and Client Secret

**Where to find your Supabase project-ref:**
```
Your Supabase URL: https://abcdefghijklmnop.supabase.co
                           ^^^^^^^^^^^^^^^^
                           This is your project-ref
```

### Step 2: Configure Supabase Authentication

1. **Go to:** Supabase Dashboard → Authentication → Providers
2. **Enable Google provider**
3. **Paste:**
   - Client ID (from Google)
   - Client Secret (from Google)
4. **Save**

✅ **Checkpoint:** Google OAuth2 is now configured!

---

## Part 2: Supabase Configuration

### Step 1: Configure URL Settings (Development)

1. **Go to:** Authentication → URL Configuration
2. **Site URL:** `http://localhost:3000`
3. **Redirect URLs:** Add these:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

### Step 2: Verify Database Migrations

1. **Go to:** SQL Editor
2. **Run this query:**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```
3. **Verify these tables exist:**
   - [ ] users
   - [ ] posts
   - [ ] comments
   - [ ] post_likes
   - [ ] equipment_listings
   - [ ] skills_exchange
   - [ ] messages
   - [ ] user_stats

### Step 3: Get Supabase Credentials

1. **Go to:** Project Settings → API
2. **Copy these values:**
   - [ ] Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - [ ] Anon/Public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## Part 3: Deploy to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Project

1. **Go to:** https://vercel.com
2. **Click:** "Add New" → "Project"
3. **Import** your GitHub repository
4. **Framework Preset:** Next.js (auto-detected)

### Step 3: Configure Environment Variables

In Vercel project settings, add these **three** environment variables:

| Name | Value | Example |
|------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | `https://abcdefgh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | `eyJhbGciOiJIUzI1Ni...` |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL | `https://tennislover.vercel.app` |

⚠️ **Note:** For `NEXT_PUBLIC_SITE_URL`, use your Vercel deployment URL (you'll get this after first deployment)

### Step 4: Deploy

1. **Click:** "Deploy"
2. **Wait** for deployment to complete
3. **Copy** your Vercel deployment URL (e.g., `https://tennislover.vercel.app`)

---

## Part 4: Update Production URLs

### Step 1: Update Vercel Environment Variable

1. **Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Edit:** `NEXT_PUBLIC_SITE_URL`
3. **Set to:** Your actual Vercel URL (e.g., `https://tennislover.vercel.app`)
4. **Save**
5. **Redeploy** (Vercel → Deployments → Three dots → Redeploy)

### Step 2: Update Supabase URLs (Production)

1. **Go to:** Supabase Dashboard → Authentication → URL Configuration
2. **Update Site URL:**
   ```
   https://tennislover.vercel.app
   ```
3. **Add Redirect URLs:**
   ```
   https://tennislover.vercel.app/auth/callback
   https://tennislover.vercel.app/**
   ```
4. **Save**

⚠️ **Important:** Keep the localhost URLs too if you want to develop locally!

---

## Part 5: Test Your Deployment

### Test OAuth2 Flow

1. **Visit:** `https://your-app.vercel.app`
2. **Click:** "Continue with Google"
3. **Expected flow:**
   ```
   Your App → Google Login → Supabase OAuth → Back to Your App → Logged In!
   ```

### Verify the URLs

**OAuth2 Flow Verification:**
1. Click "Continue with Google"
2. Check the URL bar - you should briefly see:
   - Google login page
   - Supabase URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Your app: `https://your-app.vercel.app/auth/callback`
   - Final: `https://your-app.vercel.app/feed`

### Test Creating a Post

1. **Navigate to:** Feed page
2. **Click:** "Create Post"
3. **Fill in:**
   - Title: "Test Post"
   - Category: Discussion
   - Content: "Testing deployment"
4. **Submit**
5. **Verify:** Post appears in feed

---

## Troubleshooting

### Issue: "redirect_uri_mismatch"

**Cause:** Google OAuth redirect URI mismatch

**Fix:**
1. Verify in Google Console the redirect URI is EXACTLY:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
2. Check for typos (common: `/oauth2callback` vs `/auth/v1/callback`)
3. Wait 5 minutes after changing Google settings

### Issue: "Invalid OAuth Client"

**Cause:** Client ID or Secret incorrect in Supabase

**Fix:**
1. Re-copy Client ID and Secret from Google Console
2. Re-paste in Supabase (careful of extra spaces)
3. Save and try again

### Issue: Users redirected but not logged in

**Cause:** Site URL or Redirect URL misconfigured in Supabase

**Fix:**
1. Check Supabase → Authentication → URL Configuration
2. Verify "Site URL" matches your Vercel URL exactly
3. Verify Redirect URL includes `/auth/callback`
4. Try in incognito/private browsing mode

### Issue: Can't create posts (403 error)

**Cause:** Database RLS policies or user not in users table

**Fix:**
1. Check Supabase → Authentication → Users (user should exist)
2. Check Supabase → Table Editor → users (profile should exist)
3. Verify migration #1 ran successfully (creates trigger)

---

## OAuth2 Configuration Summary

### ✅ Correctly Configured

**Google Cloud Console:**
```
Authorized redirect URI: https://your-project-ref.supabase.co/auth/v1/callback
```
☝️ This handles the OAuth2 callback from Google

**Supabase Dashboard:**
```
Site URL: https://your-app.vercel.app
Redirect URL: https://your-app.vercel.app/auth/callback
```
☝️ This tells Supabase where to send users after processing OAuth

**Your Code (AuthButton.tsx):**
```typescript
redirectTo: `${window.location.origin}/auth/callback`
```
☝️ This is where your app handles the final callback

**Environment Variables:**
```
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```
☝️ Used by middleware for redirects

---

## Post-Deployment

### Optional: Custom Domain

1. **Add domain in Vercel:** Settings → Domains
2. **Update Supabase URLs** to use custom domain
3. **Update environment variable** `NEXT_PUBLIC_SITE_URL`
4. **Redeploy**

### Optional: Publish OAuth Consent Screen

For public use, publish your OAuth consent screen in Google Cloud Console:
1. Go to OAuth consent screen
2. Click "Publish App"
3. Submit for verification (if needed)

---

## 🎉 Deployment Complete!

Your Tennis Lover community is now live!

**Share your site:**
- Production URL: `https://your-app.vercel.app`
- Status: ✅ Deployed
- Authentication: ✅ Google OAuth2
- Database: ✅ Supabase PostgreSQL

**Next steps:**
- Share with tennis friends
- Monitor usage in Vercel Analytics
- Check Supabase logs for any issues
- Plan next features (Marketplace, Skills Exchange)

---

## Quick Reference

### All URLs at a Glance

| Purpose | URL | Where to Set |
|---------|-----|--------------|
| **Google OAuth Redirect** | `https://project-ref.supabase.co/auth/v1/callback` | Google Cloud Console |
| **Supabase Site URL** | `https://your-app.vercel.app` | Supabase Dashboard |
| **App Callback Handler** | `https://your-app.vercel.app/auth/callback` | Supabase Redirect URLs |
| **App Home** | `https://your-app.vercel.app` | Environment Variable |

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

---

**Need help?** Check `OAUTH_SETUP.md` for detailed OAuth2 troubleshooting.

Good luck! 🎾
