-- Complete PM Internship Portal Database Schema
-- Run this in Supabase SQL Editor

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables for the complete workflow

-- 1. Recruiters/Organizations table
CREATE TABLE IF NOT EXISTS recruiters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id VARCHAR(50) UNIQUE NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL, -- 'government', 'psu', 'approved_private'
    ministry VARCHAR(255),
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    approval_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES government_officials(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enhanced Government Officials table
CREATE TABLE IF NOT EXISTS government_officials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'officer', -- 'officer', 'admin', 'super_admin'
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Internship Postings (from recruiters)
CREATE TABLE IF NOT EXISTS internship_postings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID REFERENCES recruiters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    ministry VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    stipend VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    skills TEXT NOT NULL,
    positions INTEGER DEFAULT 1,
    deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted', -- 'draft', 'submitted', 'under_review', 'approved', 'rejected', 'live', 'closed'
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES government_officials(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    applications INTEGER DEFAULT 0,
    documents JSONB DEFAULT '[]', -- Array of document URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Approved Internships (visible to students)
CREATE TABLE IF NOT EXISTS internships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    posting_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL, -- Organization name
    ministry VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'full-time', 'part-time', 'remote'
    duration VARCHAR(100) NOT NULL,
    stipend VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    skills TEXT NOT NULL,
    applications INTEGER DEFAULT 0,
    max_applications INTEGER DEFAULT 100,
    deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'cancelled'
    posted_by UUID REFERENCES government_officials(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enhanced Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- References auth.users
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    posting_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    application_data JSONB NOT NULL, -- Complete application form data
    resume_url TEXT,
    cover_letter_url TEXT,
    additional_documents JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'under_review', 'shortlisted', 'selected', 'rejected'
    recruiter_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'shortlisted', 'selected', 'rejected'
    government_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'approved', 'rejected'
    application_id VARCHAR(20) UNIQUE, -- PMI-XXXXXX format
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enhanced Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Can be student, recruiter, or government official
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'info', 'success', 'warning', 'error', 'application', 'approval'
    related_id UUID, -- Can reference internship, application, etc.
    related_type VARCHAR(50), -- 'internship', 'application', 'posting'
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Workflow Status Tracking
CREATE TABLE IF NOT EXISTS workflow_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    posting_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    changed_by UUID, -- Can reference government_officials or recruiters
    changed_by_type VARCHAR(50) NOT NULL, -- 'government', 'recruiter'
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enhanced Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    father_name VARCHAR(255),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    education_level VARCHAR(100),
    institution_name VARCHAR(255),
    course_name VARCHAR(255),
    year_of_passing INTEGER,
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    account_holder_name VARCHAR(255),
    skills TEXT[],
    languages TEXT[],
    resume_url TEXT,
    profile_step INTEGER DEFAULT 1,
    profile_completed BOOLEAN DEFAULT false,
    document_verified BOOLEAN DEFAULT false,
    aadhaar_verified BOOLEAN DEFAULT false,
    digilocker_verified BOOLEAN DEFAULT false,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_internship_postings_status ON internship_postings(status);
CREATE INDEX IF NOT EXISTS idx_internship_postings_recruiter ON internship_postings(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_workflow_status_posting ON workflow_status(posting_id);

-- Enable Row Level Security
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Recruiters can only see their own data
CREATE POLICY "Recruiters can view own data" ON recruiters
    FOR SELECT USING (auth.uid()::text = organization_id);

-- Government officials can see all data
CREATE POLICY "Government officials can view all" ON internship_postings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM government_officials 
            WHERE employee_id = auth.jwt() ->> 'employee_id'
        )
    );

-- Students can view approved internships
CREATE POLICY "Students can view approved internships" ON internships
    FOR SELECT USING (status = 'active');

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view and update their own profiles
CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Functions for automatic notifications

-- Function to notify when internship is approved
CREATE OR REPLACE FUNCTION notify_internship_approved()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Notify recruiter
        INSERT INTO notifications (user_id, user_type, title, message, type, related_id, related_type)
        SELECT 
            r.id,
            'recruiter',
            'Internship Approved',
            'Your internship posting "' || NEW.title || '" has been approved and is now live.',
            'success',
            NEW.id,
            'posting'
        FROM recruiters r WHERE r.id = NEW.recruiter_id;
        
        -- Create live internship for students
        INSERT INTO internships (
            posting_id, title, company, ministry, location, type, duration, 
            stipend, description, requirements, skills, max_applications, 
            deadline, posted_by
        )
        SELECT 
            NEW.id,
            NEW.title,
            r.organization_name,
            NEW.ministry,
            NEW.location,
            'full-time',
            NEW.duration,
            NEW.stipend,
            NEW.description,
            NEW.requirements,
            NEW.skills,
            NEW.positions * 10, -- Allow 10x applications per position
            NEW.deadline,
            NEW.reviewed_by
        FROM recruiters r WHERE r.id = NEW.recruiter_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for internship approval
CREATE TRIGGER internship_approval_trigger
    AFTER UPDATE ON internship_postings
    FOR EACH ROW
    EXECUTE FUNCTION notify_internship_approved();

-- Function to generate application ID
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.application_id := 'PMI-' || LPAD((EXTRACT(EPOCH FROM NOW())::bigint % 1000000)::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for application ID generation
CREATE TRIGGER generate_application_id_trigger
    BEFORE INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION generate_application_id();

-- Insert sample data

-- Sample Government Officials
INSERT INTO government_officials (employee_id, name, designation, ministry, email, role) VALUES
('GOV001', 'Dr. Rajesh Kumar', 'Joint Secretary', 'Ministry of Education', 'rajesh.kumar@gov.in', 'admin'),
('GOV002', 'Ms. Priya Sharma', 'Director', 'Ministry of Electronics & IT', 'priya.sharma@gov.in', 'officer'),
('GOV003', 'Mr. Amit Singh', 'Under Secretary', 'Ministry of Skill Development', 'amit.singh@gov.in', 'officer');

-- Sample Recruiters
INSERT INTO recruiters (organization_id, organization_name, organization_type, ministry, contact_person, email, approval_status) VALUES
('ORG001', 'National Informatics Centre', 'government', 'Ministry of Electronics & IT', 'Dr. Suresh Patel', 'contact@nic.in', 'approved'),
('ORG002', 'Indian Space Research Organisation', 'government', 'Department of Space', 'Dr. Kavitha Nair', 'contact@isro.gov.in', 'approved'),
('ORG003', 'Bharat Heavy Electricals Limited', 'psu', 'Ministry of Heavy Industries', 'Mr. Ravi Gupta', 'contact@bhel.in', 'approved');

-- Sample Internship Postings
INSERT INTO internship_postings (
    recruiter_id, title, department, ministry, location, duration, stipend, 
    description, requirements, skills, positions, deadline, status
) VALUES
(
    (SELECT id FROM recruiters WHERE organization_id = 'ORG001'),
    'Software Development Intern',
    'National Informatics Centre',
    'Ministry of Electronics & IT',
    'New Delhi',
    '6 months',
    '₹25,000/month',
    'Work on government digital initiatives and web applications.',
    'B.Tech/MCA students in final year or recent graduates.',
    'Java, Python, React, Database Management',
    5,
    '2024-12-31',
    'approved'
),
(
    (SELECT id FROM recruiters WHERE organization_id = 'ORG002'),
    'Data Science Intern',
    'Indian Space Research Organisation',
    'Department of Space',
    'Bangalore',
    '4 months',
    '₹30,000/month',
    'Analyze satellite data and develop machine learning models.',
    'M.Tech/PhD students in Computer Science or related fields.',
    'Python, Machine Learning, Data Analysis, Statistics',
    3,
    '2024-11-30',
    'submitted'
);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE recruiters;
ALTER PUBLICATION supabase_realtime ADD TABLE government_officials;
ALTER PUBLICATION supabase_realtime ADD TABLE internship_postings;
ALTER PUBLICATION supabase_realtime ADD TABLE internships;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE workflow_status;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
