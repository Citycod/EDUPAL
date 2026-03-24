-- Seed file for NUC Political Science Education (PSE) & Political Science (POL) Curriculum (CCMAS Structure)
BEGIN;

-- Two programs: PSE for Education-specific courses, POL for core Political Science courses
INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Political Science Education', 'PSE')
ON CONFLICT (nuc_code) DO NOTHING;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Political Science', 'POL')
ON CONFLICT (nuc_code) DO NOTHING;

--------------------------------------------------------------------------------
-- PSE COURSES (Political Science Education)
--------------------------------------------------------------------------------

-- PSE101: Introduction to Political Science Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PSE101', 'Introduction to Political Science Education', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Political Science Education', ARRAY[
    'Explain the reason for the course.',
    'State the difference between the course and other courses in the education faculty.',
    'Identify the role of some founding fathers of the course.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- PSE201: Political Science Teaching Method
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PSE201', 'Political Science Teaching Method', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Political Science Teaching Method', ARRAY[
    'Identify the methods that can be used to teach Political Science.',
    'Develop or improvise instructional resources needed for teaching Political Science.',
    'Demonstrate how instructional resources are effectively used in teaching.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- PSE301: Politics of Education
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PSE301', 'Politics of Education', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Politics of Education', ARRAY[
    'Explain the factors that influence political leaders'' policies on education.',
    'Suggest practicable measures through which these influences can be removed or reduced.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- PSE401: Educational Policy and Society
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PSE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PSE401', 'Educational Policy and Society', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Educational Policy and Society', ARRAY[
    'Explain the tangible impact of education on Nigerian society.',
    'Explain the impact of society on education including the growth of cult activities on campus.',
    'Explain how contemporary social issues like COVID-19 and HIV/AIDS influence the education system.',
    'Discuss the different models in educational policy making.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

--------------------------------------------------------------------------------
-- POL COURSES (Political Science)
--------------------------------------------------------------------------------

-- POL111: Introduction to Political Science
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL111', 'Introduction to Political Science', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Political Science', ARRAY[
    'Explain key concepts in political science such as politics, power, authority, influence, state and nation.',
    'Explain the nature, form and character of politics.',
    'Identify the contributions of the founding and leading scholars of political science.',
    'Differentiate between political science as a field of study and politics as an art or practice.',
    'Explain the relationship among the various concepts in political science.',
    'Identify the relationship between political science and other fields of study.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL112: Introduction to African Politics
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL112', 'Introduction to African Politics', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to African Politics', ARRAY[
    'Explain the systems of political organisation before the advent of colonialism in Africa.',
    'Discuss contending arguments for the colonial invasion of Africa.',
    'Explain the manifestation, form and character of colonialism in Africa.',
    'Identify the impact and consequences of colonialism on state, economy and society in Africa.',
    'Discuss nationalist agitations and liberation movements in Africa.',
    'Explain the nature and forms of African states after independence.',
    'Identify some major theories in the study of African politics.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL113: Nigerian Constitutional Development
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL113', 'Nigerian Constitutional Development', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigerian Constitutional Development', ARRAY[
    'Identify the reasons for and processes of creating the Nigerian state in 1914.',
    'Discuss the reasons for enacting the 1922, 1946, 1951, 1954, 1960, 1979 and 1999 constitutions.',
    'State the features, strengths and weaknesses of each constitution.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL114: Organization of Government
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL114', 'Organization of Government', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Organization of Government', ARRAY[
    'Explain the nature and functions of the three organs of government.',
    'Explain the reasons for the adoption of the different administrative systems.',
    'Describe the nature of the administrative systems and the differences between them.',
    'State the differences between the Presidential and Parliamentary forms of government.',
    'Highlight the guiding principles of political systems such as separation of powers and rule of law.',
    'State the need for instruments of political interactions including political parties, pressure groups, interest groups and public opinion.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL211: Nigerian Government and Politics
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL211', 'Nigerian Government and Politics', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigerian Government and Politics', ARRAY[
    'State the need for the adoption of federalism in Nigeria.',
    'Describe the juridical division of powers between the three tiers of government.',
    'Explain the nature of fiscal relations between the three levels of government.',
    'State the impact and consequences of the politicization of critical issues such as census, ethnicity and elections on nation building, national unity and development in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL212: Foundations of Political Economy
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL212', 'Foundations of Political Economy', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Foundations of Political Economy', ARRAY[
    'State the nexus between economics and politics.',
    'Identify the determinants of class formations.',
    'Explain in detail what is meant by class relations.',
    'Discuss the premises of contending theories on production, distribution and exchange.',
    'Explain the impact of such theories on the state, economy and society.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL213: Introduction to Political Analysis
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL213', 'Introduction to Political Analysis', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Political Analysis', ARRAY[
    'State the theories and approaches to the study and analysis of politics.',
    'Explain reasons for contending orientations in political analysis.',
    'Highlight the efficacy of the comparative method in political analysis.',
    'State the impact of regime types on political efficiency.',
    'Describe the three levels of political participation.',
    'Explain the factors and types of political culture.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL214: Introduction to Public Administration
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL214', 'Introduction to Public Administration', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Public Administration', ARRAY[
    'State the need for public administration.',
    'Explain the models and theories of administration.',
    'Identify and explain the roles of administrators.',
    'Explain the elements of administrative law and administrative principles including decentralisation and delegation.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL215: Introduction to International Relations
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL215', 'Introduction to International Relations', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to International Relations', ARRAY[
    'State the need for interactions between states and other actors in the international system.',
    'Explain the importance of national interest as a major determinant of global interactions and politics.',
    'Identify the linkage between domestic and foreign policies.',
    'Discuss the theories explaining various forms of interactions in the international system.',
    'Explain reasons for and types of coalitions and alliances in the international system.',
    'Highlight the quest by states to maintain equilibrium in global power politics.',
    'Discuss the reasons for different classifications of states such as developed, developing, less developed and Third World countries.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL216: Political Ideas
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL216', 'Political Ideas', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Political Ideas', ARRAY[
    'Discuss the origins and main premises of major political ideas.',
    'Discuss the contributions of the founding and leading scholars to these ideas.',
    'Explain the impact of these ideas on the forms, systems, processes and structures of government.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL311: History of Political Thought
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL311', 'History of Political Thought', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'History of Political Thought', ARRAY[
    'State the contributions of leading scholars to the study of politics.',
    'Explain the impact of their thoughts on structures, systems and forms of government, society and state.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL312: Logic and Methods of Political Science Research
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL312', 'Logic and Methods of Political Science Research', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Logic and Methods of Political Science Research', ARRAY[
    'State the rationale behind the scientific study of politics.',
    'Explain the methods of conducting scientific research in Political Science.',
    'Apply the methods and techniques in various areas of political research.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL313: Public Policy Analysis
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL313', 'Public Policy Analysis', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Public Policy Analysis', ARRAY[
    'State the nature of public policy making and differentiate it from decision making.',
    'Discuss the need for planning for policy efficiency.',
    'Identify and explain the actors and processes involved in the policy cycle.',
    'Explain the methods and techniques essential for policy analysis.',
    'Identify and apply scientific methods and techniques to analyse public policy.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL314: Comparative Federalism
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL314', 'Comparative Federalism', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Comparative Federalism', ARRAY[
    'State the nature of federalism.',
    'Discuss the reasons why some states adopt the federal structure of government.',
    'Identify and explain some of the challenges of federal systems.',
    'Compare and contrast the differences in the practice of federalism across the world.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL315: Political Behaviour
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL315', 'Political Behaviour', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Political Behaviour', ARRAY[
    'State the importance of political behaviour to the scientific study of politics.',
    'Identify and explain the principles of behaviouralism.',
    'Identify and explain the determinants of political behaviour.',
    'Discuss the analytical patterns of political socialisation.',
    'State the levels of political participation and reasons for apathy.',
    'Explain the differences in political culture and behaviour across the globe.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL316: Politics of Development and Under-Development
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL316', 'Politics of Development and Under-Development', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Politics of Development and Under-Development', ARRAY[
    'Explain the rationale for classifications of states into developed and developing/underdeveloped countries.',
    'Explain the contending theories of development and underdevelopment.',
    'Explain the impact of colonialism and neo-colonialism on Africa, Latin America and Asia.',
    'Discuss the differences in levels of development between Africa, Asia and Latin American countries.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL317: Democratisation Studies
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL317', 'Democratisation Studies', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Democratisation Studies', ARRAY[
    'Discuss conceptual and theoretical issues in democratisation studies.',
    'State conditions for democratic consolidation.',
    'Narrate historic democratisation and elections in Nigeria.',
    'Explain the various models of electoral administration.',
    'Highlight the major actors and processes in the democratisation process.',
    'Enumerate the nature and dynamics of Nigeria''s elections.',
    'Explain the relevance of elections to political development in Nigeria.',
    'Identify and explain the challenges of electoral administration in Nigeria.',
    'Discuss electoral reforms in Nigeria.',
    'Discuss the place of election in the democratisation process.',
    'Explain the links among elections, democratisation and democratic consolidation.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL318: Theory and Practice of Marxism
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL318', 'Theory and Practice of Marxism', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Theory and Practice of Marxism', ARRAY[
    'Discuss the principles of Marxism such as dialectical materialism, historical materialism and class struggle.',
    'Discuss the impact of Marxism on revolutions in USSR, China, Cuba and others, and the premises for neo-Marxism.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL319: Contemporary Political Analysis
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL319', 'Contemporary Political Analysis', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Contemporary Political Analysis', ARRAY[
    'Explain the nature of political analysis.',
    'Discuss the relevance of competing paradigms in political analysis.',
    'Explain theories and models of political analysis.',
    'Apply relevant paradigms, theories and models to analysis of political phenomena.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL411: State and Economy
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL411', 'State and Economy', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'State and Economy', ARRAY[
    'Explain the nature of the Nigerian economy.',
    'Discuss the relationships between government and private enterprises.',
    'State the role of foreign aid and technology in developing Nigeria''s economy.',
    'Identify and discuss challenges of development planning in Nigeria.',
    'Discuss the roles of indigenisation and self-reliance as solutions to Nigeria''s dependency in the international economic system.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL412: Contemporary Defence and Strategic Studies
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL412', 'Contemporary Defence and Strategic Studies', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Contemporary Defence and Strategic Studies', ARRAY[
    'Explain the nature of defence and strategic studies.',
    'Describe the actors and processes of strategic decision making.',
    'State the strategic paradigms in defence and security studies.',
    'Highlight the relevance of strategic decision making and analysis in national defence and security.',
    'Identify and discuss challenges of strategic affairs.',
    'State the relevant skills for strategic decision making.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL413: Nigerian Local Government
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL413', 'Nigerian Local Government', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigerian Local Government', ARRAY[
    'State the operations of local governments before 1976.',
    'Discuss the provisions of the 1976 local government reforms.',
    'Explain the challenges of local government''s funding and management of resources.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL414: Nigerian Foreign Policy
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL414', 'Nigerian Foreign Policy', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigerian Foreign Policy', ARRAY[
    'State the dynamics of Nigeria''s national interests since independence.',
    'Describe the actors and processes involved in Nigeria''s foreign policy formulation.',
    'Describe the different dimensions of Nigeria''s relationships with other members of the international community.',
    'Highlight the challenges and prospects of Nigeria''s external relations.',
    'Explain the required skills to interrogate Nigeria''s foreign policy.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- POL415: International Law and Organization
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'POL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'POL415', 'International Law and Organization', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'International Law and Organization', ARRAY[
    'Explain the nature and objectives of international law.',
    'State the development of international law.',
    'Identify the principles of international law.',
    'Highlight the procedure involved in international adjudication and dispute settlement.',
    'Explain limitations of international law in international politics.',
    'Discuss the institutions and processes of various international organisations.',
    'Discuss the prospects and limitations of international organisations as important actors in the international system.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

COMMIT;
