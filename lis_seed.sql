-- Seed file for Library and Information Science Curriculum
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Library and Information Science', 'LIS')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS111', 'Introduction to Library and Information Science', 3, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Library and Information Science', ARRAY[
    'Define the basic concepts in the course.',
    'Discuss the relationship between library science and information science.',
    'Explain the philosophical foundations of the course.',
    'Explain its origin, growth and development.',
    'Discuss the contributions of great scholars to the field.',
    'Mention the need for its study and practice.',
    'Discuss LIS education in Nigeria.',
    'Explain the relationship between LIS and other fields.',
    'Discuss the future of the course.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS114', 'Introduction to Digital Libraries', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Digital Libraries', ARRAY[
    'Define the basic concepts in the course.',
    'Explain the origin and development of digital libraries.',
    'Identify the components of digital libraries.',
    'Enumerate the services of digital libraries.',
    'Explain the uses of digital libraries.',
    'Discuss their advantages and disadvantages.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS125', 'Introduction to Library Application Packages', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Library Application Packages', ARRAY[
    'Define the basic concepts in the course.',
    'Identify types of library application packages.',
    'Discuss the different categories of library application packages and what they are used for.',
    'Describe the features of library application packages.',
    'Explain the limitations of library application packages.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS211', 'Introduction to ICT in Library and Information Services', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to ICT in Library and Information Services', ARRAY[
    'Define basic concepts in the course.',
    'Explain the concept of library automation.',
    'Discuss ICT application in different library services.',
    'Describe information seeking in the electronic environment.',
    'Explain database use in libraries and information centres.',
    'Discuss the Internet as an information resource.',
    'Explain the concept and design of web page and how to run it.',
    'Explain ICT application in library and information centre management and promotion.',
    'Describe digital libraries and open access.',
    'Explain property rights in the digital age.',
    'Discuss the challenges and prospects of ICT application in Nigerian libraries and information centres.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS214', 'Management of Libraries and Information Centres', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Management of Libraries and Information Centres', ARRAY[
    'Discuss the concept of management from library and information centre perspective.',
    'Explain delegation of authority, staff committee, library committee and evaluation as they pertain to management.',
    'Explain goals setting, developing action plans, budgeting and reporting.',
    'Discuss how to manage resources, time, people and money.',
    'Explain how to manage specialized library services.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS215', 'Library and Information Services for Children and Adolescents', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Library and Information Services for Children and Adolescents', ARRAY[
    'Identify the characteristics, needs and interests of children and adolescents for the purpose of selecting appropriate information materials.',
    'Enumerate the effects of media on children and adolescents.',
    'Explain the relationship between gaming and libraries.',
    'Discuss how to filter the gamut of information resources to ensure users’ safety.',
    'Mention social networking services that are available for children and adolescents.',
    'Explain how to offer information and media literacy to children and adolescents.',
    'Enumerate and evaluate digital library resources and services for children and adolescents.',
    'Discuss the role of technology on children’s library and information services.',
    'Explain future trends in library and information services for children and adolescents.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS216', 'Serials Management', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Serials Management', ARRAY[
    'Define the basic concepts in the course.',
    'Explain the role of serials in information dissemination.',
    'Describe the selection, acquisition, organization storage and dissemination processes of serials in print, microform and digital formats.',
    'Enumerate the uses of databases for serials control and dissemination.',
    'Mention the problems of bibliographic control of serials.',
    'Explain users’ access to serials through indexing and abstracting services.',
    'Demonstrate serials control and access using appropriate software.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS222', 'Organization of Knowledge I: Principles of Cataloguing', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Organization of Knowledge I: Principles of Cataloguing', ARRAY[
    'Define the basic concepts in the course.',
    'Describe catalogue using AACR2 and RDA.',
    'Use Library of Congress Subject Headings, Sears List of Subject Headings and Medical Subject Headings (MeSH).',
    'Use Dublin Core Metadata Standard Elements and the Minnesota Metadata Guidelines.',
    'Catalogue non-book materials.',
    'Explain the application of computers to cataloguing.',
    'Mention the types of catalogues and their uses.',
    'Explain filing rules and demonstrate their practical application.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS225', 'Hardware and Software Technologies', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Hardware and Software Technologies', ARRAY[
    'Define the basic concepts in in the course.',
    'Identify the various parts of hardware and their uses.',
    'Discuss network technology.',
    'Mention the various components of system software and their functions.',
    'Explain application software, general application software, application specific software; operating system software, programming languages, telecommunications software satellite/radio/Tv/Internet communications.',
    'Discuss the use of LIS packages for library automation.',
    'Explain electronic library management software, institutional repository management software and electronic resources management software.',
    'Mention and discuss other emerging software and applications.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS312', 'Collection Management', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Collection Management', ARRAY[
    'Discuss the principles and methods of building library collections.',
    'Identify the criteria for evaluating library materials.',
    'Explain the relationship of the selection process to user requirements and other library procedures such as book review, the relationship of the publishing industry and collection management.',
    'Discuss the development of special collections such as non-print materials, cartographic materials and musical materials.',
    'Explain the problems of collection management in Nigerian libraries and information centres.',
    'Identify the problems of acquiring Africana materials.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS313', 'Reference and Information Services', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Reference and Information Services', ARRAY[
    'Explain the evolution, theory and objectives of reference and information services.',
    'Enumerate and explain different types of reference questions.',
    'Identify the tools for offering reference and information services.',
    'Enumerate the qualities reference and information services personnel should possess.',
    'Explain the techniques of literature searching.',
    'Identify types of reference and information services.',
    'Explain abstracting and indexing, current awareness, selective dissemination of information, and translation services.',
    'Explain reference and information services as performed in different types of libraries.',
    'Discuss organization and evaluation of reference and information services.',
    'Explain reference and information services in the digital environment.',
    'Establish the status of reference and information services in Nigerian libraries; and 12. do practical reference work.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS321', 'Preservation, Conservation and Security of Library and Information Resources', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Preservation, Conservation and Security of Library and Information Resources', ARRAY[
    'Define the various concepts of the course.',
    'Enumerate the various disaster and security issues in libraries and information centres.',
    'Describe how to manage them, as well as the current trends in practice, especially with regard to electronic resources.',
    'Identify the body of literature on how to ameliorate the problems of preservation, conservation, security and disasters in libraries and information centres.',
    'Identify institutions with good practices in preservation, conservation, security, disaster preparedness and control.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS413', 'Indexing and Abstracting', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Indexing and Abstracting', ARRAY[
    'Define the basic concepts in the course.',
    'Explain the concepts and methods of indexing and abstracting.',
    'Design and update a thesaurus.',
    'Enumerate types of indexes and abstracts.',
    'Explain the workings of indexing and abstracting services, both print and electronic.',
    'Evaluate indexes and abstracts.',
    'Apply practical knowledge of indexing and abstracting.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS416', 'Archives Administration & Records Management', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Archives Administration & Records Management', ARRAY[
    'Define the key concepts of the course.',
    'Explain the life cycle of records.',
    'Discuss archival activities and processes with regard to theory and practice.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS417', 'Publishing, Book Production and Book Trade', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Publishing, Book Production and Book Trade', ARRAY[
    'Define the key concepts of the course.',
    'Provide an outline history of printing and publishing.',
    'Mention books for different categories of readers.',
    'Identify the different types of publishers.',
    'Explain indigenous publishing.',
    'Mention and explain the nature of book vending.',
    'Identify and explain the problems of marketing and distribution of books.',
    'Explain manuscript development and editing.',
    'Identify and explain author-publisher marketing and promotion techniques.',
    'Discuss intellectual property laws.',
    'Explain the use of modern technologies in publishing.',
    'Enumerate the problems of publishing in Africa with emphasis on Nigeria.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'LIS'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'LIS421', 'Database Design and Management', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Database Design and Management', ARRAY[
    'Define the key concepts of the course.',
    'Identify types of databases.',
    'Discuss the scope of database design, database management, database principles for microcomputers.',
    'Identify and discuss examples of database applications in library in library and information fields.',
    'Explain and demonstrate the processes of database design, creation and maintenance.',
    'Discuss and demonstrate data dictionary and normalization process.',
    'Explain user interface and programming concepts.',
    'Create a workable database system.',
    'Describe centralized and distributed database system.',
    'Execute practical work in database design and management.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

COMMIT;
