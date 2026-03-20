import { createClient } from '@supabase/supabase-js';

// We use the service_role key here because this is intended to be called from a secure 
// backend context (e.g. Route Handler or Server Action) where we need to bypass 
// RLS to perform the specific resolution mapping if required, or strictly with SSR client in other contexts.
// HOWEVER: The engineering spec (Section 2.2) explicitly mentions using `createServerClient`
// for Route Handlers to ensure RLS is enforced based on the student's JWT.
// This file acts as a typed helper.

export async function resolveStudentCurriculum(
    supabase: any, // Pass the createServerClient instance
    student: {
        institution_id: string;
        department_id: string;
        level: number;
    }
): Promise<{ courses: any[]; source: 'catalog' | 'custom' | 'mixed' }> {

    const { data, error } = await supabase
        .from('curriculum_resolution_view') // academic schema
        .select('*')
        .eq('institution_id', student.institution_id)
        .eq('department_id', student.department_id)
        .eq('level', student.level)
        .order('course_code');

    if (error) {
        throw new Error(`Curriculum resolution failed: ${error.message}`);
    }

    const hasNational = data?.some((c: any) => !c.is_custom);
    const hasCustom = data?.some((c: any) => c.is_custom);
    
    let source: 'catalog' | 'custom' | 'mixed' = 'custom';
    if (hasNational && hasCustom) {
        source = 'mixed';
    } else if (hasNational) {
        source = 'catalog';
    }

    return { courses: data ?? [], source };
}
