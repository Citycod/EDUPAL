import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: depts, error } = await supabase.from('departments').select('*').limit(1);
    if (error) {
        console.error('Error fetching departments:', error);
    } else {
        console.log('Got departments using public.departments format or maybe academic.departments?');
    }
}
check();
