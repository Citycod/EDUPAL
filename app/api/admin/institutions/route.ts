import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // Fetch institutions with student counts
        const { data, error } = await supabaseAdmin
            .from('hub_institutions')
            .select(`
                *,
                profiles:profiles(count)
            `);

        if (error) throw error;

        // For each institution, fetch the resource count separately
        const institutions = await Promise.all(
            data.map(async (inst: any) => {
                const { count: resourceCount, error: resErr } = await supabaseAdmin
                    .schema('academic')
                    .from('resources')
                    .select('*', { count: 'exact', head: true })
                    .eq('institution_id', inst.id);

                if (resErr) {
                    console.error(`Error fetching resources for inst ${inst.id}:`, resErr);
                }

                return {
                    ...inst,
                    student_count: inst.profiles?.[0]?.count ?? 0,
                    resource_count: resourceCount ?? 0,
                };
            })
        );

        return NextResponse.json(institutions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, location, logo_url } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Institution name is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('academic.institutions')
            .insert({ name, location, logo_url })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
