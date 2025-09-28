# Government Internship Portal - Complete Login Credentials

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
1. **Run SQL Script**: Execute `setup-database-with-auth.sql` in Supabase SQL Editor
2. **Create Tables**: This will create all required tables with proper structure
3. **Insert Test Data**: Government officials and recruiters will be added
4. **Test Login**: Use the credentials above for testing

## 🔄 Real-time Workflow
1. **Recruiter Login** → Post internship → Status: "submitted"
2. **Government Review** → Approve/Reject → Status: "approved"/"rejected"  
3. **Auto-Create** → Approved internships appear in student dashboard
4. **Student Apply** → Real-time notifications to recruiter
5. **Track Applications** → Full workflow visibility

## ⚠️ Important Notes
- All recruiters are pre-approved for immediate posting
- Government officials can approve internships instantly
- Real-time notifications work across all user types
- No static data - everything flows through Supabase
