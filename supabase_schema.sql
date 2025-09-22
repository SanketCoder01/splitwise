-- =====================================================
-- PM INTERNSHIP PORTAL - COMPLETE SUPABASE SCHEMA
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER PROFILES TABLE (Main profile information)
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  
  -- Profile Completion Tracking
  profile_step INTEGER DEFAULT 1, -- Current step (1-6)
  profile_completed BOOLEAN DEFAULT FALSE,
  profile_completion_percentage INTEGER DEFAULT 0,
  
  -- Step 1: Personal Details
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  father_name TEXT,
  mother_name TEXT,
  category TEXT CHECK (category IN ('general', 'obc', 'sc', 'st', 'ews')),
  
  -- Step 2: Contact Details
  phone TEXT,
  alternate_phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  district TEXT,
  
  -- Step 3: Education Details
  education_level TEXT CHECK (education_level IN ('10th', '12th', 'diploma', 'bachelors', 'masters', 'phd')),
  institution_name TEXT,
  course_name TEXT,
  specialization TEXT,
  year_of_passing INTEGER,
  percentage DECIMAL(5,2),
  cgpa DECIMAL(4,2),
  
  -- Step 4: Bank Details
  bank_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  account_holder_name TEXT,
  branch_name TEXT,
  
  -- Step 5: Skills & Languages
  skills JSONB DEFAULT '[]'::jsonb, -- Array of skills
  languages JSONB DEFAULT '[]'::jsonb, -- Array of languages with proficiency
  
  -- Professional Links
  linkedin TEXT,
  github TEXT,
  portfolio TEXT,
  
  -- Document Verification Status
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  digilocker_verified BOOLEAN DEFAULT FALSE,
  aadhaar_number TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  step1_completed_at TIMESTAMP WITH TIME ZONE,
  step2_completed_at TIMESTAMP WITH TIME ZONE,
  step3_completed_at TIMESTAMP WITH TIME ZONE,
  step4_completed_at TIMESTAMP WITH TIME ZONE,
  step5_completed_at TIMESTAMP WITH TIME ZONE,
  step6_completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 2. DOCUMENT VERIFICATION TABLE
-- =====================================================
CREATE TABLE document_verifications (
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

-- =====================================================
-- 3. INTERNSHIPS TABLE
-- =====================================================
CREATE TABLE internships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  skills_required JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  duration_months INTEGER,
  stipend DECIMAL(10,2),
  application_deadline DATE,
  start_date DATE,
  end_date DATE,
  total_positions INTEGER DEFAULT 1,
  filled_positions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  
  -- Company Details
  company_website TEXT,
  company_logo TEXT,
  company_description TEXT,
  
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. APPLICATIONS TABLE
-- =====================================================
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  resume_url TEXT,
  additional_documents JSONB DEFAULT '[]'::jsonb,
  
  -- Interview Details
  interview_date TIMESTAMP WITH TIME ZONE,
  interview_mode TEXT CHECK (interview_mode IN ('online', 'offline', 'phone')),
  interview_notes TEXT,
  
  -- Selection Details
  selection_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  feedback TEXT,
  
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. SKILLS ASSESSMENT TABLE
-- =====================================================
CREATE TABLE skills_assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  skill_name TEXT NOT NULL,
  assessment_type TEXT CHECK (assessment_type IN ('quiz', 'coding', 'project', 'interview')),
  score DECIMAL(5,2),
  max_score DECIMAL(5,2) DEFAULT 100,
  percentage DECIMAL(5,2),
  
  -- Assessment Details
  questions_answered INTEGER,
  correct_answers INTEGER,
  time_taken INTEGER, -- in minutes
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
  verified BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  
  -- Notification Details
  action_url TEXT,
  action_text TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Priority and Category
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  category TEXT CHECK (category IN ('application', 'profile', 'verification', 'system', 'internship')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. GRIEVANCES TABLE
-- =====================================================
CREATE TABLE grievances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('technical', 'application', 'verification', 'payment', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Status and Resolution
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  resolution TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Attachments
  attachments JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE system_settings (
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

-- =====================================================
-- 9. AUDIT LOG TABLE (For tracking changes)
-- =====================================================
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_profile_step ON profiles(profile_step);
CREATE INDEX idx_profiles_profile_completed ON profiles(profile_completed);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_internship_id ON applications(internship_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_skills_assessments_user_id ON skills_assessments(user_id);
CREATE INDEX idx_grievances_user_id ON grievances(user_id);
CREATE INDEX idx_grievances_status ON grievances(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Skills assessments policies
CREATE POLICY "Users can view own assessments" ON skills_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON skills_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON skills_assessments FOR UPDATE USING (auth.uid() = user_id);

-- Grievances policies
CREATE POLICY "Users can view own grievances" ON grievances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own grievances" ON grievances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own grievances" ON grievances FOR UPDATE USING (auth.uid() = user_id);

-- System settings policies
CREATE POLICY "Users can view own settings" ON system_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON system_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON system_settings FOR UPDATE USING (auth.uid() = user_id);

-- Document verifications policies
CREATE POLICY "Users can view own verifications" ON document_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own verifications" ON document_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own verifications" ON document_verifications FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grievances_updated_at BEFORE UPDATE ON grievances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_verifications_updated_at BEFORE UPDATE ON document_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.system_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
        CASE WHEN skills IS NOT NULL AND jsonb_array_length(skills) > 0 THEN 1 ELSE 0 END
    INTO completion_count
    FROM profiles
    WHERE id = user_uuid;
    
    RETURN (completion_count * 100 / total_steps);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample internships
INSERT INTO internships (company_name, position, description, location, duration_months, stipend, application_deadline, start_date, skills_required) VALUES
('Tech Corp India', 'Software Development Intern', 'Work on cutting-edge web applications using React and Node.js', 'Bangalore', 6, 25000.00, '2024-02-15', '2024-03-01', '["JavaScript", "React", "Node.js"]'),
('Digital Solutions Ltd', 'Data Science Intern', 'Analyze large datasets and build ML models', 'Mumbai', 4, 20000.00, '2024-02-20', '2024-03-15', '["Python", "Machine Learning", "SQL"]'),
('Innovation Hub', 'UI/UX Design Intern', 'Design user interfaces for mobile and web applications', 'Delhi', 3, 15000.00, '2024-02-25', '2024-03-10', '["Figma", "Adobe XD", "Prototyping"]');

-- =====================================================
-- VIEWS FOR EASY DATA ACCESS
-- =====================================================

-- View for complete user profile with verification status
CREATE VIEW user_profile_complete AS
SELECT 
    p.*,
    dv.aadhaar_verified,
    dv.digilocker_verified,
    dv.overall_verification_status,
    calculate_profile_completion(p.id) as calculated_completion_percentage
FROM profiles p
LEFT JOIN document_verifications dv ON p.id = dv.user_id;

-- View for application statistics
CREATE VIEW application_stats AS
SELECT 
    user_id,
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'applied' THEN 1 END) as pending_applications,
    COUNT(CASE WHEN status = 'selected' THEN 1 END) as selected_applications,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications
FROM applications
GROUP BY user_id;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Schema created successfully!
-- Run this SQL in your Supabase SQL editor to set up the complete database structure.
-- Make sure to enable RLS and set up authentication in Supabase dashboard.
