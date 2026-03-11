-- Create a table for rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- IP address or User ID
    endpoint TEXT NOT NULL, -- The API endpoint being accessed
    count INTEGER DEFAULT 1,
    last_request TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure efficient lookups
    UNIQUE(identifier, endpoint)
);

-- Index for expiration cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON public.rate_limits(expires_at);

-- Add comment
COMMENT ON TABLE public.rate_limits IS 'Stores rate limiting data for API endpoints.';

-- Enable RLS (though only accessible via service role usually)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access to rate_limits" 
ON public.rate_limits 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
