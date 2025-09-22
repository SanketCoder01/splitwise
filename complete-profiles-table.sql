-- Complete profiles table structure with all required columns

-- Add all missing columns that might be needed
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education_level TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS institution_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year_of_passing TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ifsc_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_holder_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step1_completed_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step2_completed_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step3_completed_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step4_completed_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step5_completed_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS step6_completed_at TIMESTAMPTZ;

-- Drop existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_education_level_check;

-- Add proper constraint for education level
ALTER TABLE profiles ADD CONSTRAINT profiles_education_level_check 
  CHECK (education_level IS NULL OR education_level IN (
    'High School', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD', 
    'ITI', 'Polytechnic', 'Other'
  ));

-- Add constraint for profile step
ALTER TABLE profiles ADD CONSTRAINT profiles_profile_step_check 
  CHECK (profile_step >= 1 AND profile_step <= 6);
