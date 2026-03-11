import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updatePlans() {
    console.log('Starting plan update...');
    const features = [
        'browse_library',
        'upload_materials',
        'community',
        'profile',
        'notifications',
        'download_files',
        'ai_study_tools',
        'document_chat',
        'project_topics',
        'leaderboard',
        'advanced_search',
        'priority_notifications',
        'study_analytics'
    ];

    const { data, error, status } = await supabase
        .from('hub_subscription_plans')
        .update({ features })
        .eq('name', 'Premium');

    if (error) {
        console.error('Error updating plans:', error);
        process.exit(1);
    } else {
        console.log('Successfully updated Premium plan features. Status:', status);
        process.exit(0);
    }
}

updatePlans();
