const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://erxpdqoftkleyhtxyacs.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeHBkcW9mdGtsZXlodHh5YWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MzUwNjIsImV4cCI6MjA3NDAxMTA2Mn0.88kr8qteHKs5XF1ugyGsNa3HXD1T8Gr-RQhtcWjAf9c'
);

async function createTestUser() {
  const testEmail = 'student@test.com';
  const testPassword = 'testpass123';
  
  try {
    console.log('Creating test user...');
    
    // Try to create a test user
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test Student',
          phone: '9876543210',
          user_type: 'student'
        }
      }
    });
    
    if (error) {
      console.error('❌ Registration failed:', error.message);
      
      // If user already exists, try to sign in
      if (error.message.includes('already registered')) {
        console.log('User already exists, trying to sign in...');
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (loginError) {
          console.error('❌ Login failed:', loginError.message);
        } else {
          console.log('✅ Login successful!');
          console.log('User ID:', loginData.user?.id);
          console.log('Email confirmed:', loginData.user?.email_confirmed_at ? 'Yes' : 'No');
        }
      }
    } else {
      console.log('✅ Registration successful!');
      console.log('User ID:', data.user?.id);
      console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
      console.log('Please check email for verification link');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

createTestUser();
