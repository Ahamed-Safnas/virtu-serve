# Image Upload for Testimonials - Setup Guide

## **What Changed**

The testimonial avatar upload has been upgraded to use **Supabase Storage** instead of storing images as base64 data URLs. This allows images to be properly persisted and served efficiently.

---

## **How It Works**

### **Flow**

```
1. User selects image in admin dashboard
2. Image preview shows immediately
3. User clicks "Use This Image"
4. Image uploaded to Supabase Storage via Edge Function
5. Public URL stored in testimonials table
6. Changes persist across all devices
```

### **Technical Details**

- **Storage:** Supabase Storage (`avatars` bucket)
- **Upload Handler:** Edge Function `upload-testimonial-avatar`
- **File Path:** `testimonials/{timestamp}-{filename}`
- **Max Size:** 5 MB
- **Allowed Types:** JPG, PNG, GIF, WebP

---

## **Setup Instructions**

### **1. Storage Bucket (Already Created)**

The storage bucket `avatars` has been automatically created with:
- Public read access
- Testimonials folder for organization
- 5 MB file size limit
- Automatic cache control

### **2. Edge Function (Already Deployed)**

The function `upload-testimonial-avatar` is deployed and handles:
- File validation (type and size)
- Upload to storage
- Public URL generation
- Error handling

### **3. Frontend Component (Already Updated)**

`ImageUpload.tsx` now:
- Shows image preview before upload
- Uploads via Edge Function (not direct storage)
- Displays upload progress
- Shows error messages
- Stores public URL in database

---

## **Testing Image Upload**

### **Local Testing**

1. Go to `/admin`
2. Login with `admin` / `admin123`
3. Go to **Testimonials** tab
4. Add new testimonial or edit existing
5. Click **Upload Custom Image**
6. Select an image (JPG, PNG, GIF, or WebP)
7. Image preview appears
8. Click **Use This Image**
9. Image uploads to Supabase Storage
10. Public URL displayed in form
11. Click **Save**
12. Reload page - image persists

### **What to Check**

✅ Image preview shows before upload
✅ Upload completes without errors
✅ Image URL stored in database
✅ Image visible after save
✅ Image persists on page reload
✅ Image syncs across browser tabs

---

## **Available Features**

### **Custom Upload**
- Click "Choose File" to select image
- Drag & drop supported
- Real-time preview
- File validation

### **Default Avatars**
- Professional male avatar
- Professional female avatar
- Pre-loaded from public images
- No upload needed

### **Error Handling**
- Invalid file type message
- File too large message
- Upload failed message
- Network error message

---

## **Storage Structure**

```
avatars/
└── testimonials/
    ├── testimonial-1705000000000-john.jpg
    ├── testimonial-1705000001000-jane.png
    └── testimonial-1705000002000-avatar.gif
```

Each file is named with:
- `testimonial-` prefix
- Timestamp (prevents conflicts)
- Original filename

---

## **Database Integration**

### **Column Storage**

Images stored in `testimonials.avatar` column as public URLs:

```
avatar: "https://your-project.supabase.co/storage/v1/object/public/avatars/testimonials/testimonial-1705000000000-john.jpg"
```

### **Query Example**

```sql
SELECT avatar FROM testimonials WHERE id = '...';
-- Returns: https://your-project.supabase.co/storage/v1/object/public/avatars/testimonials/...
```

---

## **Troubleshooting**

### **Upload Fails**

**Problem:** "Upload failed"
**Solution:**
1. Check file size (max 5 MB)
2. Check file type (JPG, PNG, GIF, WebP only)
3. Check browser console for details
4. Verify internet connection

### **Image Not Persisting**

**Problem:** Image disappears after reload
**Solution:**
1. Verify testimonial was saved (not just in form)
2. Check browser console for errors
3. Verify database has correct URL
4. Try uploading again

### **Permission Denied**

**Problem:** "Upload failed: Forbidden"
**Solution:**
1. Verify Supabase credentials in .env
2. Check if Edge Function is deployed
3. Verify storage bucket exists
4. Check Supabase Dashboard for policies

---

## **Performance**

### **Image Optimization**

- Images served from Supabase CDN
- Global edge caching (3600 seconds)
- Automatic resizing via CDN (optional)
- Minimal database storage (only URL)

### **File Size Impact**

- Images stored in Supabase Storage (separate from database)
- Database stores only URLs (< 300 bytes each)
- No impact on database size
- Up to 100 GB storage available (Pro plan)

---

## **Production Notes**

### **Deployment**

1. Edge Function already deployed ✅
2. Storage bucket already created ✅
3. Component already updated ✅
4. No additional setup needed

### **Vercel Deployment**

- No additional environment variables needed
- Edge Function uses Supabase secrets (auto-configured)
- Images accessible from production URL

### **Custom Domain**

- Images will use production domain
- Example: `https://virtuserve.com/admin`
- Image URLs include Supabase domain
- Example: `https://your-project.supabase.co/storage/...`

---

## **API Reference**

### **Edge Function: upload-testimonial-avatar**

**Endpoint:** `POST /functions/v1/upload-testimonial-avatar`

**Headers:**
```
Authorization: Bearer {VITE_SUPABASE_ANON_KEY}
Content-Type: multipart/form-data
```

**Body:**
```
FormData with key 'file'
```

**Response (Success):**
```json
{
  "success": true,
  "url": "https://..../testimonials/testimonial-1705000000000-image.jpg",
  "path": "testimonials/testimonial-1705000000000-image.jpg"
}
```

**Response (Error):**
```json
{
  "error": "File size exceeds 5MB limit"
}
```

---

## **Maintenance**

### **Clean Up Old Images**

To delete old images from storage:

```sql
-- List all uploaded images
SELECT path FROM storage.objects
WHERE bucket_id = 'avatars'
ORDER BY created_at DESC;

-- Delete specific image via Supabase Dashboard or API
```

### **Monitor Storage Usage**

Supabase Dashboard → Storage → avatars → See usage

---

## **Support**

- **Supabase Docs:** https://supabase.com/docs/guides/storage
- **Image Upload Issues:** Check browser console (F12)
- **Edge Function Logs:** Supabase Dashboard → Edge Functions → upload-testimonial-avatar

---

## **Summary**

✅ Images uploaded to Supabase Storage
✅ Public URLs stored in database
✅ Images persist across devices
✅ Global CDN distribution
✅ 5 MB file size limit
✅ JPG, PNG, GIF, WebP support
✅ Professional error handling
✅ Production ready

**You can now upload images for testimonials!**
