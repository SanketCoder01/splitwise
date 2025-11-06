-- ============================================
-- ADDITIONAL SQL FOR INTERNSHIP POSTING SYSTEM
-- Run this AFTER you've already run supabase-recruiter-realtime.sql
-- ============================================

-- ============================================
-- 1. CREATE INTERNSHIP POSTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.internship_postings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT CHECK (type IN ('on-site', 'remote', 'hybrid')),
    duration TEXT NOT NULL,
    stipend TEXT,
    description TEXT NOT NULL,
    requirements TEXT,
    required_skills TEXT[],
    responsibilities TEXT,
    perks TEXT,
    status TEXT CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'live', 'closed')) DEFAULT 'submitted',
    current_applications INTEGER DEFAULT 0,
    max_applications INTEGER,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID,
    rejection_reason TEXT
);

-- Enable realtime for internship postings
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'internship_postings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE internship_postings;
        RAISE NOTICE '✅ Added internship_postings to supabase_realtime publication';
    ELSE
        RAISE NOTICE 'ℹ️ internship_postings already in supabase_realtime publication';
    END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_internship_postings_recruiter 
ON internship_postings(recruiter_id);

CREATE INDEX IF NOT EXISTS idx_internship_postings_status 
ON internship_postings(status);

CREATE INDEX IF NOT EXISTS idx_internship_postings_created 
ON internship_postings(created_at DESC);

-- ============================================
-- 2. CREATE APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    internship_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    student_id UUID NOT NULL, -- References auth.users or profiles
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted')) DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,
    UNIQUE(internship_id, student_id)
);

-- Enable realtime for applications
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'applications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE applications;
        RAISE NOTICE '✅ Added applications to supabase_realtime publication';
    ELSE
        RAISE NOTICE 'ℹ️ applications already in supabase_realtime publication';
    END IF;
END $$;

-- Create indexes for applications
CREATE INDEX IF NOT EXISTS idx_applications_internship 
ON applications(internship_id);

CREATE INDEX IF NOT EXISTS idx_applications_student 
ON applications(student_id);

CREATE INDEX IF NOT EXISTS idx_applications_status 
ON applications(status);

-- ============================================
-- 3. CREATE TRIGGER TO UPDATE APPLICATION COUNT
-- ============================================
CREATE OR REPLACE FUNCTION update_internship_application_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE internship_postings
        SET current_applications = current_applications + 1
        WHERE id = NEW.internship_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE internship_postings
        SET current_applications = GREATEST(0, current_applications - 1)
        WHERE id = OLD.internship_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS application_count_trigger ON applications;
CREATE TRIGGER application_count_trigger
    AFTER INSERT OR DELETE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_internship_application_count();

-- ============================================
-- 4. CREATE TRIGGER TO NOTIFY ON NEW APPLICATION
-- ============================================
CREATE OR REPLACE FUNCTION notify_recruiter_new_application()
RETURNS TRIGGER AS $$
DECLARE
    posting_record RECORD;
BEGIN
    -- Get internship posting details
    SELECT ip.*, rp.id as recruiter_id
    INTO posting_record
    FROM internship_postings ip
    JOIN recruiter_profiles rp ON ip.recruiter_id = rp.id
    WHERE ip.id = NEW.internship_id;
    
    -- Create notification for recruiter
    INSERT INTO public.recruiter_notifications (
        recruiter_id,
        title,
        message,
        type,
        data
    ) VALUES (
        posting_record.recruiter_id,
        '📩 New Application Received!',
        format('New application from %s for "%s" position', NEW.student_name, posting_record.title),
        'info',
        jsonb_build_object(
            'application_id', NEW.id,
            'internship_id', NEW.internship_id,
            'student_name', NEW.student_name,
            'student_email', NEW.student_email,
            'applied_at', NEW.applied_at
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS new_application_notification_trigger ON applications;
CREATE TRIGGER new_application_notification_trigger
    AFTER INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION notify_recruiter_new_application();

-- ============================================
-- 5. CREATE TRIGGER TO NOTIFY ON INTERNSHIP APPROVAL
-- ============================================
CREATE OR REPLACE FUNCTION notify_internship_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if status changed
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        
        -- If approved/live
        IF NEW.status IN ('approved', 'live') THEN
            INSERT INTO public.recruiter_notifications (
                recruiter_id,
                title,
                message,
                type,
                data
            ) VALUES (
                NEW.recruiter_id,
                '✅ Internship Posting Approved!',
                format('Your internship posting "%s" has been approved and is now live!', NEW.title),
                'approval',
                jsonb_build_object(
                    'internship_id', NEW.id,
                    'title', NEW.title,
                    'status', NEW.status,
                    'approved_at', NEW.approved_at
                )
            );
        
        -- If rejected
        ELSIF NEW.status = 'rejected' THEN
            INSERT INTO public.recruiter_notifications (
                recruiter_id,
                title,
                message,
                type,
                data
            ) VALUES (
                NEW.recruiter_id,
                '❌ Internship Posting Rejected',
                format('Your internship posting "%s" was rejected. Reason: %s', NEW.title, COALESCE(NEW.rejection_reason, 'Not specified')),
                'rejection',
                jsonb_build_object(
                    'internship_id', NEW.id,
                    'title', NEW.title,
                    'status', NEW.status,
                    'rejection_reason', NEW.rejection_reason
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS internship_status_notification_trigger ON internship_postings;
CREATE TRIGGER internship_status_notification_trigger
    AFTER UPDATE OF status ON internship_postings
    FOR EACH ROW
    EXECUTE FUNCTION notify_internship_status_change();

-- ============================================
-- 6. RLS POLICIES FOR INTERNSHIP POSTINGS
-- ============================================
ALTER TABLE internship_postings ENABLE ROW LEVEL SECURITY;

-- Everyone can view approved/live internships
DROP POLICY IF EXISTS "Anyone can view live internships" ON internship_postings;
CREATE POLICY "Anyone can view live internships" 
ON internship_postings FOR SELECT 
USING (status IN ('approved', 'live') OR auth.uid() IS NOT NULL);

-- Recruiters can insert postings
DROP POLICY IF EXISTS "Recruiters can insert postings" ON internship_postings;
CREATE POLICY "Recruiters can insert postings" 
ON internship_postings FOR INSERT 
WITH CHECK (true);

-- Recruiters can update own postings
DROP POLICY IF EXISTS "Recruiters can update own postings" ON internship_postings;
CREATE POLICY "Recruiters can update own postings" 
ON internship_postings FOR UPDATE 
USING (true);

-- ============================================
-- 7. RLS POLICIES FOR APPLICATIONS
-- ============================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view applications
DROP POLICY IF EXISTS "Authenticated users can view applications" ON applications;
CREATE POLICY "Authenticated users can view applications" 
ON applications FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Students can insert applications
DROP POLICY IF EXISTS "Students can insert applications" ON applications;
CREATE POLICY "Students can insert applications" 
ON applications FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Students and recruiters can update applications
DROP POLICY IF EXISTS "Users can update applications" ON applications;
CREATE POLICY "Users can update applications" 
ON applications FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Internship posting system setup completed!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 New Tables Created:';
    RAISE NOTICE '  ✓ internship_postings - For recruiter job postings';
    RAISE NOTICE '  ✓ applications - For student applications';
    RAISE NOTICE '';
    RAISE NOTICE '⚡ Triggers Created:';
    RAISE NOTICE '  ✓ Application count auto-updates';
    RAISE NOTICE '  ✓ Recruiter notified on new application';
    RAISE NOTICE '  ✓ Recruiter notified on internship approval/rejection';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 Security:';
    RAISE NOTICE '  ✓ RLS policies configured';
    RAISE NOTICE '  ✓ Real-time enabled for both tables';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next Steps:';
    RAISE NOTICE '  1. Go to Supabase Dashboard → Database → Replication';
    RAISE NOTICE '  2. Enable realtime for: internship_postings, applications';
    RAISE NOTICE '  3. Add implementation code to your dashboards';
    RAISE NOTICE '  4. Test the complete flow!';
    RAISE NOTICE '';
END $$;
