// Database verification script
// Run this with: node scripts/verify-database.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyDatabase() {
  console.log('🔍 Verifying database structure...\n')

  // Check if profiles table exists and has correct structure
  try {
    console.log('1. Testing profiles table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message)
      
      // Try to create profiles table if it doesn't exist
      if (profilesError.message.includes('relation "public.profiles" does not exist')) {
        console.log('🔧 Creating profiles table...')
        
        const { error: createError } = await supabase.rpc('exec', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.profiles (
              id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
              full_name TEXT,
              phone TEXT,
              date_of_birth DATE,
              gender TEXT,
              father_name TEXT,
              address_line1 TEXT,
              address_line2 TEXT,
              city TEXT,
              state TEXT,
              pincode TEXT,
              education_level TEXT,
              institution_name TEXT,
              course_name TEXT,
              year_of_passing INTEGER,
              bank_name TEXT,
              account_number TEXT,
              ifsc_code TEXT,
              account_holder_name TEXT,
              skills TEXT[],
              languages TEXT[],
              profile_completed BOOLEAN DEFAULT FALSE,
              profile_step INTEGER DEFAULT 1,
              role TEXT DEFAULT 'student',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Enable RLS
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
            
            -- Create policies
            CREATE POLICY "Users can view own profile" ON public.profiles
              FOR SELECT USING (auth.uid() = id);
            
            CREATE POLICY "Users can update own profile" ON public.profiles
              FOR UPDATE USING (auth.uid() = id);
            
            CREATE POLICY "Users can insert own profile" ON public.profiles
              FOR INSERT WITH CHECK (auth.uid() = id);
          `
        })
        
        if (createError) {
          console.error('❌ Failed to create profiles table:', createError.message)
        } else {
          console.log('✅ Profiles table created successfully')
        }
      }
    } else {
      console.log('✅ Profiles table exists and accessible')
      console.log(`   Found ${profiles?.length || 0} sample records`)
    }

    // Check documents table
    console.log('\n2. Testing documents table...')
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('*')
      .limit(1)

    if (documentsError) {
      console.error('❌ Documents table error:', documentsError.message)
      
      if (documentsError.message.includes('relation "public.documents" does not exist')) {
        console.log('🔧 Creating documents table...')
        
        const { error: createDocsError } = await supabase.rpc('exec', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.documents (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES auth.users ON DELETE CASCADE,
              type TEXT NOT NULL,
              name TEXT NOT NULL,
              file_path TEXT,
              verification_status TEXT DEFAULT 'pending',
              verified_by UUID REFERENCES auth.users,
              verified_at TIMESTAMP WITH TIME ZONE,
              rejection_reason TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Users can view own documents" ON public.documents
              FOR SELECT USING (auth.uid() = user_id);
            
            CREATE POLICY "Users can insert own documents" ON public.documents
              FOR INSERT WITH CHECK (auth.uid() = user_id);
          `
        })
        
        if (createDocsError) {
          console.error('❌ Failed to create documents table:', createDocsError.message)
        } else {
          console.log('✅ Documents table created successfully')
        }
      }
    } else {
      console.log('✅ Documents table exists and accessible')
    }

    // Check grievances table
    console.log('\n3. Testing grievances table...')
    const { data: grievances, error: grievancesError } = await supabase
      .from('grievances')
      .select('*')
      .limit(1)

    if (grievancesError) {
      console.error('❌ Grievances table error:', grievancesError.message)
      
      if (grievancesError.message.includes('relation "public.grievances" does not exist')) {
        console.log('🔧 Creating grievances table...')
        
        const { error: createGrievancesError } = await supabase.rpc('exec', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.grievances (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES auth.users ON DELETE CASCADE,
              subject TEXT NOT NULL,
              description TEXT NOT NULL,
              category TEXT DEFAULT 'other',
              status TEXT DEFAULT 'open',
              priority TEXT DEFAULT 'medium',
              assigned_to UUID REFERENCES auth.users,
              resolution TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Users can view own grievances" ON public.grievances
              FOR SELECT USING (auth.uid() = user_id);
            
            CREATE POLICY "Users can insert own grievances" ON public.grievances
              FOR INSERT WITH CHECK (auth.uid() = user_id);
          `
        })
        
        if (createGrievancesError) {
          console.error('❌ Failed to create grievances table:', createGrievancesError.message)
        } else {
          console.log('✅ Grievances table created successfully')
        }
      }
    } else {
      console.log('✅ Grievances table exists and accessible')
    }

    console.log('\n🎉 Database verification completed!')
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message)
  }
}

verifyDatabase()
