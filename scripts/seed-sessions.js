
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || (!supabaseKey && !supabaseServiceKey)) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

// Prefer service key for seeding to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

const sessions = [
    '2026/2027',
    '2025/2026',
    '2024/2025',
    '2023/2024',
    '2022/2023',
    '2021/2022',
    '2020/2021',
];

async function seedSessions() {
    console.log('Seeding sessions...');

    for (const session of sessions) {
        // Check existence
        const { data, error } = await supabase
            .from('hub_sessions')
            .select('name')
            .eq('name', session)
            .maybeSingle();

        if (error) {
            // If unexpected error, just log it. 
            // It could be RLS issue if using Anon key, or table doesn't exist.
            console.error(`Error checking session ${session}:`, error.message);
        }

        if (!data) {
            // Did not find it, so insert.
            // Try inserting into 'academic.academic_sessions' directly.

            // Note: The JS client might default to 'public'. 
            // We can explicitely set schema in createClient but here we just use .schema() modifier if available (it is not available on standard client builder easily per query in older versions, but widely supported now).
            // Actually .schema('academic') is a modifier on the client instance if using supabase-js v2.

            // Try inserting into 'hub_sessions' view directly.
            const { error: insertError } = await supabase
                .from('hub_sessions')
                .insert([{ name: session }]);

            if (insertError) {
                console.error(`Failed to insert ${session}:`, insertError.message);
            } else {
                console.log(`Inserted ${session}`);
            }
        } else {
            console.log(`Session ${session} already exists.`);
        }
    }

    console.log('Seeding complete.');
}

seedSessions();
