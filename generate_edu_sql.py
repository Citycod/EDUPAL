import re

with open('edu_raw.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# remove page numbers
text = re.sub(r'Page \d+ of \d+', '', text)
text = re.sub(r'YEAR \w+ [-–] \w+ SEMESTER', '', text)

# Split by course header: e.g. "EDU 111"
blocks = re.split(r'\n(?=EDU \d{3}\s)', "\n" + text.strip())

sql = "-- Seed file for NCE General Education Courses\nBEGIN;\n\n"
sql += "INSERT INTO catalog.national_programs (name, nuc_code)\nVALUES ('Education (General NCE)', 'NCE_EDU')\nON CONFLICT (nuc_code) DO NOTHING;\n\n"

for block in blocks:
    if not block.strip(): continue
    
    lines = block.strip().split('\n')
    header_line = lines[0]
    
    # Match header
    m = re.match(r'^EDU\s+(\d{3})\s+(.*?)\(?\s*(\d)\s*CREDITS?\)?\s*[CE]', header_line, re.IGNORECASE)
    if not m:
        m2 = re.match(r'^EDU\s+(\d{3})\s+(.*?)(\d)\s*Credit[s]?\s*[CE]', header_line, re.IGNORECASE)
        if m2:
            crs_num = m2.group(1)
            title = m2.group(2).strip()
            units = int(m2.group(3))
        else:
            print(f"Skipping unparseable header: {header_line[:50]}")
            continue
    else:
        crs_num = m.group(1)
        title = m.group(2).strip()
        units = int(m.group(3))

    title = re.sub(r'[-–]+$', '', title).strip(" -(")

    objectives = []
    
    for line in lines[1:]:
        line = line.strip()
        if not line: continue
        if line.lower() in ["course description", "content outline", "introduction"]: continue
        if line.lower().startswith("this course introduces"): continue
        if line.lower().startswith("note:"): continue
        
        # Clean up leading numbers or bullets
        obj = re.sub(r'^[\d\.\-\s]+', '', line)
        if len(obj) > 10:
            objectives.append(obj)

    course_code = f"EDU{crs_num}"
    level = (int(crs_num[0])) * 100
    semester = 'first' if int(crs_num[1]) % 2 != 0 else 'second'

    sql += f"""WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
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

with open('edu_seed.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print("Generated edu_seed.sql successfully.")
