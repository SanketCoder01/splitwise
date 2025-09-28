-- ==========================================
-- PM INTERNSHIP PORTAL - COMPLETE DATABASE SCHEMA
-- ==========================================
-- Run this in Supabase SQL Editor to create all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES TABLE (Enhanced for complete profile system)
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    
    -- Personal Information (Step 1)
    full_name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    
    -- Contact Information (Step 2)
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    
    -- Education Information (Step 3)
    education_level VARCHAR(100),
    institution_name VARCHAR(255),
    course_name VARCHAR(255),
    year_of_passing INTEGER,
    percentage DECIMAL(5,2),
    cgpa DECIMAL(4,2),
    
    -- Bank Details (Step 4)
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    account_holder_name VARCHAR(255),
    
    -- Skills & Languages (Step 5)
    skills TEXT[], -- Array of skills
    languages TEXT[], -- Array of languages
    
    -- Additional Profile Data
    profile_image TEXT,
    resume_url TEXT,
    linkedin VARCHAR(255),
    github VARCHAR(255),
    portfolio_url TEXT,
    
    -- Profile Completion Tracking
    profile_step INTEGER DEFAULT 1, -- Current step (1-6)
    profile_completed BOOLEAN DEFAULT FALSE,
    profile_completion INTEGER DEFAULT 0, -- Percentage
    
    -- Verification Status
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    document_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. GOVERNMENT OFFICIALS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS government_officials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'officer', -- 'officer', 'admin', 'super_admin'
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. RECRUITERS/ORGANIZATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS recruiters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id VARCHAR(50) UNIQUE NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL, -- 'government', 'psu', 'private'
    ministry VARCHAR(255),
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(255),
    approval_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES government_officials(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. INTERNSHIPS TABLE (Real-time postings)
-- ==========================================
CREATE TABLE IF NOT EXISTS internships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    ministry VARCHAR(255),
    department VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'remote', 'onsite', 'hybrid'
    duration VARCHAR(100) NOT NULL,
    stipend VARCHAR(100),
    description TEXT NOT NULL,
    requirements TEXT[],
    skills TEXT[],
    applications INTEGER DEFAULT 0,
    max_applications INTEGER DEFAULT 100,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'draft'
    posted_by UUID REFERENCES government_officials(id),
    recruiter_id UUID REFERENCES recruiters(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. APPLICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    application_id VARCHAR(50) UNIQUE, -- PMI-XXXXXX format
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'under_review', 'shortlisted', 'selected', 'rejected'
    cover_letter TEXT,
    resume_url TEXT,
    additional_documents JSONB DEFAULT '{}',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES government_officials(id),
    feedback TEXT,
    score INTEGER, -- Assessment score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(internship_id, student_id) -- Prevent duplicate applications
);

-- ==========================================
-- 6. NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
    category VARCHAR(100), -- 'internship', 'application', 'system', 'verification'
    data JSONB DEFAULT '{}', -- Additional data
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 7. DOCUMENT VERIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS document_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'aadhaar', 'education', 'experience', 'resume'
    document_url TEXT,
    document_number VARCHAR(100),
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_by UUID REFERENCES government_officials(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 8. RESUME VERIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS resume_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Resume Upload
    resume_url TEXT,
    resume_analysis JSONB DEFAULT '{}', -- AI analysis results
    
    -- Certificate Verification
    certificate_number VARCHAR(100),
    certificate_verified BOOLEAN DEFAULT FALSE,
    
    -- Experience Verification
    experience_documents TEXT[], -- Array of document URLs
    experience_verified BOOLEAN DEFAULT FALSE,
    
    -- GitHub Verification
    github_username VARCHAR(100),
    github_verified BOOLEAN DEFAULT FALSE,
    github_data JSONB DEFAULT '{}',
    
    -- LinkedIn Verification
    linkedin_profile VARCHAR(255),
    linkedin_verified BOOLEAN DEFAULT FALSE,
    linkedin_data JSONB DEFAULT '{}',
    
    -- Skills Assessment
    skills_assessed TEXT[], -- Array of assessed skills
    skills_scores JSONB DEFAULT '{}', -- Skill -> Score mapping
    
    -- Overall Status
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    completion_percentage INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 9. SKILLS ASSESSMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS skills_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    assessment_type VARCHAR(50) DEFAULT 'quiz', -- 'quiz', 'practical', 'interview'
    questions JSONB DEFAULT '{}',
    answers JSONB DEFAULT '{}',
    score INTEGER,
    max_score INTEGER DEFAULT 100,
    duration_minutes INTEGER,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 10. GRIEVANCES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS grievances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    grievance_id VARCHAR(50) UNIQUE, -- GRV-XXXXXX format
    category VARCHAR(100) NOT NULL, -- 'technical', 'application', 'verification', 'other'
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    assigned_to UUID REFERENCES government_officials(id),
    resolution TEXT,
    attachments TEXT[], -- Array of file URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 11. UPDATES/ANNOUNCEMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    category VARCHAR(100) DEFAULT 'announcement', -- 'announcement', 'news', 'technology', 'education'
    priority INTEGER DEFAULT 1, -- 1-5 (5 being highest)
    is_active BOOLEAN DEFAULT TRUE,
    published_by UUID REFERENCES government_officials(id),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 12. SCHEMES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS schemes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    ministry VARCHAR(255),
    description TEXT NOT NULL,
    duration VARCHAR(100),
    stipend VARCHAR(100),
    eligibility TEXT,
    features TEXT[],
    locations TEXT[],
    deadline DATE,
    slots INTEGER,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Applications: Users can only access their own applications
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Notifications: Users can only access their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Document Verifications: Users can only access their own documents
CREATE POLICY "Users can view own documents" ON document_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON document_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Resume Verifications: Users can only access their own resume data
CREATE POLICY "Users can view own resume verification" ON resume_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resume verification" ON resume_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resume verification" ON resume_verifications FOR UPDATE USING (auth.uid() = user_id);

-- Skills Assessments: Users can only access their own assessments
CREATE POLICY "Users can view own assessments" ON skills_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON skills_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON skills_assessments FOR UPDATE USING (auth.uid() = user_id);

-- Grievances: Users can only access their own grievances
CREATE POLICY "Users can view own grievances" ON grievances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own grievances" ON grievances FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Internships: Everyone can view active internships
CREATE POLICY "Anyone can view active internships" ON internships FOR SELECT USING (status = 'active');

-- Updates: Everyone can view active updates
CREATE POLICY "Anyone can view active updates" ON updates FOR SELECT USING (is_active = true);

-- Schemes: Everyone can view active schemes
CREATE POLICY "Anyone can view active schemes" ON schemes FOR SELECT USING (is_active = true);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_verifications_updated_at BEFORE UPDATE ON document_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_verifications_updated_at BEFORE UPDATE ON resume_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grievances_updated_at BEFORE UPDATE ON grievances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON internships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate application ID
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.application_id = 'PMI-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6));
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-generate application ID
CREATE TRIGGER generate_application_id_trigger 
    BEFORE INSERT ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_application_id();

-- Function to generate grievance ID
CREATE OR REPLACE FUNCTION generate_grievance_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.grievance_id = 'GRV-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6));
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-generate grievance ID
CREATE TRIGGER generate_grievance_id_trigger 
    BEFORE INSERT ON grievances 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_grievance_id();

-- Function to create notification for new internship
CREATE OR REPLACE FUNCTION notify_new_internship()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type, category)
    SELECT 
        id,
        'New Internship Posted: ' || NEW.title,
        'A new internship opportunity has been posted at ' || NEW.company || '. Apply now!',
        'info',
        'internship'
    FROM profiles 
    WHERE profile_completed = true;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to notify users of new internships
CREATE TRIGGER notify_new_internship_trigger
    AFTER INSERT ON internships
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION notify_new_internship();

-- ==========================================
-- CREATE STORAGE BUCKETS
-- ==========================================

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
('resumes', 'resumes', true),
('documents', 'documents', true),
('profile-images', 'profile-images', true),
('certificates', 'certificates', true),
('experience-proofs', 'experience-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes
CREATE POLICY "Users can upload own resume" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own resume" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own resume" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own resume" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for documents
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for profile images
CREATE POLICY "Users can upload own profile image" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own profile image" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==========================================
-- SAMPLE DATA (Optional - for testing)
-- ==========================================

-- Insert sample government official
INSERT INTO government_officials (employee_id, name, designation, ministry, email, role) VALUES 
('GOV001', 'Dr. Rajesh Kumar', 'Joint Secretary', 'Ministry of Education', 'rajesh.kumar@gov.in', 'admin')
ON CONFLICT (employee_id) DO NOTHING;

-- Insert sample schemes
INSERT INTO schemes (title, department, ministry, description, duration, stipend, eligibility, features, locations, slots) VALUES 
('Government Internship Scheme', 'Ministry of Education', 'Ministry of Education', 'Flagship internship program providing hands-on experience in government departments', '6-12 months', '₹25,000 - ₹40,000', 'Graduate/Post-graduate in any discipline', ARRAY['Direct mentorship', 'Policy exposure', 'Government certificate'], ARRAY['New Delhi', 'Mumbai', 'Bangalore'], 10000),
('Digital India Internship', 'Ministry of Electronics and IT', 'Ministry of Electronics and IT', 'Technology-focused internships in AI, ML, and Digital Governance', '3-6 months', '₹30,000 - ₹50,000', 'Engineering/MCA/MSc in Computer Science', ARRAY['Tech projects', 'Innovation labs', 'Startup exposure'], ARRAY['Hyderabad', 'Pune', 'Chennai'], 5000)
ON CONFLICT DO NOTHING;

-- ==========================================
-- ENABLE REALTIME
-- ==========================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE internships;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE updates;

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_completed ON profiles(profile_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_step ON profiles(profile_step);

-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Internships indexes
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_deadline ON internships(deadline);
CREATE INDEX IF NOT EXISTS idx_internships_ministry ON internships(ministry);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ==========================================
-- FIX MISSING COLUMNS (Safe Migration)
-- ==========================================

-- Fix missing student_id column error
DO $$ 
BEGIN
    -- Check if student_id column exists in applications table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'student_id'
    ) THEN
        ALTER TABLE applications ADD COLUMN student_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added student_id column to applications table';
    ELSE
        RAISE NOTICE 'student_id column already exists in applications table';
    END IF;

    -- Check if other commonly missing columns exist and add them
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'resume_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
        RAISE NOTICE 'Added resume_url column to profiles table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'profile_step'
    ) THEN
        ALTER TABLE profiles ADD COLUMN profile_step INTEGER DEFAULT 1;
        RAISE NOTICE 'Added profile_step column to profiles table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'profile_completed'
    ) THEN
        ALTER TABLE profiles ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added profile_completed column to profiles table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'internships' AND column_name = 'ministry'
    ) THEN
        ALTER TABLE internships ADD COLUMN ministry VARCHAR(255);
        RAISE NOTICE 'Added ministry column to internships table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'internships' AND column_name = 'department'
    ) THEN
        ALTER TABLE internships ADD COLUMN department VARCHAR(255);
        RAISE NOTICE 'Added department column to internships table';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred while adding columns: %', SQLERRM;
END $$;

-- Update RLS policies for applications table with student_id
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON applications;

CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ==========================================
-- COMPLETION MESSAGE
-- ==========================================

-- This completes the database schema setup
-- All tables, policies, triggers, and functions are now created
-- Missing columns have been safely added
-- The system is ready for the Government Internship Portal
