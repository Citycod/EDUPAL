const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    console.log("Checking hub_ai_quizzes table...");
    const { data, error } = await supabase
        .from('hub_ai_quizzes')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error("Query Error:", error.message);
        if (error.message.includes("column")) {
             console.log("RESULT: COLUMNS MISSING");
        }
    } else {
        console.log("Query Success. Data:", data);
        const columns = Object.keys(data[0] || {});
        console.log("Columns found:", columns);
        if (columns.includes('catalog_course_code')) {
            console.log("RESULT: COLUMNS EXIST");
        } else {
            console.log("RESULT: COLUMNS MISSING");
        }
    }
}

check();
