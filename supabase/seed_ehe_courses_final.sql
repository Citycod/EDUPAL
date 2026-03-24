-- Seed file for Health Education (EHE) - CCMAS Structure
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Health Education', 'EHE')
ON CONFLICT (nuc_code) DO NOTHING;

-- EHE111: Introduction to Health Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE111', 'Introduction to Health Education', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Health Education', ARRAY[
    'Explain the meaning of health and health education',
    'Discuss basic principles, history, prominent philosophies, and issues related to health education',
    'Identify key historical events that have contributed to modern health education',
    'Explain scientific, behavioral, cultural, social, legal and educational foundations of health education',
    'Assess individual and community needs for health education',
    'Explain the role of a health educator in health care as well as within culturally diverse populations and numerous settings',
    'Develop health attitudes and habits among students',
    'Act as a resource person in health education',
    'Organize health education activities; and',
    'Build a good healthy condition through classroom and school environment'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE113: Personal Health & Dental Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE113', 'Personal Health & Dental Education', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Personal Health & Dental Education', ARRAY[
    'Demonstrate understanding of health principles incorporating some aspects of personal health maintenance',
    'Identify risk behaviors that affect health',
    'Rate his or her understanding of self-responsibility for personal health and wellness; and',
    'Indicate the implication of personal and societal behaviors on dental and oral health diseases'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE114: Environmental Health
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE114', 'Environmental Health', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Environmental Health', ARRAY[
    'Illustrate through case example(s), ways in which environmental factors in community, occupational and residential settings impact health',
    'List the major agencies and organizations involved in environmental health protection',
    'Assess interdisciplinary and global impacts of human-environment relationships',
    'Explain the basic responsibilities, programmes and problems of environmental health agencies in Nigeria',
    'Examine personal contributions to environmental degradation and their potential health consequences; and',
    'Describe the role of environmental health in public and population health'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE117: Human Growth & Development
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE117', 'Human Growth & Development', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Human Growth & Development', ARRAY[
    'Explain growth and development and their characteristics',
    'Demonstrate an understanding of the role of parents, teachers and mentors in providing safe and positive environments for development',
    'Summarize theories related to human growth and development',
    'Obtain health-related data about growth and development factors, needs and interests',
    'Explain how heredity and environment influence human development',
    'Discuss early childhood education and its influence on cognitive development',
    'Describe the changes that occur physically, cognitively and socio-emotionally during middle childhood and adolescence',
    'Analyze ageism and stereotypes associated with late adulthood',
    'Evaluate ways to promote continued wellness and mitigate declining health associated with ageing; and',
    'Demonstrate an understanding and appreciation for the diverse potential of all students'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE120: Introduction to Community and Public Health
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE120', 'Introduction to Community and Public Health', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Community and Public Health', ARRAY[
    'Explain the core functions of public health with an emphasis on community health programmes and current trends of population health',
    'Identify public health problems to develop appropriate public health, education programme based on sound theoretical foundations of health behavior',
    'Design community health educational programmes for identified health problems for at-risk populations and communities',
    'Analyze evidence based and innovation best practices of healthy behavior to appropriate audiences',
    'Demonstrate effective communication advocacy skills for populations; and',
    'Describe the role of community health practice in maximizing the health status of all populations'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE101: General Biology I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE101', 'General Biology I', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Biology I', ARRAY[
    'Explain cells structure and organizations',
    'Summarize functions of cellular organelles',
    'Characterize living organisms and state their general reproduction',
    'Describe the interrelationship that exists between organisms',
    'Discuss the concept of heredity and evolution; and',
    'Enumerate habitat types and their characteristics'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE211: Methods and Resources in Health Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE211', 'Methods and Resources in Health Education', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Methods and Resources in Health Education', ARRAY[
    'Describe many aspects of fundamental strategies for health education, including conceptualizing instruction, developing instructional objectives, planning units/ lessons and presentations; becoming familiar with various traditional and digital instructional methods and materials; and evaluating the effectiveness of health instruction in schools and community and other settings',
    'Develop print health educational materials for teaching, learning and communicating health information',
    'Practice a variety of in-person as well as digital, health education methods',
    'Apply the principles of developing and delivering effective multimedia hybrid presentation and educational intervention',
    'Select appropriate learning materials and methods in health education programmes',
    'Evaluate health education resources available from a variety of sources including the internet and mobile apps',
    'Outline the technical and production aspects of materials and media considered in laboratory sessions; and',
    'Develop health education materials and learning activities though fieldwork in addition to in-class and laboratory session'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE212: School Health Education Programme
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE212', 'School Health Education Programme', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'School Health Education Programme', ARRAY[
    'Explain the factors for operating effective school health programme including the teacher''''s role in health appraisal and in effecting healthful school living',
    'Develop a school health programme',
    'Plan school health programme activities',
    'Implement case examples of school health counselling; and',
    'Evaluate an existing school health programme'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE213: Human Anatomy and Physiology
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE213', 'Human Anatomy and Physiology', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Human Anatomy and Physiology', ARRAY[
    'Explain the organisation of the human body',
    'Identify the major anatomical structures of the body',
    'Describe the systems and processes involved in maintaining life and homeostasis in the human body; and',
    'Analyze muscle movements in relation to human anatomy'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE313: Research Methods in Health Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE313', 'Research Methods in Health Education', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Research Methods in Health Education', ARRAY[
    'Explain basic concepts of research and research in health education',
    'Describe how to conduct a research study applying appropriate research procedures and protocol',
    'Compare the fundamentals of quantitative and qualitative research and mixed method approaches, including experimental and survey researches',
    'Develop a better understanding of collecting, analyzing and interpreting valid and reliable data',
    'Learn the basic procedures involved in the design and implementation of evaluation research',
    'Apply appropriate research principles and methods in health education; and',
    'Evaluate basic knowledge and application of appropriate research principles and methods in health education'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE314: Substance Use and Abuse Prevention
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE314', 'Substance Use and Abuse Prevention', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Substance Use and Abuse Prevention', ARRAY[
    'Estimate the magnitude and trends in substance use and abuse',
    'Describe the consequences of substance use and abuse on health and development',
    'Explain the methods, materials and theories of drug abuse prevention in school and community',
    'Examine both licit and illicit substances; drug addiction and drug dependency',
    'Develop skills for avoiding destructive behaviors, including substance control and cessation; and',
    'Appraise existing programmes and policies designed to prevent substance use and abuse'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE315: Maternal, Infant & Child Health
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE315', 'Maternal, Infant & Child Health', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Maternal, Infant & Child Health', ARRAY[
    'Provide a comprehensive overview of critical and contemporary women''''s health issues',
    'Identify the major health issues confronting women today',
    'Discuss the characteristics and health needs of children in infancy and early childhood period and indices of such children',
    'Describe the common infant and child health concerns at different points in development and protective measures; and',
    'Evaluate maternal and child health and child survival programmes'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE317: Health Psychology & Counselling
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE317', 'Health Psychology & Counselling', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Health Psychology & Counselling', ARRAY[
    'Discuss the concept of health psychology; its rationale for health psychology and health behaviors',
    'Describe the behavioral processes around health and sickness, and a wide-range of approaches, from advanced research methods, through a working and evidence-based knowledge of theory and behavior-change interventions',
    'Describe how behavioral theories and models can be used to explain and health problems',
    'Examine the key features of selected behavior change theories and program planning models in health education',
    'Evaluate psychological issues in advancing and terminal illness; and',
    'Explain the principles and techniques of identifying students'''' health problems with emphasis on personalized approaches, such as conferences and interviews',
    'Apply counselling strategies to promote health behavior change; demonstrate how to help people change unhealthy behaviors by using motivational interviewing and basic counselling strategies; and',
    'Evaluate why health counselling is an important skill for health educators'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE320: First Aid, Accident Prevention and Safety Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE320', 'First Aid, Accident Prevention and Safety Education', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'First Aid, Accident Prevention and Safety Education', ARRAY[
    'Explain the meaning and principles of first aid and first aid management of selected emergency situations',
    'Explain safety education and safety tasks of teachers',
    'Describe accident prevention and management techniques including accident reporting',
    'Develop general safety skills programmes and techniques in schools and environment; and',
    'Analyze the importance and relevance of safety programmes in schools and the environment in general'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE321: Application of Computer Skills & Health Informatics
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE321', 'Application of Computer Skills & Health Informatics', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Application of Computer Skills & Health Informatics', ARRAY[
    'Apply computer in health diagnostics and treatment of complicated ailments',
    'Use data to improve human health and health care services',
    'Explain trends in health informatics; health informatics technology in population; human computer interaction; information system in health care; IT and cyber security; web technologies and cloud computing; Geographic Information System (GIS); modern information technology and health service statistics; and',
    'Utilize computerized health information retrieval system effectively'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE322: Life Skills & Skilled-Based Health Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE322', 'Life Skills & Skilled-Based Health Education', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Life Skills & Skilled-Based Health Education', ARRAY[
    'Discuss the importance of health education skills, their relevance and relationships to other learned skills',
    'Present steps for developing health skills',
    'Practice health skills using real-life scenarios',
    'Discuss key considerations when teaching the skills of health education',
    'Evaluate the impact of social media and other environmental factors in personal and family health',
    'Demonstrate strategies to prevent, manage or resolve interpersonal conflicts without harming self or others',
    'Apply effective verbal and non-verbal communication skills to enhance relationship health',
    'Select a variety of communication methods and techniques in providing health information',
    'Choose healthy alternatives over unhealthy alternatives when making a decision about health; and',
    'List the steps of effective health goal setting'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE324: Epidemiology of Public Health & Human Biometrics
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE324', 'Epidemiology of Public Health & Human Biometrics', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Epidemiology of Public Health & Human Biometrics', ARRAY[
    'Explain the types of epidemiological investigations',
    'Analyze the causes, patterns and distribution of disease outbreaks in different populations',
    'Explain the methods for monitoring, evaluating and managing population health',
    'Discuss the nature, types, sources and collection of health data/human biometrics',
    'Describe the use of descriptive and inferential statistical techniques in processing and analyzing health data',
    'Explain the principal subdivision of vital statistics/human biometrics and their rates; and',
    'Prepare epidemiological reports'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE401: Contemporary National Health Programmes, Issues and Problems in Health Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE401', 'Contemporary National Health Programmes, Issues and Problems in Health Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Contemporary National Health Programmes, Issues and Problems in Health Education', ARRAY[
    'Discuss the aims, objectives and achievements of National Health Programmes recorded',
    'Identify various international and national health issues and problems',
    'Describe the factors associated with current health issues',
    'Describe the role of a health educator in preventing health issues and promoting health among diverse groups',
    'Discuss the concepts of public health and the resultant health-related issues emanating from human activities and behaviors as well as the types and characteristics of health care systems; and',
    'Evaluate the issues and problems arising from the levels of health care delivery system outlined in the national health policy'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE402: Occupational & Industrial Health Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE402', 'Occupational & Industrial Health Education', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Occupational & Industrial Health Education', ARRAY[
    'Explain the meaning, rationale and historical background of occupational health with emphasis on Nigeria',
    'Highlight the advantages of occupational health',
    'Explain the responsibilities of employees in work environment; occupational safety; occupational hazards and hygiene; and',
    'Evaluate the human and environmental health in relation to the effects of the operation of industries; security and safety in industries; industrial affluence control, health and safety of industrial workers'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE403: Health Economics & Consumerism
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE403', 'Health Economics & Consumerism', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Health Economics & Consumerism', ARRAY[
    'Explain the concept of health economics',
    'Discuss economic considerations in health care and health care as an economic commodity; health care financing, planning, budgeting and decision making',
    'Comprehend the fundamentals of social marketing as well as health literacy and how these concepts should be used to create more effective health education and health promotion programmes',
    'State consumer health and psychological factors in consumerism, healing philosophies, food faddism, and weight control measures, consumer protection',
    'Assess the needs and technological practices of potential users',
    'Apply existing measures designed for the safety of products, information and services for consumers, including the concepts and recognition of health quackery and nostrum; and',
    'Evaluate the roles of government and health agencies in consumer protection, including economic considerations in health care financing, planning, budgeting and decision making'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE404: Organisation, Planning and Evaluation of Health Education Programmes
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE404', 'Organisation, Planning and Evaluation of Health Education Programmes', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Organisation, Planning and Evaluation of Health Education Programmes', ARRAY[
    'Organize programme activities in public health',
    'Identify the key concepts related to organization and administrative processes in health education programs and services',
    'Apply the principles and steps in planning school and health education program in primary and secondary schools; and in the measurement of needs',
    'Plan effective health education programmes through formulating appropriate and measurable program objectives',
    'Develop plans to assess the achievement of programme objectives',
    'Apply evaluation methods to understand the effect of health education and health behavior interventions',
    'Construct a logical scope and sequence plan for a health education programme',
    'Learn about the necessity of early alignment between assessment and evaluation in health education program planning',
    'Articulate the role of systematic evaluation in health education',
    'Design an evaluation plan that is suitable for a specific programme',
    'Evaluate the health education programme organisation, personnel problems, national policies, public relations, budgeting, working with staff members, student teachers and students in discipline; and',
    'Implement evaluation plans for health education programme using appropriate evaluation approaches'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE407: Seminar in Health Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE407', 'Seminar in Health Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Seminar in Health Education', ARRAY[
    'Acquire skills of researching and writing empirical and non-empirical papers',
    'Present papers on selected current national and international health problems, programmes or issues',
    'Co-ordinate seminars/workshops in health education; and',
    'Evaluate the research skills needed to write and present good seminar papers'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE408: Global Health, National Health Laws, Policies and Advocacy
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE408', 'Global Health, National Health Laws, Policies and Advocacy', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Global Health, National Health Laws, Policies and Advocacy', ARRAY[
    'Critically think about how to apply key concepts and skills in health behavior and health education to understanding global health issues',
    'Identify bilateral and multilateral agencies; Non-Governmental Organizations and intergovernmental agencies that provide aids in health programmes',
    'Suggest how health indicators are likely to change overtime',
    'Discuss why some populations are healthier than others and what can be done to reduce health disparities',
    'Describe the inter-connection between health problems in developed and developing countries and the interdisciplinary approach necessary to understand and address health problems and issues',
    'Discuss health laws; personnel that enact health laws; application and enforcement of health laws; and the process of health policy formulation',
    'Gain an in-depth knowledge of agenda setting; legislative research and legislative advocacy',
    'Describe public-private partnerships in global health and international health regulations; and',
    'Apply advocacy and mediation in creating supportive environments for health'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE409: Curriculum Development & Innovation in Health Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE409', 'Curriculum Development & Innovation in Health Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Curriculum Development & Innovation in Health Education', ARRAY[
    'Explain the steps in curriculum development, current patterns of curriculum development in health education, including innovations in curricular approaches',
    'Highlight the importance of curricular alignment including connections between course outcomes/goals, delivery of instruction, and the assessment and evaluation of learning in health education',
    'Explain the theories and approaches to curriculum development',
    'Plan effective health education curriculum/programme activities; and',
    'Reflect on the importance of designing and developing positive learning environments with a focus on how curricular design promotes learning in health education settings'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- EHE410: Geriatrics & Death Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EHE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EHE410', 'Geriatrics & Death Education', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Geriatrics & Death Education', ARRAY[
    'Describe geriatrics/geriatric care; myths of ageing; the process of ageing; physical and psychosocial changes of ageing; meeting the special needs and methods of care of the elderly in different setting',
    'Explain the factors affecting ageing; theories of ageing and hospice care for the terminally ill; confusion and disorientation in the elderly',
    'Explain the changes in a variety of health areas including, but not limited to, physical activity, nutrition, mental health, long-term care, sexuality',
    'Prepare for retirement effectively',
    'Explain death and death education; orientations and approaches to death education',
    'Develop positive attitudes to death including funeral rites/customs; grief and bereavement; and',
    'Evaluate the physical and psychosocial changes of ageing; meeting the special needs and methods of care of the elderly in different setting'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

COMMIT;