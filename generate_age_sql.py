import re

def parse_curriculum(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by course code pattern (e.g., AGE 101:)
    blocks = re.split(r'\n(?=AGE\s*\d{3}:)', content)
    
    courses = []
    
    for block in blocks:
        block = block.strip()
        if not block:
            continue
            
        # Extract Code and Title
        # AGE 101: Introduction to Agriculture (2 Units C: LH 15; PH 45)
        header_match = re.match(r'(AGE\s*(\d)(\d{2})):\s*(.*?)\((\d+)\s*Unit', block)
        if not header_match:
            # Try a looser match for lines with typos
            header_match = re.match(r'(AGE\s*(\d)(\d{2})):\s*(.*?)\s*\((\d+)', block)
            
        if header_match:
            full_code = header_match.group(1).replace(' ', '')
            level_digit = int(header_match.group(2))
            code_num = int(header_match.group(3))
            title = header_match.group(4).strip().replace("'", "''")
            units = int(header_match.group(5))
            
            level = level_digit * 100
            # Heuristic: Odd = First, Even = Second
            semester = 'first' if code_num % 2 != 0 else 'second'
            
            # Extract Learning Outcomes
            outcomes = []
            outcomes_section = re.search(r'Learning Outcome[s]?\n(.*?)\nCourse Content', block, re.DOTALL | re.IGNORECASE)
            if outcomes_section:
                outcomes_text = outcomes_section.group(1).strip()
                # Find numbered items
                items = re.findall(r'\d+\.\s*(.*?)(?=\n\d+\.|$)', outcomes_text, re.DOTALL)
                for item in items:
                    clean_item = ' '.join(item.split()).replace("'", "''")
                    if clean_item:
                        outcomes.append(clean_item)
            
            courses.append({
                'code': full_code,
                'title': title,
                'units': units,
                'level': level,
                'semester': semester,
                'outcomes': outcomes
            })
            
    return courses

def generate_sql(courses):
    sql = ["-- Seed file for NUC Agricultural Science Education\nBEGIN;\n"]
    
    sql.append("INSERT INTO catalog.national_programs (name, nuc_code)\nVALUES ('Agricultural Science Education', 'AGE')\nON CONFLICT (nuc_code) DO NOTHING;\n")
    
    sql.append("\nWITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE')")
    
    for course in courses:
        sql.append(f"\n-- {course['code']}: {course['title']}")
        sql.append(f"INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)")
        sql.append(f"SELECT id, '{course['code']}', '{course['title']}', {course['units']}, {course['level']}, '{course['semester']}'")
        sql.append(f"FROM p")
        sql.append(f"ON CONFLICT (program_id, course_code_standard) DO UPDATE")
        sql.append(f"  SET title_standard = EXCLUDED.title_standard,")
        sql.append(f"      credit_units = EXCLUDED.credit_units,")
        sql.append(f"      level = EXCLUDED.level,")
        sql.append(f"      semester = EXCLUDED.semester;")
        
        if course['outcomes']:
            sql.append(f"\nWITH c AS (")
            sql.append(f"  SELECT nc.id FROM catalog.national_courses nc")
            sql.append(f"  JOIN catalog.national_programs np ON nc.program_id = np.id")
            sql.append(f"  WHERE np.nuc_code = 'AGE' AND nc.course_code_standard = '{course['code']}'")
            sql.append(f")")
            sql.append(f"INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)")
            sql.append(f"SELECT id, '{course['title']}', ARRAY[")
            for i, outcome in enumerate(course['outcomes']):
                comma = "," if i < len(course['outcomes']) - 1 else ""
                sql.append(f"    '{outcome}'{comma}")
            sql.append(f"]::text[]")
            sql.append(f"FROM c")
            sql.append(f"ON CONFLICT (course_id, topic_name) DO UPDATE")
            sql.append(f"  SET learning_objectives = EXCLUDED.learning_objectives;")
            
    sql.append("\nCOMMIT;")
    return "\n".join(sql)

if __name__ == '__main__':
    courses = parse_curriculum('age_raw.txt')
    print(f"Parsed {len(courses)} courses.")
    sql_content = generate_sql(courses)
    with open('age_seed.sql', 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print("Generated age_seed.sql")
