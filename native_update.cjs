const https = require('https');

const data = JSON.stringify({
    features: [
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
    ]
});

const options = {
    hostname: 'xrrdwbebwabqvzoygiyk.supabase.co',
    port: 443,
    path: '/rest/v1/subscription_plans?name=eq.Premium',
    method: 'PATCH',
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmR3YmVid2FicXZ6b3lnaXlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU5OTMyMiwiZXhwIjoyMDg2MTc1MzIyfQ.AkjKefF78OeXZtf2UluSXH92YesyXicO-Q7FmS68ydE',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycmR3YmVid2FicXZ6b3lnaXlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU5OTMyMiwiZXhwIjoyMDg2MTc1MzIyfQ.AkjKefF78OeXZtf2UluSXH92YesyXicO-Q7FmS68ydE',
        'Content-Type': 'application/json',
        'Accept-Profile': 'academic',
        'Content-Profile': 'academic',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
