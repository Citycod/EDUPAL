const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    console.log("Checking for invalid types in academic.ai_quizzes...");
    // Since we access via public schema view normally
    const { data, error } = await supabase
        .from('hub_ai_quizzes')
        .select('id, type')
        .not('type', 'in', '("flashcards","quiz")');
    
    if (error) {
        console.error("Query Error:", error.message);
    } else {
        console.log("Rows with non-standard types:", data);
    }
}

check();
