-- Seed file for NUC Adult Education Curriculum
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Adult Education', 'EAE')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE101', 'Introduction to Adult Education', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Adult Education', ARRAY[
    'Give the meaning and scope of adult education.',
    'Discuss the significance of the study of adult-education.',
    'Identify challenges facing adult education practice in Nigeria.',
    'Discuss the career opportunities for adult education graduates.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE102', 'Adult Education and Development', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Adult Education and Development', ARRAY[
    'Explain the link between education and nation building.',
    'Express the knowledge of certain education theories guiding national development and education.',
    'Provide diverse explanations of social change and development.',
    'Identify needed social changes in the community and their challenges.',
    'State the role of adult education in promoting social change.',
    'Discuss the role of university adult education in national development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE111', 'Literacy and Vocational Skills for Development', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Literacy and Vocational Skills for Development', ARRAY[
    'Explain the difference between the production of vowel and consonant sounds.',
    'List many phonological features of language (mother tongue & English) with examples of effect on communication.',
    'Use and critique certain features in samples of oral communication.',
    'Identify appropriate techniques for sounding new words; determining meaning of words and others.',
    'Use techniques to make out correct features of a language in an oral or written passage.',
    'Create materials for group to practice using the techniques.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE112', 'Oracy and Linguistic Literacy in English', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Oracy and Linguistic Literacy in English', ARRAY[
    'Explain the difference between the production of vowel and consonant sounds.',
    'List many phonological features of language (mother tongue & English) with examples of effect on communication.',
    'Use and critique certain features in samples of oral communication.',
    'Identify appropriate techniques for sounding new words; determining meaning of words and others.',
    'Use techniques to make out correct features of a language in an oral or written passage.',
    'Create materials for group to practice using the techniques.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE121', 'Introduction to Community Development', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Community Development', ARRAY[
    'Explain the meaning of community and community development.',
    'Give reasons why community development is important.',
    'List economic, social and cultural factors that affect community well-being and development.',
    'Describe how education can affect community development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE122', 'Adult Education and Community Development', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Adult Education and Community Development', ARRAY[
    'State the role and importance of adult education in relation to the Nigerian environment and SDGs.',
    'Explain the concepts of self-relevance and self-reliance as goals of adult education and how they can be achieved.',
    'Discuss what strategies can be used to conduct successful adult education in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE131', 'Working with Marginal Groups', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Working with Marginal Groups', ARRAY[
    'Identify various marginalised groups and their educational needs.',
    'Describe the principles and techniques of working with marginalised groups.',
    'Discuss the challenges affecting the education of marginalised groups in Nigeria.',
    'State effective ways of organising and addressing the challenges of marginalised groups.',
    'Explain the importance of inclusion of the marginalised group for sustainable development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE132', 'Critical Pedagogy', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Critical Pedagogy', ARRAY[
    'Explain certain methods of helping adults learn.',
    'Discuss the roles of Malcolm Knowles and Paulo Freire in shaping adult education instruction.',
    'Discuss Nigeria’s national policy on education provisions on adult education instruction.',
    'Discuss the meaning, scope and significance of extension education.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE141', 'Historical Perspectives of Cooperative in Nigeria', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Historical Perspectives of Cooperative in Nigeria', ARRAY[
    'Give an historical account of cooperative movement in Nigeria before and after independence.',
    'Highlight the factors that contributed to the growth and development of cooperative societies in different sectors of the society.',
    'Describe the transformative process of the Cooperative from the traditional to the modern form.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE142', 'Introduction to Philosophy of Cooperatives and Cooperative Management', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Philosophy of Cooperatives and Cooperative Management', ARRAY[
    'Discuss the concept of cooperatives and describe the basis and basic principles of cooperative.',
    'Identify the types and forms of cooperatives in Nigeria and state the advantages of cooperative.',
    'Highlight the distinction between cooperatives and other business enterprise.',
    'Explain the concept of cooperative management and describe cooperative governance.',
    'Enumerate the challenges facing cooperatives in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE152', 'Government Policies and Development of Women', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Government Policies and Development of Women', ARRAY[
    'Explain the importance of government articulated policy for women development.',
    'Identify the landmark policy statements and instruments and underlying global influences if any.',
    'Analyse the focus and targets of policies.',
    'Assess extent and success of implementation and sustainability.',
    'Trace historically the focal points of women education in response to growing demands.',
    'Identify the socio-cultural and economic factors placing constraints on women education in the Nigerian environment.',
    'Summarise and assess individual, private and government interventions to equalize women educational opportunities.',
    'Suggest further action to be taken in Nigeria to meet 2030 targets.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE161', 'Introduction to Industrial Education', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Industrial Education', ARRAY[
    'Identify various occupations and careers in industry.',
    'Explain key terms in the world of work.',
    'Discuss the concepts of industry, education, and industrial education.',
    'Mention different types of industry and nature of their production.',
    'Describe forms of industrial education essential to enhance workers’ skills, competence and productivity.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE162', 'Introduction to Personnel Development and Administration', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Personnel Development and Administration', ARRAY[
    'Explain personnel development and highlight importance of personnel training.',
    'Discuss workers’ training needs, in-service training, training on the job.',
    'Highlight the steps to mentoring of workers in an industry.',
    'Describe how targets are set and met in an industry.',
    'Explain personnel administration and identify principles, policies, and practices in personnel administration.',
    'Describe methods of job design in industry.',
    'Highlight techniques of staff recruitment, selection and placement in industry; and identify the yardsticks used for workers’ promotion.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE171', 'History of Distance Education', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'History of Distance Education', ARRAY[
    'Give a historical background of open and distance education/learning in Nigeria.',
    'Examine the different models of distance learning in Nigeria.',
    'Highlight the roles of mass media in the development of open and distance education in Nigeria.',
    'Identify the distinction between distance education and other terminologies with distance education.',
    'Give examples of some correspondence institute.',
    'Explain the roles of information and communication technology in the development of open and distance learning in Nigeria.',
    'Explain the role of national open university of Nigeria (noun) in the promotion of distance education in Nigeria.',
    'Give an overview of the work study programme of National Open University in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE172', 'Open Learning System and Learning in Non-school Environment', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Open Learning System and Learning in Non-school Environment', ARRAY[
    'Define and discuss the meaning, concept and objectives of Open Learning.',
    'Highlight the features of LMS, explain the concept of learning management system (LMS) and its use in Open Learning.',
    'Discuss the meaning and types of open access literature as well as its relevance to Open Learning.',
    'Enumerate the different techniques used in Open Learning and identify the users and beneficiaries.',
    'Identify nature and types of non-school environment in Nigeria.',
    'Discuss the forms and contents of learning in non-school environment.',
    'Suggest methods for improvisation and deployment of human and material resources for learning in non-school environment.',
    'Enumerate factors inhibiting learning in non-school environment.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE201', 'Psychology of Adult Learning', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Psychology of Adult Learning', ARRAY[
    'Distinguish the circumstances of adult learners from other learners.',
    'Explain the various learning theories and their application to adult learning.',
    'Discuss the aging process and its impact on adult learners.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE203', 'Historical Development of Adult Education in Nigeria and Elsewhere', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Historical Development of Adult Education in Nigeria and Elsewhere', ARRAY[
    'Demonstrate knowledge of the evolution of adult education as a distinct field of study.',
    'Discuss the evolution of adult education in Nigeria from pre-colonial times to date.',
    'Identify and describe different methods and techniques of comparing adult education systems in different climes.',
    'Compare the development of adult education in developing and developed countries.',
    'Highlight the contributions of NGOs, professional bodies and international development partners in the development of adult education in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE204', 'Sociology of Adult Education', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Sociology of Adult Education', ARRAY[
    'Explain various sociological concepts in relation to adult education.',
    'Describe certain sociological theories and their effect on adult education.',
    'Relate the role of adult education to the promotion of social change.',
    'Describe pattern and arrangements of dynamic component parts within the society.',
    'State the consequent influences of belonging to society on behaviour, status and personal independence.',
    'Discuss possible management strategies to promote human development and independence.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE206', 'Introduction to Non-Formal Education', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Non-Formal Education', ARRAY[
    'Explain the concept of non-formal education in relation to other education modes.',
    'Situate traditional adult education within the context of non-formal education.',
    'Identify various non-formal learning Centre’s in Nigeria.',
    'Discuss the problems of non-formal learning centres and suggest possible solutions.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE211', 'Theories of Andragogy Applied to Literacy Learning', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Theories of Andragogy Applied to Literacy Learning', ARRAY[
    'State problems adults experience in learning new things, skills, information especially language.',
    'Compare and contrast adults and children’s learning patterns.',
    'Describe some ways of motivating adult learners.',
    'Name and summarise one learning theory and its principles.',
    'Explain an eclectic learning approach.',
    'Show how some learning principles can be applied to vocational skill learning; language learning; socio-emotional skill learning.',
    'Identify some cognitive skills and what learning principles can be used to promote them.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE212', 'Literacy Education and Social Change', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Literacy Education and Social Change', ARRAY[
    'Explain the nature of social change.',
    'Mention factors that can bring about social change.',
    'Compare planned and unplanned social change.',
    'Show in what ways literacy education can bring about beneficial social change.',
    'State differences of positive social change in urban and rural areas of Nigeria.',
    'Discuss the meaning of and necessity for sustainable development.',
    'Discuss what environmental issues are suitable for enlightenment campaign.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE221', 'Socio-Cultural Features of Community Development', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Socio-Cultural Features of Community Development', ARRAY[
    'Describe characteristics and stages of social movements.',
    'Discuss socio-cultural aspects of community life and importance to the well-being of the community.',
    'Explain how socio-cultural aspects of life may condition attitudes and personality of individuals in the community.',
    'Explain the existing class distinction in education.',
    'Discuss the influence of location, cost, et as factors in class distinction in education; private and public education.',
    'Give reasons and appreciate how education is a force for desired social change.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE222', 'Comparative Studies in Community Development', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Comparative Studies in Community Development', ARRAY[
    'State the usefulness of and possible lessons from engaging in comparative assessment of developing communities.',
    'Select and justify the use of participatory or integrated approach of community development in Nigeria.',
    'Describe simple methods and techniques to use in comparative studies of communities’ development.',
    'Discuss the pros and cons of using technological devices in the study of community development in Nigeria.',
    'Explain what lessons can be learnt by a student participating in the planning and study of community development.',
    'Describe the composition of the group and list parameters to use in a comparative study of community development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE231', 'Learning in Non-School Environment', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Learning in Non-School Environment', ARRAY[
    'Situate the scope and significance of open learning to be a veritable educational tool outside the conventional schooling.',
    'Identify advantages and challenges associated with open schooling.',
    'Describe how Nigeria can optimise the use of open schooling.',
    'Discuss issues and challenges associated with learning in non-school settings.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE232', 'Political Economy of Extension', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Political Economy of Extension', ARRAY[
    'Demonstrate ability to bring out how economic theories and methods can impact on extension work in the community.',
    'Discuss the theories and principles of extension.',
    'Highlight the benefits extension work to productivity and the economy in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE241', 'Bye laws and Registration', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Bye laws and Registration', ARRAY[
    'Discuss how cooperative bye laws are drafted.',
    'Highlight the essential components of cooperative bye laws.',
    'Describe the steps involved in the registration of cooperative societies.',
    'Explain government regulations governing cooperative societies.',
    'Discuss any problems encountered in operating the law and suggest solutions.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE242', 'Cooperatives and National Development', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Cooperatives and National Development', ARRAY[
    'Explain the roles of cooperative societies to national development.',
    'Describe the nature, forms and structures of cooperative financial institutions in Nigeria.',
    'Discuss the forms and structure of Cooperatives in Nigeria and the impact on socioeconomic development.',
    'Outline the ways cooperative ventures have assisted in tackling the problems of unemployment in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE251', 'Women and Education', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Women and Education', ARRAY[
    'Explain the necessity and perspective of the education of girls and women as a human right.',
    'State the benefits of education generally and women education in particular as the means to change and development.',
    'Discuss the identified problems, proffered solutions and suggest more solutions.',
    'State the importance of education of women for development and to the individual.',
    'Discuss the choices of educational type and paths available to women and the factors compelling such choices.',
    'Argue convincingly about freedom to choose educational path, removal of some of the constraints and challenges.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE252', 'Reproductive Health of Women and Environment', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Reproductive Health of Women and Environment', ARRAY[
    'State the meaning of reproductive health of women and the impact of the environment on health.',
    'List the infections and diseases endemic in the environment and preventive measures to take to maintain positive reproductive health.',
    'Suggest improvement strategies for preventing reproductive diseases of women in the neighbourhood.',
    'Explain the link between female reproductive health and development.',
    'Show how female reproductive health has an impact on family health.',
    'Argue in favour of the need for widespread information on aspects of female reproductive health issues to be disseminated to all sectors of the community.',
    'Analyse the influence of external interest on female reproductive health issues especially HIV Aids on the Nigerian situation.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE261', 'Management of Small Scale Industries', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Management of Small Scale Industries', ARRAY[
    'Identify strategies for establishing and sustaining small scale entrepreneurial industries.',
    'Explain the key terms in business management such as bookkeeping, banking, stock taking, personnel management, credit facilities, marketing, customer relations.',
    'Identify the need for business registration and state the roles of CAC in business registration and management in Nigeria.',
    'Discuss basic management principles and strategies suitable for enhancing personnel and industrial operational efficiency and effectiveness.',
    'Highlight the importance of branding and trademark/secrets to the prospects of a business enterprise.',
    'Apply SWOT analysis as a strategic planning technique for healthy business competition.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE262', 'Workers Education, Skills and Scaling in Labour', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Workers Education, Skills and Scaling in Labour', ARRAY[
    'Discuss the concept of work and identify factors that promote efficiency at work.',
    'Explain the essence of workers skills and competence updating and upgrading.',
    'Discuss the relevance of continuous professional education, and self-directed learning to workers education and learning.',
    'Explain the concept of production and discuss the processes for acquiring and transmitting knowledge, skills and attitudes to improve efficiency and effectiveness.',
    'Identify factors that enhance production of quality goods and services and highlight the strategies for ensuring that production meets the needs of the customers.',
    'Enumerate the marketing skills required in selling goods and services.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE271', 'Instructional Technology in Distance Education', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Instructional Technology in Distance Education', ARRAY[
    'Explain the concept of instructional technology, teaching aids and techniques and relate this to the concept of instructional system design (ISD).',
    'Enumerate the key elements of instructional design in distance education and discuss the fundamental principles of human learning that form the basis of instructional design in distance education.',
    'Itemise and explain major factors to be considered in instructional design in distance education.',
    'Explain the effect of contextual factors such as power and politics on the deployment of technology in instructional design.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE272', 'Programme Monitoring and Evaluation in Distance Education', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Programme Monitoring and Evaluation in Distance Education', ARRAY[
    'Explain the concept of monitoring and evaluation of distance education.',
    'Differentiate between monitoring and evaluation of distance education.',
    'Highlight the steps involved in carrying out monitoring and evaluation of distance education.',
    'Discuss the essential components of evaluation report and enumerate the different phases of evaluation.',
    'Describe different evaluation models and utilize them to design an evaluation plan for distance education.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE281', 'Financing Adult Education', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Financing Adult Education', ARRAY[
    'Explain the rationale for cost analyses in educational planning.',
    'Analyse the state of expenses at local, state and federal levels.',
    'Enumerate the sources of adult education funding.',
    'Prepare and present budgets, simple accounts and financial statements.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE282', 'Administration of Adult Education: Theory and Practice', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Administration of Adult Education: Theory and Practice', ARRAY[
    'Explain concepts of administration, management, adult education administration.',
    'Outline management/administration theories.',
    'Describe administrative functions and how they influence successful organization of adult education in Nigeria.',
    'Identify problems of adult education practice in Nigeria and suggest solutions.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE301', 'Funding and Management of Adult Education', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Funding and Management of Adult Education', ARRAY[
    'Discuss the various sources of funding adult education programmes.',
    'Identify practical ways in which adult education is financed in Nigeria.',
    'Highlight challenges in the funding and management of adult education in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE302', 'Teaching Principles and Practice in Adult Education', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Teaching Principles and Practice in Adult Education', ARRAY[
    'Acquaint themselves with the unique characteristics of adult learners.',
    'Identify the major approaches and principles involved in helping adults learn.',
    'Discuss specific techniques that are suitable for different sets of adult learners.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE303', 'Comparative Adult Education', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Comparative Adult Education', ARRAY[
    'Explain the key concepts and techniques in comparative adult education.',
    'Identify adult education systems in different countries.',
    'Describe how adult education in Nigeria differs from some other countries.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE311', 'Post Literacy and Resources in Education', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Post Literacy and Resources in Education', ARRAY[
    'Define post literacy education.',
    'State strategies to use to sustain literacy among the recently literate in the community.',
    'List resources and state their usefulness in literacy education.',
    'Discuss availability and acquisition.',
    'Improvise an instructional material.',
    'Suggest both preventive and remedial strategies for maintenance of literacy.',
    'Practise with some of the technological resource materials.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE312', 'Management of Small-Scale Business', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Management of Small-Scale Business', ARRAY[
    'List small scale businesses in the neighbourhood and describe one.',
    'State the importance of small and medium businesses in national economies.',
    'Link literacy skills to management of small business enterprises.',
    'Explain the various activities involved in management of small-scale business.',
    'Describe essential skills and knowledge required for efficient management of small-scale entrepreneurial outfit.',
    'Show how social skills and positive personality traits can enhance management and functioning of small business enterprises.',
    'Discuss in what ways use of technology and digital skills can help the management and functioning of small business enterprises.',
    'Enumerate some of the challenges and suggest out-of-the-box coping strategies.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE321', 'Ecosystem and Community Development', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Ecosystem and Community Development', ARRAY[
    'Give the meaning and nature of ecosystem.',
    'Distinguish between environmental and community development ecosystems.',
    'State the relationship of ecosystem and the community in terms of people’s cultural, social and economic behaviours.',
    'Discuss planned beneficial community development based on improved ecosystem.',
    'State some of the challenges of both environmental and community development ecosystems face and suggest coping strategies.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE402', 'Evaluation of Adult Education Programmes', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Evaluation of Adult Education Programmes', ARRAY[
    'Demonstrate knowledge of concepts of evaluation in education.',
    'Describe types and techniques of evaluation of adult education programmes.',
    'Identify different aspects of adult education programmes that can be evaluated.',
    'List and explain applicability of various instruments to use for evaluation of Adult Education Programmes.',
    'Suggest how and apply ICT techniques in evaluative study of Adult Education Programmes in Nigeria.',
    'Demonstrate practically an evaluation of a Nigerian adult education programme/project.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE403', 'ICT and Communication Media in Adult Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'ICT and Communication Media in Adult Education', ARRAY[
    'Explain the meaning of major ICT concepts.',
    'Describe the significance of ICT in the promotion of teaching and learning adult education.',
    'Situate the importance of communication media in adult education.',
    'Identify various mass media tools in contemporary society.',
    'Identify the advantages and limitations of certain mass media tools in adult education.',
    'Describe mass media personnel and techniques for effective delivery of adult education programmes.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE411', 'Primer Construction and Research in Adult Literacy', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Primer Construction and Research in Adult Literacy', ARRAY[
    'Describe different types of primers used in literacy education.',
    'State methods, strategies needed to construct and produce a primer.',
    'Investigate and list what subject matter would be of interest to adults in your neighbourhood.',
    'Construct a primer with a group containing specified features.',
    'Justify the use of technological devices for the construction and production of primer; 6. discuss the use of a primer for adult instruction.',
    'Explain the benefit of research in adult education to primer construction.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE412', 'Contemporary Issues in Literacy and Vocational Skills Education', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Contemporary Issues in Literacy and Vocational Skills Education', ARRAY[
    'Identify some local and contemporary issues in literacy education.',
    'State the policy issues in Nigeria and compare with another West African country.',
    'Explain how literacy and vocational skills are important for community and national development.',
    'Show how different communities and governments are tackling these issues.',
    'Suggest ways that any selected issues can be handled in Nigeria.',
    'Discuss how to network and share ideas with other locations and countries for solutions.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE421', 'Sociology of Development', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Sociology of Development', ARRAY[
    'Explain the meaning of development, human development, societal development.',
    'State the factors that bring about change and the progressive nature of development.',
    'Enumerate the problems of translating policy to implementation in community development.',
    'Imagine and suggest ways of planning and effecting development beneficial to Nigerian communities in future.',
    'Compare and contrast factors that affect human and economic development in a developed and developing country.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE422', 'Needs Analysis and Evaluation of Community Development', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Needs Analysis and Evaluation of Community Development', ARRAY[
    'Explain the meaning and usefulness of needs analysis for community development.',
    'Devise and justify a stepwise plan for needs analysis of a known community.',
    'State what areas and targets can be selected for study in a typical Nigerian community.',
    'List and describe the tools for evaluating community projects.',
    'Find and read up for critiquing reported cases of community project; and 6. participate in group simulation of community project.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE431', 'Adult Education and Integrated Social Development', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Adult Education and Integrated Social Development', ARRAY[
    'Demonstrate the contribution of adult education and enlightenment to the social development of communities.',
    'Relate theories of social change to social development of society.',
    'Enhance their capacity to use adult education for social development in Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE432', 'Basic Processes in Facilitating Extension', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Basic Processes in Facilitating Extension', ARRAY[
    'Explain the basic processes in facilitating extension.',
    'Identify the tools and resources that facilitate extension.',
    'Discuss the challenges that impede basic processes in facilitating extension services in Nigeria.',
    'Explain basic concepts in social analysis extension; and 5. discuss theories and principles of extension.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE441', 'Cooperative Economics', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Cooperative Economics', ARRAY[
    'Explain the meaning of cooperative economics.',
    'Distinguish between cooperative federalism and cooperative individualism.',
    'Highlight the roles of cooperatives in economic development of Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE442', 'Issues in Nigerian Cooperatives', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Issues in Nigerian Cooperatives', ARRAY[
    'Enumerate and discuss the concepts, components and processes guiding Cooperatives in Nigeria.',
    'Identify the challenges facing Cooperatives in Nigeria and suggest solutions to the problems.',
    'Explore the gender dimensions inherent in the operations and management of Nigerian Cooperative.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE451', 'Women Achievement and Career Motivation', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Women Achievement and Career Motivation', ARRAY[
    'Explain some basic concepts of career, career motivation, extrinsic and intrinsic motivational factors.',
    'Select and outline a theory of career motivation with applicable principles to the Nigerian situation.',
    'Analyse recorded case studies or collect material and write up a relevant case study.',
    'Examine the necessity and role of women in politics and other areas for national development.',
    'Assess the achievement of women in business, teaching, civil service. politics and other professions in Nigeria with some examples.',
    'Discuss the challenges and overcoming strategies to encourage greater female participation in education and politics.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE452', 'Intervention and Evaluation in Women Education', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Intervention and Evaluation in Women Education', ARRAY[
    'State the importance and necessity of situational analysis as guide to intervention.',
    'Describe the tools and the steps used for situational analysis.',
    'Plan a situational analysis and intervention for the empowerment of women in a rural community.',
    'Explain the importance of evaluation as part of an intervention project.',
    'Differentiate between qualitative and quantitative analysis of data obtained from study of intervention project in women education.',
    'List with justification the digital skills that students may use for their evaluations.',
    'Identify the challenges that students/workers may encounter carrying out intervention and evaluations in women education.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE461', 'Personnel Management and Industrial Relations', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Personnel Management and Industrial Relations', ARRAY[
    'Define personnel management.',
    'Identify how to enhance personnel capacity and establish the relationship between motivation and training to job satisfaction, staff output and staff turnover.',
    'Discuss manpower planning, recruitment and training strategies and explain methods of administration of personnel’s promotions, incentives, commendations and awards.',
    'Discuss the concepts of industrial relations, operation, management and incorporation.',
    'Identify essential soft skills and social capital required to foster good industrial relations among stakeholders in industry.',
    'Highlight the strategies and principles of industry public relation.',
    'Explain the roles of marketers, agents and sales representatives in industrial relations.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE462', 'Labour Studies, Collective Bargaining and the History of the Nigerian Labour Movement', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Labour Studies, Collective Bargaining and the History of the Nigerian Labour Movement', ARRAY[
    'Define trade and labour unions.',
    'Describe labour laws and highlight their relevance to industrial harmony.',
    'Identify the types and the causes of grievances in industry; 4. mention how to manage conflicts in industry.',
    'Highlights steps to resolving labour disharmony in industry.',
    'Discuss the establishment of NLC and list its mandates.',
    'Identify the roles of NLC in industrial matters in Nigeria.',
    'Enumerate some of the achievements of NLC since inception and highlight its relevance in the Nigerian Labour space.',
    'Explain some of the challenges confronting the labour union suggest ways of addressing them.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE471', 'Economics of Distance Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Economics of Distance Education', ARRAY[
    'Explain the relationship between education and economic growth.',
    'Describe the concept of human capital formation and development.',
    'Highlight indices of human resources development and social and political indicators.',
    'Discuss the financing of distance education and the impact on quality and effectiveness of Distance Education.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE472', 'Management of Distance Education', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Management of Distance Education', ARRAY[
    'Discuss the concept of management and highlight the core rationales, assumptions and general principles of programme management.',
    'Relate the general principles of management to the management of distance Education and describe various approaches to managing distance education programmes.',
    'Outline the importance of African values in the context of managing distance Education facilities and discuss ways of implementing these values.',
    'Discuss the different motivational strategies available to the manager of a distance Education programme and the importance of motivating workers, facilitators, practitioners and learners in distance education programmes.',
    'Discuss the scope, skills and characteristics of personnel management in distance education and highlight the role of the personnel manager in a distance education institution.',
    'Explain the status of public funding of distance education in Nigeria and articulate the financial management accountability requirements.',
    'Highlight the role of a manager in financial management of distance education and explain the budget preparation process.',
    'Outline innovative ways of raising funds for distance education.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE481', 'Supervision and Change in Adult Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Supervision and Change in Adult Education', ARRAY[
    'Describe different styles of supervision.',
    'Select and justify preferred styles of supervision.',
    'Discuss how to introduce change ideas to supervisors from below as opposed to change ideas being introduced above from management.',
    'Suggest ways to test acceptability of change.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'EAE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EAE482', 'Innovations in Adult Education', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Innovations in Adult Education', ARRAY[
    'Enumerate new and emerging practices in Adult Education locally and internationally.',
    'Discuss characteristics of innovation.',
    'Factors that enhance and inhibit adoption in Nigeria of new and emerging practices.',
    'Discuss how the Adult Educator can facilitate adoption of new changes in the system.',
    'Suggest and justify innovations in practice and tools that can be of benefit in Adult Education.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

COMMIT;
