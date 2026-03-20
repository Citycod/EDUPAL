import pdfplumber
import psycopg2
import re
import json
import os
import argparse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Use SUPABASE_SERVICE_ROLE_KEY or DB connection string
DB_URL = os.getenv("SUPABASE_DB_URL") 

COURSE_CODE_PATTERN = re.compile(r'^([A-Z]{2,4})\s?(\d{3})$')

def parse_confidence(code: str, title: str, objectives: list) -> float:
    score = 1.0
    if not COURSE_CODE_PATTERN.match(code.strip()):
        score -= 0.4
    if not title or len(title) < 4:
        score -= 0.3
    if not objectives or len(objectives) == 0:
        score -= 0.3
    return round(score, 2)

def extract_courses_from_pdf(pdf_path: str) -> list:
    courses = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            lines = text.split('\n')
            current_course = None
            for line in lines:
                line = line.strip()
                # Detect course header: "CSC 316 - Operating Systems (3 Units)"
                match = re.match(
                    r'([A-Z]{2,4}\s?\d{3})\s[–\-]\s(.+?)(?:\s*\((\d+)\s*[Uu]nits?\))?$',
                    line
                )
                if match:
                    if current_course:
                        courses.append(current_course)
                    current_course = {
                        "code": match.group(1).replace(" ", "").strip(),
                        "title": match.group(2).strip(),
                        "credit_units": int(match.group(3)) if match.group(3) else None,
                        "objectives": [],
                        "description": "",
                        "raw_lines": []
                    }
                elif current_course and line.lower().startswith(("at the end", "by the end", "student")):
                    current_course["objectives"].append(line)
                elif current_course:
                    current_course["raw_lines"].append(line)

            if current_course:
                courses.append(current_course)

    return courses

def seed_program(conn, nuc_code: str, name: str) -> str:
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO catalog.national_programs (name, nuc_code)
            VALUES (%s, %s)
            ON CONFLICT (nuc_code) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
        """, (name, nuc_code))
        return cur.fetchone()[0]

def seed_course(conn, program_id: str, course: dict, level: int, semester: str) -> dict:
    confidence = parse_confidence(
        course["code"], course["title"], course["objectives"]
    )
    if confidence < 0.85:
        print(f"⚠️  LOW CONFIDENCE ({confidence}): {course['code']} — {course['title']}")
        print(f"    → Flagged for human review. Skipping insert.")
        return {"skipped": True, "course": course, "confidence": confidence}

    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO catalog.national_courses
              (program_id, course_code_standard, title_standard, credit_units, level, semester)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (program_id, course_code_standard) DO UPDATE
              SET title_standard = EXCLUDED.title_standard,
                  credit_units   = EXCLUDED.credit_units
            RETURNING id
        """, (
            program_id,
            course["code"],
            course["title"],
            course["credit_units"],
            level,
            semester
        ))
        course_id = cur.fetchone()[0]

    if course["objectives"]:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
                VALUES (%s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (course_id, course["title"], course["objectives"]))

    return {"skipped": False, "course_id": course_id, "confidence": confidence}

def run_ingestion(pdf_path: str, nuc_code: str, program_name: str, level: int, semester: str):
    if not DB_URL:
        print("❌ Error: SUPABASE_DB_URL not found in environment.")
        return

    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    try:
        program_id = seed_program(conn, nuc_code, program_name)
        courses = extract_courses_from_pdf(pdf_path)
        print(f"\n📄 Found {len(courses)} courses in PDF")

        results = []
        for c in courses:
            result = seed_course(conn, program_id, c, level, semester)
            results.append(result)

        skipped = [r for r in results if r.get("skipped")]
        inserted = [r for r in results if not r.get("skipped")]

        conn.commit()
        print(f"\n✅ Inserted: {len(inserted)} | ⚠️  Flagged: {len(skipped)}")

        if skipped:
            with open("flagged_for_review.json", "w") as f:
                json.dump(skipped, f, indent=2)
            print("📝 Flagged courses written to flagged_for_review.json")

    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest CCMAS PDF into Supabase Catalog")
    parser.add_argument("--pdf", required=True, help="Path to the CCMAS PDF file")
    parser.add_argument("--code", required=True, help="NUC Program Code (e.g., CSC)")
    parser.add_argument("--name", required=True, help="Program Name (e.g., Computer Science)")
    parser.add_argument("--level", required=True, type=int, help="Student Level (e.g., 300)")
    parser.add_argument("--semester", required=True, choices=['first', 'second', 'both'], help="Semester")

    args = parser.parse_args()

    run_ingestion(args.pdf, args.code, args.name, args.level, args.semester)

