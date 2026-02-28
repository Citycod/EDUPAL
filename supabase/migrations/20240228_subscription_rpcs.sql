-- Because the `academic` schema is not exposed to PostgREST by default,
-- we need public wrapper functions to allow the API routes to create 
-- and update subscriptions securely.

-- 1. Create a pending subscription
CREATE OR REPLACE FUNCTION public.create_pending_subscription(
  p_user_id uuid,
  p_plan_id uuid,
  p_amount integer
)
RETURNS uuid AS $$
DECLARE
  v_sub_id uuid;
BEGIN
  -- We already checked plan price in the edge function, but just to be safe
  
  INSERT INTO academic.user_subscriptions (
    user_id, plan_id, status, amount_paid
  ) VALUES (
    p_user_id, p_plan_id, 'pending', p_amount
  ) RETURNING id INTO v_sub_id;

  RETURN v_sub_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Activate a subscription (called by Paystack Webhook)
CREATE OR REPLACE FUNCTION public.activate_subscription(
  p_sub_id uuid,
  p_reference text,
  p_channel text,
  p_expires_at timestamptz
)
RETURNS void AS $$
BEGIN
  UPDATE academic.user_subscriptions
  SET 
    status = 'active',
    payment_reference = p_reference,
    payment_channel = p_channel,
    starts_at = now(),
    expires_at = p_expires_at,
    updated_at = now()
  WHERE id = p_sub_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to service role and authenticated users
GRANT EXECUTE ON FUNCTION public.create_pending_subscription(uuid, uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.activate_subscription(uuid, text, text, timestamptz) TO service_role;
