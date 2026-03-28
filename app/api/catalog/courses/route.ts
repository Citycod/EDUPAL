import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const programCode = searchParams.get('programCode'); // e.g., 'CSC'
        const departmentId = searchParams.get('departmentId'); 
        const level = searchParams.get('level'); // e.g., '200'

        const cookieStore = await cookies();
        let finalProgramCode = programCode;

        // If departmentId is provided and no programCode, lookup the NUC code
        if (departmentId && departmentId !== 'all' && departmentId !== '' && !finalProgramCode) {
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            
            // First, see if the department name starts with NCE_
            const { data: rawDept } = await supabaseAdmin
                .from('academic.departments')
                .select('name')
                .eq('id', departmentId)
                .maybeSingle();

            if (rawDept?.name?.startsWith('NCE_')) {
                finalProgramCode = rawDept.name;
            } else {
                // 1. Get the catalog program ID from the mapping table
                const { data: mapData } = await supabaseAdmin
                    .from('academic.department_program_map')
                    .select('catalog_program_id')
                    .eq('department_id', departmentId)
                    .maybeSingle();

            if (mapData?.catalog_program_id) {
                // 2. Get the NUC code from the catalog program view
                const { data: programData } = await supabaseAdmin
                    .from('national_programs_view')
                    .select('nuc_code')
                    .eq('id', mapData.catalog_program_id)
                    .maybeSingle();
                
                if (programData) {
                    finalProgramCode = programData.nuc_code;
                } else {
                    // Mapped to a non-existent explicit program, return empty
                    return NextResponse.json({ courses: [] });
                }
            } else {
                // Selected a specific department, but NO mapping exists in the curriculum database.
                // Do NOT fall through and return all courses. Return empty array instead.
                return NextResponse.json({ courses: [] });
            }
                }
            }
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: any) {
                        try {
                            cookieStore.set({ name, value, ...options })
                        } catch (error) {}
                    },
                    remove(name: string, options: any) {
                        try {
                            cookieStore.set({ name, value: '', ...options })
                        } catch (error) {}
                    },
                },
            }
        )

        // Priority 1: Check Authorization header (more robust for client fetch)
        const authHeader = req.headers.get('Authorization');
        let user: any = null;

        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user: headerUser } } = await supabase.auth.getUser(token);
            user = headerUser;
        }

        // Priority 2: Fallback to cookies
        if (!user) {
            const { data: { user: cookieUser } } = await supabase.auth.getUser();
            user = cookieUser;
        }
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Use supabaseAdmin (with Service Role Key) to fetch from the views in the public schema
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let query = supabaseAdmin
            .from('national_courses_view')
            .select(`
                *,
                national_programs_view!inner (nuc_code),
                national_topics_view (topic_name, learning_objectives)
            `);

        if (finalProgramCode) {
            query = query.eq('national_programs_view.nuc_code', finalProgramCode);
        }

        // Optional Level Filter
        if (level && level !== 'all' && level !== '') {
            query = query.eq('level', parseInt(level));
        }

        // Optional Type filter to prevent NCE from showing up in degree catalog if no finalProgramCode
        const typeFilter = searchParams.get('type');
        if (typeFilter === 'degree') {
            query = query.not('national_programs_view.nuc_code', 'like', 'NCE_%');
        } else if (typeFilter === 'nce') {
            query = query.like('national_programs_view.nuc_code', 'NCE_%');
        }

        // Add sorting for consistent results
        query = query
            .order('level', { ascending: true })
            .order('course_code_standard', { ascending: true })
            .order('title_standard', { ascending: true });

        const { data, error } = await query;

        if (error) {
            console.error("Catalog Fetch Error:", error);
            return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
        }

        // Map the results from views back to the cleaner property names 
        // because the select returns 'national_topics_view' instead of 'national_topics'
        const courses = (data || []).map((c: any) => ({
            ...c,
            national_programs: c.national_programs_view,
            national_topics: c.national_topics_view
        }));

        return NextResponse.json({ courses });

    } catch (error: any) {
        console.error('API /catalog/courses Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
