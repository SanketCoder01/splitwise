-- ============================================
-- RECRUITER PROFILES TABLE - COMPLETE SCHEMA
-- ============================================

-- Drop existing table if you want fresh start (CAREFUL!)
-- DROP TABLE IF EXISTS recruiter_profiles CASCADE;

-- Create recruiter_profiles table with ALL required columns
CREATE TABLE IF NOT EXISTS recruiter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Authentication
  email TEXT UNIQUE NOT NULL,
  
  -- Personal Details (Step 1)
  full_name TEXT,
  designation TEXT,
  employee_id TEXT,
  
  -- Company Details (Step 2)
  company_name TEXT,
  company_type TEXT,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  
  -- Contact Information (Step 3)
  phone TEXT,
  alternate_phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  
  -- Documents (Step 4)
  company_registration_url TEXT,
  authorization_letter_url TEXT,
  id_proof_url TEXT,
  company_logo TEXT,
  
  -- Internship Preferences (Step 5)
  internship_types TEXT[],
  internship_alignment TEXT[],
  preferred_skills TEXT,
  min_duration TEXT,
  max_duration TEXT,
  stipend_range TEXT,
  
  -- Agreement (Step 6)
  terms_accepted BOOLEAN DEFAULT false,
  data_consent BOOLEAN DEFAULT false,
  
  -- Profile Status
  profile_completed BOOLEAN DEFAULT false,
  profile_step INTEGER DEFAULT 1,
  approval_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for better performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_email ON recruiter_profiles(email);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_approval_status ON recruiter_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_profile_completed ON recruiter_profiles(profile_completed);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Allow anyone to INSERT (for registration)
CREATE POLICY "Allow public insert" ON recruiter_profiles
  FOR INSERT
  WITH CHECK (true);

-- POLICY 2: Allow users to UPDATE their own profile
CREATE POLICY "Allow users to update own profile" ON recruiter_profiles
  FOR UPDATE
  USING (true) -- For now, allow all updates
  WITH CHECK (true);

-- POLICY 3: Allow users to SELECT their own profile
CREATE POLICY "Allow users to select own profile" ON recruiter_profiles
  FOR SELECT
  USING (true); -- For now, allow all reads

-- POLICY 4: Allow users to DELETE their own profile (optional)
CREATE POLICY "Allow users to delete own profile" ON recruiter_profiles
  FOR DELETE
  USING (true);

-- ============================================
-- RECRUITER NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS recruiter_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'approval', 'rejection', 'application'
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_recruiter_notifications_recruiter_id ON recruiter_notifications(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_notifications_read ON recruiter_notifications(read);

-- Enable RLS for notifications
ALTER TABLE recruiter_notifications ENABLE ROW LEVEL SECURITY;

-- Allow all operations on notifications (you can restrict later)
CREATE POLICY "Allow all operations on notifications" ON recruiter_notifications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- REAL-TIME PUBLICATION
-- ============================================

-- Enable real-time for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE recruiter_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE recruiter_notifications;

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recruiter_profiles_updated_at
  BEFORE UPDATE ON recruiter_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Send notification on approval/rejection
-- ============================================

CREATE OR REPLACE FUNCTION notify_recruiter_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification if approval_status changed
  IF NEW.approval_status != OLD.approval_status THEN
    IF NEW.approval_status = 'approved' THEN
      INSERT INTO recruiter_notifications (recruiter_id, title, message, type)
      VALUES (
        NEW.id,
        'Profile Approved! 🎉',
        'Congratulations! Your recruiter profile has been approved. You can now post internships and access all features.',
        'approval'
      );
    ELSIF NEW.approval_status = 'rejected' THEN
      INSERT INTO recruiter_notifications (recruiter_id, title, message, type)
      VALUES (
        NEW.id,
        'Profile Rejected',
        'Unfortunately, your recruiter profile has been rejected. Please contact support for more information.',
        'rejection'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_recruiter_on_status_change
  AFTER UPDATE ON recruiter_profiles
  FOR EACH ROW
  WHEN (OLD.approval_status IS DISTINCT FROM NEW.approval_status)
  EXECUTE FUNCTION notify_recruiter_on_status_change();

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Check if everything is set up correctly
DO $$
BEGIN
  RAISE NOTICE '✅ recruiter_profiles table created successfully!';
  RAISE NOTICE '✅ recruiter_notifications table created successfully!';
  RAISE NOTICE '✅ Indexes created for better performance';
  RAISE NOTICE '✅ RLS policies enabled (currently permissive for testing)';
  RAISE NOTICE '✅ Real-time publication enabled';
  RAISE NOTICE '✅ Triggers created for auto-updates and notifications';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 You can now test the recruiter profile completion flow!';
END $$;

-- ============================================
-- TEST: Insert sample data (optional)
-- ============================================

-- Uncomment below to insert test data
/*
INSERT INTO recruiter_profiles (
  email, 
  full_name, 
  company_name, 
  profile_completed, 
  approval_status
) VALUES 
  ('test@company.com', 'Test Recruiter', 'Test Company Ltd', true, 'pending')
ON CONFLICT (email) DO NOTHING;
*/

-- ============================================
-- CLEANUP: Remove old policies if needed
-- ============================================

-- Run this ONLY if you have old conflicting policies
/*
DROP POLICY IF EXISTS "Allow public insert" ON recruiter_profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON recruiter_profiles;
DROP POLICY IF EXISTS "Allow users to select own profile" ON recruiter_profiles;
DROP POLICY IF EXISTS "Allow users to delete own profile" ON recruiter_profiles;
DROP POLICY IF EXISTS "Allow all operations on notifications" ON recruiter_notifications;
*/
