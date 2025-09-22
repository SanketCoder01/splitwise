# Manual SQL Fix Steps for Education Level Constraint & Resume Storage

## Steps to Fix All Issues:

### 1. Create Resume Storage Bucket
First, create the storage bucket for resumes:

```sql
-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;
```

```sql
-- Allow anonymous access to view resumes (optional)
CREATE POLICY "Resume files are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes');
```

```sql
-- Allow authenticated users to upload their own resumes
CREATE POLICY "Users can upload their own resumes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resumes'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

```sql
-- Allow users to update their own resumes
CREATE POLICY "Users can update their own resumes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'resumes'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

```sql
-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resumes'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 2. Fix Profile Table Constraints

#### Step 1: Drop the dependent view
```sql
DROP VIEW IF EXISTS user_profile_complete CASCADE;
```

#### Step 2: Drop existing constraints
```sql
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_education_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_profile_step_check;
```

#### Step 3: Update invalid education level data
```sql
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
```

#### Step 4: Fix profile_step values
```sql
UPDATE profiles SET profile_step = 1 WHERE profile_step IS NULL OR profile_step < 1 OR profile_step > 6;
```

#### Step 5: Add missing columns
```sql
-- Add skills column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'skills') THEN
        ALTER TABLE profiles ADD COLUMN skills TEXT;
    END IF;
END $$;
```

```sql
-- Add languages column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'languages') THEN
        ALTER TABLE profiles ADD COLUMN languages TEXT;
    END IF;
END $$;
```

```sql
-- Add resume_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles' AND column_name = 'resume_url') THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
    END IF;
END $$;
```

#### Step 6: Add proper constraints (allowing NULL values)
```sql
-- Add proper check constraint for education levels
ALTER TABLE profiles ADD CONSTRAINT profiles_education_level_check
  CHECK (education_level IS NULL OR education_level IN (
    'High School', 'Intermediate', 'Diploma', 'Bachelor', 'Master', 'PhD',
    'ITI', 'Polytechnic', 'Other'
  ));
```

```sql
-- Add proper constraint for profile_step (allow NULL and 1-6)
ALTER TABLE profiles ADD CONSTRAINT profiles_profile_step_check
  CHECK (profile_step IS NULL OR (profile_step >= 1 AND profile_step <= 6));
```

#### Step 7: Recreate the view (handle JSON fields properly)
```sql
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
```

### 3. Test the Fix
After running these commands:
1. The "skills column does not exist" error should be fixed
2. The education level constraint error should be resolved
3. The profile_step constraint error should be fixed
4. Resume uploads should work properly
5. Profile updates should save successfully

## Expected Result:
- Resume storage bucket created
- All missing columns added to profiles table
- No more constraint violation errors
- Profile updates work properly
- Resume upload functionality works
- Multi-step profile form saves data correctly
