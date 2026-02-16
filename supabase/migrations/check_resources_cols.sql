-- CHECK COLUMNS
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'academic' AND table_name = 'resources';
