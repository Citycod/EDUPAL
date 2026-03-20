import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This Route Handler relies on the Supabase JWT containing the 'institution_id' 
// claim to properly enforce Row Level Security (RLS) on the academic schemas.
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const institution_id = searchParams.get('institution_id');
        const department_id = searchParams.get('department_id');
        const level = searchParams.get('level');

        if (!institution_id || !department_id || !level) {
            return NextResponse.json(
                { error: 'Missing required query parameters: institution_id, department_id, level' },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        
        // CRITICAL: use createServerClient (from @supabase/ssr), not createClient
        // The JWT must be attached for RLS to enforce institution isolation
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
                        } catch (error) {
                            // The `set` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                    remove(name: string, options: any) {
                        try {
                            cookieStore.set({ name, value: '', ...options })
                        } catch (error) {
                            // The `remove` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )

        // Ensure the user is actually authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        const { data, error } = await supabase
            .from('academic.curriculum_resolution_view')
            .select('*')
            .eq('institution_id', institution_id)
            .eq('department_id', department_id)
            .eq('level', parseInt(level))
            .order('course_code');

        if (error) {
            console.error("Curriculum Resolution Error:", error);
            throw error;
        }

        return NextResponse.json({ courses: data });

    } catch (error: any) {
        console.error('API /curriculum Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
