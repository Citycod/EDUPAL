import re

with open('gse_raw.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Split by course header: e.g. "GSE 111"
blocks = re.split(r'\n(?=GSE \d{3}\s)', "\n" + text.strip())

sql = "-- Seed file for NCE General Studies in Education (GSE) Courses\nBEGIN;\n\n"
sql += "INSERT INTO catalog.national_programs (name, nuc_code)\nVALUES ('General Studies in Education', 'NCE_GSE')\nON CONFLICT (nuc_code) DO NOTHING;\n\n"

for block in blocks:
    if not block.strip() or block.strip().startswith('GSE COURSE OUTLINE'):
        continue
    
    lines = block.strip().split('\n')
    header_line = lines[0]
    
    # Match header
    m = re.match(r'^GSE\s+(\d{3})\s+(.*?)\(?\s*(\d)\s*CREDITS?\)?\s*[CE]', header_line, re.IGNORECASE)
    if not m:
        print(f"Skipping unparseable header: {header_line[:50]}")
        continue

    crs_num = m.group(1)
    title = m.group(2).strip()
    units = int(m.group(3))

    title = re.sub(r'[-–]+$', '', title).strip(" -(")

    objectives = []
    
    for line in lines[1:]:
        line = line.strip()
        if not line: continue
        if line.lower() in ["course description", "content outline", "introduction"]: continue
        
        # Clean up leading numbers or bullets or letters
        obj = re.sub(r'^[\d\.\-\s\(\)abcde]+', '', line)
        obj = obj.strip()
        if len(obj) > 3: # allow short topics
            objectives.append(obj)

    course_code = f"GSE{crs_num}"
    level = (int(crs_num[0])) * 100
    semester = 'first' if int(crs_num[1]) % 2 != 0 else 'second'

    sql += f"""WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, '{course_code}', '{title.replace("'", "''")}', {units}, {level}, '{semester}'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, '{title.replace("'", "''")}', ARRAY[
"""
    array_items = []
    if not objectives:
        objectives = [title]
        
    for obj in objectives:
        safe_obj = obj.replace("'", "''")
        array_items.append(f"    '{safe_obj}'")
        
    sql += ",\n".join(array_items)
    
    sql += "\n]::text[]\nFROM inserted_course\nON CONFLICT (course_id, topic_name) DO NOTHING;\n\n"

sql += "COMMIT;\n"

with open('gse_seed.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print("Generated gse_seed.sql successfully.")
