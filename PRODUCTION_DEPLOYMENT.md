# Production Deployment - Step by Step Guide

## **PHASE 1: PRE-DEPLOYMENT PREPARATION**

### **1.1 Test Locally**

```bash
# Install dependencies (if not done)
npm install

# Test development mode
npm run dev
# Open http://localhost:5173

# Test production build
npm run build
npm run preview
# Open http://localhost:4173
```

**Verify locally:**
- Homepage loads
- Admin login works
- Admin dashboard functional
- All CRUD operations work
- No console errors

---

## **PHASE 2: SUPABASE SETUP (Already Done)**

### **2.1 Verify Database**

1. Go to https://app.supabase.com
2. Select your project
3. Run this in SQL Editor:

```sql
-- Verify all tables exist
SELECT
  schemaname,
  tablename
FROM pg_catalog.pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY tablename;

-- Verify data count
SELECT 'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'contact_info', COUNT(*) FROM contact_info
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users;
```

**Expected Output:**
```
services       | 16
testimonials   | 8
contact_info   | 1
admin_users    | 1
```

### **2.2 Verify Edge Functions**

Go to **Edge Functions** and confirm these are deployed:
- ✅ admin-login
- ✅ admin-update-services
- ✅ admin-update-testimonials
- ✅ admin-update-contact
- ✅ admin-record-visit

### **2.3 Get API Keys**

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (for `VITE_SUPABASE_URL`)
   - **anon public** (for `VITE_SUPABASE_ANON_KEY`)

**Example:**
```
VITE_SUPABASE_URL = https://mfvmghebtylvhrzvfmda.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## **PHASE 3: VERCEL DEPLOYMENT**

### **3.1 Create Vercel Account**

1. Go to https://vercel.com
2. Sign up with GitHub/GitLab/Bitbucket account
3. Verify email

### **3.2 Push Code to Git**

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Production ready deployment"

# Push to GitHub
git branch -M main
git push -u origin main
```

### **3.3 Import Project on Vercel**

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your repository
5. Click **"Import"**

### **3.4 Configure Project Settings**

**Framework:**
- Should auto-detect: **Vite**

**Build & Output:**
- Build Command: `npm run build`
- Output Directory: `dist`

**Environment Variables:**
Click **"Add Environment Variable"** and add:

| Key | Value | Apply to |
|-----|-------|----------|
| `VITE_SUPABASE_URL` | Your URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your key | Production, Preview, Development |

### **3.5 Deploy**

1. Click **"Deploy"** button
2. Wait for build to complete (usually 1-2 minutes)
3. You'll see:
   ```
   ✓ Deployment successful
   Production: your-project-name.vercel.app
   ```

---

## **PHASE 4: POST-DEPLOYMENT VERIFICATION**

### **4.1 Test Public Site**

Visit: `https://your-project-name.vercel.app`

Verify:
- [ ] Homepage loads
- [ ] All services visible
- [ ] All testimonials visible
- [ ] Contact info displayed
- [ ] Responsive on mobile
- [ ] No 404 errors

### **4.2 Test Admin Login**

Visit: `https://your-project-name.vercel.app/admin`

1. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
2. Should redirect to admin dashboard

### **4.3 Test Admin Dashboard**

**Services Tab:**
- [ ] All 16 services loaded
- [ ] Add new service
- [ ] Edit existing
- [ ] Delete service
- [ ] Changes persist on refresh
- [ ] Changes show on homepage

**Testimonials Tab:**
- [ ] All 8 testimonials loaded
- [ ] Add new testimonial
- [ ] Edit existing
- [ ] Delete testimonial
- [ ] Search works
- [ ] Filter by rating works
- [ ] Changes persist

**Contact Tab:**
- [ ] Current info displayed
- [ ] Can edit all fields
- [ ] Changes persist
- [ ] Changes visible on homepage

**Analytics Tab:**
- [ ] Chart displays
- [ ] Visitor stats visible

### **4.4 Monitor Vercel Logs**

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Deployments"** → Latest deployment
4. Check **"View Build Logs"** for any warnings
5. Go to **"Analytics"** tab to see real-time metrics

---

## **PHASE 5: DOMAIN SETUP (Optional)**

### **5.1 Add Custom Domain**

1. Vercel Dashboard → Project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `your-domain.com`
4. Choose DNS option:
   - **Nameservers** (recommended)
   - **CNAME** (if registrar supports CNAME on root)

### **5.2 Update DNS**

**For Nameservers:**
1. Go to your domain registrar
2. Update nameservers to Vercel's:
   ```
   ns1.vercel.sh
   ns2.vercel.sh
   ```

**For CNAME (subdomain only):**
1. Add CNAME record:
   ```
   Name: your-subdomain
   Value: cname.vercel-dns.com
   ```

### **5.3 Wait for DNS Propagation**

DNS can take 1-48 hours to propagate. Vercel will show status:
```
✓ DNS configured
⏳ Verifying...
✓ Valid configuration
```

---

## **PHASE 6: VERIFICATION & TESTING**

### **6.1 Security Checklist**

```bash
# Verify no secrets in bundled code
grep -r "SUPABASE_SERVICE_ROLE_KEY" dist/
# Should return nothing

grep -r "password" dist/ | grep -i "admin"
# Should return nothing

# Check that app works with just public keys
cat dist/index.html | grep -o "vite_supabase_url\|vite_supabase_anon_key"
# These are injected at build time
```

### **6.2 Performance Check**

Visit your deployed URL and open DevTools (F12):

**Network Tab:**
- [ ] All requests complete
- [ ] No 404 errors
- [ ] CSS/JS load quickly
- [ ] Images load from Pexels (external)

**Performance Tab:**
- [ ] Lighthouse score > 70
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3s

### **6.3 API Verification**

Test Edge Functions with curl:

```bash
# Test admin login
curl -X POST \
  https://YOUR_SUPABASE_URL/functions/v1/admin-login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"username":"admin","password":"admin123"}'

# Expected response:
# {"success":true,"message":"Authentication successful","adminId":"..."}
```

---

## **PHASE 7: MAINTENANCE**

### **7.1 Monitoring**

Set up alerts in Vercel:
1. Vercel Dashboard → Project → **Settings** → **Monitoring**
2. Enable alerts for:
   - Build failures
   - Error rate > 5%
   - Response time > 2s

### **7.2 Database Backups**

In Supabase Dashboard:
1. Go to **Backups**
2. Enable **Automated backups**
3. Set retention to 7 days

### **7.3 Update Admin Password (Security)**

```sql
-- In Supabase SQL Editor
UPDATE admin_users
SET password_hash = crypt('your_new_secure_password', gen_salt('bf'))
WHERE username = 'admin';
```

---

## **DEPLOYMENT SUMMARY**

| Component | Status | Location |
|-----------|--------|----------|
| Frontend | Vercel | https://your-project.vercel.app |
| Backend | Supabase Edge Functions | Deployed (5 functions) |
| Database | Supabase PostgreSQL | 5 tables, populated |
| Domain | Optional | your-domain.com |

---

## **TROUBLESHOOTING**

### Build Failed on Vercel

**Check logs:**
1. Vercel Dashboard → Deployments → Latest
2. Click "View Build Logs"
3. Look for error messages

**Common fixes:**
```bash
# Test locally
npm install
npm run build

# If fails, check TypeScript errors
npx tsc --noEmit
```

### Environment Variables Not Working

**Solution:**
1. Delete variables in Vercel
2. Add them again carefully
3. Ensure no extra spaces
4. Redeploy project
5. Hard refresh browser (Ctrl+Shift+R)

### Admin Login Fails in Production

**Debug:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try login
4. Click the request to `/admin-login`
5. Check Response
6. If error, check Supabase Edge Function logs

**Check Supabase logs:**
```
Supabase Dashboard → Edge Functions → admin-login → View Logs
```

### Database Updates Not Persisting

**Check:**
1. Supabase Dashboard → Edge Functions → Logs
2. Look for error messages
3. Verify data was inserted (use SQL Editor)

---

## **SUCCESS INDICATORS**

Your production deployment is successful when:

✅ Public site loads in < 3 seconds
✅ Admin login works with correct credentials
✅ Admin dashboard loads all data
✅ CRUD operations persist to database
✅ Changes visible on public site after refresh
✅ No console errors (F12)
✅ No 404 errors
✅ Analytics showing visitor data
✅ HTTPS/TLS certificate active
✅ Vercel metrics show healthy

---

## **NEXT STEPS**

1. Share production URL with team
2. Update DNS records for custom domain
3. Monitor Vercel Analytics
4. Monitor Supabase logs
5. Set up automated backups
6. Configure email notifications

---

## **SUPPORT LINKS**

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev
- React Router: https://reactrouter.com

---

**Deployment Date:** _______________

**Production URL:** https://_______________

**Status:** ✅ LIVE

