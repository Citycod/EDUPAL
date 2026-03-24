-- Seed file for NUC English Curriculum
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('LAS Program', 'LAS')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LAS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LAS402', 'Entrepreneurship in Language Education', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Entrepreneurship in Language Education', ARRAY[
    'Define entrepreneurship in language education.',
    'State the importance of entrepreneurship in language education.',
    'Give examples of entrepreneurship in language education.',
    'Discuss the characteristics of successful entrepreneurs.',
    'State the advantages of entrepreneurship in language education.',
    'Identify the modalities for planning entrepreneurial ventures.',
    'Explain the types of entrepreneurship in language education.',
    'Identify the factors affecting entrepreneurship in language education.',
    'Apply the rule to practice entrepreneurship in language education; and 10. examine case studies of successful entrepreneur in language education.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('English', 'ENG')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG402', 'Pragmatics', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Pragmatics', ARRAY[
    'Understand the functions and behaviors of the English Language and their sociocultural implications.',
    'Interpret the theories of English and apply them in national context.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG403', 'Psycholinguistics', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Psycholinguistics', ARRAY[
    'Acquire competences in the meaning structure and impact of the English language on the African experience and African psyche.',
    'Identify and correct defects in language usage based on physical challenges including tools for language understanding and usage by the mentally challenged citizens.',
    'Help mentally or physically challenge in understanding and usage of English language in communication.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG404', 'Multilingualism', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Multilingualism', ARRAY[
    'Appreciate the role of the English language and its impact on the development of indigenous languages.',
    'Contribute to the growth and development of indigenous language and viability for survival outside of the English language dominance in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG405', 'English for Specific Purposes', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'English for Specific Purposes', ARRAY[
    'Develop English Language effective usage in various technical vocational circumstances.',
    'Establish the character, form and nature of English for academic purposes such as thesis writing, academic essay writing and others.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('LIT Program', 'LIT')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIT'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIT104', 'Introduction to Poetry', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Poetry', ARRAY[
    'Acquire the basic techniques and principles for comprehending basic poetic forms and traditions of all traditions.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIT'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIT105', 'Introduction to Prose Literature', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Prose Literature', ARRAY[
    'Establish the influences and impact of the English novel on the African and Nigerian novels.',
    'Appreciate the distinctive features context between the English and African.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIT'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIT106', 'Introduction to Drama', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Drama', ARRAY[
    'Understand the performance elements in African drama different from the western classical notion.',
    'Identity African Theatre and Drama scholars and their proposition of the tenets of African drama.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LAS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LAS244', 'Method I-Teaching Grammar, Lexis and Oracy Skills', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Method I-Teaching Grammar, Lexis and Oracy Skills', ARRAY[
    'Practise habits of correct pronunciation.',
    'Teach correct pronunciation.',
    'Recognise linguistic and cultural impediments to correct English usage in ESL classrooms.',
    'Practise performance in speech making.',
    'Discriminate sounds in isolated word forms.',
    'Produce intonation patterns.',
    'Discriminate stress patterns within words.',
    'Recognise variation in stress in connected speech.',
    'Apply different methods and techniques to the teaching of grammar, lexis, and oracy skills.',
    'Express information implicitly.',
    'Mention communicative functions of sentences and utterances.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LAS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LAS245', 'Method II-Teaching Literacy Skills and Literature', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Method II-Teaching Literacy Skills and Literature', ARRAY[
    'Define literacy in its various forms.',
    'Explain the inter-connectivity of reading and writing.',
    'Identify reading processes, components, levels, skills and methods.',
    'Monitor students’ comprehension.',
    'Identify the rules of summary writing.',
    'Apply the rules of summary writing.',
    'Apply different methods and techniques to teach reading and comprehension at different levels.',
    'Identify the series of writing skills with corresponding teaching methodology.',
    'Apply different methods to teach different types of essay.',
    'Apply the knowledge about literacy to reading in other subjects.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG201', 'An Introduction to Morphology and Syntax', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'An Introduction to Morphology and Syntax', ARRAY[
    'Should possess knowledge of the principles, structures and systems of the English Language.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG203', 'Introduction to General Phonetics and Phonology I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to General Phonetics and Phonology I', ARRAY[
    'Apply the phonology and classifications of various languages.',
    'Apply them to the teaching of English in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG204', 'Introduction to General Phonetics and Phonology II', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to General Phonetics and Phonology II', ARRAY[
    'Use phonetics of sound systems of various languages practically.',
    'Distinguish them from English Language in communication.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG205', 'Advance English Composition I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Advance English Composition I', ARRAY[
    'Acquire technical tools for writing in special and professional situations.',
    'Develop distinctive registers and styles for special writing, including scholarly writing, protocol writing and journalistic and media composition.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG207', 'Varieties of English (Including English based Pidgins and Creoles)', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Varieties of English (Including English based Pidgins and Creoles)', ARRAY[
    'State and utilize English of various ages.',
    'State the impact of the internationality of the English language.',
    'Express the impact of regional and contextual situations on the standard English usage.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG209', 'Language and Society', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Language and Society', ARRAY[
    'Apply the English Language to various social genders, educational and political settings.',
    'Identify and deploy the English Language and the usage in various context and situations.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG211', 'English Morphology', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'English Morphology', ARRAY[
    'Should master the word structures and their various applications in various contexts.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LAS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LAS324', 'Issues in Language Education', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Issues in Language Education', ARRAY[
    'Define language.',
    'Identify the features of human language.',
    'State the relevance and importance of language and language education.',
    'Describe the nature of language and structure.',
    'Describe the socio-linguistic classifications and functions of language (L1, L2, Foreign Language and Lingua Franca).',
    'Discuss language provisions in the National policy on Education.',
    'List the factors influencing language teaching and learning.',
    'Differentiate between bilingualism and multilingualism in different cultural contexts.',
    'Identify interference and attitudinal issues in language pedagogy.',
    'Discuss language problems in developed and developing nations with special reference to Nigeria, Anglo and Francophone countries.',
    'Identify language learning problems and disabilities.',
    'Mention language development agencies in Nigeria and discuss their contributions.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LAS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LAS348', 'Theories of Learning Applied to Language Education', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Theories of Learning Applied to Language Education', ARRAY[
    'Define theory.',
    'Explain the importance of theory.',
    'Explain psychological foundations of education in relation to language pedagogy.',
    'Identify the major theories of language learning and the proponents.',
    'Discuss the implications of theories to language pedagogy.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG302', 'Phonology of English', 3, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Phonology of English', ARRAY[
    'Understand the nature of sounds and their behaviours in speech contexts.',
    'Deploy English sounds and written nuances to construction and composition of speech and essays and various forms of writing.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG303', 'Introduction to Applied Linguistics', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Applied Linguistics', ARRAY[
    'Apply the structure of languages to construction and language competence to technical specialized situations such as computer technology and artificial intelligence situations.',
    'Detect causes and resolutions of speech defect in language use.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG304', 'Introduction to Semantics', 3, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Semantics', ARRAY[
    'Gain competence in writing and composition making, various types of meaning from word and sentence structures.',
    'Develop distinctive styles of writing through meaning generation competence from theories of meaning derived from word phrase sentence clusters of grammar.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG305', 'The English Language in Nigeria', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'The English Language in Nigeria', ARRAY[
    'Differentiate between Nigerian Englishes and their influence on standard English.',
    'Identify the distinctive character of Nigerian English and standard English and using them at the appropriate context.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG306', 'Discourse Analysis', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Discourse Analysis', ARRAY[
    'Gain competence in analysis and criticism of text and composition of speeches and writings in specialized situations like advertisements tributes cartoons and courtesies.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG307', 'The Sociolinguistics of English', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'The Sociolinguistics of English', ARRAY[
    'Understand the political usages of English languages in various political contexts.',
    'Develop English language registers appropriate to Nigeria situation and context such as technological register for technological findings and innovation.',
    'Make proposition for the development of a national language through indigenous languages.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIT'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIT308', 'Creative Writing II', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Creative Writing II', ARRAY[
    'Should write a one act play, slim volume of poems and novelette.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG101', 'A Survey of the English Language', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'A Survey of the English Language', ARRAY[
    'Acquire competence in the conventions and rudiments of the grammar and phonology of English language.',
    'Display basic grasp on skills of communication in written and spoken forms of English Language.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG102', 'Introduction to English Grammar and Composition', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to English Grammar and Composition', ARRAY[
    'Understand the structure of the English language.',
    'State its basic conventional rules.',
    'Compose writing, using basic structure of the English language.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ENG'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENG103', 'Spoken English (Practical)', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Spoken English (Practical)', ARRAY[
    'Maintain firm grips of language technical tools.',
    'Hold intelligible conversations in the English Language.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

COMMIT;
