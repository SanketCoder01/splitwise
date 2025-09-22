-- Fix Database Schema - PM Internship Portal
-- This script safely adds missing columns and tables without errors

-- 1. Fix the "ministry" column error in internships table
DO $$ 
BEGIN
    -- Check if internships table exists, if not create it
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'internships') THEN
        CREATE TABLE internships (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            ministry TEXT NOT NULL,
            location TEXT NOT NULL,
            type TEXT DEFAULT 'onsite',
            duration TEXT NOT NULL,
            stipend TEXT NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT[] DEFAULT '{}',
            skills TEXT[] DEFAULT '{}',
            applications INTEGER DEFAULT 0,
            max_applications INTEGER DEFAULT 100,
            deadline DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            posted_by UUID REFERENCES auth.users(id),
            status TEXT DEFAULT 'active',
            featured BOOLEAN DEFAULT FALSE,
            category TEXT DEFAULT 'general'
        );
    ELSE
        -- Add missing columns safely
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'ministry') THEN
            ALTER TABLE internships ADD COLUMN ministry TEXT DEFAULT 'Ministry of Education';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'requirements') THEN
            ALTER TABLE internships ADD COLUMN requirements TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'skills') THEN
            ALTER TABLE internships ADD COLUMN skills TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'applications') THEN
            ALTER TABLE internships ADD COLUMN applications INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'max_applications') THEN
            ALTER TABLE internships ADD COLUMN max_applications INTEGER DEFAULT 100;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'posted_by') THEN
            ALTER TABLE internships ADD COLUMN posted_by UUID REFERENCES auth.users(id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'status') THEN
            ALTER TABLE internships ADD COLUMN status TEXT DEFAULT 'active';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'featured') THEN
            ALTER TABLE internships ADD COLUMN featured BOOLEAN DEFAULT FALSE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'category') THEN
            ALTER TABLE internships ADD COLUMN category TEXT DEFAULT 'general';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'updated_at') THEN
            ALTER TABLE internships ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
    END IF;
END $$;

-- 2. Create notifications table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        CREATE TABLE notifications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            read BOOLEAN DEFAULT FALSE,
            action_url TEXT,
            metadata JSONB DEFAULT '{}'
        );
    END IF;
END $$;

-- 3. Create updates table for sliding banner
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'updates') THEN
        CREATE TABLE updates (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT,
            date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            category TEXT DEFAULT 'announcement',
            priority INTEGER DEFAULT 1,
            active BOOLEAN DEFAULT TRUE,
            created_by UUID REFERENCES auth.users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- 4. Create applications table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications') THEN
        CREATE TABLE applications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) NOT NULL,
            internship_id UUID REFERENCES internships(id) NOT NULL,
            status TEXT DEFAULT 'pending',
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            cover_letter TEXT,
            resume_url TEXT,
            additional_documents JSONB DEFAULT '{}',
            interview_scheduled_at TIMESTAMP WITH TIME ZONE,
            notes TEXT,
            UNIQUE(user_id, internship_id)
        );
    END IF;
END $$;

-- 5. Create government_officials table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'government_officials') THEN
        CREATE TABLE government_officials (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            employee_id TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            designation TEXT NOT NULL,
            ministry TEXT NOT NULL,
            department TEXT,
            office_location TEXT,
            phone TEXT,
            verified BOOLEAN DEFAULT TRUE,
            permissions JSONB DEFAULT '{"can_post_internships": true, "can_review_applications": true}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- 5. Add resume_url to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'resume_url') THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
    END IF;
END $$;

-- 6. Insert sample government officials (only if table is empty)
DO $$ 
BEGIN
    -- Insert sample government officials if table is empty
    IF NOT EXISTS (SELECT 1 FROM government_officials LIMIT 1) THEN
        INSERT INTO government_officials (employee_id, email, password_hash, name, designation, ministry, department, office_location, phone) VALUES
        ('GOV001', 'rajesh.kumar@gov.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Rajesh Kumar', 'Joint Secretary', 'Ministry of Education', 'Higher Education', 'Shastri Bhawan, New Delhi', '+91-11-2338-1234'),
        ('GOV002', 'priya.sharma@gov.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ms. Priya Sharma', 'Director', 'Ministry of Education', 'Skill Development', 'Shastri Bhawan, New Delhi', '+91-11-2338-5678'),
        ('GOV003', 'amit.singh@gov.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Shri Amit Singh', 'Deputy Secretary', 'Ministry of Electronics & IT', 'Digital India', 'Electronics Niketan, New Delhi', '+91-11-2301-9876');
    END IF;
END $$;

-- 7. Insert sample data for testing (only if tables are empty)
DO $$ 
BEGIN
    -- Insert sample internships if table is empty
    IF NOT EXISTS (SELECT 1 FROM internships LIMIT 1) THEN
        INSERT INTO internships (title, company, ministry, location, type, duration, stipend, description, requirements, skills, max_applications, deadline) VALUES
        ('Software Developer Intern', 'NIC (National Informatics Centre)', 'Ministry of Education', 'New Delhi', 'onsite', '6 months', '₹35,000/month', 'Work on government digital initiatives and e-governance projects', 
         ARRAY['Bachelor''s in Computer Science', 'Programming knowledge', 'Good communication skills'], 
         ARRAY['JavaScript', 'React', 'Node.js', 'Database'], 50, '2024-06-30'),
        
        ('Data Analyst Intern', 'Ministry of Education', 'Ministry of Education', 'Mumbai', 'hybrid', '4 months', '₹30,000/month', 'Analyze educational data and create insights for policy making',
         ARRAY['Statistics background', 'Excel proficiency', 'Analytical thinking'],
         ARRAY['Python', 'SQL', 'Excel', 'Data Visualization'], 30, '2024-07-15'),
         
        ('Digital Marketing Intern', 'Digital India Corporation', 'Ministry of Electronics & IT', 'Bangalore', 'remote', '3 months', '₹25,000/month', 'Promote Digital India initiatives through social media and content',
         ARRAY['Marketing knowledge', 'Social media experience', 'Content creation'],
         ARRAY['Social Media', 'Content Writing', 'SEO', 'Analytics'], 25, '2024-08-01');
    END IF;
    
    -- Insert sample updates if table is empty
    IF NOT EXISTS (SELECT 1 FROM updates LIMIT 1) THEN
        INSERT INTO updates (title, content, category, priority, image) VALUES
        ('PM Internship Program 2024 Launch', 'The Prime Minister has launched the new internship program with enhanced benefits and opportunities for students across India.', 'announcement', 1, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'),
        ('Digital India Initiative Expansion', 'New internship opportunities in AI, Machine Learning, and Digital Governance are now available for engineering students.', 'technology', 2, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'),
        ('Application Deadline Extended', 'Due to high demand, the application deadline for summer internships has been extended to July 31st, 2024.', 'announcement', 1, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800');
    END IF;
END $$;

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_internships_created_at ON internships(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_ministry ON internships(ministry);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON applications(internship_id);

-- 8. Enable Row Level Security (RLS) - Run these one by one if needed
-- ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- 9. Create basic RLS policies (uncomment if needed)
-- CREATE POLICY "Anyone can view active internships" ON internships FOR SELECT USING (status = 'active');
-- CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
-- CREATE POLICY "Users can manage own applications" ON applications FOR ALL USING (user_id = auth.uid());
-- CREATE POLICY "Anyone can view active updates" ON updates FOR SELECT USING (active = true);

-- 10. Enable realtime (uncomment if needed)
-- ALTER PUBLICATION supabase_realtime ADD TABLE internships;
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE applications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE updates;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Database schema updated successfully! All tables and columns are now ready.';
END $$;
