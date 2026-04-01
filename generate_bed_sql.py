import re

def update_verb(text):
    # Mapping of passive/vague verbs to active/measurable ones
    replacements = {
        r'\bunderstand\b': 'Explain',
        r'\bknow\b': 'Describe',
        r'\bappreciate\b': 'Analyze',
        r'\battain\b': 'Demonstrate',
        r'\bacquire\b': 'Demonstrate',
        r'\bstate\b': 'Explain',
        r'\bhighlight\b': 'Describe',
        r'\blist\b': 'Identify',
    }
    for old, new in replacements.items():
        text = re.sub(old, new, text, flags=re.IGNORECASE)
    
    # Capitalize first letter if it's a verb
    if text and text[0].islower():
        text = text[0].upper() + text[1:]
    return text.strip()

def parse_curriculum(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by course code pattern (e.g., BED 114:)
    courses = re.split(r'\n(?=BED \d{3}:)', content)
    sql_blocks = []

    for course_text in courses:
        if not course_text.strip():
            continue
            
        # Extract basic info
        header_match = re.search(r'BED (\d{3}): (.*?) \((\d+) Units.*?\)', course_text)
        if not header_match:
            continue
            
        code_num = header_match.group(1)
        full_code = f"BED{code_num}"
        title = header_match.group(2).strip()
        units = header_match.group(3)
        level = (int(code_num) // 100) * 100
        # Simple heuristic: Odd = 1st, Even = 2nd (except for SIWES or others)
        semester = 'first' if int(code_num) % 2 != 0 else 'second'
        
        # Special case for SIWES
        if "SIWES" in title:
            semester = 'second'

        # Extract Learning Outcomes
        outcomes = []
        outcomes_match = re.search(r'Learning Outcomes\n(.*?)\nCourse Content', course_text, re.DOTALL | re.IGNORECASE)
        if outcomes_match:
            raw_outcomes = outcomes_match.group(1)
            # Find numbered items: 1. ... 2. ...
            items = re.findall(r'\d+\.\s*(.*?)(?=\n\d+\.|\Z)', raw_outcomes, re.DOTALL)
            for item in items:
                cleaned = item.replace('\n', ' ').strip()
                if cleaned:
                    outcomes.append(update_verb(cleaned))

        if not outcomes:
            continue

        # Build SQL block
        block = f"""
-- {full_code}: {title} ({units} units, Level {level}, {semester.capitalize()} Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, '{full_code}', '{title}', {units}, {level}, '{semester}'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, '{title}', ARRAY[
{",\n".join([f"    '{obj}'" for obj in outcomes])}
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;
"""
        sql_blocks.append(block)

    return sql_blocks

def main():
    header = """-- Seed file for NUC Business Education (CCMAS)
-- Generated with active-verb normalisation and CTE safety
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Business Education', 'BED')
ON CONFLICT (nuc_code) DO NOTHING;
"""
    footer = "\nCOMMIT;"
    
    blocks = parse_curriculum('bed_raw.txt')
    
    with open('bed_seed.sql', 'w', encoding='utf-8') as f:
        f.write(header)
        for b in blocks:
            f.write(b)
        f.write(footer)
    
    print(f"Generated bed_seed.sql with {len(blocks)} courses.")

if __name__ == "__main__":
    main()
