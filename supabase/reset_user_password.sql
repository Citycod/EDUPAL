-- Run this in the Supabase SQL Editor to manually change a user's password
-- REPLACE 'targetuser@example.com' with the user's actual email
-- REPLACE 'newpassword123' with the desired new password 

UPDATE auth.users
SET encrypted_password = crypt('newpassword123', gen_salt('bf'))
WHERE email = 'targetuser@example.com';
