const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
    // Try to select the column to see if it exists
    const { data, error } = await supabase
        .from('hub_study_roadmaps')
        .select('last_notified_date')
        .limit(1);
    
    if (error) {
        console.log("Column 'last_notified_date' check result:", error.message);
    } else {
        console.log("Column 'last_notified_date' exists.");
    }

    const { data: cols, error: colErr } = await supabase.rpc('get_table_columns', { table_name: 'study_roadmaps' });
    if (colErr) console.log("RPC Error (get_table_columns might not exist):", colErr.message);
    else console.log("Columns:", cols);
}

checkColumns();
