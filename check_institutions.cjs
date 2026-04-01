const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInstitutions() {
    console.log("Fetching existing institutions from 'academic.institutions'...");
    
    const { data: data2, error: error2 } = await supabase
        .schema('academic')
        .from('institutions')
        .select('name, location')
        .order('name');
        
    if (error2) {
        console.error("Error fetching (academic schema):", error2.message);
        return;
    }
    
    printData(data2);
}

function printData(data) {
    if (!data || data.length === 0) {
        console.log("No institutions found in the database. It is completely empty!");
    } else {
        console.log(`\nFound ${data.length} institutions currently installed in EduPal:`);
        data.forEach((inst, index) => {
            console.log(`${index + 1}. ${inst.name}`);
        });
    }
}

checkInstitutions();
