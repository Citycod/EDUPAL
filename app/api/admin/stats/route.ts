import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // Fetch global stats
        const { count: userCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
        const { count: instCount } = await supabaseAdmin.from('academic.institutions').select('*', { count: 'exact', head: true });
        const { count: resourceCount } = await supabaseAdmin.from('academic.resources').select('*', { count: 'exact', head: true });

        // Fetch recent activity (last 5 reports)
        const { data: recentReports } = await supabaseAdmin
            .from('hub_reports_view')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        return NextResponse.json({
            stats: {
                totalUsers: userCount || 0,
                totalInstitutions: instCount || 0,
                totalResources: resourceCount || 0,
            },
            recentReports: recentReports || []
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
