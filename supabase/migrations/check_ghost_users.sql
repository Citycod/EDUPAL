-- CHECK GHOST USERS
-- This script checks the internal 'auth.users' table which is where Supabase stores actual accounts.
-- You likely deleted the 'profile' but the account still exists in the 'auth' schema.

-- 1. Check for a specific email (replace with the email you are testing)
SELECT id, email, created_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'TEST_EMAIL_HERE'; 

-- 2. List recent users in auth schema
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
