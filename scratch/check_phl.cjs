const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xrrdwbebwabqvzoygiyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmR3YmVid2FicXZ6b3lnaXlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU5OTMyMiwiZXhwIjoyMDg2MTc1MzIyfQ.AkjKefF78OeXZtf2UluSXH92YesyXicO-Q7FmS68ydE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking for 'Philosophy' in catalog.national_programs...");
    
    // Try view first
    const { data: programs, error } = await supabase
        .from('national_programs_view')
        .select('name, nuc_code')
        .ilike('name', '%Philosophy%');

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Results:', programs);
    }
}

check();
