-- Recruiter Profile Tables for Government Internship Portal
-- Run this in Supabase SQL Editor

-- Create recruiter_profiles table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'recruiter_profiles') THEN
        CREATE TABLE public.recruiter_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            
            -- Step 1: Personal Details
            full_name TEXT,
            designation TEXT,
            employee_id TEXT,
            
            -- Step 2: Company Details
            company_name TEXT,
            company_type TEXT,
            industry TEXT,
            company_size TEXT,
            website TEXT,
            
            -- Step 3: Contact Information
            email TEXT,
            phone TEXT,
            alternate_phone TEXT,
            address_line1 TEXT,
            address_line2 TEXT,
            city TEXT,
            state TEXT,
            pincode TEXT,
            
            -- Step 4: Documents (file paths)
            company_registration_url TEXT,
            authorization_letter_url TEXT,
            id_proof_url TEXT,
            
            -- Step 5: Internship Preferences
            internship_types TEXT[], -- Array of internship types
            preferred_skills TEXT,
            min_duration TEXT,
            max_duration TEXT,
            stipend_range TEXT,
            
            -- Step 6: Agreement
            terms_accepted BOOLEAN DEFAULT FALSE,
            data_consent BOOLEAN DEFAULT FALSE,
            
            -- Profile Status
            profile_step INTEGER DEFAULT 1,
            profile_completed BOOLEAN DEFAULT FALSE,
            approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
            
            -- Metadata
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            approved_at TIMESTAMP WITH TIME ZONE,
            approved_by UUID
        );
        
        RAISE NOTICE 'Created recruiter_profiles table';
    ELSE
        RAISE NOTICE 'recruiter_profiles table already exists';
    END IF;
END $$;

-- Create internship_postings table for recruiter postings
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'internship_postings') THEN
        CREATE TABLE public.internship_postings (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            recruiter_id UUID REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
            
            -- Basic Information
            title TEXT NOT NULL,
            description TEXT,
            requirements TEXT,
            responsibilities TEXT,
            
            -- Details
            department TEXT,
            location TEXT,
            work_type TEXT CHECK (work_type IN ('remote', 'onsite', 'hybrid')),
            duration TEXT,
            stipend TEXT,
            
            -- Application Details
            max_applications INTEGER DEFAULT 50,
            current_applications INTEGER DEFAULT 0,
            deadline DATE,
            
            -- Skills and Qualifications
            required_skills TEXT[],
            preferred_qualifications TEXT,
            education_level TEXT,
            
            -- Status
            status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'live', 'closed')),
            
            -- Metadata
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            approved_at TIMESTAMP WITH TIME ZONE,
            approved_by UUID
        );
        
        RAISE NOTICE 'Created internship_postings table';
    ELSE
        RAISE NOTICE 'internship_postings table already exists';
    END IF;
END $$;

-- Create indexes for better performance
DO $$
BEGIN
    -- Indexes for recruiter_profiles
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_recruiter_profiles_email') THEN
        CREATE INDEX idx_recruiter_profiles_email ON recruiter_profiles(email);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_recruiter_profiles_approval_status') THEN
        CREATE INDEX idx_recruiter_profiles_approval_status ON recruiter_profiles(approval_status);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_recruiter_profiles_profile_completed') THEN
        CREATE INDEX idx_recruiter_profiles_profile_completed ON recruiter_profiles(profile_completed);
    END IF;
    
    -- Indexes for internship_postings
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_internship_postings_recruiter_id') THEN
        CREATE INDEX idx_internship_postings_recruiter_id ON internship_postings(recruiter_id);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_internship_postings_status') THEN
        CREATE INDEX idx_internship_postings_status ON internship_postings(status);
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_internship_postings_deadline') THEN
        CREATE INDEX idx_internship_postings_deadline ON internship_postings(deadline);
    END IF;
    
    RAISE NOTICE 'Created indexes successfully';
END $$;

-- Insert sample recruiter data for testing
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM recruiter_profiles WHERE email = 'hr@tcs.com') THEN
        INSERT INTO recruiter_profiles (
            id,
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
            gen_random_uuid(),
            'Rajesh Kumar',
            'Senior HR Manager',
            'TCS001',
            'Tata Consultancy Services',
            'private',
            'it',
            '1000+',
            'https://www.tcs.com',
            'hr@tcs.com',
            '+91 9876543210',
            'TCS House, Raveline Street',
            'Mumbai',
            'Maharashtra',
            '400001',
            ARRAY['Technical', 'Research'],
            'Java, Python, React, Node.js, Database Management',
            '3',
            '12',
            '25000-50000',
            TRUE,
            TRUE,
            6,
            TRUE,
            'approved'
        );
        
        RAISE NOTICE 'Inserted sample TCS recruiter data';
    END IF;
    
    IF NOT EXISTS (SELECT FROM recruiter_profiles WHERE email = 'careers@infosys.com') THEN
        INSERT INTO recruiter_profiles (
            id,
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
            gen_random_uuid(),
            'Priya Sharma',
            'Talent Acquisition Lead',
            'INF002',
            'Infosys Limited',
            'private',
            'it',
            '1000+',
            'https://www.infosys.com',
            'careers@infosys.com',
            '+91 9876543211',
            'Electronics City, Hosur Road',
            'Bangalore',
            'Karnataka',
            '560100',
            ARRAY['Technical', 'Design', 'Marketing'],
            'Full Stack Development, UI/UX Design, Digital Marketing',
            '2',
            '6',
            '20000-40000',
            TRUE,
            TRUE,
            6,
            TRUE,
            'approved'
        );
        
        RAISE NOTICE 'Inserted sample Infosys recruiter data';
    END IF;
END $$;

-- Insert sample internship postings
DO $$
DECLARE
    tcs_recruiter_id UUID;
    infosys_recruiter_id UUID;
BEGIN
    -- Get recruiter IDs
    SELECT id INTO tcs_recruiter_id FROM recruiter_profiles WHERE email = 'hr@tcs.com' LIMIT 1;
    SELECT id INTO infosys_recruiter_id FROM recruiter_profiles WHERE email = 'careers@infosys.com' LIMIT 1;
    
    -- Insert TCS internship posting
    IF tcs_recruiter_id IS NOT NULL AND NOT EXISTS (SELECT FROM internship_postings WHERE title = 'Software Development Intern - TCS') THEN
        INSERT INTO internship_postings (
            recruiter_id,
            title,
            description,
            requirements,
            responsibilities,
            department,
            location,
            work_type,
            duration,
            stipend,
            max_applications,
            deadline,
            required_skills,
            preferred_qualifications,
            education_level,
            status
        ) VALUES (
            tcs_recruiter_id,
            'Software Development Intern - TCS',
            'Join TCS as a Software Development Intern and work on cutting-edge projects with our experienced development teams.',
            'Strong programming skills in Java/Python, Understanding of software development lifecycle, Good problem-solving abilities',
            'Develop and test software applications, Participate in code reviews, Collaborate with senior developers, Document code and processes',
            'Software Development',
            'Mumbai, Maharashtra',
            'hybrid',
            '6 months',
            '₹35,000/month',
            100,
            CURRENT_DATE + INTERVAL '30 days',
            ARRAY['Java', 'Python', 'SQL', 'Git'],
            'Experience with web frameworks, Knowledge of cloud platforms',
            'Bachelor''s in Computer Science/IT',
            'live'
        );
        
        RAISE NOTICE 'Inserted TCS internship posting';
    END IF;
    
    -- Insert Infosys internship posting
    IF infosys_recruiter_id IS NOT NULL AND NOT EXISTS (SELECT FROM internship_postings WHERE title = 'Full Stack Developer Intern - Infosys') THEN
        INSERT INTO internship_postings (
            recruiter_id,
            title,
            description,
            requirements,
            responsibilities,
            department,
            location,
            work_type,
            duration,
            stipend,
            max_applications,
            deadline,
            required_skills,
            preferred_qualifications,
            education_level,
            status
        ) VALUES (
            infosys_recruiter_id,
            'Full Stack Developer Intern - Infosys',
            'Work with Infosys development teams on full-stack web applications using modern technologies.',
            'Knowledge of React/Angular, Node.js experience, Database fundamentals, Version control (Git)',
            'Build responsive web applications, Develop REST APIs, Work with databases, Participate in agile development',
            'Digital Services',
            'Bangalore, Karnataka',
            'onsite',
            '4 months',
            '₹30,000/month',
            75,
            CURRENT_DATE + INTERVAL '25 days',
            ARRAY['React', 'Node.js', 'MongoDB', 'JavaScript'],
            'Experience with cloud services, Knowledge of DevOps practices',
            'Bachelor''s in Computer Science/Engineering',
            'live'
        );
        
        RAISE NOTICE 'Inserted Infosys internship posting';
    END IF;
END $$;

-- Enable Row Level Security (Optional - uncomment if needed)
-- ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE internship_postings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (Optional - uncomment if needed)
-- CREATE POLICY "Recruiters can view own profile" ON recruiter_profiles FOR SELECT USING (auth.uid()::text = id::text);
-- CREATE POLICY "Recruiters can update own profile" ON recruiter_profiles FOR UPDATE USING (auth.uid()::text = id::text);

-- RAISE NOTICE 'Recruiter database setup completed successfully!';
-- RAISE NOTICE 'Tables created: recruiter_profiles, internship_postings';
-- RAISE NOTICE 'Sample data inserted for testing';
-- RAISE NOTICE 'You can now test the recruiter profile completion system';
