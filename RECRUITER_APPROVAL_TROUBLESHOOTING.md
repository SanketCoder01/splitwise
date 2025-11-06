# 🔧 Recruiter Approval Troubleshooting Guide

## Issue: Recruiter Profile Not Showing in Government Dashboard

If you've completed your recruiter profile but it's not appearing in the government dashboard, follow these steps:

---

## ✅ Step 1: Check Profile Completion

### In Recruiter Dashboard:
1. Go to `/recruiter-dashboard`
2. Check if you see "Profile Complete" status
3. Make sure you completed ALL 6 steps:
   - Step 1: Personal Information
   - Step 2: Company Details  
   - Step 3: Contact Information
   - Step 4: Internship Preferences
   - Step 5: Additional Details
   - Step 6: Terms & Conditions

**If incomplete:** Go back and finish all steps!

---

## ✅ Step 2: Verify Database Entry

### Open Supabase Dashboard:
1. Go to your Supabase project
2. Click **Table Editor** in left sidebar
3. Find `recruiter_profiles` table
4. Look for your email/company name

### Check these columns:
```
✓ profile_completed = true (must be checked/true)
✓ approval_status = 'pending' (text)
✓ profile_step = 6 (number)
✓ created_at = recent date
```

### If values are wrong:
Click on the row → Edit → Update values → Save

---

## ✅ Step 3: Run SQL Script

### Required for real-time functionality:

1. **Open Supabase SQL Editor**
   - Go to Supabase Dashboard
   - Click "SQL Editor" in sidebar
   - Click "New Query"

2. **Copy entire contents of:**
   ```
   supabase-recruiter-realtime.sql
   ```

3. **Paste and Run**
   - Should see success messages
   - No errors about "already in publication" (we fixed this!)

4. **Verify Output:**
   ```
   ✅ Added recruiter_profiles to supabase_realtime publication
   ✅ Added recruiter_notifications to supabase_realtime publication
   ✅ Tables created successfully
   ```

---

## ✅ Step 4: Check Browser Console

### Open Developer Tools:
1. Press **F12** on government dashboard
2. Go to **Console** tab
3. Look for these messages:

**Good Messages (✅):**
```
🔍 Fetching pending recruiter profiles...
✅ Found X pending recruiter profiles: [...]
📊 Recruiter Stats: {pendingRecruiters: X, ...}
```

**Bad Messages (❌):**
```
❌ Error fetching recruiter profiles: [error details]
❌ Exception fetching pending recruiter profiles
relation "recruiter_profiles" does not exist
```

### If you see errors:
- **"table does not exist"**: Run the SQL script (Step 3)
- **"permission denied"**: Check RLS policies in Supabase
- **Network errors**: Verify Supabase connection in `.env.local`

---

## ✅ Step 5: Check Environment Variables

### Verify `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Test connection:
Open browser console on any page and run:
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```
Should show your Supabase URL, not `undefined`

---

## ✅ Step 6: Enable Realtime in Supabase

### Important for live updates:

1. Go to **Supabase Dashboard** → **Database** → **Replication**
2. Find these tables and enable them:
   - ✓ `recruiter_profiles`
   - ✓ `recruiter_notifications`
3. Click **Save** after enabling

---

## 🔍 Debug Mode

### The dashboard now shows debug info:

When you visit `/gov-dashboard` → **Recruiter Approvals** tab, you'll see:

```
Debug Info: X pending profiles loaded. Check browser console (F12) for detailed logs.
```

This tells you:
- How many profiles were found
- Reminds you to check console for details

---

## 🎯 Common Issues & Solutions

### Issue 1: "0 pending profiles loaded"

**Possible Causes:**
- Profile not completed (profile_completed = false)
- Approval status not "pending"
- SQL script not run
- Table doesn't exist

**Solution:**
Follow Steps 1-3 above

---

### Issue 2: Profile shows in database but not in dashboard

**Possible Causes:**
- profile_completed = false
- Real-time not enabled
- Caching issue

**Solution:**
1. Check profile_completed column in Supabase
2. Enable realtime (Step 6)
3. Hard refresh browser (Ctrl+Shift+R)

---

### Issue 3: SQL script errors

**Error:** "already member of publication"
**Solution:** ✅ Already fixed! The updated script checks before adding.

**Error:** "relation does not exist"
**Solution:** Make sure you're running script on correct database/schema

---

### Issue 4: Real-time not working

**Symptoms:** New profiles don't appear automatically

**Solution:**
1. Enable realtime in Supabase (Step 6)
2. Check console for subscription errors
3. Refresh the page

---

## 📊 Expected Data Flow

When working correctly:

```
1. Recruiter completes profile
   ↓
2. Data saved to recruiter_profiles table
   with: profile_completed=true, approval_status='pending'
   ↓
3. Real-time trigger fires
   ↓
4. Government dashboard receives update
   ↓
5. Profile appears in Pending Approvals list
   ↓
6. Count updates automatically
```

---

## 🧪 Test with SQL Query

### Run this in Supabase SQL Editor:

```sql
-- Check your recruiter profile
SELECT 
  id,
  full_name,
  company_name,
  email,
  profile_completed,
  approval_status,
  profile_step,
  created_at
FROM recruiter_profiles
WHERE email = 'your-email@company.com';

-- Should return:
-- profile_completed: true
-- approval_status: pending
-- profile_step: 6
```

### If nothing returns:
- Profile was never saved
- Wrong email address
- Wrong database/table

---

## 🛠️ Manual Fix (Last Resort)

### If profile exists but fields are wrong:

```sql
-- Update your profile to pending status
UPDATE recruiter_profiles
SET 
  profile_completed = true,
  approval_status = 'pending',
  profile_step = 6
WHERE email = 'your-email@company.com';
```

Then refresh the government dashboard.

---

## 📞 Still Not Working?

### Check these files:

1. **SQL Script:** `supabase-recruiter-realtime.sql`
2. **Dashboard Code:** `/app/gov-dashboard/page.tsx`
3. **Recruiter Form:** `/app/recruiter-dashboard/page.tsx`

### Look for console errors:

Open F12 and check:
- Network tab: Failed requests?
- Console tab: JavaScript errors?
- Application tab: Session storage has recruiter_data?

---

## ✅ Success Indicators

You'll know it's working when:

1. **Console shows:**
   ```
   ✅ Found X pending recruiter profiles
   ```

2. **Dashboard shows:**
   - Real count in "Pending Review" card
   - Your profile in the list
   - "Review" button clickable

3. **Debug info shows:**
   ```
   Debug Info: 1 pending profiles loaded
   ```

4. **Stats update:**
   - Pending Review: Shows your profile
   - All counts are real numbers

---

## 🎉 After It Works

Once your profile appears:
1. Government official clicks "Review"
2. They see your complete details
3. They click "Approve" or "Reject"
4. You get real-time notification
5. If approved: Features unlock
6. If rejected: Auto-logout in 3 seconds

---

**Happy Debugging! 🚀**

If all else fails, check that your Supabase project is active and you have a working internet connection.
