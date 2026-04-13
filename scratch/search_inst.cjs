const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xrrdwbebwabqvzoygiyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmR3YmVid2FicXZ6b3lnaXlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU5OTMyMiwiZXhwIjoyMDg2MTc1MzIyfQ.AkjKefF78OeXZtf2UluSXH92YesyXicO-Q7FmS68ydE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function search() {
    console.log("Checking total department count in system...");
    
    const { count, error } = await supabase
        .from('hub_departments')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log(`Total departments in system: ${count}`);

    const { data: insts } = await supabase
        .from('hub_institutions')
        .select('id, name')
        .ilike('name', '%Delta State%');
    
    console.log('Delta State Institutions found:', insts);

    for (const inst of insts) {
        const { count: dCount } = await supabase
            .from('hub_departments')
            .select('*', { count: 'exact', head: true })
            .eq('institution_id', inst.id);
        console.log(`Departments for ${inst.name}: ${dCount}`);
    }
}

search();
