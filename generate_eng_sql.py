import re

text = ""
with open('english_raw.txt', 'r', encoding='utf-8') as f:
    text += f.read() + "\n\n"
with open('english_raw2.txt', 'r', encoding='utf-8') as f:
    text += f.read() + "\n\n"
with open('english_raw3.txt', 'r', encoding='utf-8') as f:
    text += f.read() + "\n\n"

# Clean up random page numbers if any (e.g., "Education 452 New")
text = re.sub(r'Education \d+ New', '', text)
text = re.sub(r':\s*\n+', ':\n', text) # clean up floating colons

course_blocks = re.split(r'\n(?=[A-Z]{3} \d{3}:)', text.strip())

sql = "-- Seed file for NUC English Curriculum\nBEGIN;\n\n"
programs_seen = set()

for block in course_blocks:
    if not block.strip(): continue
    
    # Parse header: ENG 402: Pragmatics (2 Units C LH 45)
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
    
    # Extract learning outcomes block
    outcomes_str = ""
    lo_match = re.search(r'Learning Outcomes(.*?)Course Contents', block, re.DOTALL | re.IGNORECASE)
    if lo_match:
        # Strip trailing text like "Education 441 New"
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
        
        # Clean passive/outcome phrasing at the start of the objective
        cleaned = re.sub(r'^(?:should have |be able to |have )', '', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'^gained\b', 'gain', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'^understood\b', 'understand', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'^acquired\b', 'acquire', cleaned, flags=re.IGNORECASE)
        
        if cleaned:
            # Capitalize first letter and ensure it ends with period if it doesn't end with punctuation
            if cleaned and cleaned[0].islower():
                cleaned = cleaned[0].upper() + cleaned[1:]
            if cleaned and cleaned[-1] not in ['.', '!', '?']:
                cleaned += '.'
            objectives.append(cleaned)
            
    if not objectives:
        # Try finding paragraph-based outcomes: anything after "students should..."
        text_match = re.search(r'students.*?((?:have acquired |possess |understand |acquired |learned |gained |be able to )?(.*))', outcomes_str, re.DOTALL | re.IGNORECASE)
        if text_match:
            obj_text = re.sub(r'\s+', ' ', text_match.group(1)).strip()
            if obj_text.endswith('; and'):
                obj_text = obj_text[:-5].strip()
            if obj_text.endswith(';'):
                obj_text = obj_text[:-1].strip()
                
            # Clean passive/outcome phrasing
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

    # Ensure program is inserted
    if prog_code not in programs_seen:
        programs_seen.add(prog_code)
        prog_title = "English" if prog_code == "ENG" else f"{prog_code} Program"
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

with open('eng_seed.sql', 'w', encoding='utf-8') as f:
    f.write(sql)
    
print("Successfully generated eng_seed.sql")
