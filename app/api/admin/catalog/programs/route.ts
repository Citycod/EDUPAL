import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET: List all NUC programs (for dropdown selection in admin UI)
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('national_programs_view')
            .select('id, name, nuc_code')
            .order('name');

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
