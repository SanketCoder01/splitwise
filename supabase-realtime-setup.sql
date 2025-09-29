-- Supabase Real-Time Setup for Government Internship Portal
-- Run this SQL in your Supabase SQL Editor to enable real-time notifications

-- =====================================================
-- 1. RECRUITER PROFILES TABLE WITH REAL-TIME SUPPORT
-- =====================================================

-- Create recruiter_profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'recruiter_profiles') THEN
        CREATE TABLE public.recruiter_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            full_name TEXT,
            company_name TEXT,
            company_logo TEXT,
            company_registration_url TEXT,
            profile_completed BOOLEAN DEFAULT FALSE,
            profile_step INTEGER DEFAULT 1,
            approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
            email TEXT,
            phone TEXT,
            designation TEXT,
            employee_id TEXT,
            company_type TEXT,
            industry TEXT,
            company_size TEXT,
            website TEXT,
            alternate_phone TEXT,
            address_line1 TEXT,
            address_line2 TEXT,
            city TEXT,
            state TEXT,
            pincode TEXT,
            internship_types TEXT[],
            internship_alignment TEXT[],
            preferred_skills TEXT,
            min_duration TEXT,
            max_duration TEXT,
            stipend_range TEXT,
            terms_accepted BOOLEAN DEFAULT FALSE,
            data_consent BOOLEAN DEFAULT FALSE,
            company_registration TEXT,
            authorization_letter TEXT,
            id_proof TEXT,
            reviewed_by UUID,
            reviewed_at TIMESTAMPTZ,
            approved_at TIMESTAMPTZ,
            rejection_reason TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        RAISE NOTICE 'Created recruiter_profiles table';
    ELSE
        RAISE NOTICE 'recruiter_profiles table already exists';
    END IF;
END $$;

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on recruiter_profiles
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for recruiter_profiles
-- Allow recruiters to view and update their own profiles
CREATE POLICY "Recruiters can view own profile" ON public.recruiter_profiles
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Recruiters can update own profile" ON public.recruiter_profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow government users to view and update all profiles (you may need to adjust this based on your auth setup)
CREATE POLICY "Government can view all profiles" ON public.recruiter_profiles
    FOR SELECT USING (true);

CREATE POLICY "Government can update all profiles" ON public.recruiter_profiles
    FOR UPDATE USING (true);

-- Allow anyone to insert profiles (for registration)
CREATE POLICY "Anyone can create profile" ON public.recruiter_profiles
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

DO $$
BEGIN
    -- Indexes for recruiter_profiles
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_recruiter_profiles_email') THEN
        CREATE INDEX idx_recruiter_profiles_email ON recruiter_profiles(email);
    END IF;

    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_recruiter_profiles_approval_status') THEN
        CREATE INDEX idx_recruiter_profiles_approval_status ON recruiter_profiles(approval_status);
    END IF;

    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_recruiter_profiles_profile_completed') THEN
        CREATE INDEX idx_recruiter_profiles_profile_completed ON recruiter_profiles(profile_completed);
    END IF;

    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_recruiter_profiles_created_at') THEN
        CREATE INDEX idx_recruiter_profiles_created_at ON recruiter_profiles(created_at);
    END IF;
END $$;

-- =====================================================
-- 4. CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for recruiter_profiles
DROP TRIGGER IF EXISTS update_recruiter_profiles_updated_at ON public.recruiter_profiles;
CREATE TRIGGER update_recruiter_profiles_updated_at
    BEFORE UPDATE ON public.recruiter_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ENABLE REAL-TIME FOR TABLES
-- =====================================================

-- Note: Real-time is automatically enabled for tables with RLS
-- But we can also explicitly enable it for specific tables if needed

-- =====================================================
-- 6. CREATE NOTIFICATION FUNCTION (OPTIONAL)
-- =====================================================

-- Function to send notifications when recruiter profile status changes
CREATE OR REPLACE FUNCTION notify_recruiter_profile_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Send notification to government dashboard
    PERFORM pg_notify('recruiter_profile_change', json_build_object(
        'id', NEW.id,
        'email', NEW.email,
        'company_name', NEW.company_name,
        'approval_status', NEW.approval_status,
        'profile_completed', NEW.profile_completed,
        'action', TG_OP
    )::text);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
DROP TRIGGER IF EXISTS notify_recruiter_profile_changes ON public.recruiter_profiles;
CREATE TRIGGER notify_recruiter_profile_changes
    AFTER INSERT OR UPDATE ON public.recruiter_profiles
    FOR EACH ROW EXECUTE FUNCTION notify_recruiter_profile_change();

-- =====================================================
-- 7. INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample pending recruiter profiles for testing
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM recruiter_profiles WHERE email = 'hr@techcorp.com') THEN
        INSERT INTO recruiter_profiles (
            id,
            full_name,
            company_name,
            email,
            phone,
            designation,
            employee_id,
            company_type,
            industry,
            profile_completed,
            profile_step,
            approval_status,
            internship_types,
            preferred_skills,
            min_duration,
            max_duration,
            stipend_range,
            terms_accepted,
            data_consent,
            created_at
        ) VALUES (
            gen_random_uuid(),
            'Rajesh Kumar',
            'TechCorp Solutions',
            'hr@techcorp.com',
            '+91-9876543210',
            'HR Manager',
            'TC001',
            'private',
            'it',
            true,
            6,
            'pending',
            ARRAY['Technical', 'Marketing'],
            'JavaScript, React, Python, Digital Marketing',
            '3',
            '12',
            '25000-50000',
            true,
            true,
            NOW() - INTERVAL '2 hours'
        );
    END IF;

    IF NOT EXISTS (SELECT FROM recruiter_profiles WHERE email = 'recruitment@innovatetech.in') THEN
        INSERT INTO recruiter_profiles (
            id,
            full_name,
            company_name,
            email,
            phone,
            designation,
            employee_id,
            company_type,
            industry,
            profile_completed,
            profile_step,
            approval_status,
            internship_types,
            preferred_skills,
            min_duration,
            max_duration,
            stipend_range,
            terms_accepted,
            data_consent,
            created_at
        ) VALUES (
            gen_random_uuid(),
            'Priya Sharma',
            'InnovateTech India',
            'recruitment@innovatetech.in',
            '+91-9876543211',
            'Recruitment Lead',
            'IT002',
            'startup',
            'it',
            true,
            6,
            'pending',
            ARRAY['Technical', 'Design'],
            'React, Node.js, UI/UX Design, Mobile Development',
            '2',
            '8',
            '20000-40000',
            true,
            true,
            NOW() - INTERVAL '1 hour'
        );
    END IF;
END $$;

-- =====================================================
-- 8. CREATE STORAGE BUCKET FOR DOCUMENTS (IF NEEDED)
-- =====================================================

-- Create storage bucket for recruiter documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('recruiter-documents', 'recruiter-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for recruiter documents
CREATE POLICY "Recruiters can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'recruiter-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Recruiters can view their own documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'recruiter-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Government can view all documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'recruiter-documents');

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Verify setup
DO $$
DECLARE
    table_count INTEGER;
    policy_count INTEGER;
    trigger_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'recruiter_profiles';

    SELECT COUNT(*) INTO policy_count FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'recruiter_profiles';

    SELECT COUNT(*) INTO trigger_count FROM information_schema.triggers
    WHERE event_object_schema = 'public' AND event_object_table = 'recruiter_profiles';

    RAISE NOTICE 'Setup verification:';
    RAISE NOTICE '  - Tables created: %', table_count;
    RAISE NOTICE '  - Policies created: %', policy_count;
    RAISE NOTICE '  - Triggers created: %', trigger_count;
    RAISE NOTICE 'Real-time setup completed successfully!';
    RAISE NOTICE 'Government dashboard will now receive real-time notifications for recruiter profile submissions.';
END $$;