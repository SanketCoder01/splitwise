# 🎯 Real-Time Recruiter Approval System - Complete Setup Guide

## ✅ Overview

This system provides a complete real-time recruiter approval workflow where:
1. **Recruiters** register and complete their profile
2. **Government officials** review applications in a beautiful, modern dashboard
3. **Real-time notifications** update both parties instantly
4. **Automatic actions** happen based on approval/rejection

---

## 📋 Prerequisites

- Supabase project set up
- Next.js application running
- Database access to Supabase SQL Editor

---

## 🚀 Setup Instructions

### Step 1: Run Database Setup Script

Open Supabase SQL Editor and run the following script:

```bash
File: supabase-recruiter-realtime.sql
```

This script will:
- ✅ Enable real-time for `recruiter_profiles` and `recruiter_notifications` tables
- ✅ Create `recruiter_notifications` table
- ✅ Add missing columns to `recruiter_profiles` (reviewed_by, reviewed_at, rejection_reason, internship_alignment)
- ✅ Create automatic notification triggers
- ✅ Set up RLS policies
- ✅ Insert 2 test pending recruiters

**Test Recruiters Created:**
1. **Amit Verma** - Wipro Limited (test.recruiter@wipro.com)
2. **Sneha Patel** - Cognizant (hr@cognizant.com)

---

### Step 2: Verify Database Tables

After running the script, verify these tables exist:
- `recruiter_profiles` - With columns: approval_status, reviewed_by, reviewed_at, rejection_reason, internship_alignment
- `recruiter_notifications` - New table for real-time notifications
- `internship_postings` - For recruiter job postings

---

### Step 3: Enable Realtime in Supabase Dashboard

1. Go to **Supabase Dashboard** → **Database** → **Replication**
2. Enable realtime for:
   - ✅ `recruiter_profiles`
   - ✅ `recruiter_notifications`
   - ✅ `internship_postings`

---

## 🎨 Features Implemented

### 1. **Beautiful Government Dashboard**

**Location:** `/app/gov-dashboard/page.tsx` → Recruiter Approvals tab

**Features:**
- 🎨 Gradient header with real-time status indicator
- 📊 Enhanced stats cards with hover animations
- 👤 Beautiful profile cards with avatars and company info
- 🔍 Detailed review modal with complete recruiter information
- ✅ One-click approve/reject with real-time feedback
- 📱 Fully responsive mobile design

**UI Improvements:**
- Modern gradient backgrounds
- Smooth animations with Framer Motion
- Professional color schemes
- Shadow and hover effects
- Government-style branding

---

### 2. **Real-Time Recruiter Dashboard**

**Location:** `/app/recruiter-dashboard/page.tsx`

**Features:**
- 🔔 Real-time approval/rejection notifications
- 🎉 Success toast on approval with auto-unlock
- ❌ Rejection toast with auto-logout (3 seconds)
- 🔄 Automatic session data cleanup
- 📡 Live status monitoring with Supabase subscriptions

**Auto-Actions:**
- **On Approval:**
  - Shows success toast with celebration
  - Unlocks all dashboard features
  - Updates session storage
  - Auto-refreshes page after 3 seconds

- **On Rejection:**
  - Shows error toast with reason
  - Clears all session data
  - Redirects to login page after 3 seconds
  - Prevents further access

---

### 3. **Database Triggers & Functions**

**Automatic Notification System:**
```sql
-- When approval_status changes:
- If approved → Create approval notification
- If rejected → Create rejection notification
```

**Auto-Deletion:**
```sql
-- Rejected profiles are deleted after 24 hours
Function: auto_delete_rejected_profiles()
```

---

## 🧪 Testing the System

### Test Scenario 1: Approval Flow

1. **Login as Government Official**
   - Navigate to: `/gov-dashboard`
   - Click on "Recruiter Approvals" tab

2. **Review Pending Recruiter**
   - You should see 2 pending recruiters (Amit Verma, Sneha Patel)
   - Click "Review" on any profile
   - Review their complete details

3. **Approve Recruiter**
   - Click "Approve Recruiter" button
   - You should see: ✅ "Recruiter approved! They will be notified in real-time."

4. **Check Recruiter Dashboard** (In another browser/incognito)
   - Login as the recruiter (or have recruiter logged in)
   - Within seconds, they should see:
     - 🎉 Success toast: "Congratulations! Your profile has been approved!"
     - Page auto-refreshes after 3 seconds
     - All features now unlocked

---

### Test Scenario 2: Rejection Flow

1. **Login as Government Official**
   - Navigate to recruiter approvals

2. **Reject Recruiter**
   - Click "Review" on a pending recruiter
   - Click "Reject Application" button
   - You should see: ❌ "Recruiter rejected. They will be logged out automatically."

3. **Check Recruiter Dashboard** (In another browser)
   - Login as the recruiter (or have recruiter logged in)
   - Within seconds, they should see:
     - ❌ Error toast: "Your profile has been rejected. You will be logged out."
     - After 3 seconds: Auto-logout
     - Redirected to `/recruiter-login`
     - All session data cleared

---

### Test Scenario 3: Real-Time Synchronization

**Setup:**
1. Open Government Dashboard in Browser 1
2. Open Recruiter Dashboard in Browser 2 (logged in as pending recruiter)
3. Keep both windows visible side-by-side

**Action:**
- In Government Dashboard: Approve or reject the recruiter
- In Recruiter Dashboard: Watch for instant notification

**Expected:** Notification appears within 1-2 seconds

---

## 🔍 Debugging & Troubleshooting

### Check Real-Time Connection

**In Browser Console:**
```javascript
// Check if subscriptions are active
console.log('Subscriptions active')

// You should see logs like:
// "Profile updated: {approval_status: 'approved', ...}"
// "New notification: {type: 'approval', message: '...'}"
```

---

### Common Issues & Solutions

#### Issue 1: No Real-Time Updates

**Solution:**
1. Verify realtime is enabled in Supabase Dashboard
2. Check browser console for connection errors
3. Ensure tables have RLS policies configured
4. Try refreshing both dashboards

#### Issue 2: Notifications Not Appearing

**Solution:**
1. Check `recruiter_notifications` table has data
2. Verify trigger is working:
   ```sql
   SELECT * FROM recruiter_notifications ORDER BY created_at DESC;
   ```
3. Check filter in subscription matches recruiter_id

#### Issue 3: Auto-Logout Not Working

**Solution:**
1. Check browser console for JavaScript errors
2. Verify session storage keys:
   - `recruiter_data`
   - `recruiter_complete_profile`
3. Ensure setTimeout is not being blocked

---

## 📊 Database Queries for Testing

### Check Pending Recruiters
```sql
SELECT id, full_name, company_name, email, approval_status, created_at
FROM recruiter_profiles
WHERE approval_status = 'pending'
ORDER BY created_at DESC;
```

### Check Notifications
```sql
SELECT n.*, rp.full_name, rp.company_name
FROM recruiter_notifications n
JOIN recruiter_profiles rp ON n.recruiter_id = rp.id
ORDER BY n.created_at DESC
LIMIT 10;
```

### Manually Approve a Recruiter (for testing)
```sql
UPDATE recruiter_profiles
SET approval_status = 'approved',
    approved_at = NOW(),
    reviewed_at = NOW()
WHERE email = 'test.recruiter@wipro.com';
```

### Manually Reject a Recruiter (for testing)
```sql
UPDATE recruiter_profiles
SET approval_status = 'rejected',
    rejection_reason = 'Test rejection',
    reviewed_at = NOW()
WHERE email = 'hr@cognizant.com';
```

---

## 🎯 Key Files Modified

### Government Dashboard
- `/app/gov-dashboard/page.tsx`
  - Enhanced recruiter approvals UI
  - Added beautiful gradient designs
  - Implemented real-time approval/rejection

### Recruiter Dashboard
- `/app/recruiter-dashboard/page.tsx`
  - Added real-time subscriptions
  - Implemented auto-logout on rejection
  - Added approval success flow with feature unlocking

### Database Schema
- `/supabase-recruiter-realtime.sql`
  - Complete real-time setup script
  - Triggers and functions
  - RLS policies
  - Test data

---

## 🔐 Security Features

1. **Row Level Security (RLS)**
   - Recruiters can only view their own data
   - Government can view all recruiter data
   - Policies prevent unauthorized access

2. **Automatic Cleanup**
   - Rejected profiles deleted after 24 hours
   - Session data cleared on rejection
   - No orphaned data

3. **Real-Time Security**
   - Filtered subscriptions per recruiter ID
   - Secure Supabase connections
   - Protected government endpoints

---

## 📱 Mobile Responsiveness

All dashboards are fully responsive:
- ✅ Mobile-optimized layouts
- ✅ Touch-friendly buttons
- ✅ Responsive typography
- ✅ Proper spacing on all devices
- ✅ Gradient headers adapt to screen size

---

## 🎉 Success Criteria

System is working correctly when:
1. ✅ Government can see pending recruiters with beautiful UI
2. ✅ Approval triggers instant notification to recruiter
3. ✅ Recruiter dashboard unlocks features on approval
4. ✅ Rejection triggers auto-logout within 3 seconds
5. ✅ Session data cleared on rejection
6. ✅ Real-time updates happen within 1-2 seconds
7. ✅ No static data - all from Supabase

---

## 🔄 Next Steps

1. **Production Deployment:**
   - Run SQL script on production database
   - Enable realtime in production Supabase
   - Test with real users

2. **Monitoring:**
   - Set up error logging
   - Monitor real-time connection health
   - Track notification delivery rates

3. **Enhancements:**
   - Add email notifications
   - Implement rejection reason modal
   - Add appeal process for rejected recruiters
   - Create admin analytics dashboard

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase connection
3. Review SQL script execution logs
4. Check real-time replication status

---

## 🎊 Congratulations!

You now have a **complete real-time recruiter approval system** with:
- ✨ Beautiful, modern UI
- ⚡ Real-time notifications
- 🔒 Secure data handling
- 📱 Mobile responsiveness
- 🎯 Automatic workflows
- 💾 No static data - all dynamic from Supabase

**Happy Testing! 🚀**
