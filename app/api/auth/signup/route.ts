import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { email, password, options } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // 1. Create user and generate verification link using Supabase Admin
        const { data, error: createError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'signup',
            email,
            password,
            options: {
                data: options?.data || {}
            }
        });

        if (createError) {
            console.error('Supabase generateLink error:', createError);
            throw createError;
        }

        const { user, properties } = data;
        const verificationLink = properties?.action_link;

        if (!verificationLink) {
            throw new Error('Failed to generate verification link');
        }

        // 2. Send Email using Gmail
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const fullName = options?.data?.full_name || 'Student';

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Verify Your EduPal Account',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Welcome to EduPal!</h2>
                    <p>Hello ${fullName},</p>
                    <p>Thank you for signing up for EduPal. Please click the button below to verify your email address:</p>
                    <a href="${verificationLink}" 
                       style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                       Verify Email
                    </a>
                    <p style="margin-top: 20px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
                    <p style="margin-top: 10px; font-size: 12px; color: #999;">Link: ${verificationLink}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            message: 'Signup successful and verification email sent',
            user
        });

    } catch (error: any) {
        console.error('Signup API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
