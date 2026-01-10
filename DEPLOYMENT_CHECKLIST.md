# Production Deployment Checklist - Vercel + Supabase

## **Pre-Deployment (Local)**

- [ ] Test locally: `npm run dev`
- [ ] Build locally: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] All admin functions working (create, update, delete)
- [ ] Login page responsive and functional
- [ ] No console errors in browser DevTools

---

## **Database (Supabase)**

- [ ] Verify all tables created:
  ```bash
  services, testimonials, contact_info, visitor_stats, admin_users
  ```
- [ ] Verify data populated (16 services, 8 testimonials, etc.)
- [ ] Admin user created with hashed password
- [ ] Backup database if needed

**Backup Command:**
```sql
-- Export from Supabase SQL Editor
SELECT * FROM services;
SELECT * FROM testimonials;
SELECT * FROM contact_info;
SELECT * FROM admin_users;
```

---

## **Backend (Supabase Edge Functions)**

- [ ] All 5 Edge Functions deployed:
  - [ ] `admin-login`
  - [ ] `admin-update-services`
  - [ ] `admin-update-testimonials`
  - [ ] `admin-update-contact`
  - [ ] `admin-record-visit`
- [ ] Test each function in Supabase Dashboard → Edge Functions → Logs
- [ ] Verify CORS headers present in responses
- [ ] No errors in deployment logs

---

## **Frontend (Vercel)**

### Account & Repository
- [ ] Have Vercel account (https://vercel.com/signup)
- [ ] Git repository created (GitHub, GitLab, or Bitbucket)
- [ ] Code pushed to repository

### Environment Variables (Critical!)
Add these in **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get values:**
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API
4. Copy `Project URL` and `anon public`

- [ ] Variables set for all environments (Production, Preview, Development)
- [ ] Variables don't contain spaces or extra characters

### Deployment
- [ ] Connect Git repository to Vercel
- [ ] Select build settings (auto-detected: Vite)
- [ ] Click "Deploy"
- [ ] Build completes without errors
- [ ] Production URL accessible

---

## **Post-Deployment Testing**

### Frontend Tests
- [ ] Homepage loads: `https://your-deployment.vercel.app`
- [ ] All pages load without 404 errors
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1920px)
- [ ] Services display correctly
- [ ] Testimonials display correctly
- [ ] Contact information visible
- [ ] Navigation works smoothly
- [ ] No console errors

### Admin Authentication
- [ ] Access admin page: `/admin`
- [ ] Login with credentials:
  - Username: `admin`
  - Password: `admin123`
- [ ] Redirects to dashboard on successful login
- [ ] Shows error on invalid credentials
- [ ] Logout button works

### Admin Dashboard - Services
- [ ] Services tab loads with all 16 items
- [ ] Can add new service
- [ ] Can edit existing service
- [ ] Can delete service (with confirmation)
- [ ] Changes persist after page refresh
- [ ] Changes visible on public homepage

### Admin Dashboard - Testimonials
- [ ] Testimonials tab loads with all 8 items
- [ ] Can add new testimonial
- [ ] Can edit existing testimonial
- [ ] Can delete testimonial
- [ ] Search/filter functionality works
- [ ] Bulk delete works
- [ ] Changes persist
- [ ] Changes visible on public homepage

### Admin Dashboard - Contact Info
- [ ] Contact tab loads current info
- [ ] Can edit phone number
- [ ] Can edit email
- [ ] Can edit address
- [ ] Can edit business hours
- [ ] Can edit social media links
- [ ] Changes persist
- [ ] Changes visible on public site

### Admin Dashboard - Analytics
- [ ] Analytics tab shows visitor stats
- [ ] Chart displays correctly
- [ ] Stats cards show correct numbers
- [ ] Visitor tracking works

### Database Operations
- [ ] Vercel logs show no errors
- [ ] Supabase logs show successful operations
- [ ] All Edge Functions executing properly

---

## **Performance & Monitoring**

- [ ] Page loads in < 3 seconds
- [ ] Vercel Analytics dashboard shows metrics
- [ ] No 5xx errors in Vercel dashboard
- [ ] Supabase monitoring shows healthy status
- [ ] Database connection pool healthy

**Check Vercel Dashboard:**
- Deployments section
- Analytics section
- Function logs

**Check Supabase Dashboard:**
- Database → Stats
- Edge Functions → Logs
- Realtime → Status

---

## **Security Verification**

- [ ] HTTPS/TLS working (green lock icon)
- [ ] Admin passwords hashed in database (not plaintext)
- [ ] No sensitive data in client code
- [ ] No API keys exposed in frontend
- [ ] CORS headers configured correctly
- [ ] Service role key not exposed to client

**Security Check:**
```bash
# Check if credentials are in bundled code
grep -r "supabaseServiceKey" dist/  # Should be empty
grep -r "SUPABASE_SERVICE_ROLE_KEY" dist/  # Should be empty
```

---

## **Domain Setup (Optional)**

- [ ] Custom domain registered (GoDaddy, Namecheap, etc.)
- [ ] Domain connected to Vercel
- [ ] DNS records updated correctly
- [ ] HTTPS certificate generated
- [ ] Domain resolves correctly

---

## **Troubleshooting**

### Build Fails
```bash
# Test build locally
npm install
npm run build

# Check for errors and fix
```

### Environment Variables Not Working
```bash
# In Vercel Dashboard:
1. Delete variable
2. Add again
3. Redeploy
4. Ctrl+Shift+R (hard refresh)
```

### Admin Login Fails
```bash
# Check Supabase Edge Function logs
1. Supabase Dashboard → Edge Functions → admin-login
2. Look for error messages
3. Verify credentials are correct
4. Test with curl if needed
```

### Database Operations Not Working
```bash
# Check if Edge Functions are deployed
1. Supabase Dashboard → Edge Functions
2. Verify all 5 functions present
3. Check deployment logs for errors
4. Test function manually
```

---

## **Rollback Plan**

If something breaks:

1. **Vercel Rollback:**
   - Vercel Dashboard → Deployments
   - Find last working deployment
   - Click ... → Promote to Production

2. **Database Rollback:**
   - Check Supabase backups
   - Restore from backup if needed

3. **Code Rollback:**
   - Revert git commit
   - Push to repository
   - Vercel auto-redeploys

---

## **Post-Launch**

- [ ] Monitor Vercel Analytics
- [ ] Monitor Supabase logs
- [ ] Set up alerts for errors
- [ ] Document any issues encountered
- [ ] Update admin password for security
- [ ] Set up database backups

---

## **Done!**

- [ ] Application live in production
- [ ] Admin panel working
- [ ] Database syncing
- [ ] All services functional
- [ ] Team notified of live URL

---

## **Quick Links**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Application:** Your deployed URL
- **Admin Panel:** Your deployed URL + `/admin`

