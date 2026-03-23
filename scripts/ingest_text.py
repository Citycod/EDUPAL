import re
import os

# Full single-line header: "CSC 301: Data Structures (3 Units C: LH 30, PH 45)"
COURSE_HEADER_PATTERN = re.compile(r'^([A-Z]{3})\s?(\d{3}):\s*(.+?)\s*\((\d+)\s*Units?', re.IGNORECASE)

# Partial header — course code + colon but title wraps to next line: "EDU 302: Educational Measurements..."
PARTIAL_HEADER_PATTERN = re.compile(r'^([A-Z]{3})\s?(\d{3}):\s*(.+)', re.IGNORECASE)

# Continuation line with units: "Statistics (2 Units C: LH 15; PH 45)" or "Methods (2 Units C: LH30)"
UNITS_CONTINUATION = re.compile(r'^(.*?)\s*\((\d+)\s*Units?', re.IGNORECASE)

# Preamble phrases to strip from objectives (case-insensitive check)
PREAMBLE_PHRASES = [
    "at the end of this course",
    "at the end of the course",
    "at the end of this training",
    "a student who has successfully gone through this course should be able to",
    "should be able to demonstrate",
    "should be able to",
    "students should be able to",
    "students should know",
    "students will be able to",
    "the students should be able to",
    "the students will be able to",
]

# Minimum character length for a standalone objective — shorter ones get merged back
MIN_OBJECTIVE_LENGTH = 25

def is_preamble(text: str) -> bool:
    """Check if text is a preamble statement, not a real objective."""
    lower = text.lower().strip().rstrip(';:., ')
    for phrase in PREAMBLE_PHRASES:
        if lower == phrase.rstrip(':. ') or lower.startswith(phrase.rstrip(': ')):
            return True
    return False

def generate_sql(txt_path: str, sql_path: str, program_code: str, program_name: str):
    courses: list[dict] = []
    current_course: dict | None = None
    state: str | None = None

    # Read all lines at once so we can look-ahead for multi-line headers
    with open(txt_path, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f.readlines()]

    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Skip empty/noise lines
        if not line or line.startswith('Education') or line.startswith('Course Contents and Learning') or line.startswith('Global Course Structure') or line == ':':
            i += 1
            continue
        
        # --- Try to detect a course header ---
        # Case 1: Full header on a single line
        match = COURSE_HEADER_PATTERN.search(line)
        if match:
            if current_course:
                courses.append(current_course)
            
            code_alpha = match.group(1).upper()
            code_num = match.group(2)
            title = match.group(3).strip()
            units = int(match.group(4))
            
            level = int(code_num[0]) * 100
            semester = 'first' if int(code_num[-1]) % 2 != 0 else 'second'
            
            current_course = {
                "code": f"{code_alpha}{code_num}",
                "title": title,
                "units": units,
                "level": level,
                "semester": semester,
                "objectives": [],
                "contents": []
            }
            state = None
            i += 1
            continue
        
        # Case 2: Partial header — course code + title, but units on next line
        partial_match = PARTIAL_HEADER_PATTERN.search(line)
        if partial_match and i + 1 < len(lines):
            next_line = lines[i + 1]
            cont_match = UNITS_CONTINUATION.search(next_line)
            if cont_match:
                if current_course:
                    courses.append(current_course)
                
                code_alpha = partial_match.group(1).upper()
                code_num = partial_match.group(2)
                title_part1 = partial_match.group(3).strip()
                title_part2 = cont_match.group(1).strip()
                full_title = f"{title_part1} {title_part2}".strip()
                units = int(cont_match.group(2))
                
                level = int(code_num[0]) * 100
                semester = 'first' if int(code_num[-1]) % 2 != 0 else 'second'
                
                current_course = {
                    "code": f"{code_alpha}{code_num}",
                    "title": full_title,
                    "units": units,
                    "level": level,
                    "semester": semester,
                    "objectives": [],
                    "contents": []
                }
                state = None
                i += 2  # Skip both lines
                continue

        # --- Parse within a course ---
        if current_course:
            lower_line = line.lower()
            if lower_line.startswith('learning outcome') or lower_line.startswith('leaning outcome'):
                state = 'objectives'
                i += 1
                continue
            elif lower_line.startswith('course contents') or lower_line.startswith('course content'):
                state = 'contents'
                i += 1
                continue
            elif lower_line.startswith('prerequisite:') or lower_line.startswith('suggested lab'):
                state = None
                i += 1
                continue
            
            if state == 'objectives':
                # Skip standalone "At the end..." preamble lines
                if lower_line.startswith('at the end'):
                    i += 1
                    continue
                cleaned_obj = line.strip(';')
                if cleaned_obj:
                    current_course["objectives"].append(cleaned_obj)
            elif state == 'contents':
                current_course["contents"].append(line)
        
        i += 1

    if current_course:
        courses.append(current_course)

    print(f"Found {len(courses)} courses to convert to SQL.")

    with open(sql_path, 'w', encoding='utf-8') as sf:
        sf.write("-- Seed file for NUC Computer Science Curriculum\n")
        sf.write("BEGIN;\n\n")
        
        # 1. Enforce UNIQUE constraint on national_topics to allow safe re-runs
        sf.write("""DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'national_topics_course_topic_unique') THEN
    ALTER TABLE catalog.national_topics ADD CONSTRAINT national_topics_course_topic_unique UNIQUE (course_id, topic_name);
  END IF;
END $$;

""")
        
        # Insert Program
        safe_program_name = program_name.replace("'", "''")
        safe_program_code = program_code.replace("'", "''")
        sf.write(f"INSERT INTO catalog.national_programs (name, nuc_code)\n")
        sf.write(f"VALUES ('{safe_program_name}', '{safe_program_code}')\n")
        sf.write(f"ON CONFLICT (nuc_code) DO NOTHING;\n\n")
        
        for c in courses:
            escaped_title = c['title'].replace("'", "''")
            course_code = c['code']
            course_units = c['units']
            course_level = c['level']
            course_sem = c['semester']
            
            sf.write(f"""WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = '{safe_program_code}'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, '{course_code}', '{escaped_title}', {course_units}, {course_level}, '{course_sem}'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
""")
            if c['objectives']:
                # --- Phase 1: Merge all raw lines into a single string ---
                raw_text = " ".join(c['objectives'])
                
                # --- Phase 2: Split by numbered list pattern (1. 2. 3. etc.) ---
                parsed_objs = re.split(r'(?:^|\s)\d+\.\s+', raw_text)
                
                # --- Phase 3: Clean, filter preambles, and merge short fragments ---
                cleaned_objs: list[str] = []
                for obj in parsed_objs:
                    cleaned = obj.strip(' ;:')
                    if not cleaned:
                        continue
                    # Filter out preamble sentences
                    if is_preamble(cleaned):
                        continue
                    cleaned_objs.append(cleaned)
                
                # Merge short trailing fragments back into the previous objective
                merged_objs: list[str] = []
                for obj in cleaned_objs:
                    if merged_objs and len(obj) < MIN_OBJECTIVE_LENGTH and not obj[0].isupper():
                        # This is likely a broken line continuation — merge it
                        merged_objs[-1] = merged_objs[-1].rstrip(' ;,.') + " " + obj
                    else:
                        merged_objs.append(obj)
                
                # --- Phase 4: Escape and write SQL ---
                objs = []
                for obj in merged_objs:
                    safe_obj = obj.replace('"', '""').replace("'", "''")
                    objs.append(f'"{safe_obj}"')
                
                if objs:
                    arr_str = "'{" + ",".join(objs) + "}'"
                    sf.write(f"""INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, '{escaped_title}', {arr_str}::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
""")
                else:
                    sf.write("SELECT 1;\n")
            else:
                sf.write("SELECT 1;\n")
            sf.write("\n")
            
        sf.write("COMMIT;\n")

    print(f"Success! Saved SQL to {sql_path}")

if __name__ == "__main__":
    generate_sql("csc_ccmas.txt", "csc_seed.sql", "CSC", "Computer Science")
