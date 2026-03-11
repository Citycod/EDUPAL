import { supabaseAdmin } from './supabase-admin';

export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number; reset: Date }> {
  const now = new Date();
  const windowInSeconds = windowMs / 1000;

  try {
    // 1. Fetch existing rate limit record
    const { data, error } = await supabaseAdmin
      .from('rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Rate limit fetch error:', error);
      // Fail open if database is down? Or fail closed? 
      // Let's fail open but log it.
      return { success: true, remaining: limit, reset: now };
    }

    if (!data) {
      // 2. No record exists, create one
      const expiresAt = new Date(now.getTime() + windowMs);
      await supabaseAdmin.from('rate_limits').insert({
        identifier,
        endpoint,
        count: 1,
        expires_at: expiresAt.toISOString(),
      });

      return { success: true, remaining: limit - 1, reset: expiresAt };
    }

    const expiresAt = new Date(data.expires_at);

    if (now > expiresAt) {
      // 3. Current window expired, reset it
      const newExpiresAt = new Date(now.getTime() + windowMs);
      await supabaseAdmin
        .from('rate_limits')
        .update({
          count: 1,
          expires_at: newExpiresAt.toISOString(),
          last_request: now.toISOString(),
        })
        .eq('id', data.id);

      return { success: true, remaining: limit - 1, reset: newExpiresAt };
    }

    if (data.count >= limit) {
      // 4. Limit exceeded
      return { success: false, remaining: 0, reset: expiresAt };
    }

    // 5. Within window and limit, increment count
    await supabaseAdmin
      .from('rate_limits')
      .update({
        count: data.count + 1,
        last_request: now.toISOString(),
      })
      .eq('id', data.id);

    return { success: true, remaining: limit - (data.count + 1), reset: expiresAt };
  } catch (err) {
    console.error('checkRateLimit Exception:', err);
    return { success: true, remaining: limit, reset: now };
  }
}
