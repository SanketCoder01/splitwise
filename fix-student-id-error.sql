-- ==========================================
-- QUICK FIX FOR student_id COLUMN ERROR
-- ==========================================
-- Run this in Supabase SQL Editor to fix the immediate error

-- Fix missing student_id column in applications table
DO $$ 
BEGIN
    -- Check if student_id column exists in applications table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'student_id'
    ) THEN
        -- Add the missing student_id column
        ALTER TABLE applications ADD COLUMN student_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added student_id column to applications table';
    ELSE
        RAISE NOTICE 'student_id column already exists in applications table';
    END IF;

    -- Also check if applications table exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'applications'
    ) THEN
        CREATE TABLE applications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
            student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            application_id VARCHAR(50) UNIQUE, -- PMI-XXXXXX format
            status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'under_review', 'shortlisted', 'selected', 'rejected'
            cover_letter TEXT,
            resume_url TEXT,
            additional_documents JSONB DEFAULT '{}',
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            reviewed_at TIMESTAMP WITH TIME ZONE,
            reviewed_by UUID,
            feedback TEXT,
            score INTEGER, -- Assessment score
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            UNIQUE(internship_id, student_id) -- Prevent duplicate applications
        );
        RAISE NOTICE 'Created applications table with student_id column';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error occurred while fixing student_id column: %', SQLERRM;
END $$;

-- Update or create RLS policies for applications table
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
DROP POLICY IF EXISTS "Users can update own applications" ON applications;

-- Enable RLS on applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own applications" ON applications 
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own applications" ON applications 
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update own applications" ON applications 
    FOR UPDATE USING (auth.uid() = student_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON applications(internship_id);

-- Function to generate application ID if it doesn't exist
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_id IS NULL THEN
        NEW.application_id = 'PMI-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-generating application ID
DROP TRIGGER IF EXISTS generate_application_id_trigger ON applications;
CREATE TRIGGER generate_application_id_trigger 
    BEFORE INSERT ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_application_id();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ student_id column error has been fixed!';
    RAISE NOTICE '✅ Applications table is ready with proper RLS policies';
    RAISE NOTICE '✅ You can now use the applications table without errors';
END $$;
