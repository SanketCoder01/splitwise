-- Fix for user_type column error in notifications table
-- Run this in Supabase SQL Editor

-- Check if notifications table exists and add missing columns
DO $$ 
BEGIN
    -- Add user_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' AND column_name = 'user_type'
    ) THEN
        ALTER TABLE notifications ADD COLUMN user_type VARCHAR(50) NOT NULL DEFAULT 'student';
    END IF;

    -- Add related_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' AND column_name = 'related_id'
    ) THEN
        ALTER TABLE notifications ADD COLUMN related_id UUID;
    END IF;

    -- Add related_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' AND column_name = 'related_type'
    ) THEN
        ALTER TABLE notifications ADD COLUMN related_type VARCHAR(50);
    END IF;

    -- Update existing notifications to have proper user_type
    UPDATE notifications 
    SET user_type = 'student' 
    WHERE user_type IS NULL OR user_type = '';

END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_type ON notifications(user_id, user_type);

-- Update any existing RLS policies to handle user_type
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;

CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (user_type = 'student' AND auth.uid() = user_id)
    );

-- Sample notification data with proper user_type
INSERT INTO notifications (user_id, user_type, title, message, type, created_at) VALUES
(auth.uid(), 'student', 'Welcome to PM Internship Portal', 'Your account has been created successfully. Complete your profile to start applying for internships.', 'info', NOW())
ON CONFLICT DO NOTHING;

COMMIT;
