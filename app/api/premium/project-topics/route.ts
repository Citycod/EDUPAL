import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { checkRateLimit } from '@/lib/rate-limit';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

let ai: GoogleGenAI | null = null;
const initAI = () => {
    if (!ai && process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
};

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting (10 requests per hour for project topics)
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const { success, reset } = await checkRateLimit(ip, 'project-topics', 10, 60 * 60 * 1000);

        if (!success) {
            return NextResponse.json(
                { error: `Topic generation limit exceeded. Try again after ${reset.toLocaleTimeString()}.` },
                { status: 429, headers: { 'Retry-After': Math.ceil((reset.getTime() - Date.now()) / 1000).toString() } }
            );
        }

        const { userId, interest } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // 2. Fetch User Profile & Subscription Status
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('hub_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        // 3. Subscription Check
        const { data: subscriptions } = await supabaseAdmin
            .from('hub_subscriptions')
            .select('status, plan_name, expires_at')
            .eq('user_id', userId)
            .eq('status', 'active');

        const hasPremium = subscriptions?.some((sub: any) =>
            sub.plan_name === 'Premium' || sub.plan_name === 'Pro'
        );

        if (!hasPremium) {
            return NextResponse.json({
                error: 'This is a premium feature. Please upgrade to Pro to generate project topics.'
            }, { status: 402 });
        }

        // 4. Level Check (Strictly 400/500 level)
        const level = String(profile.level || profile.year || '').toUpperCase();
        const isEligibleLevel = level.includes('400') || level.includes('500') || level.includes('FINAL') || level.includes('4') || level.includes('5');

        if (!isEligibleLevel) {
            return NextResponse.json({
                error: 'Project topic generation is exclusively for 400L and 500L (Final Year) students.'
            }, { status: 403 });
        }

        const aiClient = initAI();
        if (!aiClient) {
            return NextResponse.json({ error: 'AI service configuration missing' }, { status: 503 });
        }

        // 5. Generate Topics with Gemini
        const department = profile.department_name || profile.major || 'General Studies';
        const interestContext = interest ? `The student is particularly interested in: ${interest}.` : '';

        const systemPrompt = `
You are an elite Academic Research Advisor specializing in helping final year students find world-class research topics.
The student is in their final year (Level ${level}) studying ${department}.
${interestContext}

YOUR MISSION:
Generate 10 unique, high-quality, and researchable project topics.
For each topic, provide:
1. The Topic Title.
2. A brief background description (Why is this important?).
3. A suggested methodology (e.g., Qualitative, Quantitative, Experimental, Case Study).

FORMATTING RULES:
- You MUST return ONLY a raw JSON array.
- DO NOT wrap the JSON in markdown code blocks.
- The structure must be:
[
  {
    "title": "Topic Name",
    "description": "2-3 sentences explaining the topic significance.",
    "methodology": "Brief methodology suggestion."
  },
  ...
]
`;

        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
            config: {
                temperature: 0.7,
            }
        });

        let text = response.text;

        if (!text) {
            return NextResponse.json({ error: 'AI failed to generate a response. Please try again.' }, { status: 500 });
        }

        // Clean up markdown markers if present
        if (text.startsWith('```json')) {
            text = text.replace(/```json\n?/, '').replace(/```\n?$/, '');
        }

        try {
            const topics = JSON.parse(text.trim());
            return NextResponse.json({ topics });
        } catch (parseError) {
            console.error('AI JSON Parse Error:', text);
            return NextResponse.json({ error: 'AI generated an invalid format. Please try again.' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Project Topics API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
