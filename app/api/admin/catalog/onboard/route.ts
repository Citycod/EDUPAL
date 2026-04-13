import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET: List all active department→program mappings across all institutions
export async function GET() {
    try {
        // Fetch all mappings with joined institution, department, and program names
        const { data, error } = await supabaseAdmin
            .schema('academic')
            .from('department_program_map')
            .select(`
                id,
                effective_from,
                institutions:institution_id (id, name),
                departments:department_id (id, name),
                national_programs:catalog_program_id (id, name, nuc_code)
            `)
            .order('effective_from', { ascending: false });

        if (error) throw error;

        // Flatten the join objects for easier frontend consumption
        const mappings = (data || []).map((m: any) => ({
            id: m.id,
            effective_from: m.effective_from,
            institution_id: m.institutions?.id,
            institution_name: m.institutions?.name,
            department_id: m.departments?.id,
            department_name: m.departments?.name,
            program_id: m.national_programs?.id,
            program_name: m.national_programs?.name,
            program_nuc_code: m.national_programs?.nuc_code,
        }));

        return NextResponse.json(mappings);
    } catch (error: any) {
        console.error('GET /admin/catalog/onboard error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Onboard a university — creates institution (if new), department, and program mapping
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            institution_id,          // Existing institution UUID (optional if institution_name is provided)
            institution_name,        // New institution name (optional if institution_id is provided)
            institution_location,    // Location string (optional)
            department_name,         // Department name (required)
            program_id,              // Catalog program UUID to map to (required)
        } = body;

        if (!department_name || !program_id) {
            return NextResponse.json(
                { error: 'department_name and program_id are required' },
                { status: 400 }
            );
        }

        if (!institution_id && !institution_name) {
            return NextResponse.json(
                { error: 'Either institution_id or institution_name is required' },
                { status: 400 }
            );
        }

        // Step 1: Resolve or create institution
        let resolvedInstitutionId = institution_id;

        if (!resolvedInstitutionId && institution_name) {
            // Try to find existing first
            const { data: existing } = await supabaseAdmin
                .from('hub_institutions')
                .select('id')
                .eq('name', institution_name.trim())
                .maybeSingle();

            if (existing) {
                resolvedInstitutionId = existing.id;
            } else {
                // Create new institution
                const { data: newInst, error: instError } = await supabaseAdmin
                    .schema('academic')
                    .from('institutions')
                    .insert({
                        name: institution_name.trim(),
                        location: institution_location?.trim() || null,
                    })
                    .select('id')
                    .single();

                if (instError) throw new Error(`Institution creation failed: ${instError.message}`);
                resolvedInstitutionId = newInst.id;
            }
        }

        // Step 2: Create or resolve department
        const { data: existingDept } = await supabaseAdmin
            .schema('academic')
            .from('departments')
            .select('id')
            .eq('name', department_name.trim())
            .eq('institution_id', resolvedInstitutionId)
            .maybeSingle();

        let resolvedDeptId: string;

        if (existingDept) {
            resolvedDeptId = existingDept.id;
        } else {
            const { data: newDept, error: deptError } = await supabaseAdmin
                .schema('academic')
                .from('departments')
                .insert({
                    name: department_name.trim(),
                    institution_id: resolvedInstitutionId,
                })
                .select('id')
                .single();

            if (deptError) throw new Error(`Department creation failed: ${deptError.message}`);
            resolvedDeptId = newDept.id;
        }

        // Step 3: Create the program mapping
        const { data: mapping, error: mapError } = await supabaseAdmin
            .schema('academic')
            .from('department_program_map')
            .upsert(
                {
                    institution_id: resolvedInstitutionId,
                    department_id: resolvedDeptId,
                    catalog_program_id: program_id,
                },
                { onConflict: 'institution_id,department_id' }
            )
            .select()
            .single();

        if (mapError) throw new Error(`Program mapping failed: ${mapError.message}`);

        return NextResponse.json({
            success: true,
            mapping,
            institution_id: resolvedInstitutionId,
            department_id: resolvedDeptId,
        });
    } catch (error: any) {
        console.error('POST /admin/catalog/onboard error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove a department→program mapping
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const mappingId = searchParams.get('id');

        if (!mappingId) {
            return NextResponse.json({ error: 'Mapping id is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .schema('academic')
            .from('department_program_map')
            .delete()
            .eq('id', mappingId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
