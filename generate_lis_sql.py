import re

text = ""
with open('lis_raw.txt', 'r', encoding='utf-8') as f:
    text += f.read() + "\n\n"

# Clean up random page numbers if any (e.g., "Education 452 New")
text = re.sub(r'Education \d+ New', '', text)
text = re.sub(r':\s*\n+', ':\n', text) # clean up floating colons

course_blocks = re.split(r'\n(?=[A-Z]{3} \d{3}:)', text.strip())

sql = "-- Seed file for Library and Information Science Curriculum\nBEGIN;\n\n"
programs_seen = set()

for block in course_blocks:
    if not block.strip(): continue
    
    # Parse header: LIS 111: Introduction to Library and Information Science (3 Units C: LH 30)
    header_match = re.match(r'^([A-Z]{3})\s+(\d{3}):\s+(.*?)\s+\((\d+)\s+Units?', block, re.IGNORECASE)
    if not header_match:
        print(f"Failed to parse header: {block[:50]}")
        continue
        
    prog_code = header_match.group(1).upper()
    crs_num = header_match.group(2)
    course_code = f"{prog_code}{crs_num}"
    title = header_match.group(3).strip()
    units = int(header_match.group(4))
    
    level = (int(crs_num) // 100) * 100
    semester = 'first' if int(crs_num[-1]) % 2 != 0 else 'second'
    
    # Extract learning outcomes block
    outcomes_str = ""
    lo_match = re.search(r'Learning Outcome[s]?(.*?)Course Contents', block, re.DOTALL | re.IGNORECASE)
    if lo_match:
        outcomes_str = re.sub(r'Education \d+ New', '', lo_match.group(1))
    
    # Extract numbered points
    objectives = []
    points = re.findall(r'\d+\.?\s+((?:(?!\n\d+\.?\s).)+)', outcomes_str, re.DOTALL)
    for p in points:
        cleaned = re.sub(r'\s+', ' ', p).strip()
        if cleaned.endswith('; and'):
            cleaned = cleaned[:-5].strip()
        if cleaned.endswith(';'):
            cleaned = cleaned[:-1].strip()
        if cleaned.endswith(' and'):
            cleaned = cleaned[:-4].strip()
        
        cleaned = re.sub(r'^(?:should have |be able to |have )', '', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'^gained\b', 'gain', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'^understood\b', 'understand', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'^acquired\b', 'acquire', cleaned, flags=re.IGNORECASE)
        
        if cleaned:
            if cleaned and cleaned[0].islower():
                cleaned = cleaned[0].upper() + cleaned[1:]
            if cleaned and cleaned[-1] not in ['.', '!', '?']:
                cleaned += '.'
            objectives.append(cleaned)
            
    if not objectives:
        text_match = re.search(r'students.*?((?:have acquired |possess |understand |acquired |learned |gained |be able to )?(.*))', outcomes_str, re.DOTALL | re.IGNORECASE)
        if text_match:
            obj_text = re.sub(r'\s+', ' ', text_match.group(1)).strip()
            if obj_text.endswith('; and'):
                obj_text = obj_text[:-5].strip()
            if obj_text.endswith(';'):
                obj_text = obj_text[:-1].strip()
                
            obj_text = re.sub(r'^(?:should have |be able to |have )', '', obj_text, flags=re.IGNORECASE)
            obj_text = re.sub(r'^gained\b', 'gain', obj_text, flags=re.IGNORECASE)
            obj_text = re.sub(r'^understood\b', 'understand', obj_text, flags=re.IGNORECASE)
            obj_text = re.sub(r'^acquired\b', 'acquire', obj_text, flags=re.IGNORECASE)
            
            if obj_text:
                if obj_text and obj_text[0].islower():
                    obj_text = obj_text[0].upper() + obj_text[1:]
                if obj_text and obj_text[-1] not in ['.', '!', '?']:
                    obj_text += '.'
                objectives.append(obj_text)
                
    if not objectives:
        print(f"Failed to parse objectives for {course_code}")
        continue

    if prog_code not in programs_seen:
        programs_seen.add(prog_code)
        prog_title = "Library and Information Science" if prog_code == "LIS" else f"{prog_code} Program"
        sql += f"INSERT INTO catalog.national_programs (name, nuc_code)\nVALUES ('{prog_title}', '{prog_code}')\nON CONFLICT (nuc_code) DO NOTHING;\n\n"
    
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
    array_items = []
    for obj in objectives:
        safe_obj = obj.replace("'", "''")
        array_items.append(f"    '{safe_obj}'")
        
    sql += ",\n".join(array_items)
    
    sql += "\n]::text[]\nFROM inserted_course\nON CONFLICT (course_id, topic_name) DO NOTHING;\n\n"

sql += "COMMIT;\n"

with open('lis_seed.sql', 'w', encoding='utf-8') as f:
    f.write(sql)
    
print("Successfully generated lis_seed.sql")
