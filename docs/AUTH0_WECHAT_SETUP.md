# Auth0 + WeChat Login Setup Guide

This guide walks you through setting up WeChat login via Auth0 for the Tennis Lover platform.

## Architecture Overview

Tennis Lover uses a **dual authentication system**:

```
Google OAuth → Supabase Auth → Your App
WeChat OAuth → Auth0 → Your App → Supabase
```

### Why This Architecture?

- **Supabase** doesn't natively support WeChat OAuth
- **Auth0** has built-in WeChat support and handles the OAuth flow
- **Dual system** keeps existing Google users on Supabase while adding WeChat
- **Unified experience** - both auth methods sync to the same Supabase database

## Prerequisites

1. **Auth0 Account** (free tier works)
2. **WeChat Open Platform Account** (requires verification)
3. **Existing Supabase setup** (for Google OAuth)

---

## Part 1: WeChat Open Platform Setup

### Step 1: Register on WeChat Open Platform

1. **Go to:** https://open.weixin.qq.com/
2. **Register** for an account (requires Chinese phone number)
3. **Verify** your identity:
   - Personal: ID verification
   - Business: Business license + bank account

⚠️ **Note:** Verification can take 2-4 weeks

### Step 2: Create a Website Application

1. **Navigate to:** 管理中心 (Management Center)
2. **Click:** 网站应用 (Website Application)
3. **Create New Application**
4. **Fill in details:**
   - Application Name: Tennis Lover
   - Application Domain: `https://your-domain.com`
   - Callback URL: `https://your-tenant.auth0.com/login/callback`

5. **Submit for review** (approval takes 1-3 business days)

### Step 3: Get WeChat Credentials

Once approved:
1. **Copy your AppID** (WeChat application ID)
2. **Copy your AppSecret**
3. **Save these** - you'll need them for Auth0

---

## Part 2: Auth0 Setup

### Step 1: Create Auth0 Account

1. **Go to:** https://auth0.com
2. **Sign up** for free account
3. **Create a tenant:**
   - Tenant Domain: `your-tennislover` (becomes `your-tennislover.us.auth0.com`)
   - Region: Choose closest to your users

### Step 2: Create an Application

1. **Go to:** Applications → Applications
2. **Create Application:**
   - Name: Tennis Lover
   - Type: **Regular Web Applications**
3. **Click:** Create

### Step 3: Configure Application Settings

In your application settings:

**Allowed Callback URLs:**
```
http://localhost:3000/auth/auth0-callback
https://your-domain.vercel.app/auth/auth0-callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
https://your-domain.vercel.app
```

**Allowed Web Origins:**
```
http://localhost:3000
https://your-domain.vercel.app
```

**Save Changes**

### Step 4: Get Auth0 Credentials

Copy these from your application:
- **Domain:** `your-tennislover.us.auth0.com`
- **Client ID:** Found in Basic Information
- **Client Secret:** Found in Basic Information

### Step 5: Enable WeChat Social Connection

1. **Go to:** Authentication → Social
2. **Find:** WeChat
3. **Click:** Enable
4. **Enter WeChat credentials:**
   - **Client ID:** Your WeChat AppID
   - **Client Secret:** Your WeChat AppSecret
5. **Applications tab:** Enable for "Tennis Lover"
6. **Save**

---

## Part 3: Configure Tennis Lover Application

### Step 1: Update Environment Variables

Add these to your `.env.local`:

```bash
# Auth0 Configuration
AUTH0_SECRET='use-openssl-rand-hex-32-to-generate'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tennislover.us.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
```

**Generate AUTH0_SECRET:**
```bash
openssl rand -hex 32
```

### Step 2: Run Database Migration

Run the new migration to add auth provider support:

```sql
-- File: supabase/migrations/20260101000011_add_auth_provider_support.sql
```

In Supabase Dashboard → SQL Editor:
1. Copy the migration content
2. Paste and run
3. Verify `auth_provider` and `external_id` columns were added to `users` table

### Step 3: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000:
1. You should see both **Google** and **WeChat** login buttons
2. Click WeChat button
3. Should redirect to WeChat login (if in China) or Auth0 login page

---

## Part 4: Production Deployment

### Step 1: Update Vercel Environment Variables

Add to Vercel dashboard:
```
AUTH0_SECRET=your-generated-secret
AUTH0_BASE_URL=https://your-domain.vercel.app
AUTH0_ISSUER_BASE_URL=https://your-tennislover.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

### Step 2: Update Auth0 Settings

In Auth0 Application settings, ensure production URLs are added:
- Callback: `https://your-domain.vercel.app/auth/auth0-callback`
- Logout: `https://your-domain.vercel.app`
- Web Origins: `https://your-domain.vercel.app`

### Step 3: Update WeChat Application

In WeChat Open Platform, add production callback:
```
https://your-tennislover.auth0.com/login/callback
```

### Step 4: Deploy

```bash
git add .
git commit -m "Add WeChat login via Auth0"
git push origin main
```

Vercel will auto-deploy.

---

## Authentication Flow Details

### Google Login Flow (Existing)
```
1. User clicks "Continue with Google"
2. → Google OAuth (accounts.google.com)
3. → Supabase Auth (your-project.supabase.co/auth/v1/callback)
4. → Your App (/auth/callback)
5. → Supabase creates session
6. → Redirect to /feed
```

### WeChat Login Flow (New)
```
1. User clicks "Continue with WeChat"
2. → Auth0 (/api/auth/login)
3. → WeChat OAuth (open.weixin.qq.com)
4. → Auth0 processes (your-tenant.auth0.com/login/callback)
5. → Your App (/auth/auth0-callback)
6. → Check if user exists in Supabase
7. → Create user if needed (with auth_provider='auth0-wechat')
8. → Redirect to /feed
```

### Key Differences

| Aspect | Google (Supabase) | WeChat (Auth0) |
|--------|-------------------|----------------|
| Provider | Supabase Auth | Auth0 |
| Session | Supabase session | Auth0 session |
| User ID | Supabase auth.users.id | Auth0 sub (stored in external_id) |
| Database sync | Automatic (trigger) | Manual (callback) |
| Sign out | /auth/signout | /api/auth/logout |

---

## Troubleshooting

### Issue: "Connection not configured"

**Cause:** WeChat connection not enabled for your Auth0 application

**Fix:**
1. Go to Auth0 → Authentication → Social → WeChat
2. Applications tab → Enable for "Tennis Lover"
3. Save

### Issue: WeChat login shows error page

**Cause:** WeChat AppID/AppSecret incorrect or app not approved

**Fix:**
1. Verify WeChat app is approved and active
2. Double-check AppID and AppSecret in Auth0
3. Ensure callback URL matches Auth0's callback

### Issue: User created but can't see posts

**Cause:** User ID mismatch between Auth0 and Supabase

**Fix:**
1. Check `users` table - `id` should be Auth0 `sub`
2. Verify `external_id` is set
3. Check `auth_provider` = 'auth0-wechat'

### Issue: Can't sign out after WeChat login

**Cause:** Sign out trying to use Supabase logout for Auth0 user

**Fix:**
1. Verify Header component checks `auth_provider`
2. Ensure Auth0 users redirect to `/api/auth/logout`
3. Clear cookies if stuck

---

## Database Schema Changes

### New Columns in `users` table:

```sql
auth_provider TEXT DEFAULT 'supabase'
  CHECK (auth_provider IN ('supabase', 'auth0-wechat'))

external_id TEXT  -- Stores Auth0 sub
```

### Example User Records:

**Google User:**
```json
{
  "id": "uuid-from-supabase-auth",
  "email": "user@gmail.com",
  "auth_provider": "supabase",
  "external_id": null
}
```

**WeChat User:**
```json
{
  "id": "auth0|1234567890",
  "email": "wechat@user.com",
  "auth_provider": "auth0-wechat",
  "external_id": "auth0|1234567890"
}
```

---

## Security Considerations

### Best Practices

✅ **DO:**
- Store Auth0 secret securely in environment variables
- Use HTTPS in production
- Validate user email from Auth0
- Check auth provider before operations
- Log authentication events

❌ **DON'T:**
- Commit `.env.local` to Git
- Share Auth0 credentials
- Mix up Supabase and Auth0 sessions
- Allow direct database access

### Rate Limiting

Auth0 free tier limits:
- 7,000 active users
- Unlimited logins

Plan accordingly for growth.

---

## Testing Checklist

- [ ] WeChat button appears on landing page
- [ ] WeChat button redirects to Auth0
- [ ] Auth0 redirects to WeChat (if in China) or shows login
- [ ] After WeChat auth, user created in Supabase
- [ ] User can access /feed after login
- [ ] User can create posts
- [ ] User can sign out (redirects to /api/auth/logout)
- [ ] Sign out clears session
- [ ] Google login still works independently
- [ ] Both auth methods can coexist

---

## Cost Analysis

### WeChat Open Platform
- **Personal:** ¥300/year (~$42 USD)
- **Business:** ¥300/year + verification fees

### Auth0
- **Free Tier:**
  - 7,000 active users
  - Unlimited logins
  - Social connections included
- **Paid:** Starts at $35/month for more users

### Total Estimated Cost
- Initial: ~$42 (WeChat) + $0 (Auth0 free tier)
- Annual: ~$42 (WeChat) + Auth0 as you scale

---

## Resources

- **Auth0 Docs:** https://auth0.com/docs
- **WeChat Open Platform:** https://open.weixin.qq.com/
- **Auth0 Next.js SDK:** https://github.com/auth0/nextjs-auth0
- **WeChat OAuth Docs:** https://developers.weixin.qq.com/doc/oplatform/en/Website_App/WeChat_Login/Wechat_Login.html

---

## Summary

You now have:
- ✅ Dual authentication system
- ✅ Google OAuth via Supabase
- ✅ WeChat OAuth via Auth0
- ✅ Unified user database
- ✅ Seamless user experience

Both authentication methods work independently and sync to the same Supabase database, giving users in China (WeChat) and internationally (Google) easy access to your tennis community! 🎾

---

**Need Help?** Check the troubleshooting section or review the Auth0 and WeChat documentation linked above.
