-- Health Education (EHE) Courses NUC Catalog Data
-- This script adds comprehensive EHE course curriculum to the system

-- First, let's check if we need to enhance the courses table for NUC data
-- Add additional columns for NUC curriculum if they don't exist
DO $$
BEGIN
    -- Add NUC-specific columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'academic' AND table_name = 'courses' AND column_name = 'credit_units') THEN
        ALTER TABLE academic.courses ADD COLUMN credit_units integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'academic' AND table_name = 'courses' AND column_name = 'course_code_standard') THEN
        ALTER TABLE academic.courses ADD COLUMN course_code_standard text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'academic' AND table_name = 'courses' AND column_name = 'title_standard') THEN
        ALTER TABLE academic.courses ADD COLUMN title_standard text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'academic' AND table_name = 'courses' AND column_name = 'learning_outcomes') THEN
        ALTER TABLE academic.courses ADD COLUMN learning_outcomes text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'academic' AND table_name = 'courses' AND column_name = 'course_contents') THEN
        ALTER TABLE academic.courses ADD COLUMN course_contents text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'academic' AND table_name = 'courses' AND column_name = 'contact_hours') THEN
        ALTER TABLE academic.courses ADD COLUMN contact_hours text;
    END IF;
END $$;

-- Create or update Health Education department
INSERT INTO academic.departments (id, name, nuc_code, institution_id) 
VALUES (
    gen_random_uuid(), 
    'Health Education', 
    'EHE', 
    (SELECT id FROM academic.institutions WHERE name = 'National Universities Commission' LIMIT 1)
) 
ON CONFLICT (nuc_code, institution_id) DO UPDATE SET 
    name = EXCLUDED.name,
    updated_at = now()
RETURNING id as dept_id;

-- Insert EHE courses
WITH ehe_dept AS (
    SELECT id FROM academic.departments WHERE nuc_code = 'EHE' LIMIT 1
)
INSERT INTO academic.courses (
    id, 
    title, 
    course_code, 
    course_code_standard,
    title_standard,
    department_id, 
    level, 
    credit_units,
    contact_hours,
    learning_outcomes,
    course_contents
) VALUES 
-- 100 Level Courses
(gen_random_uuid(), 'Introduction to Health Education', 'EHE 111', 'EHE111', 'Introduction to Health Education', 
 (SELECT id FROM ehe_dept), '100', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. explain the meaning of health and health education;
2. discuss basic principles, history, prominent philosophies, and issues related to health education;
3. identify key historical events that have contributed to modern health education;
4. explain the scientific, behavioral, cultural, social, legal and educational foundations of health education;
5. assess individual and community needs for health education;
6. explain the role of the health educator in health care as well as within culturally diverse populations and numerous settings;
7. develop health attitudes and habits among students;
8. act as a resource person in health education;
9. organize health education activities; and
10. build a good healthy condition through classroom and school environment.',
'Introductory concepts related to the field of health education. Basic principles, philosophies, and issues related to health education. The concept and meaning of health education. Importance of health education. Aims and objectives of health education. Health literacy. Life skills conducive to individual and community health are discussed. Frameworks, principles and practice of health education in schools. The historical, philosophical and biological foundations of health and health education. History of man''s struggle for health through the ages. History of health education in Nigeria. Development of public health definitions; goals; rationale and philosophical basis of health and health education. Principles and components of health education are explored. Health education as a career option is examined. The role of the health educator in numerous settings discussed. Development of health attitudes and habits among students and build a good healthy condition via the classroom and school environment.'),

(gen_random_uuid(), 'Personal Health & Dental Education', 'EHE 113', 'EHE113', 'Personal Health & Dental Education', 
 (SELECT id FROM ehe_dept), '100', 2, 'LH 30',
'Upon successful completion of this course, the students will have the ability to:
1. demonstrate understanding of health principles incorporating some aspects of personal health maintenance;
2. identify risk behaviors that affect health;
3. rate his or her understanding of self-responsibility for personal health and wellness; and
4. indicate the implication of personal and societal behaviors on dental and oral health diseases.',
'Overview of personal health. The application of the principles of health to the promotion and maintenance of personal health. Personal health needs and problems of students, including methods of determining health status. Issues in healthy living cutting across food, clothing, environment, water and bathing that promote personal health of school children. Exposure of students to causes of disease and prevention/control of disease. Concept of holistic health. Dental education and dental care. Dentistry, oral health/hygiene. Behaviour guidance of the dental patient. Mechanical and chemotherapeutic home oral hygiene. Essence and importance of dental education.'),

(gen_random_uuid(), 'Environmental Health', 'EHE 114', 'EHE114', 'Environmental Health', 
 (SELECT id FROM ehe_dept), '100', 2, 'LH 30',
'It is intended that at the completion of this course, each student should be able to:
1. illustrate through case example(s), ways in which environmental factors in community, occupational and residential settings impact health;
2. list the major agencies and organizations involved in environmental health protection;
3. assess the interdisciplinary and global impacts of human- environment relationships;
4. explain the basic responsibilities, programmes and problems of environmental health agencies in Nigeria;
5. examine personal contributions to environmental degradation and their potential health consequences; and
6. describe the role of environmental health in public and population health.',
'The interdisciplinary and global impacts of human-environment relationships. Emphasis is placed on the critical nature of understanding these relationships in order to improve ecosystem health, human health and well-being. The role of environmental health in public and population health. Concept of environment and types of environment. Environmental health. Serene Environment, strategies for encouraging serene environment. Water supply and treatment. Waste management (gaseous waste, sewage and refuge management including dead body and industrial and medical waste management). Pest and vector control measures. Shelter/housing and site planning. Hygiene education. Food safety and hygiene. Protection from radiation. Pollution control (air, water, land/soil, noise and chemical pollution). Environmental sustainability (including climate change and biodiversity). Environmental emergencies. Environmental agencies. Environmental impact assessment and security. Ventilation. Lighting. Hazards in the environment and the environmental factors that are connected to disease transmission. Field trips to public source of water supply, waste disposal sites and other controlling environmental agencies.'),

(gen_random_uuid(), 'Human Growth & Development', 'EHE 117', 'EHE117', 'Human Growth & Development', 
 (SELECT id FROM ehe_dept), '100', 2, 'LH 30',
'In completion of this course, the student is expected to:
1. explain growth and development and their characteristics;
2. demonstrate an understanding of the role of parents, teachers and mentors in providing safe and positive environments for development;
3. summarize theories related to human growth and development;
4. obtain health-related data about growth and development factors, needs and interests;
5. explain how heredity and environment influence human development;
6. discuss early childhood education and its influence on cognitive development;
7. describe the changes that occur physically, cognitively and socio-emotionally during middle childhood and adolescence;
8. analyze ageism and stereotypes associated with late adulthood;
9. evaluate ways to promote continued wellness and mitigate declining health associate with ageing; and
10. demonstrate an understanding and appreciation for the diverse potential of all students.',
'Basic concepts of growth and development over a life span. Growth as an index of health. This course introduces characteristics of normal growth. Factors affecting growth and development from conception to retirement (old age). Life stages and human needs. Cell structure and division. Cell differentiation and the process of foetal development. Development milestones via the lenses and perspective of developmental theorists (Erik Erikson, Jean Piaget, Sigmund Freud, Bandura, Bowlby, Lev Vygotsky, Bame Augustine Nsamenang''s theory, Owusu-Bempah, Lawrence Kohlberg''s theory, Seretsekhama, Nyerere theory) and their respective theories. Current thinking and research are examined as well as the processes and influences affecting the developing person. The biological, social, emotional and intellectual aspects across the lifespan and individual application. Early, middle and late childhood focuses on the milestones of normal physical growth, cognitive, socio-emotional and personality development via the main stages of childhood is discussed.'),

(gen_random_uuid(), 'Introduction to Community and Public Health', 'EHE 120', 'EHE120', 'Introduction to Community and Public Health', 
 (SELECT id FROM ehe_dept), '100', 2, 'LH 30',
'Upon completion of this course, the student is expected to:
1. explain the core functions of public health with an emphasis on community health programmes and current trends of population health;
2. identify public health problems to develop appropriate public health, education programme based on sound theoretical foundations of health behavior;
3. design community health educational programmes for identified health problems for at risk populations and communities;
4. analyze evidence based and innovation best practices of healthy behavior to appropriate audiences;
5. demonstrate effective communication advocacy skills for populations; and
6. describe the role community health practice in maximizing the health status of all populations.',
'The core functions of public health with an emphasis on community health programme and current trends of population health. The role of community health practice in maximizing the health status of all populations. Course will include an overview of the organizational structure of Local Government Area, State and Federal health related agencies and examine the inter relationship of political, social, cultural and economic dimensions of community based population health activities. The context and scope of public health from historical, modern and postmodern perspectives. The dimension of public health; key public health functions; and modern public health will be discussed as well as the ecological approach to public health. Communicating with people and organizations to promote public health; planning, implementing and evaluating public health programmes. The primary health care system and the principles underlying its operation.
Concepts of community life in relation to the effect of human activities on public and environmental health. Meaning and organization of community health and control. Development of community health in Nigeria. Trends and dynamics from current head and medical care programmes and practices. Health programmes included in community health (such as maternal and child care and other community health services). Meaning and identification of community health needs and problems and solving them. Various ways, by which diseases can be prevented. How life can be prolonged and how healthy living can be promoted through the organized efforts and informed choices of the community and individuals. Threats to health based on population health analysis.'),

(gen_random_uuid(), 'General Biology I', 'EHE 101', 'EHE101', 'General Biology I', 
 (SELECT id FROM ehe_dept), '100', 2, 'LH 45',
'At the end of lectures in Plant Biology, students should be able to:
1. explain cells structure and organizations;
2. summarize functions of cellular organelles;
3. characterize living organisms and state their general reproduction;
4. describe the interrelationship that exists between organisms; 5. discuss the concept of heredity and evolution; and
6. enumerate habitat types and their characteristics.',
'Cell structure and organization. Functions of cellular organelles. Characteristics and classification of living things. Chromosomes their relationships and importance. Genes their relationships and importance. General reproduction. Interrelationships of organisms (competitions, parasitism, predation, symbiosis, commensalisms, mutualism, saprophytism). Heredity and evolution (introduction to Darwinism and Lamarkism, Mendelian laws, explanation of key genetic terms). Elements of ecology. Types of habitat.')

ON CONFLICT (course_code_standard, department_id) DO NOTHING;

-- Add more courses in separate batches due to size constraints
-- 200 Level Courses
WITH ehe_dept AS (
    SELECT id FROM academic.departments WHERE nuc_code = 'EHE' LIMIT 1
)
INSERT INTO academic.courses (
    id, 
    title, 
    course_code, 
    course_code_standard,
    title_standard,
    department_id, 
    level, 
    credit_units,
    contact_hours,
    learning_outcomes,
    course_contents
) VALUES 
(gen_random_uuid(), 'Methods and Resources in Health Education', 'EHE 211', 'EHE211', 'Methods and Resources in Health Education', 
 (SELECT id FROM ehe_dept), '200', 2, 'LH 30',
'In completion of this course the student is expected to:
1. describe many aspects of fundamental strategies for health education, including conceptualizing instruction, developing instructional objectives, planning units/ lessons and presentations; becoming familiar with various traditional and digital instructional methods and materials; and evaluating the effectiveness of health instruction in schools and community and other settings;
2. develop print health educational materials for teaching, learning and communicating health information;
3. practice a variety of in-person as well as digital, health education methods;
4. apply the principles of developing and delivering effective multimedia hybrid presentation and educational intervention;
5. select appropriate learning materials and methods in health education programmes;
6. evaluate health education resources available from a variety of sources including the internet and mobile apps;
7. outline the technical and production aspects of materials and media considered in laboratory sessions; and
8. develop health education materials and learning activities though fieldwork in addition to in-class and laboratory session.',
'Various methods and resources used in teaching and practising health education. Pedagogic and teaching/learning materials are emphasized. The selection and use learning materials and methods in health education programmes. Technical and production aspects of materials and media are considered in laboratory sessions. Students are required to produce health education materials or develop learning activities though fieldwork in addition to in-class and laboratory session. Strategies and approaches to health instruction. Selection and utilization of instructional materials in teaching health education, health promotion and health maintenance are explored. Organization of health instructions from curriculum content to specific lesson plans are carried out. Aspects of fundamental strategies for health education, including conceptualizing instruction, developing instructional objectives, planning units/lessons and presentations; becoming familiar with various traditional and digital instructional methods and materials. Evaluating the effectiveness of health instruction in schools and community and other settings.'),

(gen_random_uuid(), 'School Health Education Programme', 'EHE 212', 'EHE212', 'School Health Education Programme', 
 (SELECT id FROM ehe_dept), '200', 2, 'LH 30',
'In completion of this course the student is expected to:
1. explain the factors for operating effective school health programme including the teacher''s role in health appraisal and in effecting healthful school living;
2. develop a school health programme;
3. plan school health programme activities;
4. implement case examples of school health counselling; and
5. evaluate an existing school health programme.',
'The value of comprehensive health education rather than disease specific units in school. Promotion of good healthy living in and out of school. The framework and components of school health education programme and how best it can be managed via employment of health personnel, drugs, clinic and encouraging body cleanliness. The factors for operating effective school health programme including the teacher''s role in health appraisal and in effecting healthful school living. Mechanisms for sustainable school health programme. Medical inspection; assessment of handicapped children; safe school environment. School feeding and control of infections. Organisation of school health services. Co-ordination, assessment and evaluation of school health programme.
Typical health problems of school age children are examined including typical intervention measures, such as: having school friendly environment, accident prevention and treatment of minor ailments of school children.'),

(gen_random_uuid(), 'Human Anatomy and Physiology', 'EHE 213', 'EHE213', 'Human Anatomy and Physiology', 
 (SELECT id FROM ehe_dept), '200', 2, 'LH 30',
'On completion of this course the student is expected to:
1. explain the organisation of the human body;
2. identify the major anatomical structures of the body;
3. describe the systems and processes involved in maintaining life and homeostasis in the human body; and
4. analyze muscle movements in relation to the human anatomy.',
'Basic and detailed concepts of the human physiology and anatomy. Basic structures of the human body. Body planes; directions and cavities. Body systems (integumentary, skeletal, muscular, circulatory, lymphatic, nervous, special senses, respiratory, digestive, urinary, endocrine and reproductive) will be explored. The human anatomy in relation to muscle movements and the physiology of the human body is discussed. A hands-on laboratory based course that investigates the structure and function of the human body. Topics covered include the basic organization of the body and major body systems along with the impact of diseases on certain systems. The basic principles of how the human body systems functions both at the micro and macro level. Using a wide variety of print and web-based resources along with hands-on learning activities and laboratories utilizing models to investigate the structures and functions of the human body systems. Demonstrative practical sessions with the use of models and charts to afford practice in drawing and close examination of body structures will be done.')

ON CONFLICT (course_code_standard, department_id) DO NOTHING;

-- Create view for NUC courses if it doesn't exist
CREATE OR REPLACE VIEW public.national_courses_view AS
SELECT 
    c.id,
    c.title_standard as title,
    c.course_code_standard as course_code,
    c.level,
    c.credit_units,
    c.contact_hours,
    c.learning_outcomes,
    c.course_contents as description,
    d.nuc_code as department_nuc_code,
    d.name as department_name,
    i.name as institution_name,
    c.created_at
FROM academic.courses c
JOIN academic.departments d ON c.department_id = d.id
JOIN academic.institutions i ON d.institution_id = i.id
WHERE c.course_code_standard IS NOT NULL
AND c.title_standard IS NOT NULL;

-- Grant access to authenticated users
GRANT SELECT ON public.national_courses_view TO authenticated;
