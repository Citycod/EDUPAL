const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCatalog() {
    console.log("Fetching program and course counts from 'public' view (bridging to catalog)...");
    
    // Fetch programs from view
    const { data: programs, error: progError } = await supabase
        .from('national_programs_view')
        .select('id, name, nuc_code');
        
    if (progError) {
        console.error("Error fetching programs from view:", progError.message);
        console.log("Trying direct access to 'catalog' schema as fallback...");
        
        const { data: programs2, error: progError2 } = await supabase
            .schema('catalog')
            .from('national_programs')
            .select('id, name, nuc_code');
            
        if (progError2) {
             console.error("Fallback failed:", progError2.message);
             return;
        }
        processPrograms(programs2);
    } else {
        processPrograms(programs);
    }
}

async function processPrograms(programs) {
    console.log(`\nFound ${programs.length} programs in catalog:`);
    
    for (const prog of programs) {
        // Try view first
        const { count, error: countError } = await supabase
            .from('national_courses_view')
            .select('*', { count: 'exact', head: true })
            .eq('program_id', prog.id);
            
        if (countError) {
            // Try schema fallback
            const { count: count2, error: countError2 } = await supabase
                .schema('catalog')
                .from('national_courses')
                .select('*', { count: 'exact', head: true })
                .eq('program_id', prog.id);
                
            if (countError2) {
                console.log(`- [${prog.nuc_code}] ${prog.name}: Error counting`);
                continue;
            }
            console.log(`- [${prog.nuc_code}] ${prog.name}: ${count2} courses`);
        } else {
            console.log(`- [${prog.nuc_code}] ${prog.name}: ${count} courses`);
        }
    }
}

checkCatalog();
