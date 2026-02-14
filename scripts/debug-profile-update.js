
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in environment.');
    process.exit(1);
}

// Admin client to manage setup
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Client to test RLS
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log('--- Starting Profile Update Debug ---');

    // 1. Create a temporary test user
    const email = `debug_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    console.log(`Creating test user: ${email}`);

    const { data: userAuth, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (createError) {
        console.error('Failed to create test user:', createError.message);
        return;
    }

    const userId = userAuth.user.id;
    console.log(`User created. ID: ${userId}`);

    // 2. Sign in to get a session (simulate frontend)
    const { data: sessionData, error: loginError } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (loginError) {
        console.error('Failed to login:', loginError.message);
        // clean up
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return;
    }

    console.log('Login successful. Testing permissions...');

    // 3. Test Storage Upload (Avatars)
    console.log('\n--- Testing Storage Upload (avatars) ---');
    try {
        const fileName = `${userId}_test.txt`;
        const fileBody = 'Hello World'; // minimal content

        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('avatars')
            .upload(fileName, fileBody, { upsert: true });

        if (uploadError) {
            console.error('FAILED: Storage Upload Error:', uploadError);
            console.error('Message:', uploadError.message);
        } else {
            console.log('SUCCESS: File uploaded.', uploadData);

            // Clean up file
            await supabaseClient.storage.from('avatars').remove([fileName]);
        }
    } catch (e) {
        console.error('EXCEPTION during storage test:', e);
    }

    // 4. Test Profile Update
    console.log('\n--- Testing Profile Update (public.profiles) ---');
    try {
        // First, ensure profile exists (it should exist if signup trigger worked, otherwise creating it manually for this test)
        // The previous signup fix might not be applied dynamically to this manual create user call unless the trigger runs.
        // Auth.admin.createUser DOES trigger the postgres trigger.

        // Check if profile exists
        const { data: profile, error: fetchError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.log('Profile not found (Trigger might have failed or row missing). Creating manually for test...');
            await supabaseAdmin.from('profiles').insert({ id: userId, email: email });
        } else {
            console.log('Profile found.');
        }

        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ full_name: 'Debug User Updated' })
            .eq('id', userId);

        if (updateError) {
            console.error('FAILED: Profile Update Error:', updateError);
            console.error('Message:', updateError.message);
        } else {
            console.log('SUCCESS: Profile updated.');
        }

    } catch (e) {
        console.error('EXCEPTION during profile update test:', e);
    }

    // Cleanup User
    console.log('\n--- Cleanup ---');
    await supabaseAdmin.auth.admin.deleteUser(userId);
    console.log('Test user deleted.');
}

main().catch(console.error);
