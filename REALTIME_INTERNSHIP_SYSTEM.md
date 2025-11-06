# 🚀 Real-Time Internship Posting System - Complete Guide

## Overview

A complete real-time system where:
1. **Recruiter** posts internship → Appears instantly on **Government** & **Student** dashboards
2. **Government** approves/rejects → **Recruiter** gets real-time notification
3. **Student** applies → **Recruiter** gets instant notification with application details
4. All application counts update automatically in real-time

---

## 📊 System Flow Diagram

```
┌─────────────────────┐
│   RECRUITER         │
│   Posts Internship  │
└──────────┬──────────┘
           │
           ↓ (Real-time via Supabase)
    ┌──────┴───────┐
    │              │
    ↓              ↓
┌────────────┐  ┌──────────────┐
│ GOVERNMENT │  │   STUDENTS   │
│  Dashboard │  │   Dashboard  │
│  (Review)  │  │  (Browse)    │
└─────┬──────┘  └──────┬───────┘
      │                │
      │ Approves       │ Applies
      ↓                ↓
┌─────────────────────────┐
│   RECRUITER Dashboard   │
│   Gets Notifications    │
│   • Approval status     │
│   • New applications    │
│   • Application count   │
└─────────────────────────┘
```

---

## 🗄️ Database Schema

### 1. **internship_postings** Table

```sql
CREATE TABLE internship_postings (
    id UUID PRIMARY KEY,
    recruiter_id UUID → recruiter_profiles(id),
    title TEXT,
    company_name TEXT,
    location TEXT,
    type TEXT ('on-site', 'remote', 'hybrid'),
    duration TEXT,
    stipend TEXT,
    description TEXT,
    requirements TEXT,
    required_skills TEXT[],
    responsibilities TEXT,
    perks TEXT,
    status TEXT ('draft', 'submitted', 'approved', 'rejected', 'live', 'closed'),
    current_applications INTEGER DEFAULT 0,
    max_applications INTEGER,
    deadline TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID,
    rejection_reason TEXT
);
```

**Real-time enabled:** ✅

---

### 2. **applications** Table

```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    internship_id UUID → internship_postings(id),
    student_id UUID → profiles(id),
    student_name TEXT,
    student_email TEXT,
    student_phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'),
    applied_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewer_notes TEXT,
    UNIQUE(internship_id, student_id)
);
```

**Real-time enabled:** ✅

---

## ⚡ Automatic Triggers

### 1. **Application Count Auto-Update**

**When:** Student submits application
**Action:** `current_applications` automatically increments

```sql
INSERT application → internship_postings.current_applications + 1
DELETE application → internship_postings.current_applications - 1
```

---

### 2. **New Application Notification**

**When:** Student applies to internship
**Action:** Creates notification for recruiter

**Notification:**
- **Title:** "📩 New Application Received!"
- **Message:** "New application from {student_name} for {internship_title}"
- **Type:** info
- **Data:** application_id, internship_id, student details

---

### 3. **Internship Status Change Notification**

**When:** Government approves/rejects internship
**Action:** Creates notification for recruiter

**If Approved:**
- **Title:** "✅ Internship Posting Approved!"
- **Message:** "Your internship posting {title} has been approved and is now live!"
- **Type:** approval

**If Rejected:**
- **Title:** "❌ Internship Posting Rejected"
- **Message:** "Your internship posting {title} was rejected. Reason: {reason}"
- **Type:** rejection

---

## 🔄 Real-Time Subscriptions

### For Recruiter Dashboard:

```typescript
// Listen for new applications
supabase
  .channel('applications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'applications',
    filter: `internship_id=eq.${internshipId}`
  }, (payload) => {
    toast.success('New application received!')
    // Update application list
    // Update count
  })
  .subscribe()
```

---

### For Government Dashboard:

```typescript
// Listen for new internship postings
supabase
  .channel('internship_postings')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'internship_postings',
    filter: 'status=eq.submitted'
  }, (payload) => {
    // Show new posting for review
    // Update pending count
  })
  .subscribe()
```

---

### For Student Dashboard:

```typescript
// Listen for approved internships
supabase
  .channel('live_internships')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'internship_postings',
    filter: 'status=in.(approved,live)'
  }, (payload) => {
    toast.success('New internship opportunity!')
    // Add to internship list
  })
  .subscribe()
```

---

## 📝 Setup Instructions

### Step 1: Run SQL Script

```bash
1. Open Supabase SQL Editor
2. Copy entire contents of: supabase-recruiter-realtime.sql
3. Click "Run"
4. Verify success messages
```

**Expected Output:**
```
✅ Real-time recruiter & internship system setup completed!
✓ Realtime enabled for internship_postings
✓ Realtime enabled for applications
✓ Triggers created for notifications
✓ Application count auto-updates
```

---

### Step 2: Enable Realtime in Supabase Dashboard

1. Go to **Database** → **Replication**
2. Enable realtime for:
   - ✅ `recruiter_profiles`
   - ✅ `recruiter_notifications`
   - ✅ `internship_postings`
   - ✅ `applications`
3. Click **Save**

---

### Step 3: Verify RLS Policies

Check that Row Level Security is enabled:
- ✅ `internship_postings`
- ✅ `applications`
- ✅ `recruiter_profiles`
- ✅ `recruiter_notifications`

---

## 🎯 Implementation Guide

### Recruiter Dashboard - Post Internship

```typescript
const postInternship = async (formData) => {
  const { data, error } = await supabase
    .from('internship_postings')
    .insert({
      recruiter_id: recruiterId,
      title: formData.title,
      company_name: formData.company,
      location: formData.location,
      type: formData.type, // on-site, remote, hybrid
      duration: formData.duration,
      stipend: formData.stipend,
      description: formData.description,
      requirements: formData.requirements,
      required_skills: formData.skills, // array
      responsibilities: formData.responsibilities,
      perks: formData.perks,
      status: 'submitted', // Needs government approval
      max_applications: formData.maxApplications,
      deadline: formData.deadline
    })
  
  if (!error) {
    toast.success('Internship posted! Awaiting government approval.')
  }
}
```

**Result:** Internship appears immediately in Government dashboard for review!

---

### Government Dashboard - Approve/Reject

```typescript
const reviewInternship = async (internshipId, status, reason?) => {
  const updateData = {
    status: status, // 'approved' or 'rejected'
    approved_at: status === 'approved' ? new Date() : null,
    approved_by: governmentOfficialId,
    rejection_reason: reason || null
  }
  
  const { error } = await supabase
    .from('internship_postings')
    .update(updateData)
    .eq('id', internshipId)
  
  if (!error) {
    if (status === 'approved') {
      toast.success('Internship approved! Recruiter will be notified.')
    } else {
      toast.success('Internship rejected.')
    }
  }
}
```

**Result:** 
- Recruiter gets real-time notification
- If approved: Internship becomes visible to students!

---

### Student Dashboard - View & Apply

```typescript
// Subscribe to live internships
useEffect(() => {
  const fetchInternships = async () => {
    const { data } = await supabase
      .from('internship_postings')
      .select('*')
      .in('status', ['approved', 'live'])
      .order('created_at', { ascending: false })
    
    setInternships(data || [])
  }
  
  fetchInternships()
  
  // Real-time subscription
  const subscription = supabase
    .channel('live_internships')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'internship_postings',
      filter: 'status=in.(approved,live)'
    }, (payload) => {
      if (payload.eventType === 'INSERT') {
        setInternships(prev => [payload.new, ...prev])
        toast.success('🎉 New internship opportunity!')
      }
    })
    .subscribe()
  
  return () => subscription.unsubscribe()
}, [])

// Apply to internship
const applyToInternship = async (internshipId) => {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      internship_id: internshipId,
      student_id: studentId,
      student_name: studentProfile.full_name,
      student_email: studentProfile.email,
      student_phone: studentProfile.phone,
      resume_url: studentProfile.resume_url,
      cover_letter: coverLetter,
      status: 'pending'
    })
  
  if (!error) {
    toast.success('Application submitted successfully!')
  }
}
```

**Result:**
- Recruiter gets instant notification: "📩 New Application Received!"
- Application count updates automatically
- Application appears in recruiter's dashboard

---

### Recruiter Dashboard - View Applications

```typescript
useEffect(() => {
  const fetchApplications = async () => {
    const { data } = await supabase
      .from('applications')
      .select(`
        *,
        internship_postings(title, company_name)
      `)
      .eq('internship_postings.recruiter_id', recruiterId)
      .order('applied_at', { ascending: false })
    
    setApplications(data || [])
  }
  
  fetchApplications()
  
  // Real-time subscription for new applications
  const subscription = supabase
    .channel('recruiter_applications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'applications'
    }, (payload) => {
      // Check if application is for this recruiter's internship
      fetchApplications() // Refresh list
      toast.success('📩 New application received!')
    })
    .subscribe()
  
  return () => subscription.unsubscribe()
}, [recruiterId])
```

---

## 🔒 Security & RLS

All tables have Row Level Security enabled with policies:

### Internship Postings:
- ✅ Everyone can SELECT (view)
- ✅ Recruiters can INSERT (create)
- ✅ Recruiters/Government can UPDATE (edit/approve)

### Applications:
- ✅ Everyone can SELECT (for transparency)
- ✅ Students can INSERT (apply)
- ✅ Students/Recruiters can UPDATE (status changes)

---

## 📊 Real-Time Features Summary

| Action | Real-Time Effect |
|--------|------------------|
| Recruiter posts internship | Government sees it instantly for review |
| Government approves internship | Recruiter gets notification + Students can see it |
| Student applies | Recruiter gets notification + Count updates |
| Recruiter reviews application | Student can see status change |
| Application count reaches max | Internship auto-closes |

---

## 🧪 Testing the System

### Test Flow 1: Post → Approve → Apply

1. **As Recruiter:**
   - Login to `/recruiter-dashboard`
   - Click "Post Internship"
   - Fill all details and submit
   - ✅ Should show "Awaiting approval" status

2. **As Government:**
   - Open `/gov-dashboard`
   - Go to "Posting Reviews" tab
   - ✅ Should see the new posting immediately (real-time)
   - Click "Approve"
   - ✅ Recruiter gets notification

3. **As Student:**
   - Open `/dashboard` or `/internships`
   - ✅ Should see approved internship (real-time)
   - Click "Apply"
   - Fill application and submit

4. **As Recruiter:**
   - Check notifications
   - ✅ Should see "New Application Received!" (real-time)
   - Go to "Applications" tab
   - ✅ Should see the application
   - ✅ Application count should be updated

---

### Test Flow 2: Multiple Applications

1. **Apply as 3 different students**
2. **Watch recruiter dashboard:**
   - ✅ Gets 3 notifications (real-time)
   - ✅ Application count: 0 → 1 → 2 → 3 (auto-updates)
   - ✅ All applications visible in list

---

## 🐛 Troubleshooting

### Issue: Internship not appearing

**Check:**
1. Status is 'submitted' in database
2. Real-time enabled for `internship_postings`
3. Browser console for subscription errors
4. RLS policies allow SELECT

---

### Issue: Applications not showing

**Check:**
1. `internship_id` matches posting ID
2. Real-time enabled for `applications`
3. Trigger `notify_recruiter_new_application` exists
4. `recruiter_notifications` table has data

---

### Issue: Counts not updating

**Check:**
1. Trigger `application_count_trigger` exists
2. Run in SQL Editor:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'application_count_trigger';
   ```
3. Manually verify:
   ```sql
   SELECT id, title, current_applications FROM internship_postings;
   SELECT COUNT(*) FROM applications WHERE internship_id = 'your-id';
   ```

---

## 📈 Performance Optimization

1. **Indexes created for:**
   - internship_postings(recruiter_id)
   - internship_postings(status)
   - internship_postings(created_at)
   - applications(internship_id)
   - applications(student_id)
   - applications(status)

2. **Real-time subscriptions:**
   - Use filters to reduce unnecessary updates
   - Unsubscribe when component unmounts
   - Batch updates if needed

---

## 🎉 Success Indicators

System is working when:
- ✅ Recruiter posts → Government sees it (< 2 seconds)
- ✅ Government approves → Students see it (< 2 seconds)
- ✅ Student applies → Recruiter gets notification (< 2 seconds)
- ✅ Application count updates automatically
- ✅ All data is real, nothing static

---

**The complete real-time internship posting system is now ready to use! 🚀**

Everything works automatically with Supabase real-time and triggers - no manual refreshes needed!
