-- Government Internship Portal - Tables Only
-- Run this if you want to create tables without dropping existing ones
-- This is safer if you have data you want to keep

-- =====================================================
-- CREATE TABLES SECTION
-- =====================================================

-- 1. Recruiter Profiles Table (Enhanced)
CREATE TABLE IF NOT EXISTS recruiter_profiles (
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
CREATE TABLE IF NOT EXISTS internship_postings (
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

-- 4. Student Profiles Table
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

-- 5. Live Internships Table (for students)
CREATE TABLE IF NOT EXISTS internships (
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

-- 7. Notifications Table
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

-- 8. Workflow Status Tracking
CREATE TABLE IF NOT EXISTS workflow_status (
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
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'Tables created successfully!' as status;
SELECT 'Use supabase-complete-setup.sql for full setup with sample data' as note;