const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://erxpdqoftkleyhtxyacs.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeHBkcW9mdGtsZXlodHh5YWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MzUwNjIsImV4cCI6MjA3NDAxMTA2Mn0.88kr8qteHKs5XF1ugyGsNa3HXD1T8Gr-RQhtcWjAf9c'
);

async function testOTPFlow() {
  const testEmail = 'test@example.com';
  
  try {
    console.log('1. Testing OTP send...');
    const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
      email: testEmail,
    });
    
    console.log('OTP Send Result:', { otpData, otpError });
    
    if (otpError) {
      console.error('❌ OTP send failed:', otpError.message);
      return;
    }
    
    console.log('✅ OTP send successful');
    console.log('Note: Check your email for the OTP code');
    
    // Test verification with a dummy code (this will fail, but shows the process)
    console.log('\n2. Testing OTP verification format...');
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email: testEmail,
      token: '123456', // dummy code
      type: 'email'
    });
    
    console.log('OTP Verify Result:', { verifyData, verifyError });
    
    if (verifyError) {
      console.log('Expected error (dummy code):', verifyError.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOTPFlow();
