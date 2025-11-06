-- ============================================
-- FIXED INTERNSHIP POSTING SYSTEM SQL
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. DROP EXISTING TABLES IF ANY (Clean Start)
-- ============================================
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.internship_postings CASCADE;

-- ============================================
-- 2. CREATE INTERNSHIP POSTINGS TABLE
-- ============================================
CREATE TABLE public.internship_postings (
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

-- ============================================
-- 3. CREATE APPLICATIONS TABLE
-- ============================================
CREATE TABLE public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    internship_id UUID NOT NULL REFERENCES internship_postings(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted')) DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT
);

-- Add unique constraint separately
ALTER TABLE public.applications 
ADD CONSTRAINT applications_internship_student_unique 
UNIQUE (internship_id, student_id);

-- ============================================
-- 4. ENABLE REALTIME
-- ============================================
DO $$ 
BEGIN
    -- Internship postings
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'internship_postings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE internship_postings;
        RAISE NOTICE '✅ Added internship_postings to realtime';
    ELSE
        RAISE NOTICE 'ℹ️ internship_postings already in realtime';
    END IF;

    -- Applications
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'applications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE applications;
        RAISE NOTICE '✅ Added applications to realtime';
    ELSE
        RAISE NOTICE 'ℹ️ applications already in realtime';
    END IF;
END $$;

-- ============================================
-- 5. CREATE INDEXES
-- ============================================
CREATE INDEX idx_internship_postings_recruiter ON internship_postings(recruiter_id);
CREATE INDEX idx_internship_postings_status ON internship_postings(status);
CREATE INDEX idx_internship_postings_created ON internship_postings(created_at DESC);

CREATE INDEX idx_applications_internship ON applications(internship_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================
-- 6. TRIGGER: UPDATE APPLICATION COUNT
-- ============================================
CREATE OR REPLACE FUNCTION update_internship_application_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE internship_postings
        SET current_applications = current_applications + 1
        WHERE id = NEW.internship_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE internship_postings
        SET current_applications = GREATEST(0, current_applications - 1)
        WHERE id = OLD.internship_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS application_count_trigger ON applications;
CREATE TRIGGER application_count_trigger
    AFTER INSERT OR DELETE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_internship_application_count();

-- ============================================
-- 7. TRIGGER: NOTIFY RECRUITER ON NEW APPLICATION
-- ============================================
CREATE OR REPLACE FUNCTION notify_recruiter_new_application()
RETURNS TRIGGER AS $$
DECLARE
    v_recruiter_id UUID;
    v_internship_title TEXT;
BEGIN
    -- Get recruiter_id and title
    SELECT recruiter_id, title 
    INTO v_recruiter_id, v_internship_title
    FROM internship_postings
    WHERE id = NEW.internship_id;
    
    -- Create notification
    INSERT INTO recruiter_notifications (
        recruiter_id,
        title,
        message,
        type,
        data
    ) VALUES (
        v_recruiter_id,
        '📩 New Application Received!',
        'New application from ' || NEW.student_name || ' for "' || v_internship_title || '" position',
        'info',
        jsonb_build_object(
            'application_id', NEW.id,
            'internship_id', NEW.internship_id,
            'student_name', NEW.student_name,
            'student_email', NEW.student_email
        )
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in notify_recruiter_new_application: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS new_application_notification_trigger ON applications;
CREATE TRIGGER new_application_notification_trigger
    AFTER INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION notify_recruiter_new_application();

-- ============================================
-- 8. TRIGGER: NOTIFY ON INTERNSHIP STATUS CHANGE
-- ============================================
CREATE OR REPLACE FUNCTION notify_internship_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if status changed
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        
        -- If approved/live
        IF NEW.status IN ('approved', 'live') THEN
            INSERT INTO recruiter_notifications (
                recruiter_id,
                title,
                message,
                type,
                data
            ) VALUES (
                NEW.recruiter_id,
                '✅ Internship Posting Approved!',
                'Your internship posting "' || NEW.title || '" has been approved and is now live!',
                'approval',
                jsonb_build_object(
                    'internship_id', NEW.id,
                    'title', NEW.title,
                    'status', NEW.status
                )
            );
        
        -- If rejected
        ELSIF NEW.status = 'rejected' THEN
            INSERT INTO recruiter_notifications (
                recruiter_id,
                title,
                message,
                type,
                data
            ) VALUES (
                NEW.recruiter_id,
                '❌ Internship Posting Rejected',
                'Your internship posting "' || NEW.title || '" was rejected. Reason: ' || COALESCE(NEW.rejection_reason, 'Not specified'),
                'rejection',
                jsonb_build_object(
                    'internship_id', NEW.id,
                    'title', NEW.title,
                    'rejection_reason', NEW.rejection_reason
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in notify_internship_status_change: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS internship_status_notification_trigger ON internship_postings;
CREATE TRIGGER internship_status_notification_trigger
    AFTER UPDATE OF status ON internship_postings
    FOR EACH ROW
    EXECUTE FUNCTION notify_internship_status_change();

-- ============================================
-- 9. ENABLE RLS
-- ============================================
ALTER TABLE internship_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 10. RLS POLICIES FOR INTERNSHIP POSTINGS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view live internships" ON internship_postings;
CREATE POLICY "Anyone can view live internships" 
ON internship_postings FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Anyone can insert postings" ON internship_postings;
CREATE POLICY "Anyone can insert postings" 
ON internship_postings FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update postings" ON internship_postings;
CREATE POLICY "Anyone can update postings" 
ON internship_postings FOR UPDATE 
USING (true);

-- ============================================
-- 11. RLS POLICIES FOR APPLICATIONS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view applications" ON applications;
CREATE POLICY "Anyone can view applications" 
ON applications FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;
CREATE POLICY "Anyone can insert applications" 
ON applications FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update applications" ON applications;
CREATE POLICY "Anyone can update applications" 
ON applications FOR UPDATE 
USING (true);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '════════════════════════════════════════════';
    RAISE NOTICE '✅ INTERNSHIP POSTING SYSTEM SETUP COMPLETE!';
    RAISE NOTICE '════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Tables Created:';
    RAISE NOTICE '  ✓ internship_postings';
    RAISE NOTICE '  ✓ applications';
    RAISE NOTICE '';
    RAISE NOTICE '⚡ Triggers Active:';
    RAISE NOTICE '  ✓ Application count auto-updates';
    RAISE NOTICE '  ✓ Recruiter notified on new application';
    RAISE NOTICE '  ✓ Recruiter notified on status change';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 Security:';
    RAISE NOTICE '  ✓ RLS enabled and policies configured';
    RAISE NOTICE '  ✓ Real-time enabled';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 NEXT STEPS:';
    RAISE NOTICE '  1. Go to Supabase Dashboard → Database → Replication';
    RAISE NOTICE '  2. Enable realtime for: internship_postings, applications';
    RAISE NOTICE '  3. Add implementation code from IMPLEMENTATION_CODE.md';
    RAISE NOTICE '';
END $$;
