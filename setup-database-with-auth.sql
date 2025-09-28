-- Government Internship Portal - Complete Database Setup with Authentication
-- Run this in Supabase SQL Editor

-- First, create the tables if they don't exist
CREATE TABLE IF NOT EXISTS government_officials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'officer',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recruiters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id VARCHAR(50) UNIQUE NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    ministry VARCHAR(255),
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    approval_status VARCHAR(50) DEFAULT 'approved',
    approved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    status VARCHAR(50) DEFAULT 'submitted',
    rejection_reason TEXT,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    applications INTEGER DEFAULT 0,
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS internships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    posting_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'full-time',
    duration VARCHAR(100) NOT NULL,
    stipend VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    skills TEXT NOT NULL,
    applications INTEGER DEFAULT 0,
    max_applications INTEGER DEFAULT 100,
    deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    posted_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    posting_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    application_data JSONB NOT NULL,
    resume_url TEXT,
    cover_letter_url TEXT,
    additional_documents JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'submitted',
    recruiter_status VARCHAR(50) DEFAULT 'pending',
    government_status VARCHAR(50) DEFAULT 'pending',
    application_id VARCHAR(20) UNIQUE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_id UUID,
    related_type VARCHAR(50),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(500),
    date DATE DEFAULT CURRENT_DATE,
    category VARCHAR(100) DEFAULT 'announcement',
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add the missing profiles table columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'resume_url') THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role VARCHAR(50) DEFAULT 'student';
    END IF;
END $$;

-- Insert test government officials
INSERT INTO government_officials (employee_id, name, designation, ministry, email, role) VALUES
('GOV001', 'Dr. Rajesh Kumar', 'Joint Secretary', 'Ministry of Education', 'rajesh.kumar@gov.in', 'admin'),
('GOV002', 'Ms. Priya Sharma', 'Director', 'Ministry of Electronics & IT', 'priya.sharma@gov.in', 'officer'),
('GOV003', 'Mr. Amit Singh', 'Under Secretary', 'Ministry of Skill Development', 'amit.singh@gov.in', 'officer')
ON CONFLICT (employee_id) DO NOTHING;

-- Insert test recruiters
INSERT INTO recruiters (organization_id, organization_name, organization_type, ministry, contact_person, email, approval_status) VALUES
('ORG001', 'National Informatics Centre', 'government', 'Ministry of Electronics & IT', 'Dr. Suresh Patel', 'contact@nic.in', 'approved'),
('ORG002', 'Indian Space Research Organisation', 'government', 'Department of Space', 'Dr. Kavitha Nair', 'contact@isro.gov.in', 'approved'),
('ORG003', 'Bharat Heavy Electricals Limited', 'psu', 'Ministry of Heavy Industries', 'Mr. Ravi Gupta', 'contact@bhel.in', 'approved'),
('ORG004', 'Defence Research and Development Organisation', 'government', 'Ministry of Defence', 'Dr. Anita Verma', 'contact@drdo.gov.in', 'approved'),
('ORG005', 'Indian Railways', 'government', 'Ministry of Railways', 'Mr. Sanjay Gupta', 'contact@indianrailways.gov.in', 'approved')
ON CONFLICT (organization_id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recruiters_organization_id ON recruiters(organization_id);
CREATE INDEX IF NOT EXISTS idx_internship_postings_recruiter ON internship_postings(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);

-- Enable RLS
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view recruiters" ON recruiters FOR SELECT USING (true);
CREATE POLICY "Students can view active internships" ON internships FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE recruiters;
ALTER PUBLICATION supabase_realtime ADD TABLE internship_postings;
ALTER PUBLICATION supabase_realtime ADD TABLE internships;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
