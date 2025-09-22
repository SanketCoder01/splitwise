-- Fix education level constraint issue by handling view dependencies

-- Step 1: Drop the dependent view first
DROP VIEW IF EXISTS user_profile_complete CASCADE;

-- Step 2: Drop existing constraints that might be causing issues
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_education_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_profile_step_check;

-- Step 3: Update existing invalid data to valid values
UPDATE profiles
SET education_level = CASE
  WHEN education_level = '10th' THEN 'High School'
  WHEN education_level = '12th' THEN 'Intermediate'
  WHEN education_level = 'diploma' THEN 'Diploma'
  WHEN education_level = 'graduation' THEN 'Bachelor'
  WHEN education_level = 'post_graduation' THEN 'Master'
  ELSE 'Other'
END
WHERE education_level NOT IN ('High School', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD', 'ITI', 'Polytechnic', 'Other');

-- Step 4: Ensure profile_step is valid (allow NULL and 1-6)
UPDATE profiles SET profile_step = 1 WHERE profile_step IS NULL OR profile_step < 1 OR profile_step > 6;

-- Step 5: Add missing columns if they don't exist
DO $$
BEGIN
    -- Add skills column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'skills') THEN
        ALTER TABLE profiles ADD COLUMN skills TEXT;
    END IF;

    -- Add languages column if it doesn't exist (as TEXT, not JSON)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'languages') THEN
        ALTER TABLE profiles ADD COLUMN languages TEXT;
    END IF;

    -- Add resume_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'resume_url') THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
    END IF;
END $$;

-- Step 6: Add proper check constraints for valid education levels (allow NULL values)
ALTER TABLE profiles ADD CONSTRAINT profiles_education_level_check
  CHECK (education_level IS NULL OR education_level IN (
    'High School', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD',
    'ITI', 'Polytechnic', 'Other'
  ));

-- Step 7: Add proper constraint for profile_step (allow NULL and 1-6)
ALTER TABLE profiles ADD CONSTRAINT profiles_profile_step_check
  CHECK (profile_step IS NULL OR (profile_step >= 1 AND profile_step <= 6));

-- Step 8: Recreate the view if needed (handle JSON fields properly)
CREATE OR REPLACE VIEW user_profile_complete AS
SELECT
  id,
  full_name,
  email,
  phone,
  profile_completed,
  profile_step,
  education_level,
  institution_name,
  course_name,
  year_of_passing,
  bank_name,
  account_number,
  ifsc_code,
  account_holder_name,
  COALESCE(skills, '') as skills,
  CASE
    WHEN languages IS NULL THEN ''
    WHEN languages::text = '' THEN ''
    ELSE languages::text
  END as languages,
  COALESCE(resume_url, '') as resume_url,
  created_at,
  updated_at,
  CASE
    WHEN profile_completed = true AND profile_step = 6 THEN 'Complete'
    WHEN profile_step >= 3 THEN 'Partially Complete'
    ELSE 'Incomplete'
  END as completion_status
FROM profiles;
