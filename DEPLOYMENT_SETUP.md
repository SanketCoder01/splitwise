# Deployment Setup Guide

## 🚀 Vercel Deployment Configuration

### 1. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site URL Configuration (Important for email redirects)
NEXT_PUBLIC_SITE_URL=https://splitwise-jet.vercel.app

# Optional
NEXT_PUBLIC_ENVIRONMENT=production
```

### 2. Supabase Authentication Settings

In your Supabase dashboard, go to **Authentication > URL Configuration** and add:

**Site URL:**
```
https://splitwise-jet.vercel.app
```

**Redirect URLs:**
```
https://splitwise-jet.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 3. Email Template Configuration

In Supabase **Authentication > Email Templates**, update the magic link template to use:

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">Confirm your mail</a></p>
```

### 4. Local Development Setup

Create `.env.local` file:

```bash
# Copy from .env.local.example and fill in your values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🔧 How the URL Resolution Works

The system automatically detects the correct URL in this priority order:

1. **NEXT_PUBLIC_SITE_URL** environment variable (highest priority)
2. **VERCEL_URL** environment variable (automatically set by Vercel)
3. **window.location.origin** (client-side fallback)
4. **Hardcoded fallback** to your Vercel URL

## 📧 Email Redirect Flow

1. User enters email and password
2. System sends magic link to: `https://splitwise-jet.vercel.app/auth/callback`
3. User clicks link in email
4. Redirects to auth callback page
5. Callback page verifies the token and redirects to dashboard

## 🐛 Troubleshooting

### Issue: Emails still go to localhost
**Solution:** 
- Check Supabase Authentication > URL Configuration
- Ensure `NEXT_PUBLIC_SITE_URL` is set in Vercel environment variables
- Redeploy after adding environment variables

### Issue: "Invalid redirect URL" error
**Solution:**
- Add your domain to Supabase redirect URLs list
- Include both production and development URLs

### Issue: Authentication timeout
**Solution:**
- Check if Supabase credentials are correctly set
- Verify network connectivity
- Check browser console for detailed error messages

## 🔍 Testing Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase redirect URLs configured
- [ ] Email templates updated
- [ ] Test login flow on deployed site
- [ ] Verify magic link redirects to correct domain
- [ ] Test both development and production environments

## 📝 Notes

- The system includes automatic timeout handling (15 seconds for auth, 10 seconds for magic links)
- Development bypass button appears automatically if Supabase is not configured in development
- All authentication errors are logged to console for debugging
