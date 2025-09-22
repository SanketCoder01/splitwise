# Government Login Credentials

## 🏛️ **PM Internship & Resume Verifier - Government Portal Access**

### **Real Government Employee Credentials:**

#### **1. Dr. Rajesh Kumar - Joint Secretary**
- **Employee ID:** `GOV001`
- **Password:** `password123`
- **Email:** rajesh.kumar@gov.in
- **Department:** Higher Education, Ministry of Education
- **Office:** Shastri Bhawan, New Delhi
- **Phone:** +91-11-2338-1234

#### **2. Ms. Priya Sharma - Director**
- **Employee ID:** `GOV002`
- **Password:** `password123`
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
