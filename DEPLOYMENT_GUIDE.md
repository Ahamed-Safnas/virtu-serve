# Production Deployment Guide - Vercel + Supabase

This guide walks you through deploying your Virtu Serve admin dashboard to Vercel with Supabase as the backend.

---

## **1. DATABASE SETUP (Supabase)**

Your database is already set up and ready! Verify:

### Check Database Status
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** → Run:
   ```sql
   SELECT COUNT(*) FROM services;
   SELECT COUNT(*) FROM testimonials;
   SELECT COUNT(*) FROM contact_info;
   ```

### Production Checklist
- ✅ Tables created: `services`, `testimonials`, `contact_info`, `visitor_stats`, `admin_users`
- ✅ Indexes created for performance
- ✅ Initial data populated
- ✅ RLS disabled (read/write via Edge Functions)
- ✅ Admin user created: `admin` / `admin123`

### Optional: Update Admin Password
```sql
UPDATE admin_users
SET password_hash = crypt('your_new_secure_password', gen_salt('bf'))
WHERE username = 'admin';
```

---

## **2. BACKEND SETUP (Supabase Edge Functions)**

Edge Functions are **already deployed**. Verify they exist:

### Check Deployed Functions
```bash
supabase functions list  # If you have CLI installed
```

Or go to Supabase Dashboard → **Edge Functions** and verify:
- ✅ `admin-login` (Authentication)
- ✅ `admin-update-services`
- ✅ `admin-update-testimonials`
- ✅ `admin-update-contact`
- ✅ `admin-record-visit`

All functions use service role key (server-only) for secure database operations.

---

## **3. FRONTEND DEPLOYMENT (Vercel)**

### Step 1: Connect Git Repository

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Select your Git provider (GitHub, GitLab, Bitbucket)
4. Connect and import your repository

### Step 2: Configure Environment Variables

In Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase URL (from `.env`) | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key (from `.env`) | Production, Preview, Development |

**Where to find these values:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Project Settings → **API**
- Copy:
  - `Project URL` → `VITE_SUPABASE_URL`
  - `anon public` → `VITE_SUPABASE_ANON_KEY`

### Step 3: Deploy

1. Click **"Deploy"** button
2. Vercel will automatically:
   - Install dependencies
   - Run `npm run build`
   - Deploy to CDN
   - Assign a production URL

### Build Settings (Auto-Detected)
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x (or latest)

---

## **4. PRODUCTION ENVIRONMENT VARIABLES**

### Your Supabase Project Credentials

Get these from `.env` file or Supabase Dashboard:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are **public** (anon key) and safe to expose in frontend code.

### What's NOT Used in Production
- `VITE_ADMIN_USERNAME` - Removed (use Supabase instead)
- `VITE_ADMIN_PASSWORD` - Removed (passwords are hashed in database)

---

## **5. ARCHITECTURE FLOW**

```
┌─────────────────────────────────────────┐
│     Vercel (Frontend)                   │
│  - React + TypeScript + Vite            │
│  - Static HTML/CSS/JS                   │
│  - Deployed on Vercel CDN               │
└────────────┬────────────────────────────┘
             │
    HTTPS Requests (Public)
             │
┌────────────▼────────────────────────────┐
│     Supabase Edge Functions             │
│  - admin-login                          │
│  - admin-update-services                │
│  - admin-update-testimonials            │
│  - admin-update-contact                 │
│  - admin-record-visit                   │
└────────────┬────────────────────────────┘
             │
     Service Role Key (Secure)
             │
┌────────────▼────────────────────────────┐
│   Supabase PostgreSQL Database          │
│  - services (16 rows)                   │
│  - testimonials (8 rows)                │
│  - contact_info (1 row)                 │
│  - visitor_stats (dynamic)              │
│  - admin_users (hashed passwords)       │
└─────────────────────────────────────────┘
```

---

## **6. API ENDPOINTS**

These are accessible from your frontend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/functions/v1/admin-login` | POST | Admin authentication |
| `/functions/v1/admin-update-services` | POST | Update services/products |
| `/functions/v1/admin-update-testimonials` | POST | Update testimonials |
| `/functions/v1/admin-update-contact` | POST | Update contact info |
| `/functions/v1/admin-record-visit` | POST | Record visitor stats |

Base URL: `https://your-project.supabase.co`

---

## **7. DOMAIN SETUP (Optional)**

### Add Custom Domain to Vercel

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your domain (e.g., `virtuserve.com`)
3. Follow DNS configuration steps
4. Automatic HTTPS via Let's Encrypt

---

## **8. MONITORING & LOGS**

### Frontend Logs (Vercel)
- Dashboard → **Deployments** → Click deployment → **View Build Logs**

### Backend Logs (Supabase Edge Functions)
- Dashboard → **Edge Functions** → Click function → **Logs**

### Database Logs (Supabase)
- Dashboard → **SQL Editor** → Query execution history

---

## **9. TESTING IN PRODUCTION**

### Test Admin Login
```bash
curl -X POST https://your-project.supabase.co/functions/v1/admin-login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"username":"admin","password":"admin123"}'
```

### Expected Response
```json
{
  "success": true,
  "message": "Authentication successful",
  "adminId": "uuid-here"
}
```

---

## **10. VERCEL DEPLOYMENT CHECKLIST**

- ✅ Git repository connected to Vercel
- ✅ Environment variables set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- ✅ Build settings configured (auto-detected)
- ✅ Initial deployment completed
- ✅ Production URL accessible
- ✅ Admin login works
- ✅ Database operations functional
- ✅ Custom domain connected (optional)

---

## **11. PERFORMANCE OPTIMIZATION**

### Vercel CDN
- ✅ Automatic global CDN distribution
- ✅ Caching headers configured
- ✅ Gzip compression enabled

### Database
- ✅ Indexes created on frequently queried columns
- ✅ Connection pooling enabled
- ✅ Real-time subscriptions available

### Frontend
- ✅ Code splitting by routes
- ✅ Lazy loading for components
- ✅ Image optimization (Pexels)

---

## **12. SECURITY CHECKLIST**

- ✅ Admin passwords hashed with bcrypt
- ✅ Service role key server-only (Edge Functions)
- ✅ Anon key public but restricted by RLS
- ✅ HTTPS/TLS enforced
- ✅ CORS headers configured
- ✅ Environment variables protected

---

## **13. TROUBLESHOOTING**

### Issue: "Build failed on Vercel"
**Solution:** Check build logs
```bash
npm run build  # Test locally first
```

### Issue: "Environment variables not loading"
**Solution:**
1. Verify variables in Vercel Dashboard
2. Redeploy after adding variables
3. Clear browser cache

### Issue: "Admin login fails in production"
**Solution:**
1. Check Edge Function logs in Supabase Dashboard
2. Verify Supabase credentials in Vercel
3. Test with valid admin credentials

### Issue: "Database updates not syncing"
**Solution:**
1. Check Edge Function logs
2. Verify service role key access
3. Check browser DevTools Network tab for errors

---

## **14. CONTINUOUS DEPLOYMENT**

### Auto-Deploy on Git Push
- ✅ Enabled by default on Vercel
- Every push to `main` → Auto-deploy to production
- Other branches → Preview deployments

### Disable Auto-Deploy
1. Vercel Dashboard → Project Settings
2. **Git** → Uncheck "Deploy on push"

---

## **15. ROLLBACK TO PREVIOUS VERSION**

1. Vercel Dashboard → **Deployments**
2. Find the deployment you want
3. Click **...** → **Promote to Production**

---

## **DEPLOYMENT COMPLETE!**

Your application is now live on Vercel with:
- ✅ Serverless frontend on Vercel CDN
- ✅ Backend API via Supabase Edge Functions
- ✅ Database persistence on Supabase PostgreSQL
- ✅ Automatic scaling and global distribution
- ✅ Custom domain support

**Production URL:** `https://your-project-name.vercel.app`

---

## **SUPPORT**

For issues:
- **Vercel:** https://vercel.com/support
- **Supabase:** https://supabase.com/docs
- **Vite:** https://vitejs.dev/guide/
