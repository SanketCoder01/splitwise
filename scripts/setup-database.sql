-- Complete Database Setup for Government Internship Portal
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. DROP EXISTING TABLES (if they exist)
-- =====================================================

DROP TABLE IF EXISTS public.skill_assessments CASCADE;
DROP TABLE IF EXISTS public.grievances CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.education CASCADE;
DROP TABLE IF EXISTS public.experience CASCADE;
DROP TABLE IF EXISTS public.resumes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =====================================================
-- 2. CREATE PROFILES TABLE (Main User Data)
-- =====================================================

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    
    -- Basic Info (Step 1)
    full_name TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    father_name TEXT,
    
    -- Contact Info (Step 2)
    phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    
    -- Education Info (Step 3)
    education_level TEXT,
    institution_name TEXT,
    course_name TEXT,
    year_of_passing INTEGER,
    
    -- Bank Details (Step 4)
    bank_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    account_holder_name TEXT,
    
    -- Skills & Languages (Step 5)
    skills TEXT[],
    languages TEXT[],
    
    -- Profile Management
    profile_completed BOOLEAN DEFAULT FALSE,
    profile_step INTEGER DEFAULT 1,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'government')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE DOCUMENTS TABLE
-- =====================================================

CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('resume', 'certificate', 'id_proof', 'education', 'experience', 'marksheet', 'degree')),
    name TEXT NOT NULL,
    file_path TEXT,
    file_size INTEGER,
    file_type TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_by UUID REFERENCES auth.users,
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE GRIEVANCES TABLE
-- =====================================================

CREATE TABLE public.grievances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'other' CHECK (category IN ('technical', 'verification', 'application', 'profile', 'other')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES auth.users,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE EXPERIENCE TABLE
-- =====================================================

CREATE TABLE public.experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CREATE EDUCATION TABLE
-- =====================================================

CREATE TABLE public.education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT,
    grade TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. CREATE SKILLS TABLE
-- =====================================================

CREATE TABLE public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'technical' CHECK (category IN ('technical', 'soft')),
    proficiency TEXT DEFAULT 'intermediate' CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. CREATE RESUMES TABLE
-- =====================================================

CREATE TABLE public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    extracted_data JSONB,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    ai_score DECIMAL(5,2),
    fraud_flags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. CREATE SKILL ASSESSMENTS TABLE
-- =====================================================

CREATE TABLE public.skill_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_taken INTEGER, -- in seconds
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'not_started')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 11. CREATE RLS POLICIES
-- =====================================================

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Documents Policies
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

-- Grievances Policies
CREATE POLICY "Users can view own grievances" ON public.grievances
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own grievances" ON public.grievances
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own grievances" ON public.grievances
    FOR UPDATE USING (auth.uid() = user_id);

-- Experience Policies
CREATE POLICY "Users can manage own experience" ON public.experience
    FOR ALL USING (auth.uid() = user_id);

-- Education Policies
CREATE POLICY "Users can manage own education" ON public.education
    FOR ALL USING (auth.uid() = user_id);

-- Skills Policies
CREATE POLICY "Users can manage own skills" ON public.skills
    FOR ALL USING (auth.uid() = user_id);

-- Resumes Policies
CREATE POLICY "Users can manage own resumes" ON public.resumes
    FOR ALL USING (auth.uid() = user_id);

-- Skill Assessments Policies
CREATE POLICY "Users can manage own assessments" ON public.skill_assessments
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 12. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_profiles_user_id ON public.profiles(id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_profile_completed ON public.profiles(profile_completed);

CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_type ON public.documents(type);
CREATE INDEX idx_documents_verification_status ON public.documents(verification_status);

CREATE INDEX idx_grievances_user_id ON public.grievances(user_id);
CREATE INDEX idx_grievances_status ON public.grievances(status);
CREATE INDEX idx_grievances_priority ON public.grievances(priority);

-- =====================================================
-- 13. CREATE FUNCTIONS FOR AUTO-UPDATING
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grievances_updated_at BEFORE UPDATE ON public.grievances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 14. INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- This will be populated when users register
-- No need to insert sample data for production

-- =====================================================
-- 15. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Verify tables were created
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
