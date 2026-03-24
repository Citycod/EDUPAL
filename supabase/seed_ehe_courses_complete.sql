-- Additional EHE Courses (300L & 400L) - Add to existing seed_ehe_courses.sql

-- 300 Level Courses
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
(gen_random_uuid(), 'Research Methods in Health Education', 'EHE 313', 'EHE313', 'Research Methods in Health Education', 
 (SELECT id FROM ehe_dept), '300', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. explain basic concepts of research and research in health education;
2. describe how to conduct a research study applying appropriate research procedures and protocol;
3. compare the fundamentals of quantitative and qualitative research and mixed method approaches, including experimental and survey researches;
4. develop a better understanding of collecting, analyzing and interpreting valid and reliable data;
5. learn the basic procedures involved in the design and implementation of evaluation research;
6. apply appropriate research principles and methods in health education; and
7. evaluate basic knowledge and application of appropriate research principles and methods in health education.',
'The basic and detailed concepts of definitions, types and aims of research in general and in the context of health education. Steps in selecting research topics. Research procedures and protocol. The role of hypotheses, criteria for establishing adequate hypotheses, research questions. Research designs and data collection techniques and analysis. Independent and dependent variables. Validity and reliability of research instruments. Content and language of research proposals and research reports. Fundamentals of quantitative and qualitative research. Mixed method approach. Experimental and survey researches. Research methods and literature review are explored. The use of library and computer in health education research.'),

(gen_random_uuid(), 'Substance Use and Abuse Prevention', 'EHE 314', 'EHE314', 'Substance Use and Abuse Prevention', 
 (SELECT id FROM ehe_dept), '300', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. estimate the magnitude and trends in substance use and abuse;
2. describe the consequences of substance use and abuse on health and development;
3. explain the methods, materials and theories of drug abuse prevention in the school and community;
4. examine both licit and illicit substances; drug addiction and drug dependency;
5. develop skills for avoiding destructive behaviours, including substance control and cessation; and
6. appraise existing programmes and policies designed to prevent substance use and abuse.',
'The basic and detailed concepts of drug, substance use and abuse, drug misuse. Rehabilitation techniques employed on victims of drug abuse and the effect of drug abuse on the body. Introducing social, psychological, pharmaceutical and cultural aspects of drug use, misuse and abuse. The methods, materials and theories of drug abuse prevention in the school and community will be introduced. Illicit (e. g. Opiates, marijuana, methamphetamines) and licit (such as alcohol, tobacco, caffeine) substances. Drug addiction and drug dependency. Harmful effects of alcohol and tobacco and other narcotic, sedatives, depressants and stimulant drugs will be explored. Critical examination of the factors associated with the use of these substances and methods of prevention. Skills for avoiding destructive behaviours, including substance control and cessation need to be developed. The chemical pharmacologic, physiological, and socio-economic use, misuse and abuse of alcohol and such psychoactive substances as opiates and opium, such as: synthetic narcotics, barbiturates, tranquilizers marijuana lysergic and diethylamide (LSD) and tranquilizers/stimulant (cocaine, amphetamine and caffeine).'),

(gen_random_uuid(), 'Maternal, Infant & Child Health', 'EHE 315', 'EHE315', 'Maternal, Infant & Child Health', 
 (SELECT id FROM ehe_dept), '300', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. provide a comprehensive overview of critical and contemporary women''s health issues;
2. identify major health issues confronting women today;
3. discuss the characteristics and health needs of children in infancy and early childhood period and indices of such children;
4. describe common infant and child health concerns at different points in development and protective measures; and
5. evaluate maternal and child health and child survival programmes.',
'The basic and detailed meaning/concept of maternal, infant and child health, highlighting historical perspective; objectives of Maternal and Child Health (MCH) services. Elements/components of MCH (antenatal care, natal (delivery) care, postpartum care). Pregnancy and physiology of pregnancy, labor and child birth. Immunizations and maternal morbidity and mortality. Safe motherhood and its essential services. Empowering women, and major health issues confronting women today. Health issues from the traditional medical model to the holistic model. Comprehensive overview of critical and contemporary women''s health issues.
Characteristics and health needs of children in early childhood period and indices of such children are explored. Common ailments of such children and protective measures such as EPI, NPI, ORT, Meal, Rest and Sleep. Concept of child health and child survival programmes. Major objectives of child health services. Childhood diseases and causes. Integrated management of childhood illness (IMCI). Child care: growth monitoring and promotion (GMP), oral dehydration and rehydration, breastfeeding, chemoprophylaxis, dietary supplements. Development task; cognitive, psychosocial and psychosexual development in the child.'),

(gen_random_uuid(), 'Health Psychology & Counselling', 'EHE 317', 'EHE317', 'Health Psychology & Counselling', 
 (SELECT id FROM ehe_dept), '300', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. discuss the concept of health psychology; its rationale for health psychology and health behaviors;
2. describe the behavioral processes around health and sickness, and a wide-range of approaches, from advanced research methods, through a working and evidence-based knowledge of theory and behavior-change interventions;
3. describe how behavioural theories and models can be used to explain and health problems;
4. examine the key features of selected behavior change theories and program planning models in health education;
5. evaluate psychological issues in advancing and terminal illness; and
6. explain the principles and techniques of identifying students'' health problems with emphasis on personalized approaches, such as conferences and interviews;
7. apply counselling strategies to promote health behaviour change; demonstrate how to help people change unhealthy behaviours by using motivational interviewing and basic counselling strategies; and
8. evaluate why health counselling is an important skill for health educators.',
'The basic and detailed meaning/concept of health psychology. Rationale for health psychology. Health behaviours; changing health habits; stages of behaviour change. Health enhancing and compromising behaviours. Stress and coping. Approaches to and steps involved in behaviour; problems raised by studying behaviour and examining ways of reducing risks to health as a result of behaviour. The behavioural processes around health and sickness. Covers a wide-range of approaches, from advanced research methods, through a working and evidence-based knowledge of theory and behaviour-change interventions. Theories explaining health behaviour changes in individuals (such as HBM and Trans theoretical theory), communities (such as Diffusion of innovation theory), organizations (such as, Stickler''s 4stage model) and health public policy (such as millions theory) are studied. Factors influencing health behaviour. The relationship between health behaviour and longevity. Health services utilization and misuse. Patient health care provider. Psychological issues in advancing and terminal illness such as cancer, stroke, HIV and AIDS. Counselling strategies to promote health behaviour change. Demonstrate how to help people change unhealthy behaviours by using motivational interviewing and basic counselling strategies. The principles and techniques of identifying students'' health problems are discussed with emphasis on personalized approaches, such as conferences and interviews. Techniques of referral and strategies for meeting identified needs and solving identified problems.'),

(gen_random_uuid(), 'First Aid, Accident Prevention and Safety Education', 'EHE 320', 'EHE320', 'First Aid, Accident Prevention and Safety Education', 
 (SELECT id FROM ehe_dept), '300', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. explain the meaning and principles of first aid and first aid management of selected emergency situations;
2. explain safety education and safety tasks of teachers;
3. describe accident prevention and management techniques including accident reporting;
4. develop general safety skills programmes and techniques in schools and environment; and
5. analyze the importance and relevance of safety programmes in schools and the environment in general.',
'The basic and detailed concepts of health and safety. Meaning and principles of first aid and first aid management of selected emergency situations. Accidents, accident prevention and management techniques. Safety tasks of teachers, accident reporting, safety measures. Concepts of safety education and related terminologies. Principles and practice of safety in the homes, schools, industries, hospitals, sports/homes and other settings. Safety skills and programmes in schools and general safety skills and techniques in schools and environment. Analysis of the importance and relevance of safety programmes in schools. Safety approaches to environmental hazards. The critical need for safety and what the school can do to improve safety conditions. Community and industrial safety will be briefly analysed. Practical situated sessions are provided to promote efficiency in management situations.'),

(gen_random_uuid(), 'Application of Computer Skills & Health Informatics', 'EHE 321', 'EHE321', 'Application of Computer Skills & Health Informatics', 
 (SELECT id FROM ehe_dept), '300', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. apply computer in health diagnostics and treatment of complicated ailments;
2. use data to improve human health and health care services;
3. explain trends in health informatics; health informatics technology in population; human computer interaction; information system in health care; IT and cyber security; web technologies and cloud computing; Geographic Information System (GIS); modern information technology and health service statistics; and
4. utilize computerized health information retrieval system effectively.',
'The basic and detailed concepts of computer application and breaking edge. Application of computer in health diagnostics and treatment of complicated ailments. Usage of data to improve human health and health care services. Concept of health informatics. Application of medical concepts in conjunction with health information technology is explored. Roles and goals of health informatics. Consumer, clinical, nursing and public health informatics. Applicable decision analysis techniques and decision support systems. Trends in health informatics; health informatics technology in population. Human computer interaction. Information system in health care; IT and cyber security; web technologies and cloud computing. Geographic Information System (GIS). Modern information technology. Health service statistics. The internet. Modern methods for data collection, analysis and data transmission (Google survey form). Resource management within the health care field.'),

(gen_random_uuid(), 'Life Skills & Skilled-Based Health Education', 'EHE 322', 'EHE322', 'Life Skills & Skilled-Based Health Education', 
 (SELECT id FROM ehe_dept), '300', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. discuss the importance of health education skills, their relevance and relationships to other learned skills;
2. present steps for developing health skills;
3. practice health skills using real-life scenarios;
4. discuss key considerations when teaching the skills of health education;
5. evaluate the impact of social media and other environmental factors in personal and family health;
6. demonstrate strategies to prevent, manage or resolve interpersonal conflicts without harming self or others;
7. apply effective verbal and non-verbal communication skills to enhance relationship health;
8. select a variety of communication methods and techniques in providing health information;
9. choose healthy alternatives over unhealthy alternatives when making a decision about health; and
10. list the steps of effective health goal setting.',
'Life skills education and skill-based health education approaches. Development of practical health skills through interactive learning methods. Communication skills for health education. Decision-making skills in health contexts. Problem-solving skills for health issues. Critical thinking skills in health education. Interpersonal skills for health promotion. Coping skills for health challenges. Self-management skills for health behavior. Advocacy skills for health promotion. Media literacy skills for health information. Technology skills for health education. Assessment and evaluation of skill-based health education programs.'),

(gen_random_uuid(), 'Epidemiology of Public Health & Human Biometrics', 'EHE 324', 'EHE324', 'Epidemiology of Public Health & Human Biometrics', 
 (SELECT id FROM ehe_dept), '300', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. explain the types of epidemiological investigations;
2. analyze the causes, patterns and distribution of disease outbreaks in different populations;
3. explain methods for monitoring, evaluating and managing population health;
4. discuss the nature, types, sources and collection of health data/human biometrics;
5. describe the use of descriptive and inferential statistical techniques in processing and analyzing health data;
6. explain the principal subdivision of vital statistics/human biometrics and their rates; and
7. prepare epidemiological reports.',
'Introduction to epidemiology as a basic science for public health. Definition and general principles of epidemiology. Sequence of epidemiological reasoning. Types of epidemiological investigations. The causes, patterns and distribution of disease outbreaks in different populations. Epidemiological methods and data; and uses of epidemiology. Students learn to read, comprehend and prepare epidemiological reports. Methods for monitoring, evaluating and managing population health. Epidemiology of infectious and non-infectious diseases is explored. Concepts of public health and health practices in relation to epidemiology. Surveillance of disease, and control and development of infectious diseases are also studied. The nature, types, sources and collection of health data/human biometrics. Measures of frequency and association, introduce the design and validity of epidemiologic research, and give an overview of appropriate data analysis for understanding population health. Definition and calculation of selected common rates used in public health practice. Principal subdivision of vital statistics/human biometrics (morbidity statistics, mortality statistics and demographic statistics). The use of descriptive and inferential statistical techniques in processing and analyzing health data.')

ON CONFLICT (course_code_standard, department_id) DO NOTHING;

-- 400 Level Courses
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
(gen_random_uuid(), 'Contemporary National Health Programmes, Issues and Problems in Health Education', 'EHE 401', 'EHE401', 'Contemporary National Health Programmes, Issues and Problems in Health Education', 
 (SELECT id FROM ehe_dept), '400', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. discuss aims, objectives and achievements of National Health Programmes recorded;
2. identify various international and national health issues and problems;
3. describe the factors associated with current health issues;
4. describe the role of the health educator in preventing health issues and promoting health among diverse groups;
5. discuss concepts of public health and resultant health-related issues emanating from human activities and behaviours as well as types and characteristics of health care systems; and
6. evaluate issues and problems arising from levels of health care delivery system outlines in the national health policy.',
'The concept, aims, objectives and achievements of National Health Programmes recorded. Detailed discussion of such contemporary health programmes as health-related sustainable development goals (SDGs), various international and national health issues and problems. Topical health problems as HIV/AIDS, Orphan and vulnerable children (OVC). Other contemporary problems and issues in health and Health Education. Development and organization of public health in Nigeria. Population and public health. Government and public health. Fundamental services in public health community nursing services, social services, health education and motivation, medical care delivery, emergency health services and future of health services. NGOs efforts towards ensuring sustainability of health standards. Concepts of public health and resultant health-related issues emanating from human activities and behaviours. Types and characteristics of health care systems, viz; orthodox medicine, traditional medicine, homeopathic medicine and spiritual healing. The three-tier or levels of health care delivery system outlines in the national health policy should be discussed, viz: primary health care; secondary health care; and tertiary health care. Specialization in health field as well as job opportunities.'),

(gen_random_uuid(), 'Occupational & Industrial Health Education', 'EHE 402', 'EHE402', 'Occupational & Industrial Health Education', 
 (SELECT id FROM ehe_dept), '400', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. explain the meaning, rationale and historical background of occupational health with emphasis on Nigeria;
2. highlight the advantages of occupational health;
3. explain the responsibilities of employees in work environment; occupational safety; occupational hazards and hygiene; and
4. evaluate human and environmental health in relation to the effects of the operation of industries; security and safety in the industries; industrial affluence control, health and safety of industrial workers.',
'Meaning, rationale and historical background of occupational health with emphasis on Nigeria. Advantages of occupational health. Responsibilities of employees in work environment. Occupational safety. Occupational hazards and hygiene. National and international labour legislations. Concepts of human and environmental health in relation to the effects of the operation of industries. Security and safety in the industries. Industrial affluence control. Health and safety of industrial workers. Community health and safety.'),

(gen_random_uuid(), 'Health Economics & Consumerism', 'EHE 403', 'EHE403', 'Health Economics & Consumerism', 
 (SELECT id FROM ehe_dept), '400', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. explain the concept of health economics;
2. discuss economic considerations in health care and health care as an economic commodity; health care financing, planning, budgeting and decision making;
3. comprehend the fundamentals of social marketing as well as health literacy and how these concepts should be used to create more effective health education and health promotion programmes;
4. state consumer health and psychological factors in consumerism, healing philosophies, food faddism, and weight control measures, consumer protection;
5. assess the needs and technological practices of potential users;
6. apply existing measures designed for the safety of products, information and services for consumers, including the concepts and recognition of health quackery and nostrum; and
7. evaluate the roles of government and health agencies in consumer protection, including economic considerations in health care financing, planning, budgeting and decision making.',
'Concepts of economics and health economics. Health and environmental determinants, demand and supply in health care. Costs in health care and benefit analysis. Structure, conduct, performance and market analysis. Hospital services industry, health care services utilization, health care industry and health insurance. Economic considerations in health care and health care as an economic commodity. Health care financing, planning, budgeting and decision making and health and social/economic development in Nigeria are also explored. Definition of consumer health and a study of existing measures designed for the safety of products, information and services for consumers, including the concepts and recognition of health quackery and nostrum. Practicing consumer skills, realizing the implication of advertisement for health and making informed choices. Psychological factors in consumerism. Healing philosophies, food faddism, and weight control, consumer protection. Dangers of misleading adverts of processed food items and roles of government and health agencies in consumer protection. Wise usage of consumer products and the avoidance of health quack services and products.'),

(gen_random_uuid(), 'Organisation, Planning and Evaluation of Health Education Programmes', 'EHE 404', 'EHE404', 'Organisation, Planning and Evaluation of Health Education Programmes', 
 (SELECT id FROM ehe_dept), '400', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. organize programme activities in public health;
2. identify key concepts related to organization and administrative processes in health education programs and services;
3. apply the principles and steps in planning school and health education program in primary and secondary schools; and in measurement of needs;
4. plan effective health education programmes through formulating appropriate and measurable program objectives;
5. develop plans to assess achievement of programme objectives;
6. apply evaluation methods to understand the effect of health education and health behaviour interventions;
7. construct a logical scope and sequence plan for a health education programme;
8. learn about the necessity of early alignment between assessment and evaluation in health education program planning;
9. articulate the role of systematic evaluation in health education;
10. design an evaluation plan that is suitable for a specific programme;
11. evaluate health education programme organisation, personnel problems, national policies, public relations, budgeting, working with staff members, student teachers and students in the discipline; and
12. implement evaluation plans for health education programme using appropriate evaluation approaches.',
'The development, organization and programming of activities in public health. Application of the principles and steps in planning school and Health Education programme in primary and secondary schools. Measurement of needs. Multi-sectorial approach; measurement and mobilization of resources. The national health science curriculum is studied. Evaluation and types; mechanisms for monitoring and evaluation of health services, outcomes and impact. Activities of health personnel in evaluation. Use of programme evaluation techniques in public health education programmes. Detailed discussion of the application of administrative and supervisory principles and techniques in achieving the goals and objectives of the health programmes. Programme organization and evaluation. Personnel problems. National policies. Public relations. Budgeting, Working with staff members, student teachers and students in the discipline would be examined. Group of students will be required to assess community needs and resources as well as plan health education programmes.'),

(gen_random_uuid(), 'Seminar in Health Education', 'EHE 407', 'EHE407', 'Seminar in Health Education', 
 (SELECT id FROM ehe_dept), '400', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. acquire skills of researching and writing empirical and non-empirical papers;
2. present papers on selected current national and international health problems, programmes or issues;
3. co-ordinate seminars/workshops in health education.; and
4. evaluate research skills needed to write and present good seminar papers.',
'The skills of researching and writing empirical and non-empirical papers. Presentation of paper by students on selected current national and international health problems, programmes or issues.'),

(gen_random_uuid(), 'Global Health, National Health Laws, Policies and Advocacy', 'EHE 408', 'EHE408', 'Global Health, National Health Laws, Policies and Advocacy', 
 (SELECT id FROM ehe_dept), '400', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. critically think about how to apply key concepts and skills in health behaviour and health education to understanding global health issues;
2. identify bilateral and multilateral agencies; Non-Governmental Organizations and intergovernmental agencies that provide aids in health programmes;
3. suggest how health indicators are likely to change overtime;
4. discuss why some populations are healthier than others and what can be done to reduce health disparities;
5. describe the inter-connection between health problems in developed and developing countries and the interdisciplinary approach necessary to understand and address health problems and issues;
6. discuss health laws; personnel that enact health laws; application and enforcement of health laws; and process of health policy formulation;
7. gain an in-depth knowledge of agenda setting; legislative research and legislative advocacy;
8. describe public-private partnerships in global health and international health regulations; and
9. apply advocacy and mediation in creating supportive environments for health.',
'Globalization and health. Mechanisms of global health co-operation. Bilateral and multilateral agencies. Non-Governmental Organizations. Intergovernmental agencies (United Nations Development Programme [UNDP], United Nations Population Fund [UNFPA], World Health Organization [WHO], United Nations Children''s Fund [UNICEF]); the World bank; private foundations. Public-private partnerships in global health. International health regulations; International and national port health programmes. Global health through its history, determinants and development as a field of study. The inter-connection between health problems in developed and developing countries and the interdisciplinary approach necessary to understand and address health problems and issues. The health status in regions of the world and various populations within those regions, and they will be able to suggest how health indicators are likely to change overtime. Healthier populations and health disparities. The concept of health laws; personnel that enact health laws; application and enforcement of health laws; registration of schools, medical personnel, births and deaths. Meanings of policy; process of policy formulation; and types of policies. Health Politics. The process of engaging communities in health education and behaviour change programmes of various kinds. Several paradigms for fostering healthy communities and their practical and ethical implications. Students are paired with health and human service, health policy and social justice agencies around coalitions to gain an in-depth knowledge of agenda setting, legislative research and legislative advocacy. Relate policy theory to real-world practice. The influence of the 21st century health and health care environment. The national health policy and responses to disease and treatment; strategies for promoting health in all policies (HiaP). The three-tiers of health care in the current health policy and strategy. Improvements in International AID policies. Concept of advocacy; health advocacy; methods of advocacy; technologies used in advocacy; advocacy strategies for health and development; advocacy and mediation in creating supportive environments for health.'),

(gen_random_uuid(), 'Curriculum Development & Innovation in Health Education', 'EHE 409', 'EHE409', 'Curriculum Development & Innovation in Health Education', 
 (SELECT id FROM ehe_dept), '400', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. explain the steps in curriculum development, current patterns of curriculum development in health education, including innovations in curricular approaches;
2. highlight the importance of curricular alignment including connections between course outcomes/goals, delivery of instruction, and the assessment and evaluation of learning in health education;
3. explain the theories and approaches to curriculum development;
4. plan effective health education curriculum/programme activities; and
5. reflect on the importance of designing and developing positive learning environments with a focus on how curricular design promotes learning in health education settings.',
'Meaning and steps in curriculum development. Current patterns of curriculum development in health education, including innovations in curricular approaches. A range of theories and approaches to curriculum development. Sessions will be literature informed but activity and discussion-based with an expectation of a high degree of collaboration and participation. The importance of curricular alignment including connections between course outcomes/goals, delivery of instruction, and the assessment and evaluation of learning in health education. The importance of designing and developing positive learning environments with a focus on how curricular design promotes learning in health education settings. The course is organized in such a way as to balance theory and practice and to support both conceptual and skill development. Curriculum implementation. Feedback / evaluation. New trends in curriculum development.'),

(gen_random_uuid(), 'Geriatrics & Death Education', 'EHE 410', 'EHE410', 'Geriatrics & Death Education', 
 (SELECT id FROM ehe_dept), '400', 2, 'LH 30',
'Upon successful completion of this course, the students will have reliably demonstrated the ability to:
1. describe geriatrics/geriatric care; myths of ageing; the process of ageing; physical and psychosocial changes of ageing; meeting the special needs and methods of care of the elderly in different setting;
2. explain the factors affecting ageing; theories of ageing and hospice care for the terminally ill; confusion and disorientation in the elderly;
3. explain changes in a variety of health areas including, but not limited to, physical activity, nutrition, mental health, long-term care, sexuality;
4. prepare for retirement effectively;
5. explain death and death education; orientations and approaches to death education;
6. develop positive attitudes to death including funeral rites/customs; grief and bereavement; and
7. evaluate physical and psychosocial changes of ageing; meeting the special needs and methods of care of the elderly in different setting.',
'Concept of geriatrics/geriatric care. Myths of ageing. The process of ageing. Physical and psychosocial changes of ageing. Meeting the special needs and methods of care of the elderly in different setting. Challenges/factors affecting ageing. Theories of ageing and hospice care for the terminally ill. Confusion and disorientation in the elderly. Preparation for retirement, and ageing and worksite health promotion. Emphasis is given to the changes in a variety of health areas including, but not limited to, physical activity, nutrition, mental health, long-term care, sexuality, and death, dying and grief. Concepts of death and death education. Orientations and approaches to death education. Attitudes to death including funeral rites/customs. Grief, bereavement, wills and probate. Death education curriculum and content areas for death education programme.')

ON CONFLICT (course_code_standard, department_id) DO NOTHING;

-- Update the national courses view to include the new courses
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

-- Create national_topics table for learning objectives if it doesn't exist
CREATE TABLE IF NOT EXISTS academic.national_topics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid REFERENCES academic.courses(id) ON DELETE CASCADE,
    topic_name text,
    learning_objectives text[], -- Array of learning objectives
    created_at timestamp with time zone DEFAULT now()
);

-- Insert sample learning objectives for EHE courses
WITH ehe_courses AS (
    SELECT id, course_code_standard FROM academic.courses 
    WHERE course_code_standard LIKE 'EHE%'
)
INSERT INTO academic.national_topics (course_id, topic_name, learning_objectives)
SELECT 
    c.id,
    'Core Learning Objectives',
    ARRAY[
        'Demonstrate understanding of fundamental health education concepts',
        'Apply health education principles in practical settings',
        'Develop critical thinking skills for health problem solving',
        'Communicate health information effectively',
        'Evaluate health programs and interventions'
    ]
FROM ehe_courses c
WHERE c.course_code_standard IN ('EHE111', 'EHE113', 'EHE114', 'EHE117', 'EHE120')
ON CONFLICT DO NOTHING;

-- Grant access to authenticated users
GRANT SELECT ON academic.national_topics TO authenticated;
