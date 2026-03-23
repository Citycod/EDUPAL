import re
import json

with open('biology_raw.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Clean up random page numbers like "Education 152 New"
text = re.sub(r'Education \d+ New', '', text)

course_blocks = re.split(r'\n(?=[A-Z]{3} \d{3}:)', text.strip())

sql = "-- Seed file for NUC Biology Curriculum\nBEGIN;\n\n"
sql += "INSERT INTO catalog.national_programs (name, nuc_code)\nVALUES ('Biology', 'BIO')\nON CONFLICT (nuc_code) DO NOTHING;\n\n"

for block in course_blocks:
    if not block.strip(): continue
    
    # Parse header: BIO 101: General Biology I (2 Units C: LH 30)
    # or SED 202: General Biology Methods I (2 Unit C: LH 30)
    header_match = re.match(r'^([A-Z]{3})\s+(\d{3}):\s+(.*?)\s+\((\d+)\s+Units?', block)
    if not header_match:
        print(f"Failed to parse header: {block[:50]}")
        continue
        
    prog_code = header_match.group(1)
    crs_num = header_match.group(2)
    course_code = f"{prog_code}{crs_num}"
    title = header_match.group(3).strip()
    units = int(header_match.group(4))
    
    level = (int(crs_num) // 100) * 100
    semester = 'first' if int(crs_num) % 2 != 0 else 'second'
    
    # Extract learning outcomes
    outcomes_str = ""
    lo_match = re.search(r'students.*be able to:(.*?)(?:Course Contents|$)', block, re.DOTALL | re.IGNORECASE)
    if lo_match:
        outcomes_str = lo_match.group(1)
    
    # Extract numbered points (with or without dot)
    objectives = []
    points = re.findall(r'\d+\.?\s+([^\n]+(?:(?!\n\d+\.?\s)[^\n]+)*)', outcomes_str, re.DOTALL)
    for p in points:
        cleaned = re.sub(r'\s+', ' ', p).strip().strip(';').strip('; and').replace('; and', '')
        if cleaned:
            objectives.append(cleaned)
            
    if not objectives:
        print(f"Failed to parse objectives for {course_code}")
        continue

    # Create SQL
    
    # Ensure program is inserted just in case it's not BIO
    if prog_code != 'BIO':
        sql += f"INSERT INTO catalog.national_programs (name, nuc_code)\nVALUES ('{prog_code} Program', '{prog_code}')\nON CONFLICT (nuc_code) DO NOTHING;\n\n"
    
    sql += f"""WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = '{prog_code}'),
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
    # format array correctly
    array_items = []
    for obj in objectives:
        safe_obj = obj.replace("'", "''")
        array_items.append(f"    '{safe_obj}'")
        
    sql += ",\n".join(array_items)
    
    sql += "\n]::text[]\nFROM inserted_course\nON CONFLICT (course_id, topic_name) DO NOTHING;\n\n"

sql += "COMMIT;\n"

with open('bio_seed.sql', 'w', encoding='utf-8') as f:
    f.write(sql)
    
print("Successfully generated bio_seed.sql")
