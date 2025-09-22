-- QUICK FIX: Run these commands in Supabase SQL Editor one by one

-- 1. Drop the problematic view first
DROP VIEW IF EXISTS user_profile_complete CASCADE;

-- 2. Add missing columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages TEXT;

-- 3. Drop existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_education_level_check;

-- 4. Update invalid education level data
UPDATE profiles 
SET education_level = 'Other'
WHERE education_level IS NOT NULL 
  AND education_level NOT IN ('High School', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD', 'ITI', 'Polytechnic', 'Other');

-- 5. Add the correct constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_education_level_check 
  CHECK (education_level IS NULL OR education_level IN (
    'High School', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD', 
    'ITI', 'Polytechnic', 'Other'
  ));
