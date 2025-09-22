const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://erxpdqoftkleyhtxyacs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeHBkcW9mdGtsZXlodHh5YWNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQzNTA2MiwiZXhwIjoyMDc0MDExMDYyfQ.JohAkiXBB_E20Z8-Vsk2TrQZqWGrx-7rtB4Ze-_qDCY'
);

async function createResumeStorage() {
  try {
    console.log('🚀 Creating resume storage bucket...');

    // Create the bucket
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('resumes', {
      public: true,
      allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (bucketError) {
      console.error('❌ Error creating bucket:', bucketError.message);
      if (bucketError.message.includes('already exists')) {
        console.log('ℹ️  Resume bucket already exists, skipping...');
      } else {
        return;
      }
    } else {
      console.log('✅ Resume storage bucket created successfully!');
    }

    // Create storage policies
    console.log('🔧 Setting up storage policies...');

    // Policy to allow users to upload their own resumes
    const { error: insertPolicyError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE POLICY "Users can upload their own resumes" ON storage.objects
        FOR INSERT WITH CHECK (
          bucket_id = 'resumes'
          AND auth.role() = 'authenticated'
          AND (string_to_array(name, '/'))[1] = auth.uid()::text
        );
      `
    });

    if (insertPolicyError) {
      console.error('❌ Error creating insert policy:', insertPolicyError.message);
    } else {
      console.log('✅ Upload policy created!');
    }

    // Policy to allow users to view all resumes (for now)
    const { error: selectPolicyError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE POLICY "Anyone can view resumes" ON storage.objects
        FOR SELECT USING (bucket_id = 'resumes');
      `
    });

    if (selectPolicyError) {
      console.error('❌ Error creating select policy:', selectPolicyError.message);
    } else {
      console.log('✅ View policy created!');
    }

    console.log('🎉 Resume storage setup completed!');
    console.log('📁 Files will be stored in: /resumes/{user_id}/filename.pdf');
    console.log('🔗 Public URLs will be: https://erxpdqoftkleyhtxyacs.supabase.co/storage/v1/object/public/resumes/...');

  } catch (error) {
    console.error('❌ Failed to setup resume storage:', error.message);
  }
}

createResumeStorage();
