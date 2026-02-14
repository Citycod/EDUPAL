
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Manual env loading for simplicity in this script
// You might need to update these values if they are not picked up from process.env when running with node --env-file
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

console.log('Testing Supabase Admin...');
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials');
} else {
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
        const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
        if (error) {
            console.error('Supabase Admin Error:', error.message);
        } else {
            console.log('Supabase Admin Connection: SUCCESS');

            // Test generateLink
            const testEmail = `test_${Date.now()}@example.com`;
            console.log(`Testing generateLink for ${testEmail}...`);
            const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
                type: 'signup',
                email: testEmail,
                password: 'testpassword123',
            });

            if (linkError) {
                console.error('generateLink Error:', linkError.message);
            } else {
                console.log('generateLink: SUCCESS');
                console.log('Action Link:', linkData.properties?.action_link);
                if (!linkData.properties?.action_link) {
                    console.error('WARNING: No action_link returned!');
                }
            }
        }
    } catch (e) {
        console.error('Supabase Admin Exception:', e.message);
    }
}

console.log('Testing Nodemailer...');
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP credentials');
} else {
    try {
        // Handle spaces in password if present
        const cleanPass = SMTP_PASS.replace(/\s/g, '');

        // Try with original pass first to see if that's the issue, or just clean it.
        // The user has spaces in .env, verify if that's valid for nodemailer.
        // Usually App Passwords are 16 chars, spaces are for readability.

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: SMTP_PORT === '465',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS, // Try as is first
            },
        });

        await transporter.verify();
        console.log('Nodemailer Connection (Original Pass): SUCCESS');
    } catch (e) {
        console.error('Nodemailer Connection (Original Pass) FAILED:', e.message);

        // Try with cleaned password
        try {
            const cleanPass = SMTP_PASS.replace(/\s/g, '');
            const transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: Number(SMTP_PORT) || 587,
                secure: SMTP_PORT === '465',
                auth: {
                    user: SMTP_USER,
                    pass: cleanPass,
                },
            });
            await transporter.verify();
            console.log('Nodemailer Connection (Cleaned Pass): SUCCESS');
        } catch (e2) {
            console.error('Nodemailer Connection (Cleaned Pass) FAILED:', e2.message);
        }
    }
}
