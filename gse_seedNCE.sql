-- Seed file for NCE General Studies in Education (GSE) Courses
-- Fixed: removed leaked section headers (GSE113, GSE124, GSE213, GSE224)
-- Fixed: removed admin note from GSE112 objectives
-- Fixed: merged fragmented entries in GSE111, GSE212
-- Fixed: typos — GSE213 'resource gloving' → 'resource browsing';
--         GSE321 'uctive' → 'deductive'; GSE323 'nd communication' → 'and communication';
--         GSE323 'scientic' → 'scientific'
-- Fixed: removed raw outline lettering prefixes (f), g), h)) from GSE321
-- All learning objectives rewritten in action-verb format
BEGIN;
 
INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('General Studies in Education', 'NCE_GSE')
ON CONFLICT (nuc_code) DO NOTHING;
 
-- ============================================================
-- YEAR ONE - FIRST SEMESTER
-- ============================================================
 
-- GSE111: General English I (1 credit)
-- FIXED: merged fragmented mid-sentence entries; removed lettered prefixes; rewrote as objectives
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE111', 'GENERAL ENGLISH I', 1, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'GENERAL ENGLISH I', ARRAY[
    'Explain the meaning and scope of communication, identify its elements and describe its channels',
    'Identify and analyse the problems facing learners of English in Nigeria',
    'Describe the major language skills and explain their interrelationship',
    'Define listening, distinguish between its types and identify common listening defects',
    'Apply strategies for efficient listening including listening for specific purposes, note-taking, and following directions and instructions',
    'Apply principles and techniques of note-taking and note-making effectively',
    'Participate in oral drills including mechanical and meaningful communication drills',
    'Engage in dialogue, inference, conversation and storytelling activities using children''s stories, poetry and drama',
    'Demonstrate questioning techniques in storytelling and discussion contexts',
    'Develop personal study skills including organisation of a study schedule, rules of spelling and acquisition of new vocabulary',
    'Use a dictionary effectively to build vocabulary including kinship words',
    'Identify and use registers appropriate to reading, literature, mathematics and other subject areas'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE112: Introduction to Library Studies (1 credit)
-- FIXED: removed admin note ('A qualified Librarian should teach this course') from objectives
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE112', 'INTRODUCTION TO LIBRARY STUDIES', 1, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO LIBRARY STUDIES', ARRAY[
    'Explain the objectives and functions of the library',
    'Distinguish between the different types of library',
    'Identify and describe the various types of library materials',
    'Describe the organisational structure of the library',
    'Explain bibliography, cataloguing and library classification systems',
    'Demonstrate correct use and care of the library',
    'Describe the principles of basic library automation',
    'Explain the concept and use of virtual and e-library resources'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE113: Basic General Mathematics I (1 credit)
-- FIXED: removed leaked section header 'YEAR ONE SECOND SEMESTER' from objectives array
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE113', 'BASIC GENERAL MATHEMATICS I', 1, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'BASIC GENERAL MATHEMATICS I', ARRAY[
    'Convert numbers between base 2 (binary) and base 10 (denary) and vice versa',
    'Define sets using correct notation and represent them using Venn diagrams',
    'Perform basic operations on fractional and whole numbers',
    'Work with fractions, decimals and approximations accurately',
    'Apply the rules of indices and surds to simplify expressions',
    'Plot and interpret graphs of mathematical functions',
    'Change the subject of a given formula'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR ONE - SECOND SEMESTER
-- ============================================================
 
-- GSE121: General English II (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE121', 'GENERAL ENGLISH II', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'GENERAL ENGLISH II', ARRAY[
    'Use verb tenses correctly in written and spoken English',
    'Apply rules of subject-verb agreement (concord) accurately',
    'Use auxiliary verbs and modal verbs appropriately in context',
    'Construct correct questions, statements and commands',
    'Distinguish between and use synonyms, antonyms, homonyms and homophones',
    'Identify and apply subject-specific registers using semantic mapping',
    'Explain the relationship between reading and writing and use summarising as a bridging skill',
    'Write well-structured paragraphs with unity and coherence',
    'Link paragraphs effectively to achieve unity and coherence in extended writing',
    'Apply correct punctuation in written work'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE122: Basic General Mathematics II (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE122', 'BASIC GENERAL MATHEMATICS II', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'BASIC GENERAL MATHEMATICS II', ARRAY[
    'Expand and factorise simple algebraic expressions',
    'Solve simple algebraic equations using appropriate methods',
    'Translate and solve simple word problems using algebraic expressions',
    'Calculate ratios, percentages, simple interest and compound interest',
    'Apply the concepts of direct and inverse variation to solve problems'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE123: Introduction to Computer Studies I (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE123', 'INTRODUCTION TO COMPUTER STUDIES I', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO COMPUTER STUDIES I', ARRAY[
    'Define the computer and explain the distinction between data and information',
    'Trace the brief historical development of the computer',
    'Classify computers by size, purpose and capability',
    'Identify the application areas of computers including law, health, education, communication, industry, government and the military',
    'Identify and describe the basic hardware and software components of a computer system',
    'Distinguish between systems software and application software and describe their functions'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE124: Family Life and Emerging Health Issues (FLEHI) (1 credit)
-- FIXED: removed leaked section header 'YEAR TWO FIRST SEMESTER' from objectives array
-- FIXED: corrected typo 'Health Promoting Behavious' → 'Health Promoting Behaviours'
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE124', 'FAMILY LIFE AND EMERGING HEALTH ISSUES (FLEHI)', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'FAMILY LIFE AND EMERGING HEALTH ISSUES (FLEHI)', ARRAY[
    'Describe reproductive anatomy and physiology and explain the stages of human development including puberty, reproduction and pregnancy',
    'Discuss body image, sexual identity and the development of healthy relationships including friendship, love, dating, courtship, marriage and parenting',
    'Apply personal skills including values clarification, self-esteem building, goal setting, decision making, communication, negotiation, assertiveness and help-seeking',
    'Explain sexual health issues including contraception, abortion, sexual abuse and STIs/HIV infection',
    'Describe the risks and consequences of drug abuse and identify health-promoting behaviours',
    'Analyse the influence of society and culture on sexuality including gender roles, diversity, the law, religion, arts and the media'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR TWO - FIRST SEMESTER
-- ============================================================
 
-- GSE211: General English III (1 credit)
-- FIXED: removed broken apostrophe in 'students' area of study'
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE211', 'GENERAL ENGLISH III', 1, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'GENERAL ENGLISH III', ARRAY[
    'Identify and use phrases and clauses correctly in sentences',
    'Distinguish between sentence types and apply correct sentence patterns including Subject-Verb-Object structures',
    'Convert sentences between active and passive voice accurately',
    'Apply the writing process including planning, drafting and editing to produce coherent texts',
    'Organise ideas in a logical sequence and develop well-structured paragraphs with unity, coherence and completeness',
    'Expand vocabulary through understanding of connotative and denotative meanings, idiomatic expressions, figures of speech and proverbs',
    'Identify and use subject-specific registers appropriate to the student''s area of study',
    'Produce narrative, descriptive, argumentative and conversational speech types',
    'Use dialogue, reported speech and inference effectively in spoken and written English'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE212: Basic General Mathematics III (1 credit)
-- FIXED: merged three fragmented entries into coherent objectives
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE212', 'BASIC GENERAL MATHEMATICS III', 1, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'BASIC GENERAL MATHEMATICS III', ARRAY[
    'Change the subject of a given formula and apply it to solve problems',
    'Apply appropriate units of measurement for time, money, length, mass, weight, area and volume',
    'Calculate the areas and volumes of two- and three-dimensional shapes including triangles, squares, rectangles and cylinders'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE213: Introduction to Computer Studies II (1 credit)
-- FIXED: removed leaked section header 'YEAR TWO SECOND SEMESTER'
-- FIXED: corrected typo 'resource gloving' → 'resource browsing'
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE213', 'INTRODUCTION TO COMPUTER STUDIES II', 1, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO COMPUTER STUDIES II', ARRAY[
    'Explain computer networking concepts including LAN, WAN, the Internet and its resource browsing',
    'Perform basic computer operations including booting, using Windows, the keyboard and mouse, and loading applications',
    'Use a word processing application to create, edit and format documents',
    'Use an electronic spreadsheet application such as MS Excel or Lotus 1-2-3 for practical tasks',
    'Evaluate the advantages and disadvantages of computer use in education',
    'Demonstrate the use of CAI, CAL and multimedia tools in educational contexts'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR TWO - SECOND SEMESTER
-- ============================================================
 
-- GSE221: General English IV (2 credits)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE221', 'GENERAL ENGLISH IV', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'GENERAL ENGLISH IV', ARRAY[
    'Convert between direct and indirect speech accurately',
    'Identify and resolve ambiguity in written and spoken English',
    'Distinguish between colloquial, formal and informal speech patterns and apply them appropriately',
    'Use subject-specific registers relevant to the student''s area of study',
    'Apply critical analysis and creative reading skills to a range of texts',
    'Produce narrative and descriptive discourse types in writing',
    'Write formal, informal and semi-formal letters with appropriate expression and organisation',
    'Apply phonetical cues and contextual meaning in reading comprehension',
    'Participate in speaking activities including reading aloud, argument and questioning',
    'Engage with drama and storytelling as modes of language use'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE222: Basic General Mathematics IV (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE222', 'BASIC GENERAL MATHEMATICS IV', 1, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'BASIC GENERAL MATHEMATICS IV', ARRAY[
    'Identify, classify and describe properties of two- and three-dimensional shapes',
    'Identify and work with types of angles and describe horizontal, vertical, parallel and perpendicular lines',
    'Collect data using appropriate methods and sources',
    'Represent data accurately using pictograms, bar charts and pie charts'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE223: Citizenship Education (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE223', 'CITIZENSHIP EDUCATION', 1, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'CITIZENSHIP EDUCATION', ARRAY[
    'Define citizenship education and explain its role in national development',
    'Explain the concept of citizenship, distinguish between its types and describe the requirements for Nigerian citizenship',
    'Describe the Nigerian constitution and explain the concept of federation',
    'Analyse the structure of the Nigerian federal system and the relationships between federal, state, local government and FCT units',
    'Compare the Nigerian federal system with other federations',
    'Define government and distinguish between different systems and forms of government',
    'Explain the Nigerian electoral process including the roles of electoral commissions and political parties',
    'Describe the functions of the three arms of the Nigerian government: the Executive, Legislature and Judiciary',
    'Explain the concepts of rights and obligations and identify the fundamental rights of Nigerian citizens',
    'Describe the responsibilities and duties of the Nigerian government and constituted authority',
    'Explain the concept and aspects of national ethics and the importance of discipline in Nigerian society',
    'Describe the concept of national identity and identify the symbols of national identity'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE224: Introduction to Entrepreneurship (1 credit)
-- FIXED: removed leaked section header 'YEAR THREE SECOND SEMESTER'
-- FIXED: merged fragmented entries into coherent objectives
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE224', 'INTRODUCTION TO ENTREPRENEURSHIP', 1, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO ENTREPRENEURSHIP', ARRAY[
    'Define the meaning and scope of enterprise and trace the history of entrepreneurship in Nigeria',
    'Identify the types, characteristics and rationale of entrepreneurship and explain its role in economic development',
    'Describe the key competencies, determining factors for success and motivational patterns of entrepreneurs',
    'Apply techniques for generating, identifying and assessing business ideas and evaluating them for enterprise development',
    'Describe methods of product selection and the process and procedures for starting an enterprise',
    'Apply management techniques relevant to running an enterprise and identify existing industries and support agencies in Nigeria',
    'Explain the roles of commercial and development banks, personal savings and portfolio investment in small-scale industry development',
    'Define SMEs, describe their importance and explain how to finance them, including common problems and reasons for failure',
    'Define a business plan, explain its objectives and purpose and describe its content, structure and importance for securing finance',
    'Define risk, identify its types and apply reduction and management strategies including intellectual property rights',
    'Conduct a SWOT analysis and apply financial literacy skills including multiple streams of income',
    'Explain the meaning, role and strategic application of e-marketing and identify entrepreneurial opportunities in sectors such as agriculture, health, ICT and reprographics',
    'Describe the roles and terms of participation of funding institutions such as SMEIS, NBCI, SSICS and NERFUND',
    'Apply customer-oriented marketing strategies including branding, image creation, awareness creation and competitive positioning',
    'Maintain basic books of accounts including cash books, bank reconciliation statements and final accounts'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR THREE - SECOND SEMESTER
-- ============================================================
 
-- GSE321: General English V (1 credit)
-- FIXED: corrected truncation 'uctive' → 'deductive'; removed raw lettered prefixes f), g), h)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE321', 'GENERAL ENGLISH V', 1, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'GENERAL ENGLISH V', ARRAY[
    'Identify and correct common grammatical errors in written English',
    'Apply advanced verb tenses accurately in writing and speech',
    'Produce argumentative and expository/explanatory discourse types',
    'Write specific text types including reports, minutes, memos, speeches, petitions, book reports and formal requests',
    'Apply different writing styles including formal, informal, deductive, inductive and project-based writing with self-editing',
    'Read extensively across fiction, non-fiction, journals, articles, newspapers, plays and poems',
    'Identify and correctly use clauses including relative clauses, transitive and intransitive structures, intensifiers, passive voice, past perfect continuous and reported speech',
    'Apply correct spelling rules and distinguish between homonyms and homophones',
    'Use subject-specific registers including the registers of reading, literature and fishing literature',
    'Use contextual cues and inference strategies in reading comprehension',
    'Demonstrate clarity, fluency, argument and questioning skills in speaking and listening',
    'Write well-structured reports and summaries with logically sequenced ideas'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE322: Basic General Mathematics V (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE322', 'BASIC GENERAL MATHEMATICS V', 1, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'BASIC GENERAL MATHEMATICS V', ARRAY[
    'Construct and interpret frequency distribution tables, histograms and cumulative frequency curves',
    'Calculate and interpret the mode, median and mean of a data set',
    'Calculate and interpret the range, mean deviation and standard deviation of a data set',
    'Apply the concept of simple probability to solve real-world problems'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE323: Science and Technology in Society (1 credit)
-- FIXED: corrected truncation 'nd communication' → 'and communication'
-- FIXED: corrected typo 'scientic' → 'scientific'
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE323', 'SCIENCE AND TECHNOLOGY IN SOCIETY', 1, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'SCIENCE AND TECHNOLOGY IN SOCIETY', ARRAY[
    'Define the meaning and scope of science and technology',
    'Explain and apply the scientific method',
    'Describe traditional science and technology and explain its meaning and scope',
    'Analyse how traditional science and technology affects agriculture, healthcare, transport and communication',
    'Explain the relationship between science, policy and public decision-making',
    'Evaluate the problems and prospects of mechanisation of agriculture in Nigeria',
    'Critically assess the myth of technology transfer and the reality faced by developing nations'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- GSE324: Political Economy (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_GSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GSE324', 'POLITICAL ECONOMY', 1, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'POLITICAL ECONOMY', ARRAY[
    'Define the meaning and scope of political economy',
    'Analyse the political economy of feudalism, capitalism, welfarism and socialism',
    'Explain the political economy of underdevelopment with reference to Nigeria',
    'Evaluate the political economy of democratisation and military rule in the Third World',
    'Analyse the political economy of poverty',
    'Discuss the political economy of cultural development',
    'Critically assess the political economy of globalisation including liberalisation, privatisation, deregulation and marginalisation in the Nigerian context',
    'Examine the political economy of population, women and child welfare',
    'Analyse the political economy of resource development and allocation'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
COMMIT;