-- PM Internship Portal - Supabase Database Schema
-- Run these commands in your Supabase SQL Editor

-- First, let's check what tables exist and add missing columns safely

-- 1. Create internships table or add missing columns
DO $$ 
BEGIN
    -- Create table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'internships') THEN
        CREATE TABLE internships (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            ministry TEXT NOT NULL,
            location TEXT NOT NULL,
            type TEXT CHECK (type IN ('remote', 'onsite', 'hybrid')) NOT NULL,
            duration TEXT NOT NULL,
            stipend TEXT NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT[] NOT NULL DEFAULT '{}',
            skills TEXT[] NOT NULL DEFAULT '{}',
            applications INTEGER DEFAULT 0,
            max_applications INTEGER NOT NULL,
            deadline DATE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            posted_by UUID REFERENCES auth.users(id),
            status TEXT CHECK (status IN ('active', 'closed', 'draft')) DEFAULT 'active',
            featured BOOLEAN DEFAULT FALSE,
            category TEXT DEFAULT 'general'
        );
    ELSE
        -- Add missing columns if table exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'ministry') THEN
            ALTER TABLE internships ADD COLUMN ministry TEXT;
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
            ALTER TABLE internships ADD COLUMN max_applications INTEGER;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'posted_by') THEN
            ALTER TABLE internships ADD COLUMN posted_by UUID REFERENCES auth.users(id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'internships' AND column_name = 'status') THEN
            ALTER TABLE internships ADD COLUMN status TEXT CHECK (status IN ('active', 'closed', 'draft')) DEFAULT 'active';
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

-- 2. Create updates table or add missing columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'updates') THEN
        CREATE TABLE updates (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT,
            date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            category TEXT NOT NULL DEFAULT 'announcement',
            priority INTEGER DEFAULT 1,
            active BOOLEAN DEFAULT TRUE,
            created_by UUID REFERENCES auth.users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add missing columns if table exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'updates' AND column_name = 'priority') THEN
            ALTER TABLE updates ADD COLUMN priority INTEGER DEFAULT 1;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'updates' AND column_name = 'active') THEN
            ALTER TABLE updates ADD COLUMN active BOOLEAN DEFAULT TRUE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'updates' AND column_name = 'created_by') THEN
            ALTER TABLE updates ADD COLUMN created_by UUID REFERENCES auth.users(id);
        END IF;
    END IF;
END $$;

-- 3. Create notifications table or add missing columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        CREATE TABLE notifications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            read BOOLEAN DEFAULT FALSE,
            action_url TEXT,
            metadata JSONB DEFAULT '{}'
        );
    ELSE
        -- Add missing columns if table exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'action_url') THEN
            ALTER TABLE notifications ADD COLUMN action_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'metadata') THEN
            ALTER TABLE notifications ADD COLUMN metadata JSONB DEFAULT '{}';
        END IF;
    END IF;
END $$;

-- 4. Create applications table or add missing columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications') THEN
        CREATE TABLE applications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) NOT NULL,
            internship_id UUID REFERENCES internships(id) NOT NULL,
            status TEXT CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'selected', 'rejected')) DEFAULT 'pending',
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            cover_letter TEXT,
            resume_url TEXT,
            additional_documents JSONB DEFAULT '{}',
            interview_scheduled_at TIMESTAMP WITH TIME ZONE,
            notes TEXT,
            UNIQUE(user_id, internship_id)
        );
    ELSE
        -- Add missing columns if table exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'cover_letter') THEN
            ALTER TABLE applications ADD COLUMN cover_letter TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'resume_url') THEN
            ALTER TABLE applications ADD COLUMN resume_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'additional_documents') THEN
            ALTER TABLE applications ADD COLUMN additional_documents JSONB DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'interview_scheduled_at') THEN
            ALTER TABLE applications ADD COLUMN interview_scheduled_at TIMESTAMP WITH TIME ZONE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'notes') THEN
            ALTER TABLE applications ADD COLUMN notes TEXT;
        END IF;
    END IF;
END $$;

-- 5. Create government_officials table or add missing columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'government_officials') THEN
        CREATE TABLE government_officials (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
            employee_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            designation TEXT NOT NULL,
            ministry TEXT NOT NULL,
            department TEXT,
            office_location TEXT,
            phone TEXT,
            verified BOOLEAN DEFAULT FALSE,
            permissions JSONB DEFAULT '{"can_post_internships": true, "can_review_applications": true}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add missing columns if table exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'government_officials' AND column_name = 'employee_id') THEN
            ALTER TABLE government_officials ADD COLUMN employee_id TEXT UNIQUE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'government_officials' AND column_name = 'ministry') THEN
            ALTER TABLE government_officials ADD COLUMN ministry TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'government_officials' AND column_name = 'department') THEN
            ALTER TABLE government_officials ADD COLUMN department TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'government_officials' AND column_name = 'verified') THEN
            ALTER TABLE government_officials ADD COLUMN verified BOOLEAN DEFAULT FALSE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'government_officials' AND column_name = 'permissions') THEN
            ALTER TABLE government_officials ADD COLUMN permissions JSONB DEFAULT '{"can_post_internships": true, "can_review_applications": true}';
        END IF;
    END IF;
END $$;

-- 6. Create schemes table or add missing columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'schemes') THEN
        CREATE TABLE schemes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            department TEXT NOT NULL,
            description TEXT NOT NULL,
            eligibility TEXT NOT NULL,
            duration TEXT NOT NULL,
            stipend_range TEXT NOT NULL,
            total_slots INTEGER NOT NULL,
            available_slots INTEGER NOT NULL,
            features TEXT[] DEFAULT '{}',
            benefits TEXT[] DEFAULT '{}',
            locations TEXT[] DEFAULT '{}',
            application_deadline DATE,
            image_url TEXT,
            color TEXT DEFAULT 'blue',
            active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add missing columns if table exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'features') THEN
            ALTER TABLE schemes ADD COLUMN features TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'benefits') THEN
            ALTER TABLE schemes ADD COLUMN benefits TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'locations') THEN
            ALTER TABLE schemes ADD COLUMN locations TEXT[] DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'image_url') THEN
            ALTER TABLE schemes ADD COLUMN image_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'color') THEN
            ALTER TABLE schemes ADD COLUMN color TEXT DEFAULT 'blue';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schemes' AND column_name = 'active') THEN
            ALTER TABLE schemes ADD COLUMN active BOOLEAN DEFAULT TRUE;
        END IF;
    END IF;
END $$;

-- 7. Add resume_url column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'resume_url') THEN
        ALTER TABLE profiles ADD COLUMN resume_url TEXT;
    END IF;
END $$;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_internships_created_at ON internships(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_ministry ON internships(ministry);
CREATE INDEX IF NOT EXISTS idx_internships_type ON internships(type);
CREATE INDEX IF NOT EXISTS idx_internships_deadline ON internships(deadline);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

CREATE INDEX IF NOT EXISTS idx_updates_active ON updates(active);
CREATE INDEX IF NOT EXISTS idx_updates_date ON updates(date DESC);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies

-- Internships: Everyone can read active internships, only government officials can insert/update
CREATE POLICY "Anyone can view active internships" ON internships
  FOR SELECT USING (status = 'active');

CREATE POLICY "Government officials can manage internships" ON internships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM government_officials 
      WHERE user_id = auth.uid() AND verified = true
    )
  );

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Applications: Users can manage their own applications
CREATE POLICY "Users can manage own applications" ON applications
  FOR ALL USING (user_id = auth.uid());

-- Government officials can view applications for their posted internships
CREATE POLICY "Officials can view applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM government_officials 
      WHERE user_id = auth.uid() AND verified = true
    )
  );

-- Updates: Everyone can read active updates
CREATE POLICY "Anyone can view active updates" ON updates
  FOR SELECT USING (active = true);

-- Government officials can manage updates
CREATE POLICY "Officials can manage updates" ON updates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM government_officials 
      WHERE user_id = auth.uid() AND verified = true
    )
  );

-- Schemes: Everyone can read active schemes
CREATE POLICY "Anyone can view active schemes" ON schemes
  FOR SELECT USING (active = true);

-- Government officials can manage schemes
CREATE POLICY "Officials can manage schemes" ON schemes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM government_officials 
      WHERE user_id = auth.uid() AND verified = true
    )
  );

-- 11. Create functions for automatic updates

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON internships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_government_officials_updated_at BEFORE UPDATE ON government_officials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schemes_updated_at BEFORE UPDATE ON schemes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Function to create notification when new internship is posted
CREATE OR REPLACE FUNCTION notify_new_internship()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert notification for all users (you might want to optimize this)
    INSERT INTO notifications (user_id, title, message, type, action_url)
    SELECT 
        id,
        'New Internship Posted',
        'New opportunity: ' || NEW.title || ' at ' || NEW.company,
        'info',
        '/internships/' || NEW.id
    FROM auth.users
    WHERE id IN (SELECT id FROM profiles WHERE profile_completed = true);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new internship notifications
CREATE TRIGGER notify_new_internship_trigger
    AFTER INSERT ON internships
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION notify_new_internship();

-- 13. Insert sample data for testing

-- Sample government official (you'll need to replace the user_id with actual auth.users id)
-- INSERT INTO government_officials (user_id, employee_id, name, designation, ministry, verified)
-- VALUES (
--     'your-auth-user-id-here',
--     'GOV001',
--     'Dr. Rajesh Kumar',
--     'Joint Secretary',
--     'Ministry of Education',
--     true
-- );

-- Sample schemes data
INSERT INTO schemes (title, department, description, eligibility, duration, stipend_range, total_slots, available_slots, features, benefits, locations, application_deadline, color) VALUES
('PM Internship Scheme', 'Ministry of Education', 'Flagship internship program providing hands-on experience in government departments', 'Graduate/Post-graduate in any discipline', '6-12 months', '₹25,000 - ₹40,000', 10000, 8500, 
 ARRAY['Direct mentorship from senior officials', 'Policy-making exposure', 'Government certificate'], 
 ARRAY['Monthly stipend', 'Health insurance', 'Professional development'], 
 ARRAY['New Delhi', 'Mumbai', 'Bangalore', 'Chennai'], 
 '2024-03-31', 'blue'),

('Digital India Internship', 'Ministry of Electronics & IT', 'Technology-focused internships in AI, ML, and Digital Governance', 'Engineering/MCA/MSc in Computer Science', '3-6 months', '₹30,000 - ₹50,000', 5000, 4200,
 ARRAY['Cutting-edge tech projects', 'Industry collaboration', 'Certification programs'],
 ARRAY['Higher technical stipend', 'Advanced resources', 'Patent opportunities'],
 ARRAY['Bangalore', 'Hyderabad', 'Pune', 'Chennai'],
 '2024-04-15', 'green'),

('Skill Development Program', 'Ministry of Skill Development', 'Comprehensive skill development with industry training', '12th pass or equivalent, ITI/Diploma preferred', '3-9 months', '₹20,000 - ₹35,000', 15000, 12000,
 ARRAY['Industry-relevant training', 'Job placement assistance', 'International certification'],
 ARRAY['Free training', 'Tool kit provided', 'Placement guarantee'],
 ARRAY['Pan India - 500+ centers'],
 '2024-12-31', 'purple');

-- Sample updates for sliding banner
INSERT INTO updates (title, content, category, priority, image) VALUES
('PM Internship Program 2024 Launch', 'The Prime Minister has launched the new internship program with enhanced benefits and opportunities for students across India.', 'announcement', 1, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'),
('Digital India Initiative Expansion', 'New internship opportunities in AI, Machine Learning, and Digital Governance are now available for engineering students.', 'technology', 2, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'),
('Skill Development Programs', 'Enhanced skill development programs for students across various domains with guaranteed placement assistance.', 'education', 3, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800');

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE internships;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE updates;

-- Grant necessary permissions
GRANT ALL ON internships TO authenticated;
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON applications TO authenticated;
GRANT ALL ON government_officials TO authenticated;
GRANT ALL ON updates TO authenticated;
GRANT ALL ON schemes TO authenticated;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
