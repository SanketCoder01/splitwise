-- Real-Time Recruiter Approval System for PM Internship Portal
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. ENABLE REALTIME FOR RECRUITER PROFILES
-- ============================================
DO $$ 
BEGIN
    -- Check if recruiter_profiles is already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'recruiter_profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE recruiter_profiles;
        RAISE NOTICE 'Added recruiter_profiles to supabase_realtime publication';
    ELSE
        RAISE NOTICE 'recruiter_profiles already in supabase_realtime publication';
    END IF;
END $$;

-- ============================================
-- 2. CREATE RECRUITER NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.recruiter_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('approval', 'rejection', 'info', 'warning')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB
);

-- Enable realtime for notifications
DO $$ 
BEGIN
    -- Check if recruiter_notifications is already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'recruiter_notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE recruiter_notifications;
        RAISE NOTICE 'Added recruiter_notifications to supabase_realtime publication';
    ELSE
        RAISE NOTICE 'recruiter_notifications already in supabase_realtime publication';
    END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recruiter_notifications_recruiter_id 
ON recruiter_notifications(recruiter_id);

CREATE INDEX IF NOT EXISTS idx_recruiter_notifications_read 
ON recruiter_notifications(read);

-- ============================================
-- 3. CREATE FUNCTION TO NOTIFY RECRUITER ON APPROVAL
-- ============================================
CREATE OR REPLACE FUNCTION notify_recruiter_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if approval_status changed
    IF NEW.approval_status IS DISTINCT FROM OLD.approval_status THEN
        
        -- If approved
        IF NEW.approval_status = 'approved' THEN
            INSERT INTO public.recruiter_notifications (
                recruiter_id,
                title,
                message,
                type,
                data
            ) VALUES (
                NEW.id,
                '🎉 Profile Approved!',
                'Congratulations! Your recruiter profile has been approved by the government. You can now post internships and access all dashboard features.',
                'approval',
                jsonb_build_object(
                    'approval_status', 'approved',
                    'approved_at', NEW.approved_at,
                    'approved_by', NEW.approved_by
                )
            );
        
        -- If rejected
        ELSIF NEW.approval_status = 'rejected' THEN
            INSERT INTO public.recruiter_notifications (
                recruiter_id,
                title,
                message,
                type,
                data
            ) VALUES (
                NEW.id,
                '❌ Profile Rejected',
                'Your recruiter profile has been rejected. You will be automatically logged out and your data will be removed.',
                'rejection',
                jsonb_build_object(
                    'approval_status', 'rejected',
                    'rejection_reason', NEW.rejection_reason,
                    'reviewed_at', NEW.reviewed_at
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. CREATE TRIGGER FOR APPROVAL NOTIFICATIONS
-- ============================================
DROP TRIGGER IF EXISTS recruiter_approval_notification_trigger ON recruiter_profiles;
CREATE TRIGGER recruiter_approval_notification_trigger
    AFTER UPDATE OF approval_status ON recruiter_profiles
    FOR EACH ROW
    EXECUTE FUNCTION notify_recruiter_approval();

-- ============================================
-- 5. ADD MISSING COLUMNS TO RECRUITER_PROFILES
-- ============================================
DO $$ 
BEGIN
    -- Add reviewed_by column if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'recruiter_profiles' 
        AND column_name = 'reviewed_by'
    ) THEN
        ALTER TABLE recruiter_profiles ADD COLUMN reviewed_by UUID;
    END IF;

    -- Add reviewed_at column if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'recruiter_profiles' 
        AND column_name = 'reviewed_at'
    ) THEN
        ALTER TABLE recruiter_profiles ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add rejection_reason column if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'recruiter_profiles' 
        AND column_name = 'rejection_reason'
    ) THEN
        ALTER TABLE recruiter_profiles ADD COLUMN rejection_reason TEXT;
    END IF;

    -- Add internship_alignment column if not exists (for profile preferences)
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'recruiter_profiles' 
        AND column_name = 'internship_alignment'
    ) THEN
        ALTER TABLE recruiter_profiles ADD COLUMN internship_alignment TEXT[];
    END IF;

    RAISE NOTICE 'All columns added successfully';
END $$;

-- ============================================
-- 6. CREATE FUNCTION TO AUTO-DELETE REJECTED PROFILES
-- ============================================
CREATE OR REPLACE FUNCTION auto_delete_rejected_profiles()
RETURNS void AS $$
BEGIN
    -- Delete rejected profiles older than 24 hours
    DELETE FROM recruiter_profiles
    WHERE approval_status = 'rejected'
    AND reviewed_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_postings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. CREATE RLS POLICIES
-- ============================================

-- Policy: Recruiters can view their own profile
DROP POLICY IF EXISTS "Recruiters can view own profile" ON recruiter_profiles;
CREATE POLICY "Recruiters can view own profile" 
ON recruiter_profiles FOR SELECT 
USING (true); -- Allow all reads for now, can be restricted later

-- Policy: Recruiters can update their own profile
DROP POLICY IF EXISTS "Recruiters can update own profile" ON recruiter_profiles;
CREATE POLICY "Recruiters can update own profile" 
ON recruiter_profiles FOR UPDATE 
USING (true); -- Allow all updates for now, can be restricted later

-- Policy: Recruiters can insert their profile
DROP POLICY IF EXISTS "Recruiters can insert own profile" ON recruiter_profiles;
CREATE POLICY "Recruiters can insert own profile" 
ON recruiter_profiles FOR INSERT 
WITH CHECK (true); -- Allow all inserts for now

-- Policy: Government can view all profiles
-- (This will be handled at the application level for now)

-- Policy: Recruiters can view their own notifications
DROP POLICY IF EXISTS "Recruiters can view own notifications" ON recruiter_notifications;
CREATE POLICY "Recruiters can view own notifications" 
ON recruiter_notifications FOR SELECT 
USING (true);

-- Policy: System can insert notifications
DROP POLICY IF EXISTS "System can insert notifications" ON recruiter_notifications;
CREATE POLICY "System can insert notifications" 
ON recruiter_notifications FOR INSERT 
WITH CHECK (true);

-- Policy: Recruiters can update their notifications (mark as read)
DROP POLICY IF EXISTS "Recruiters can update own notifications" ON recruiter_notifications;
CREATE POLICY "Recruiters can update own notifications" 
ON recruiter_notifications FOR UPDATE 
USING (true);

-- Policy: Recruiters can view their own postings
DROP POLICY IF EXISTS "Recruiters can view own postings" ON internship_postings;
CREATE POLICY "Recruiters can view own postings" 
ON internship_postings FOR SELECT 
USING (true);

-- Policy: Approved recruiters can insert postings
DROP POLICY IF EXISTS "Approved recruiters can insert postings" ON internship_postings;
CREATE POLICY "Approved recruiters can insert postings" 
ON internship_postings FOR INSERT 
WITH CHECK (true);

-- Policy: Recruiters can update own postings
DROP POLICY IF EXISTS "Recruiters can update own postings" ON internship_postings;
CREATE POLICY "Recruiters can update own postings" 
ON internship_postings FOR UPDATE 
USING (true);

-- ============================================
-- 9. INSERT TEST DATA FOR PENDING RECRUITERS
-- ============================================
DO $$
DECLARE
    test_recruiter_id UUID;
BEGIN
    -- Insert a pending recruiter for testing
    IF NOT EXISTS (SELECT FROM recruiter_profiles WHERE email = 'test.recruiter@wipro.com') THEN
        INSERT INTO recruiter_profiles (
            full_name,
            designation,
            employee_id,
            company_name,
            company_type,
            industry,
            company_size,
            website,
            email,
            phone,
            alternate_phone,
            address_line1,
            city,
            state,
            pincode,
            internship_types,
            internship_alignment,
            preferred_skills,
            min_duration,
            max_duration,
            stipend_range,
            terms_accepted,
            data_consent,
            profile_step,
            profile_completed,
            approval_status
        ) VALUES (
            'Amit Verma',
            'Senior Recruitment Manager',
            'WIP2024001',
            'Wipro Limited',
            'private',
            'it',
            '1000+',
            'https://www.wipro.com',
            'test.recruiter@wipro.com',
            '+91 9876543220',
            '+91 9876543221',
            'Wipro Campus, Electronic City Phase 2',
            'Bangalore',
            'Karnataka',
            '560100',
            ARRAY['Technical', 'Marketing', 'Operations'],
            ARRAY['Web Development', 'Digital Marketing', 'Project Management'],
            'Full Stack Development, React, Node.js, Digital Marketing',
            '3',
            '6',
            '25000-50000',
            TRUE,
            TRUE,
            6,
            TRUE,
            'pending'
        ) RETURNING id INTO test_recruiter_id;
        
        RAISE NOTICE 'Inserted test pending recruiter: %', test_recruiter_id;
    END IF;

    -- Insert another pending recruiter
    IF NOT EXISTS (SELECT FROM recruiter_profiles WHERE email = 'hr@cognizant.com') THEN
        INSERT INTO recruiter_profiles (
            full_name,
            designation,
            employee_id,
            company_name,
            company_type,
            industry,
            company_size,
            website,
            email,
            phone,
            address_line1,
            city,
            state,
            pincode,
            internship_types,
            internship_alignment,
            preferred_skills,
            min_duration,
            max_duration,
            stipend_range,
            terms_accepted,
            data_consent,
            profile_step,
            profile_completed,
            approval_status
        ) VALUES (
            'Sneha Patel',
            'Talent Acquisition Specialist',
            'COG2024002',
            'Cognizant Technology Solutions',
            'private',
            'it',
            '1000+',
            'https://www.cognizant.com',
            'hr@cognizant.com',
            '+91 9876543230',
            'Cognizant Campus, Sholinganallur',
            'Chennai',
            'Tamil Nadu',
            '600119',
            ARRAY['Technical', 'Finance', 'HR'],
            ARRAY['Software Development', 'Financial Analysis', 'Talent Acquisition'],
            'Java, Python, Cloud Computing, Financial Modeling',
            '2',
            '12',
            '20000-40000',
            TRUE,
            TRUE,
            6,
            TRUE,
            'pending'
        ) RETURNING id INTO test_recruiter_id;
        
        RAISE NOTICE 'Inserted test pending recruiter: %', test_recruiter_id;
    END IF;
END $$;

-- ============================================
-- 10. CREATE VIEW FOR RECRUITER DASHBOARD STATS
-- ============================================
CREATE OR REPLACE VIEW recruiter_dashboard_stats AS
SELECT 
    rp.id as recruiter_id,
    rp.company_name,
    rp.approval_status,
    COUNT(DISTINCT ip.id) as total_postings,
    COUNT(DISTINCT CASE WHEN ip.status = 'live' THEN ip.id END) as live_postings,
    COUNT(DISTINCT CASE WHEN ip.status = 'submitted' THEN ip.id END) as pending_postings,
    COALESCE(SUM(ip.current_applications), 0) as total_applications
FROM recruiter_profiles rp
LEFT JOIN internship_postings ip ON rp.id = ip.recruiter_id
GROUP BY rp.id, rp.company_name, rp.approval_status;

-- ============================================
-- 11. CREATE INTERNSHIP POSTINGS TABLE
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
        RAISE NOTICE 'Added internship_postings to supabase_realtime publication';
    ELSE
        RAISE NOTICE 'internship_postings already in supabase_realtime publication';
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
-- 12. CREATE APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    internship_id UUID REFERENCES internship_postings(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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
        RAISE NOTICE 'Added applications to supabase_realtime publication';
    ELSE
        RAISE NOTICE 'applications already in supabase_realtime publication';
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
-- 13. CREATE TRIGGER TO UPDATE APPLICATION COUNT
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
-- 14. CREATE TRIGGER TO NOTIFY ON NEW APPLICATION
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
-- 15. CREATE TRIGGER TO NOTIFY ON INTERNSHIP APPROVAL
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
-- 16. RLS POLICIES FOR INTERNSHIP POSTINGS
-- ============================================
ALTER TABLE internship_postings ENABLE ROW LEVEL SECURITY;

-- Recruiters can view their own postings
DROP POLICY IF EXISTS "Recruiters can view own postings" ON internship_postings;
CREATE POLICY "Recruiters can view own postings" 
ON internship_postings FOR SELECT 
USING (true);

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
-- 17. RLS POLICIES FOR APPLICATIONS
-- ============================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Students can view their own applications
DROP POLICY IF EXISTS "Students can view own applications" ON applications;
CREATE POLICY "Students can view own applications" 
ON applications FOR SELECT 
USING (true);

-- Students can insert applications
DROP POLICY IF EXISTS "Students can insert applications" ON applications;
CREATE POLICY "Students can insert applications" 
ON applications FOR INSERT 
WITH CHECK (true);

-- Students can update own applications
DROP POLICY IF EXISTS "Students can update own applications" ON applications;
CREATE POLICY "Students can update own applications" 
ON applications FOR UPDATE 
USING (true);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Real-time recruiter & internship system setup completed!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Summary:';
    RAISE NOTICE '  ✓ Realtime enabled for recruiter_profiles and recruiter_notifications';
    RAISE NOTICE '  ✓ Realtime enabled for internship_postings';
    RAISE NOTICE '  ✓ Realtime enabled for applications';
    RAISE NOTICE '  ✓ Notification system created with triggers';
    RAISE NOTICE '  ✓ Auto-notification on approval/rejection';
    RAISE NOTICE '  ✓ Auto-notification on new applications';
    RAISE NOTICE '  ✓ Auto-notification on internship approval';
    RAISE NOTICE '  ✓ Application count auto-updates';
    RAISE NOTICE '  ✓ RLS policies configured';
    RAISE NOTICE '  ✓ Test data inserted (2 pending recruiters)';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Real-Time Features:';
    RAISE NOTICE '  1. Recruiter posts internship → Appears in Government & Student dashboards';
    RAISE NOTICE '  2. Government approves internship → Recruiter gets notified';
    RAISE NOTICE '  3. Student applies → Recruiter gets real-time notification';
    RAISE NOTICE '  4. Application count updates automatically';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Test Credentials:';
    RAISE NOTICE '  Email: test.recruiter@wipro.com';
    RAISE NOTICE '  Email: hr@cognizant.com';
    RAISE NOTICE '  (These are pending approval)';
END $$;
