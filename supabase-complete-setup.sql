-- Complete Government Internship Portal Database Setup
-- Run this in Supabase SQL Editor
-- This file includes DROP statements, table creation, and sample data

-- =====================================================
-- CLEANUP SECTION - DROP EXISTING TABLES AND DATA
-- =====================================================

-- Safely drop all tables and dependencies
DO $$
BEGIN
    -- Drop triggers first
    EXECUTE 'DROP TRIGGER IF EXISTS internship_approval_trigger ON internship_postings';
    EXECUTE 'DROP TRIGGER IF EXISTS generate_application_id_trigger ON applications';

    -- Drop functions
    EXECUTE 'DROP FUNCTION IF EXISTS notify_internship_approved()';
    EXECUTE 'DROP FUNCTION IF EXISTS generate_application_id()';

    -- Drop tables in reverse dependency order
    EXECUTE 'DROP TABLE IF EXISTS workflow_status CASCADE';
    EXECUTE 'DROP TABLE IF EXISTS notifications CASCADE';
    EXECUTE 'DROP TABLE IF EXISTS applications CASCADE';
    EXECUTE 'DROP TABLE IF EXISTS internships CASCADE';
    EXECUTE 'DROP TABLE IF EXISTS internship_postings CASCADE';
    EXECUTE 'DROP TABLE IF EXISTS government_officials CASCADE';
    EXECUTE 'DROP TABLE IF EXISTS recruiters CASCADE';
    EXECUTE 'DROP TABLE IF EXISTS recruiter_profiles CASCADE';
    EXECUTE 'DROP TABLE IF EXISTS profiles CASCADE';

    RAISE NOTICE 'All existing tables and dependencies dropped successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Some cleanup operations failed, but continuing with setup: %', SQLERRM;
END $$;

-- =====================================================
-- PREPARATION - DISABLE RLS TEMPORARILY
-- =====================================================

-- Temporarily disable RLS to avoid issues during table creation
ALTER TABLE IF EXISTS recruiter_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS internship_postings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS government_officials DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workflow_status DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE TABLES SECTION
-- =====================================================

-- 1. Recruiter Profiles Table (Enhanced)
CREATE TABLE recruiter_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Step 1: Personal Details
    full_name TEXT,
    designation TEXT,
    employee_id TEXT,

    -- Step 2: Company Details
    company_name TEXT,
    company_type TEXT,
    industry TEXT,
    company_size TEXT,
    website TEXT,

    -- Step 3: Contact Information
    email TEXT,
    phone TEXT,
    alternate_phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,

    -- Step 4: Documents (file paths)
    company_registration_url TEXT,
    authorization_letter_url TEXT,
    id_proof_url TEXT,

    -- Step 5: Internship Preferences
    internship_types TEXT[], -- Array of internship types
    internship_alignment TEXT[], -- Array of specific alignments
    preferred_skills TEXT,
    min_duration TEXT,
    max_duration TEXT,
    stipend_range TEXT,

    -- Step 6: Agreement
    terms_accepted BOOLEAN DEFAULT FALSE,
    data_consent BOOLEAN DEFAULT FALSE,

    -- Profile Status
    profile_step INTEGER DEFAULT 1,
    profile_completed BOOLEAN DEFAULT FALSE,
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID
);

-- 2. Internship Postings Table
CREATE TABLE internship_postings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID REFERENCES recruiter_profiles(id) ON DELETE CASCADE,

    -- Basic Information
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    responsibilities TEXT,

    -- Details
    department TEXT,
    location TEXT,
    work_type TEXT CHECK (work_type IN ('remote', 'onsite', 'hybrid')),
    duration TEXT,
    stipend TEXT,

    -- Application Details
    max_applications INTEGER DEFAULT 50,
    current_applications INTEGER DEFAULT 0,
    deadline DATE,

    -- Skills and Qualifications
    required_skills TEXT[],
    preferred_qualifications TEXT,
    education_level TEXT,

    -- Screening Questions (JSON format)
    screening_questions JSONB DEFAULT '[]',

    -- Additional Information
    benefits TEXT[],
    company_description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    application_instructions TEXT,

    -- Poster
    poster_url TEXT,

    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'live', 'closed')),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Government Officials Table
CREATE TABLE government_officials (
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

-- 4. Student Profiles Table
CREATE TABLE profiles (
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

-- 5. Live Internships Table (for students)
CREATE TABLE internships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    posting_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    stipend VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    skills TEXT NOT NULL,
    applications INTEGER DEFAULT 0,
    max_applications INTEGER DEFAULT 100,
    deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    posted_by UUID REFERENCES government_officials(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Applications Table
CREATE TABLE applications (
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

-- 7. Notifications Table
CREATE TABLE notifications (
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

-- 8. Workflow Status Tracking
CREATE TABLE workflow_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    posting_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    changed_by UUID,
    changed_by_type VARCHAR(50) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_email ON recruiter_profiles(email);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_approval_status ON recruiter_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_profile_completed ON recruiter_profiles(profile_completed);
CREATE INDEX IF NOT EXISTS idx_internship_postings_recruiter_id ON internship_postings(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_internship_postings_status ON internship_postings(status);
CREATE INDEX IF NOT EXISTS idx_internship_postings_deadline ON internship_postings(deadline);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_status_posting ON workflow_status(posting_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_status ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Recruiters can manage their own profiles
CREATE POLICY "Recruiters can manage own profile" ON recruiter_profiles
    FOR ALL USING (auth.uid() = id);

-- Recruiters can manage their own postings
CREATE POLICY "Recruiters can manage own postings" ON internship_postings
    FOR ALL USING (auth.uid() = recruiter_id);

-- Government officials can view all data
CREATE POLICY "Government officials can view all" ON internship_postings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM government_officials
            WHERE employee_id = auth.jwt() ->> 'employee_id'
        )
    );

-- Students can view approved internships
CREATE POLICY "Students can view approved internships" ON internships
    FOR SELECT USING (status = 'active');

-- Users can manage their own applications
CREATE POLICY "Users can manage own applications" ON applications
    FOR ALL USING (auth.uid() = user_id);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own profiles
CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- =====================================================
-- CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to notify when internship is approved
CREATE OR REPLACE FUNCTION notify_internship_approved()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Notify recruiter
        INSERT INTO notifications (user_id, title, message, type, related_id, related_type)
        SELECT
            NEW.recruiter_id,
            'Internship Approved',
            'Your internship posting "' || NEW.title || '" has been approved and is now live.',
            'success',
            NEW.id,
            'posting';

        -- Create live internship for students
        INSERT INTO internships (
            posting_id, title, company, ministry, location, type, duration,
            stipend, description, requirements, skills, max_applications,
            deadline, posted_by
        )
        SELECT
            NEW.id,
            NEW.title,
            rp.company_name,
            'Approved Organization',
            NEW.location,
            COALESCE(NEW.work_type, 'hybrid'),
            NEW.duration,
            NEW.stipend,
            NEW.description,
            NEW.requirements,
            array_to_string(NEW.required_skills, ', '),
            NEW.max_applications,
            NEW.deadline,
            NEW.approved_by
        FROM recruiter_profiles rp WHERE rp.id = NEW.recruiter_id;
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

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Sample Government Officials
INSERT INTO government_officials (employee_id, name, designation, ministry, email, role) VALUES
('GOV001', 'Dr. Rajesh Kumar', 'Joint Secretary', 'Ministry of Education', 'rajesh.kumar@gov.in', 'admin'),
('GOV002', 'Ms. Priya Sharma', 'Director', 'Ministry of Electronics & IT', 'priya.sharma@gov.in', 'officer'),
('GOV003', 'Mr. Amit Singh', 'Under Secretary', 'Ministry of Skill Development', 'amit.singh@gov.in', 'officer');

-- Sample Recruiter Profiles
INSERT INTO recruiter_profiles (
    full_name, designation, employee_id, company_name, company_type, industry,
    company_size, website, email, phone, address_line1, city, state, pincode,
    internship_types, internship_alignment, preferred_skills, min_duration,
    max_duration, stipend_range, terms_accepted, data_consent, profile_step,
    profile_completed, approval_status
) VALUES
(
    'Rajesh Kumar', 'Senior HR Manager', 'TCS001', 'Tata Consultancy Services',
    'private', 'it', '1000+', 'https://www.tcs.com', 'hr@tcs.com',
    '+91 9876543210', 'TCS House, Raveline Street', 'Mumbai', 'Maharashtra', '400001',
    ARRAY['Technical', 'Research'], ARRAY['Web Development', 'Software Development', 'Testing'],
    'Java, Python, React, Node.js, Database Management', '3', '12', '25000-50000',
    TRUE, TRUE, 6, TRUE, 'approved'
),
(
    'Priya Sharma', 'Talent Acquisition Lead', 'INF002', 'Infosys Limited',
    'private', 'it', '1000+', 'https://www.infosys.com', 'careers@infosys.com',
    '+91 9876543211', 'Electronics City, Hosur Road', 'Bangalore', 'Karnataka', '560100',
    ARRAY['Technical', 'Design', 'Marketing'], ARRAY['Full Stack Development', 'UI/UX Design', 'Digital Marketing'],
    'Full Stack Development, UI/UX Design, Digital Marketing', '2', '6', '20000-40000',
    TRUE, TRUE, 6, TRUE, 'approved'
);

-- Sample Internship Postings
INSERT INTO internship_postings (
    recruiter_id, title, description, requirements, responsibilities,
    department, location, work_type, duration, stipend, max_applications,
    deadline, required_skills, preferred_qualifications, education_level,
    screening_questions, benefits, status
) VALUES
(
    (SELECT id FROM recruiter_profiles WHERE email = 'hr@tcs.com'),
    'Software Development Intern - TCS',
    'Join TCS as a Software Development Intern and work on cutting-edge projects with our experienced development teams.',
    'Strong programming skills in Java/Python, Understanding of software development lifecycle, Good problem-solving abilities',
    'Develop and test software applications, Participate in code reviews, Collaborate with senior developers, Document code and processes',
    'Software Development', 'Mumbai, Maharashtra', 'hybrid', '6 months', '₹35,000/month', 100,
    CURRENT_DATE + INTERVAL '30 days',
    ARRAY['Java', 'Python', 'SQL', 'Git'],
    'Experience with web frameworks, Knowledge of cloud platforms',
    'Bachelor''s in Computer Science/IT',
    '[{"question": "What programming languages are you proficient in?", "type": "text", "required": true}, {"question": "Do you have experience with version control systems?", "type": "yes_no", "required": true}]',
    ARRAY['Health Insurance', 'Learning Opportunities', 'Certificate of Completion'],
    'live'
),
(
    (SELECT id FROM recruiter_profiles WHERE email = 'careers@infosys.com'),
    'Full Stack Developer Intern - Infosys',
    'Work with Infosys development teams on full-stack web applications using modern technologies.',
    'Knowledge of React/Angular, Node.js experience, Database fundamentals, Version control (Git)',
    'Build responsive web applications, Develop REST APIs, Work with databases, Participate in agile development',
    'Digital Services', 'Bangalore, Karnataka', 'onsite', '4 months', '₹30,000/month', 75,
    CURRENT_DATE + INTERVAL '25 days',
    ARRAY['React', 'Node.js', 'MongoDB', 'JavaScript'],
    'Experience with cloud services, Knowledge of DevOps practices',
    'Bachelor''s in Computer Science/Engineering',
    '[{"question": "Have you built any full-stack applications?", "type": "yes_no", "required": true}, {"question": "Which frontend frameworks are you familiar with?", "type": "multiple_choice", "options": ["React", "Angular", "Vue.js", "Other"], "required": true}]',
    ARRAY['Flexible Working Hours', 'Mentorship Program', 'Project Completion Certificate'],
    'live'
);

-- =====================================================
-- ENABLE REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE recruiter_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE internship_postings;
ALTER PUBLICATION supabase_realtime ADD TABLE government_officials;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE internships;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE workflow_status;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'Database setup completed successfully!' as status;
SELECT 'Tables created: recruiter_profiles, internship_postings, government_officials, profiles, internships, applications, notifications, workflow_status' as tables;
SELECT 'Sample data inserted for testing' as sample_data;
SELECT 'You can now test the complete government internship portal system' as next_steps;