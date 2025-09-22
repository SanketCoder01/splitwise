-- QUICK FIX for JSON and constraint errors

-- 1. Drop the problematic view first
DROP VIEW IF EXISTS user_profile_complete CASCADE;

-- 2. Drop existing constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_education_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_profile_step_check;

-- 3. Update invalid education level data
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

-- 4. Fix profile_step values
UPDATE profiles SET profile_step = 1 WHERE profile_step IS NULL OR profile_step < 1 OR profile_step > 6;

-- 5. Add resume_url column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- 6. Add proper constraints (allowing NULL values)
ALTER TABLE profiles ADD CONSTRAINT profiles_education_level_check
  CHECK (education_level IS NULL OR education_level IN (
    'High School', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD',
    'ITI', 'Polytechnic', 'Other'
  ));

ALTER TABLE profiles ADD CONSTRAINT profiles_profile_step_check
  CHECK (profile_step IS NULL OR (profile_step >= 1 AND profile_step <= 6));

-- 7. Simple view without JSON issues (skip if it fails)
-- CREATE OR REPLACE VIEW user_profile_complete AS
-- SELECT * FROM profiles;
