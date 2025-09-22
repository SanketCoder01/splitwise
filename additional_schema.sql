-- =====================================================
-- ADDITIONAL SCHEMA FOR PM INTERNSHIP PORTAL
-- Run this after your existing schema
-- =====================================================

-- Add missing columns to profiles table for 6-step profile completion
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_step INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;

-- Step 1: Personal Details
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mother_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('general', 'obc', 'sc', 'st', 'ews'));

-- Step 2: Contact Details (phone already exists)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS alternate_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS district TEXT;

-- Step 3: Education Details
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education_level TEXT CHECK (education_level IN ('10th', '12th', 'diploma', 'bachelors', 'masters', 'phd'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS institution_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year_of_passing INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS percentage DECIMAL(5,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cgpa DECIMAL(4,2);

-- Step 4: Bank Details
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ifsc_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_holder_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branch_name TEXT;

-- Step 5: Skills & Languages (will use existing skills table + new languages)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio TEXT;

-- Document Verification Status
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS aadhaar_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS digilocker_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS aadhaar_number TEXT;

-- Step completion timestamps
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step1_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step2_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step3_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step4_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step5_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step6_completed_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- DOCUMENT VERIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS document_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Aadhaar e-KYC
  aadhaar_number TEXT,
  aadhaar_name TEXT,
  aadhaar_dob DATE,
  aadhaar_gender TEXT,
  aadhaar_address TEXT,
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  aadhaar_verification_date TIMESTAMP WITH TIME ZONE,
  
  -- DigiLocker
  digilocker_connected BOOLEAN DEFAULT FALSE,
  digilocker_documents JSONB DEFAULT '[]'::jsonb,
  digilocker_verified BOOLEAN DEFAULT FALSE,
  digilocker_verification_date TIMESTAMP WITH TIME ZONE,
  
  -- Verification Status
  overall_verification_status TEXT DEFAULT 'pending' CHECK (overall_verification_status IN ('pending', 'in_progress', 'verified', 'rejected')),
  verification_notes TEXT,
  verified_by UUID REFERENCES profiles(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for document_verifications
ALTER TABLE document_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_verifications
CREATE POLICY "Users can view own verifications" ON document_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own verifications" ON document_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own verifications" ON document_verifications FOR UPDATE USING (auth.uid() = user_id);

-- Add trigger for document_verifications
CREATE TRIGGER update_document_verifications_updated_at 
  BEFORE UPDATE ON document_verifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Notification Preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  
  -- Privacy Settings
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'recruiters_only')),
  data_sharing BOOLEAN DEFAULT TRUE,
  
  -- Language and Theme
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi')),
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_settings
CREATE POLICY "Users can view own settings" ON system_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON system_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON system_settings FOR UPDATE USING (auth.uid() = user_id);

-- Add trigger for system_settings
CREATE TRIGGER update_system_settings_updated_at 
  BEFORE UPDATE ON system_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS FOR PROFILE COMPLETION
-- =====================================================

-- Function to calculate profile completion percentage
CREATE OR REPLACE FUNCTION calculate_profile_completion(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    completion_count INTEGER := 0;
    total_steps INTEGER := 5; -- Steps 1-5 (step 6 is completion)
BEGIN
    SELECT 
        CASE WHEN full_name IS NOT NULL AND date_of_birth IS NOT NULL AND gender IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN phone IS NOT NULL AND address_line1 IS NOT NULL AND city IS NOT NULL AND state IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN education_level IS NOT NULL AND institution_name IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN bank_name IS NOT NULL AND account_number IS NOT NULL AND ifsc_code IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN languages IS NOT NULL AND jsonb_array_length(languages) > 0 THEN 1 ELSE 0 END
    INTO completion_count
    FROM profiles
    WHERE id = user_uuid;
    
    RETURN (completion_count * 100 / total_steps);
END;
$$ LANGUAGE plpgsql;

-- Update the handle_new_user function to include profile_step
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, profile_step, profile_completed, profile_completion_percentage)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    1,
    FALSE,
    0
  );
  
  -- Also create system settings for the user
  INSERT INTO public.system_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_profile_step ON profiles(profile_step);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_completed ON profiles(profile_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_aadhaar_verified ON profiles(aadhaar_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_digilocker_verified ON profiles(digilocker_verified);
CREATE INDEX IF NOT EXISTS idx_document_verifications_user_id ON document_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_user_id ON system_settings(user_id);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert some sample internships for testing
INSERT INTO internships (title, company, description, requirements, location, duration, stipend, application_deadline, start_date, status) VALUES
('Software Development Intern', 'Tech Corp India', 'Work on cutting-edge web applications using React and Node.js', 'JavaScript, React, Node.js knowledge required', 'Bangalore', '6 months', 25000, '2024-03-15', '2024-04-01', 'active'),
('Data Science Intern', 'Analytics Pro', 'Analyze large datasets and build ML models for business insights', 'Python, Machine Learning, SQL experience preferred', 'Mumbai', '4 months', 20000, '2024-03-20', '2024-04-15', 'active'),
('UI/UX Design Intern', 'Creative Solutions', 'Design user interfaces for mobile and web applications', 'Figma, Adobe XD, Design thinking skills', 'Delhi', '3 months', 15000, '2024-03-25', '2024-04-10', 'active')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VIEWS FOR EASY DATA ACCESS
-- =====================================================

-- View for complete user profile with verification status
CREATE OR REPLACE VIEW user_profile_complete AS
SELECT 
    p.*,
    dv.aadhaar_verified as doc_aadhaar_verified,
    dv.digilocker_verified as doc_digilocker_verified,
    dv.overall_verification_status,
    calculate_profile_completion(p.id) as calculated_completion_percentage
FROM profiles p
LEFT JOIN document_verifications dv ON p.id = dv.user_id;

-- View for application statistics
CREATE OR REPLACE VIEW application_stats AS
SELECT 
    user_id,
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'submitted' THEN 1 END) as pending_applications,
    COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_applications,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications
FROM applications
GROUP BY user_id;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Additional schema for PM Internship Portal completed!
-- Your existing schema has been extended with:
-- ✅ Multi-step profile fields (6 steps)
-- ✅ Document verification table
-- ✅ Profile completion tracking
-- ✅ System settings
-- ✅ Performance indexes
-- ✅ Helper functions and views
