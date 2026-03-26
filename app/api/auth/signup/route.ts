import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        // --- Rate Limiting ---
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const { success, reset } = await checkRateLimit(ip, 'auth-signup', 3, 60 * 60 * 1000); // 3 requests per hour

        if (!success) {
            return NextResponse.json(
                { error: `Too many signup attempts. Please try again after ${reset.toLocaleTimeString()}.` },
                {
                    status: 429,
                    headers: {
                        'Retry-After': Math.ceil((reset.getTime() - Date.now()) / 1000).toString()
                    }
                }
            );
        }
        // -----------------------

        const { email, password, options } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Validate Full Name
        const fullName = options?.data?.full_name?.toLowerCase().trim() || '';
        const restrictedWords = ['anonymous', 'admin', 'administrator', 'root', 'system', 'moderator', 'support', 'edupal'];
        
        const isRestricted = restrictedWords.some(word => fullName.includes(word));

        if (isRestricted) {
            return NextResponse.json(
                { error: 'Please use your real name. Names containing "Anonymous", "Admin", etc. are not permitted.' },
                { status: 400 }
            );
        }

        // Create user directly with auto-confirmed email (no verification needed)
        const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: options?.data || {}
        });

        if (createError) {
            console.error('Supabase createUser error:', createError);
            throw createError;
        }

        return NextResponse.json({
            message: 'Signup successful! You can now log in.',
            user: data.user
        });

    } catch (error: any) {
        console.error('Signup API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
