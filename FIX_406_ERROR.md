# 🔥 Fix 406 Error - Supabase Table Setup

## ❌ Current Error:
```
GET https://erxpdqoftkleyhtxyacs.supabase.co/rest/v1/recruiter_profiles?select=*&email=eq.hr%40company.com 
406 (Not Acceptable)
```

## ✅ Solution: Run SQL Script

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `erxpdqoftkleyhtxyacs`
3. Click **SQL Editor** in left sidebar

### Step 2: Run the SQL Script
1. Click **New Query**
2. Copy **ALL** the contents from: `supabase-recruiter-profiles-TABLE.sql`
3. Paste into the SQL editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Success
You should see:
```
✅ recruiter_profiles table created successfully!
✅ recruiter_notifications table created successfully!
✅ Indexes created for better performance
✅ RLS policies enabled
✅ Real-time publication enabled
✅ Triggers created
```

### Step 4: Verify Table Exists
1. Go to **Table Editor** in Supabase
2. You should see:
   - `recruiter_profiles` table
   - `recruiter_notifications` table

### Step 5: Test the App
1. Refresh your recruiter dashboard
2. The 406 error should be gone!
3. Profile completion should now work

---

## 🔍 What the SQL Script Does:

1. **Creates Tables:**
   - `recruiter_profiles` - Stores all recruiter data
   - `recruiter_notifications` - Real-time notifications

2. **Adds All Columns:**
   - Personal details (name, designation, employee_id)
   - Company details (name, type, industry, size, website)
   - Contact info (email, phone, address)
   - Documents (registration, authorization, ID proof)
   - Internship preferences (types, alignment, skills, duration, stipend)
   - Agreement (terms, consent)
   - Status (profile_completed, profile_step, approval_status)

3. **Sets Up Security:**
   - Row Level Security (RLS) enabled
   - Policies allow:
     - Anyone can INSERT (register)
     - Users can UPDATE own profile
     - Users can SELECT own profile
     - Users can DELETE own profile

4. **Enables Real-Time:**
   - Government gets instant notifications
   - Recruiters get approval notifications
   - Live updates work

5. **Adds Triggers:**
   - Auto-updates `updated_at` timestamp
   - Sends notification on approval/rejection

---

## 🚨 Alternative: Quick Disable RLS (For Testing Only)

If you want to test quickly without RLS:

```sql
-- WARNING: Only for development/testing!
ALTER TABLE recruiter_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_notifications DISABLE ROW LEVEL SECURITY;
```

**⚠️ Re-enable RLS for production:**
```sql
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_notifications ENABLE ROW LEVEL SECURITY;
```

---

## 🐛 Still Getting 406?

### Check 1: Table Exists
```sql
SELECT * FROM recruiter_profiles LIMIT 1;
```
If this fails, table doesn't exist. Run the main SQL script.

### Check 2: RLS Status
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'recruiter_profiles';
```

### Check 3: Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'recruiter_profiles';
```

### Check 4: Anon Key Permissions
In Supabase dashboard:
1. Settings → API
2. Copy `anon` key
3. Make sure it's in your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

---

## ✅ After Running SQL Script:

1. **Refresh your app** (Ctrl+Shift+R)
2. **Complete recruiter profile**
3. **Check console** - should see:
   ```
   ✅ Profile saved successfully to Supabase
   ```
4. **Open Government Dashboard** - your profile should appear!

---

**The 406 error happens because Supabase can't find the table or RLS is blocking access. Running the SQL script fixes both issues!** 🚀
