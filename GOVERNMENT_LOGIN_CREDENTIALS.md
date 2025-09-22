# Government Login Credentials

## 🏛️ **PM Internship Portal - Login Credentials**

## 🏛️ Government Officials
- **Employee ID**: `GOV001` | **Password**: `gov123456`
  - Name: Dr. Rajesh Kumar
  - Role: Joint Secretary, Ministry of Education
  
- **Employee ID**: `GOV002` | **Password**: `gov123456`
  - Name: Ms. Priya Sharma  
  - Role: Director, Ministry of Electronics & IT
  
- **Employee ID**: `GOV003` | **Password**: `gov123456`
  - Name: Mr. Amit Singh
  - Role: Under Secretary, Ministry of Skill Development

## 🏢 Recruiters/Organizations
- **Organization ID**: `ORG001` | **Password**: `recruiter123`
  - Organization: National Informatics Centre
  - Ministry: Ministry of Electronics & IT
  
- **Organization ID**: `ORG002` | **Password**: `recruiter123`
  - Organization: Indian Space Research Organisation
  - Ministry: Department of Space
  
- **Organization ID**: `ORG003` | **Password**: `recruiter123`
  - Organization: Bharat Heavy Electricals Limited
  - Ministry: Ministry of Heavy Industries
  
- **Organization ID**: `ORG004` | **Password**: `recruiter123`
  - Organization: Defence Research and Development Organisation
  - Ministry: Ministry of Defence
  
- **Organization ID**: `ORG005` | **Password**: `recruiter123`
  - Organization: Indian Railways
  - Ministry: Ministry of Railways

## 📋 Setup Instructions
1. Run `setup-database-with-auth.sql` in Supabase SQL Editor
2. This will create all tables and insert the test data
3. Use the credentials above for testing the system
4. All organizations are pre-approved for immediate use
- **Email:** priya.sharma@gov.in
- **Department:** Skill Development, Ministry of Education
- **Office:** Shastri Bhawan, New Delhi
- **Phone:** +91-11-2338-5678

#### **3. Shri Amit Singh - Deputy Secretary**
- **Employee ID:** `GOV003`
- **Password:** `password123`
- **Email:** amit.singh@gov.in
- **Department:** Digital India, Ministry of Electronics & IT
- **Office:** Electronics Niketan, New Delhi
- **Phone:** +91-11-2301-9876

---

## 🔐 **How to Login:**

### **Step 1: Access Government Portal**
- Go to: `/gov-login`
- Use any of the Employee IDs above
- Enter the corresponding password

### **Step 2: Complete Security**
- Enter the displayed CAPTCHA code
- Click "Secure Login"

### **Step 3: OTP Verification**
- Enter any 6-digit number (e.g., `123456`)
- Click "Verify & Access Dashboard"

### **Step 4: Access Dashboard**
- You'll be redirected to `/gov-dashboard`
- Full access to post internships, manage applications, etc.

---

## 📊 **Database Setup Required:**

**Before using these credentials, run this SQL in your Supabase SQL Editor:**

```sql
-- Run the fix-database.sql file to create all tables and insert sample data
-- This includes the government_officials table with these credentials
```

---

## 🎯 **Features Available After Login:**

1. **Post New Internships** - Real-time posting to student dashboard
2. **Manage Applications** - Review and process student applications  
3. **Student Verification** - Verify profiles and documents
4. **Analytics Dashboard** - View statistics and reports
5. **Notification System** - Send updates to students
6. **Certificate Management** - Issue completion certificates

---

## 🔧 **Technical Notes:**

- Credentials are stored in `government_officials` table
- Session data stored in browser sessionStorage
- Real-time integration with student dashboard via Supabase
- All government actions are logged and tracked

**Ready to use immediately after running the database setup!** 🚀
