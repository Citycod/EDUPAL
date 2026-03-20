import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const REDIS_URL    = Deno.env.get('REDIS_URL')!
const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

const LEVEL_DEPTH: Record<number, string> = {
  100: 'Explain using simple analogies and everyday Nigerian examples. Avoid heavy jargon.',
  200: 'Explain clearly with examples. Introduce technical terms but define them.',
  300: 'Use technical depth. Include exam-relevant distinctions and edge cases.',
  400: 'Frame at research level. Connect to adjacent topics and real-world applications.',
  500: 'Graduate-level depth. Discuss open problems, trade-offs, and current practice.',
}

async function getCached(key: string): Promise<string | null> {
  if (!REDIS_URL) return null;
  try {
    const res = await fetch(`${REDIS_URL}/get/${key}`)
    if (!res.ok) return null;
    const data = await res.json()
    return data.result ?? null
  } catch (e) {
    console.warn("Redis GET error:", e);
    return null;
  }
}

async function setCached(key: string, value: string): Promise<void> {
  if (!REDIS_URL) return;
  try {
    await fetch(`${REDIS_URL}/set/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, ex: 60 * 60 * 24 * 7 }) // 7 day TTL
    })
  } catch (e) {
    console.warn("Redis SET error:", e);
  }
}

function buildCacheKey(topicId: string, objectives: string[], isGlobal: boolean, institutionId?: string, level?: number): string {
  // Hash objectives to auto-invalidate if NUC updates the standard
  const objHash = btoa(objectives.join('|')).slice(0, 12)
  if (isGlobal) {
    return `ccmas:${topicId}:notes:global:${objHash}`
  }
  return `ccmas:${topicId}:notes:${institutionId}:${level}:${objHash}`
}

serve(async (req) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      topic_id,
      catalog_course_id,
      institution_id,
      department,
      university_name,
      level,
      mode = 'explain'  // 'explain' | 'summarize' | 'quiz'
    } = await req.json()

    if (!topic_id) {
       return new Response(JSON.stringify({ error: 'topic_id is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch topic from catalog
    const { data: topic } = await supabase
      .from('catalog.national_topics')
      .select('topic_name, learning_objectives, course_id')
      .eq('id', topic_id)
      .single()

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const isGlobal = mode === 'summarize' // summaries are institution-agnostic
    const cacheKey = buildCacheKey(
      topic_id,
      topic.learning_objectives ?? [],
      isGlobal,
      institution_id,
      level
    )

    // Check cache
    const cached = await getCached(cacheKey)
    if (cached) {
      return new Response(JSON.stringify({ content: cached, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-cached': 'true' }
      })
    }

    if (!ANTHROPIC_KEY) {
      throw new Error("Missing ANTHROPIC_API_KEY environment variable");
    }

    // Build prompt
    const depthInstruction = LEVEL_DEPTH[level] ?? LEVEL_DEPTH[300]
    const objectivesText = (topic.learning_objectives ?? []).map((o: string, i: number) => `${i + 1}. ${o}`).join('\n')

    const systemPrompt = isGlobal
      ? `You are an expert Nigerian university academic coach. Your content must align exactly with NUC CCMAS standards. Use clear, structured explanations. ${depthInstruction}`
      : `You are an AI Academic Coach for a ${level}-level student at ${university_name || 'a Nigerian University'} in the ${department || 'their'} department. Your content must align with the NUC CCMAS standard. Use local Nigerian examples where applicable. ${depthInstruction}`

    const modeInstructions: Record<string, string> = {
      explain:   `Explain the topic "${topic.topic_name}" thoroughly, covering all the learning objectives below. Format the output in clean, readable Markdown.`,
      summarize: `Provide a concise but complete summary of "${topic.topic_name}" covering the key points a student must know. Format the output in Markdown using bullet points and headers.`,
      quiz:      `Generate 5 exam-style questions (mix of MCQ and short answer) on "${topic.topic_name}" based on the objectives below. Include answers at the end of the document. Format the output in Markdown.`
    }

    const userPrompt = `${modeInstructions[mode] || modeInstructions['explain']}

Learning objectives (NUC CCMAS standard):
${objectivesText}`

    // Call Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620', // Standard model for code/text gen
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    })

    if (!response.ok) {
       const text = await response.text();
       console.error("Anthropic error:", text);
       throw new Error(`Anthropic API failed: ${response.status}`);
    }

    const result = await response.json()
    const content = result.content?.[0]?.text ?? ''

    // Cache and return
    await setCached(cacheKey, content)

    return new Response(JSON.stringify({ content, cached: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error("Hydrate function error:", error);
     return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
})
