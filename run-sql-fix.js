const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://erxpdqoftkleyhtxyacs.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeHBkcW9mdGtsZXlodHh5YWNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQzNTA2MiwiZXhwIjoyMDc0MDExMDYyfQ.JohAkiXBB_E20Z8-Vsk2TrQZqWGrx-7rtB4Ze-_qDCY'
);

async function runSQLFix() {
  try {
    console.log('🔧 Running SQL constraint fix...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('./fix-constraints.sql', 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message);
      }
    }
    
    console.log('🎉 SQL fix completed!');
    
  } catch (error) {
    console.error('❌ Failed to run SQL fix:', error.message);
  }
}

runSQLFix();
