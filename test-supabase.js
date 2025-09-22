// Test Supabase Connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://erxpdqoftkleyhtxyacs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeHBkcW9mdGtsZXlodHh5YWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MzUwNjIsImV4cCI6MjA3NDAxMTA2Mn0.88kr8qteHKs5XF1ugyGsNa3HXD1T8Gr-RQhtcWjAf9c'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('Connection test failed:', error)
    } else {
      console.log('✅ Supabase connection successful!')
    }
    
    // Test auth
    console.log('Testing auth...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Auth test failed:', authError)
    } else {
      console.log('✅ Auth service working!')
    }
    
  } catch (err) {
    console.error('Test failed:', err)
  }
}

testConnection()
