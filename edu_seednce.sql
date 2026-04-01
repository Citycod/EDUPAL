-- Seed file for NCE General Education Courses
-- Fixed: data quality issues in EDU222, EDU214, EDU311, EDU323, EDU215 title casing
-- Added: EDU112, EDU113, EDU121, EDU122, EDU123, EDU124, EDU125,
--         EDU211, EDU212, EDU223, EDU224, EDU324
BEGIN;
 
INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Education (General NCE)', 'NCE_EDU')
ON CONFLICT (nuc_code) DO NOTHING;
 
-- ============================================================
-- YEAR ONE - FIRST SEMESTER
-- ============================================================
 
-- EDU111: History of Education in Nigeria (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU111', 'HISTORY OF EDUCATION IN NIGERIA', 1, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'HISTORY OF EDUCATION IN NIGERIA', ARRAY[
    'Explain the concept and rationale of History of Education',
    'Describe the brief history of education in Ancient Greek and Roman societies',
    'Analyse the African Indigenous System of Education and African Traditional Education (ATE)',
    'Explain the development and features of Islamic Education in Nigeria',
    'Trace the history of Christian Missionary and Western Education in Nigeria',
    'Outline the development of Nigerian Education since 1960',
    'Describe the evolution of Junior Secondary Education in Nigeria'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU112: Educational Psychology I - Child Development (2 credits)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU112', 'EDUCATIONAL PSYCHOLOGY I - CHILD DEVELOPMENT', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'EDUCATIONAL PSYCHOLOGY I - CHILD DEVELOPMENT', ARRAY[
    'Define the meaning and scope of Educational Psychology',
    'Explain the relevance of Psychology to Teacher Education',
    'Describe human reproduction and the principles of human growth and development',
    'Identify and explain the stages and essential features of human growth and development up to adolescence (physical, social, emotional, intellectual and moral)',
    'Examine at least two theories of personality development (Sigmund Freud/Psychoanalytic Theory, Types Theory and Traits Theory)',
    'Discuss the concept and significance of individual differences',
    'Analyse the roles of heredity and environment in child development'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU113: Principles and Methods of Teaching Junior Secondary Education (2 credits)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU113', 'PRINCIPLES AND METHODS OF TEACHING JUNIOR SECONDARY EDUCATION', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'PRINCIPLES AND METHODS OF TEACHING JUNIOR SECONDARY EDUCATION', ARRAY[
    'State the objectives and categories of objectives in the teaching-learning process including instructional, behavioural and expressive objectives',
    'Formulate correct and measurable behavioural objectives',
    'Explain the principles underlying the choice of teaching methods at the Junior Secondary level',
    'Describe and apply teacher-centred methods: Lecture, Story Telling, Demonstration',
    'Describe and apply student-centred methods: Project, Discovery, Inquiry, Discussion and Play methods',
    'Distinguish between group instructional methods and individual instructional techniques',
    'Explain conventional/traditional methods and innovative or new instructional strategies',
    'Apply methods of teaching Population and Family Life Education (POP/FLE) including value clarification',
    'Prepare and present well-structured lesson plans',
    'Demonstrate effective classroom management skills',
    'Identify and describe the characteristics of a good teacher'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR ONE - SECOND SEMESTER
-- ============================================================
 
-- EDU121: Sociology of Education for Junior Secondary (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU121', 'SOCIOLOGY OF EDUCATION FOR JUNIOR SECONDARY', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'SOCIOLOGY OF EDUCATION FOR JUNIOR SECONDARY', ARRAY[
    'Explain the nature and scope of Sociology of Education',
    'Define socialization and identify its concepts, types and agencies',
    'Analyse the relationship between the child, the Junior School and group dynamics',
    'Discuss Nigerian attitudes and beliefs about population education',
    'Explain how quality of life can be improved through POP/FLE',
    'Identify the influence of various social factors on learning processes at the Junior Secondary level',
    'Analyse the relationship between social stratification and school achievement',
    'Explain the concept of culture and its dimensions in Junior Secondary Education',
    'Describe social change and evaluate education as a change agent in Nigeria',
    'Analyse the consequences of social change on Nigerian Education',
    'Describe the Junior Secondary School as a formal organisation',
    'Examine contemporary sociological issues in Junior Secondary Education such as national consciousness, religious tolerance, cultism, examination malpractice and drug abuse'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU122: Introduction to Teacher Education for Junior Secondary (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU122', 'INTRODUCTION TO TEACHER EDUCATION FOR JUNIOR SECONDARY', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO TEACHER EDUCATION FOR JUNIOR SECONDARY', ARRAY[
    'Explain the concept, aims and objectives of Junior Secondary Teacher Education',
    'Describe the roles of the Junior Secondary teacher in the school and as a member of a population group in Nigeria',
    'Define the concept of a profession and evaluate teaching as a profession in Nigeria',
    'Discuss the ethics of the teaching profession',
    'Identify professional organisations in teaching and other fields',
    'Explain UNESCO/ILO provisions on the status and profession of teaching worldwide',
    'Describe the role of the Teachers Registration Council of Nigeria (TRCN) in the professionalisation of teaching',
    'Develop a positive professional identity and self-image as a prospective Junior Secondary teacher'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU123: Philosophy of Education for Junior Secondary (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU123', 'PHILOSOPHY OF EDUCATION FOR JUNIOR SECONDARY', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'PHILOSOPHY OF EDUCATION FOR JUNIOR SECONDARY', ARRAY[
    'Explain the relevance and importance of Philosophy of Education to the student teacher',
    'Describe the school of Naturalism and the contributions of Rousseau and Herbert Spencer to Junior Secondary Education',
    'Describe the school of Idealism and the contributions of Plato, Thomas Aquinas and Hegel',
    'Describe the school of Realism and the contributions of Aristotle and Frederick Herbert',
    'Describe the school of Pragmatism and the contributions of Dewey and William James',
    'Describe the school of Existentialism and the contributions of Camus, Sartre and Kierkegaard',
    'Explain Africanism and the educational ideas of Nkrumah, Nyerere, Fafunwa and Majasan',
    'Discuss the practical methodological contributions of leading philosophers to Junior Secondary Education',
    'Define education as a concept and distinguish its processes: teaching, training, instruction, indoctrination, cultivation, facilitation and mentoring',
    'Explain the evolution and tenets of Developmentalism and the goals, aims and objectives of Nigerian Education',
    'Analyse philosophical concepts in relation to Junior Secondary Education such as rationality, justice, freedom, democracy and equality of educational opportunities'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU124: Theory and Practice of Child-Friendly Schools (2 credits)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU124', 'THEORY AND PRACTICE OF CHILD-FRIENDLY SCHOOLS', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'THEORY AND PRACTICE OF CHILD-FRIENDLY SCHOOLS', ARRAY[
    'Define Child Friendly Schools (CFS) and explain their underlying concept and key principles',
    'Explain the generic CFS principles derived from the Convention on the Rights of the Child: child-centredness, democratic participation and inclusiveness',
    'Describe quality education as holistic and multi-dimensional within the CFS framework',
    'Apply Principle 1: child rights and inclusive education in a school setting',
    'Apply Principle 2: effective teaching and learning environments',
    'Apply Principle 3: safe, supportive and protective learning environments',
    'Apply Principle 4: healthy and health-seeking learning environments',
    'Apply Principle 5: gender-sensitive learning environments',
    'Apply Principle 6: democratic participation and partnership building',
    'Explain the Nigerian policy context and policies that promote the CFS approach',
    'Describe Child-Friendly Schools standards and indicators for teacher education',
    'Prepare lessons using child-centred, interactive and constructivist methodologies',
    'Identify facilities and resources required in a Child-Friendly School',
    'Assess teaching practice in a CFS environment',
    'Explain the use of technology in CFS learning and teaching',
    'Outline strategies for mainstreaming CFS concepts and principles in Nigeria'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU125: Education Psychology II - Human Learning (2 credits)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU125', 'EDUCATIONAL PSYCHOLOGY II - HUMAN LEARNING', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'EDUCATIONAL PSYCHOLOGY II - HUMAN LEARNING', ARRAY[
    'Define and explain the concept of learning',
    'Describe and apply behaviourist theories of learning in the classroom',
    'Describe and apply cognitivist theories of learning in the classroom',
    'Describe and apply constructivist theories of learning in the classroom',
    'Explain transfer of learning and identify factors that affect learning',
    'Discuss the role of motivation in the learning process',
    'Evaluate the practical application of reward and punishment in education',
    'Distinguish between memory, rote-learning and over-learning',
    'Explain the processes of remembering and forgetting',
    'Analyse the effects of rural and urban settings on learning and strategies for managing overcrowded classrooms'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR TWO - FIRST SEMESTER
-- ============================================================
 
-- EDU211: Practicum in Classroom Management and School Organisation (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU211', 'PRACTICUM IN CLASSROOM MANAGEMENT AND SCHOOL ORGANISATION', 1, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'PRACTICUM IN CLASSROOM MANAGEMENT AND SCHOOL ORGANISATION', ARRAY[
    'Explain the concept of classroom management and organisation',
    'Demonstrate effective classroom organisation, arrangement and leadership',
    'Apply practical strategies for class control and maintenance',
    'Maintain accurate class records including the attendance register and result master sheet',
    'Complete and interpret a pupil report card and dossier (cumulative record)',
    'Develop a course syllabus, scheme of work and record of work',
    'Demonstrate effective use of instructional materials in relation to the learner',
    'Maintain appropriate class discipline',
    'Explain the concept and essence of school-public relations',
    'Identify factors influencing school-public relations',
    'Describe and dramatise staff-management, student-staff and parent-staff relations',
    'Evaluate the Junior Secondary School environment including school programme, performance and tone'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU212: Educational Technology: Theory and Practice (2 credits)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU212', 'EDUCATIONAL TECHNOLOGY: THEORY AND PRACTICE', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'EDUCATIONAL TECHNOLOGY: THEORY AND PRACTICE', ARRAY[
    'Explain the concept and history of Educational Technology in Nigeria',
    'Describe the place of Educational Technology in communication and the teaching-learning process at the Junior Secondary level',
    'Explain the concept and process of communication',
    'Apply the Systems Approach to Instruction (SAI) at the Junior Secondary level',
    'Identify and utilise multi-media in Junior Secondary Education including interdisciplinary applications',
    'Demonstrate the use of computer-assisted teaching and learning at the Junior Secondary level',
    'Apply the Enter-Educate approach to teaching Population and Family Life Education (POP/FLE)',
    'Design, produce, improvise, use, maintain, store and retrieve educational media for the Junior Secondary level',
    'Identify and utilise community resources in Junior Secondary Education',
    'Demonstrate practical skills in photocopy and video production'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU213: Micro-Teaching - Theory (1 credit)
-- FIXED: added 'Closure' and 'Evaluation' which were in the curriculum but missing from original seed
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU213', 'MICRO-TEACHING - THEORY', 1, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'MICRO-TEACHING - THEORY', ARRAY[
    'Explain the concept and process of Micro-Teaching',
    'Justify the relevance of Micro-Teaching to Teacher Education',
    'Demonstrate Micro-Teaching practicum skills with emphasis on teach/re-teach cycles',
    'Apply the skill of Set Induction to engage learners at the start of a lesson',
    'Apply Stimulus Variation techniques to sustain learner attention',
    'Use Planned Repetition effectively to reinforce learning',
    'Apply Reinforcement strategies appropriately in classroom interactions',
    'Demonstrate effective Non-Verbal Communication during teaching',
    'Use effective Questioning techniques to promote higher-order thinking',
    'Apply Closure techniques to consolidate learning at the end of a lesson',
    'Conduct formative Evaluation of micro-teaching sessions',
    'Evaluate the merits and demerits of Micro-Teaching as a teacher preparation strategy'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU214: Introduction to Research Methods (1 credit)
-- FIXED: merged fragmented array entries into coherent learning objectives
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU214', 'INTRODUCTION TO RESEARCH METHODS', 1, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO RESEARCH METHODS', ARRAY[
    'Explain the nature and meaning of research',
    'Distinguish between pure research and action/applied research',
    'Describe historical research, descriptive survey and experimental research',
    'Differentiate between quantitative, qualitative and eclectic/triangulation research approaches',
    'Outline the research process from problem identification to reporting',
    'Select and justify appropriate research topics in Junior Secondary Education',
    'Conduct a review of related literature relevant to a research topic',
    'Describe and apply quantitative data collection techniques including Likert-type questionnaires, tests and experiments',
    'Describe and apply qualitative data collection techniques including structured, semi-structured and unstructured interviews, participant and non-participant observation, and use of documents, artefacts and audio-visual materials',
    'Assess the reliability and validity of research instruments',
    'Organise and analyse quantitative data using frequency counts, percentages and graphs',
    'Organise and analyse qualitative data using content analysis, transcription, documentary analysis and historical analysis',
    'Write a coherent research proposal',
    'Write a well-structured research report',
    'Apply correct bibliography techniques including references and citations'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU215: Education of Special Target Groups (1 credit) - Elective
-- FIXED: title casing standardised to ALL CAPS
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU215', 'EDUCATION OF SPECIAL TARGET GROUPS', 1, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'EDUCATION OF SPECIAL TARGET GROUPS', ARRAY[
    'Explain the rationale, objectives and principles of education for adults, women and migrants',
    'Describe the principles and strategies of non-formal education',
    'Explain the principles and strategies of Distance Education (DE), Open and Distance Learning (ODL) and Distance Learning Systems (DLS)',
    'Analyse issues, problems and prospects of women education in Nigeria',
    'Describe nomadic education principles and practices in Nigeria',
    'Explain the principles and strategies for the education of migrant fishermen',
    'Identify and discuss educational provisions for other sub-cultural groups such as traders and artisans'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR TWO - SECOND SEMESTER
-- ============================================================
 
-- EDU221: Curriculum Studies I (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU221', 'CURRICULUM STUDIES I', 1, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'CURRICULUM STUDIES I', ARRAY[
    'Define the meaning and scope of curriculum',
    'Explain basic curriculum concepts and the curriculum as a teaching plan',
    'Distinguish between broad fields/integrated, core, and single subject/discrete subject curriculum designs',
    'Differentiate between official/formal and informal/hidden curriculum',
    'Compare teacher-centred and student-centred/activity curriculum perspectives',
    'Trace the history of Junior Secondary Curriculum Development in Nigeria',
    'Identify the agencies of Junior Secondary Curriculum Development in Nigeria including Federal and State Ministries of Education, NERDC, NUC, NCCE, NBTE, WAEC, NECO and STAN'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU222: Measurement and Evaluation (2 credits)
-- FIXED: removed EDU223 course description text that had leaked into this entry's objectives array
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU222', 'MEASUREMENT AND EVALUATION', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'MEASUREMENT AND EVALUATION', ARRAY[
    'Define the meaning and scope of measurement and evaluation',
    'Explain the functions of measurement and evaluation for teachers',
    'Collect and analyse demographic data relevant to Junior Secondary Education',
    'Classify and use tests appropriately at the Junior Secondary level',
    'Construct and validate teacher-made tests and standardised tests',
    'Apply basic statistics including measures of central tendency, spread, dispersion and variability',
    'Explain census and vital registration in Junior Secondary Education',
    'Define continuous assessment and discuss its meaning, scope, principles, prospects and problems in Junior Secondary Education',
    'Construct, use and interpret Norm-Referenced Tests (NRT) and Criterion-Referenced Tests (CRT) for the Junior Secondary level',
    'Apply examination ethics in educational assessment',
    'Use observation techniques, checklists and rating scales to assess the non-cognitive domain',
    'Apply self-reporting techniques including interviews, questionnaires and inventories',
    'Apply sociometric techniques in classroom assessment',
    'Apply projective techniques in educational assessment'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU223: Microteaching Practicum (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU223', 'MICROTEACHING PRACTICUM', 1, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'MICROTEACHING PRACTICUM', ARRAY[
    'Demonstrate all micro-teaching skills covered in EDU213 in a supervised practicum setting',
    'Conduct teach and re-teach cycles incorporating peer and supervisor feedback',
    'Receive, reflect on and act upon formative feedback from supervisors and peers',
    'Produce a self-evaluation of micro-teaching performance across multiple practicum sessions'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU224: Educational Administration, Planning and Supervision (2 credits)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU224', 'EDUCATIONAL ADMINISTRATION, PLANNING AND SUPERVISION', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'EDUCATIONAL ADMINISTRATION, PLANNING AND SUPERVISION', ARRAY[
    'Explain the concept of organisation and distinguish between types of organisations',
    'Define educational administration and management and describe its general principles',
    'Demonstrate resource management and maintenance of Junior Secondary school records',
    'Use population and related data for educational planning and administration',
    'Describe the control structure of Junior Secondary Education in Nigeria',
    'Apply strategies for maintaining discipline in Junior Secondary Schools',
    'Plan school programmes including budgeting, sports, examinations and founders day',
    'Explain the financing of Junior Secondary Education',
    'Identify and apply different leadership styles in a school context',
    'Explain education laws and regulations governing Junior Secondary Schools',
    'Define the concept and purposes of Junior Secondary School supervision',
    'Distinguish between types of supervision including full inspection, routine inspection, follow-up visits, sampling visits, special visits and internal supervision',
    'Describe the qualities of a good educational supervisor',
    'Compare traditional and modern supervisory methods and apply the principles of supervision',
    'Analyse the challenges and problems of Junior Secondary School supervision in Nigeria'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU225: Introduction to Special Education (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU225', 'INTRODUCTION TO SPECIAL EDUCATION', 1, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO SPECIAL EDUCATION', ARRAY[
    'Trace the historical development of Special Education with particular reference to Nigeria',
    'Explain the National Policy on Education as it relates to Special Education',
    'Identify and describe the types of exceptionalities',
    'Explain the causes, characteristics, identification and intervention strategies for each type of exceptionality',
    'Discuss attitudes, beliefs and the philosophy of education for exceptional children',
    'Describe the general problems and symptoms associated with each type of exceptionality',
    'Explain the concept and implementation of Inclusive Education',
    'Demonstrate interdisciplinary collaboration in an Inclusive Classroom',
    'Create and manage an Inclusive Classroom environment',
    'Apply appropriate methodology in an Inclusive Classroom setting'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR THREE - FIRST SEMESTER
-- ============================================================
 
-- EDU311: Teaching Practice (6 credits)
-- FIXED: replaced procedural/administrative prose with proper learning objectives;
--        corrected broken apostrophes
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU311', 'TEACHING PRACTICE', 6, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'TEACHING PRACTICE', ARRAY[
    'Plan and deliver well-structured lessons using appropriate instructional methods for the Junior Secondary level',
    'Select and integrate relevant instructional technology into classroom teaching',
    'Demonstrate competence across all micro-teaching skills through model teaching, assessment and feedback cycles',
    'Respond constructively to supervisory feedback from a minimum of ten supervisions per student',
    'Apply subject-specific content knowledge effectively in a real classroom environment',
    'Maintain required teaching practice records including lesson plans, schemes of work and records of work',
    'Manage a real classroom environment including discipline, organisation and learner engagement',
    'Reflect critically on personal teaching performance and identify areas for improvement'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- ============================================================
-- YEAR THREE - SECOND SEMESTER
-- ============================================================
 
-- EDU321: Curriculum Studies II (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU321', 'CURRICULUM STUDIES II', 1, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'CURRICULUM STUDIES II', ARRAY[
    'Explain each stage of the curriculum process: planning, development, implementation and evaluation',
    'Apply curriculum development strategies appropriate to Junior Secondary Education',
    'Describe the role of curriculum research in improving educational provision',
    'Explain the concept and approaches of curriculum innovation'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU322: Adolescent Psychology (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU322', 'ADOLESCENT PSYCHOLOGY', 1, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'ADOLESCENT PSYCHOLOGY', ARRAY[
    'Define the meaning and scope of Adolescent Psychology',
    'Describe and evaluate major theories of adolescence',
    'Explain physical, moral, social, intellectual and emotional growth and development during adolescence',
    'Analyse the educational implications of early and late maturation',
    'Identify the developmental tasks of the adolescent',
    'Discuss adolescent concerns and problems including drug abuse, sexuality, school adjustment, religion, politics, examination malpractice, cultism and armed robbery',
    'Examine the challenges faced by adolescents in the home, school and wider society',
    'Apply educational interventions, approaches, strategies and counselling techniques during adolescence'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU323: Research Project (2 credits)
-- FIXED: replaced procedural/administrative prose with proper learning objectives;
--        corrected broken apostrophes
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU323', 'RESEARCH PROJECT', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'RESEARCH PROJECT', ARRAY[
    'Identify and justify an original research problem in Education or the student''s major teaching subject',
    'Conduct a comprehensive review of related literature',
    'Design an appropriate research methodology including data collection instruments',
    'Collect, organise and analyse research data using suitable quantitative or qualitative methods',
    'Interpret findings and draw evidence-based conclusions',
    'Write a complete, well-structured research project report',
    'Defend research findings before an internal supervisor and external assessor'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU324: Introduction to the Theory and Practice of Guidance and Counselling (1 credit)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU324', 'INTRODUCTION TO THE THEORY AND PRACTICE OF GUIDANCE AND COUNSELLING', 1, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO THE THEORY AND PRACTICE OF GUIDANCE AND COUNSELLING', ARRAY[
    'Define guidance and counselling, distinguish between them and explain their goals',
    'Trace the history and development of guidance and counselling practices in Nigeria',
    'Describe and compare major theories of counselling',
    'Explain the ethics of the counselling profession',
    'Describe the range of guidance services available in schools',
    'Demonstrate effective communication skills used in guidance',
    'Apply study skills techniques relevant to student development',
    'Explain health counselling issues including AIDS, drug abuse, alcoholism and smoking',
    'Identify and describe tests used in guidance and counselling',
    'Explain career education and development and its relation to the labour market',
    'Discuss sex education and marriage counselling in a school context',
    'Describe the organisation and administration of guidance and counselling in schools',
    'Outline the requirements for establishing a counselling centre in a school setting'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
-- EDU325: Introduction to Adult and Non-Formal Education (1 credit) - Elective
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'NCE_EDU'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU325', 'INTRODUCTION TO ADULT AND NON-FORMAL EDUCATION', 1, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'INTRODUCTION TO ADULT AND NON-FORMAL EDUCATION', ARRAY[
    'Define the nature and scope of adult education',
    'Analyse the problems and prospects of adult education in Nigeria',
    'Describe the characteristics of the adult learner',
    'Identify and apply appropriate methods and materials for teaching adult learners',
    'Explain the relationship between adult education and human resources development in Nigeria',
    'Analyse the contribution of adult education to national development including community, political and socio-economic dimensions',
    'Identify and describe the types of adult education organisations',
    'Compare adult education programmes across different cultures'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;
 
COMMIT;