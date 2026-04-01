-- Seed file for NUC Business Education (CCMAS)
-- Generated with active-verb normalisation and CTE safety
-- CORRECTED VERSION: Fixed typos, removed editorial text, standardized formatting
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Business Education', 'BED')
ON CONFLICT (nuc_code) DO NOTHING;

-- BED114: Financial Accounting for Business Educators I (2 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED114', 'Financial Accounting for Business Educators I', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Financial Accounting for Business Educators I', ARRAY[
    'Explain the concept of accounting',
    'Explain the history and development of accounting',
    'Describe the structure of International Accounting Standard Board (IASB) and its conceptual framework',
    'Identify source documents',
    'Demonstrate knowledge of the principles of double entry book-keeping',
    'Prepare cash books, bank reconciliation statements, and statements for sole traders'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED121: Office Administration and Management (2 units, Level 100, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED121', 'Office Administration and Management', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Office Administration and Management', ARRAY[
    'Demonstrate knowledge of the principles of office management',
    'Describe types of office organization',
    'Explain the advantages and disadvantages of each method of office organization',
    'Explain the procedures for effective office management',
    'Explain the theories of motivation and job specification'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED122: Business Mathematics (2 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED122', 'Business Mathematics', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Business Mathematics', ARRAY[
    'Apply symbolic logic in reasoning',
    'Conduct deductive and inductive reasoning in problem-solving approaches',
    'Solve complex number problems',
    'Identify sets and subsets'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED124: Principles of Marketing for Business Educators (2 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED124', 'Principles of Marketing for Business Educators', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Principles of Marketing for Business Educators', ARRAY[
    'Demonstrate knowledge of marketing',
    'Explain why business and marketing are changing',
    'Explain functions and principles of marketing',
    'Use the marketing mix to satisfy consumer needs',
    'Segment the market using different factors',
    'Carry out retailing and wholesaling activities',
    'Determine factors that influence consumer behavior',
    'Identify consumer rights and explain how to protect the consumer'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED213: Principles of Business Finance (2 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED213', 'Principles of Business Finance', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Principles of Business Finance', ARRAY[
    'Identify the types of funds available to an enterprise',
    'Identify the various sources of finance available to an organization',
    'Apply working capital management strategies',
    'Apply capital budgeting techniques in mapping project decisions',
    'Demonstrate acquired knowledge of risk and portfolio management'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED214: Business Communication & Report Writing (2 units, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED214', 'Business Communication & Report Writing', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Business Communication & Report Writing', ARRAY[
    'Explain the concept of business communication skills',
    'Discuss the process that takes place in communication',
    'Explain the different types of communication',
    'Explain the steps in the writing process',
    'Explain the principles of interpersonal relationships',
    'Describe interview skills for recruitment purposes',
    'Identify the necessary plans to make before negotiating communication'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED222: Cost Accounting for Business Educators (2 units, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED222', 'Cost Accounting for Business Educators', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Cost Accounting for Business Educators', ARRAY[
    'Explain the attitudes of cost accounting information',
    'Classify cost accounting information using various bases',
    'Prepare job cost sheets for management decision making',
    'Prepare labour costs of an operation for a business concern',
    'Identify and apportion costs of production to various cost centres',
    'Ascertain costs of production using marginal and absorption techniques',
    'Prepare cost information for management'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED223: Office Information Technology (2 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED223', 'Office Information Technology', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Office Information Technology', ARRAY[
    'Demonstrate knowledge of information and communication handling procedures in the organization',
    'Describe skills for handling office information and communication procedures',
    'Elucidate understanding and practical knowledge of information security in the organization',
    'Explain the basic concept of office automation'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED313: Nigerian Marketing System (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED313', 'Nigerian Marketing System', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigerian Marketing System', ARRAY[
    'Analyze the Nigerian marketing environment',
    'Segment the market according to consumer needs',
    'Forecast the market',
    'Develop new products and classify them',
    'Develop market strategies for products',
    'Manage channels of distribution',
    'Utilize promotion variables for marketing products and services'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED315: Theories of Entrepreneurship (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED315', 'Theories of Entrepreneurship', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Theories of Entrepreneurship', ARRAY[
    'Identify the different schools of entrepreneurial thought',
    'Explain the different schools of thought',
    'Differentiate between the macro view and the micro view',
    'Explain the effect of entrepreneurship theories on entrepreneurial education',
    'Explain the relevance of entrepreneurship theories to contemporary entrepreneurship education'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED320: Marketing Management for Business Educators (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED320', 'Marketing Management for Business Educators', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Marketing Management for Business Educators', ARRAY[
    'Apply fundamental principles and functions of management to marketing',
    'Apply marketing strategies to meet consumer needs',
    'Demonstrate knowledge of consumer rights and demonstrate commitment to consumerism',
    'Demonstrate social responsibility in marketing'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED321: Management Accounting for Business Educators (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED321', 'Management Accounting for Business Educators', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Management Accounting for Business Educators', ARRAY[
    'Compare job order with process costing',
    'Design and use activity-based costing systems',
    'Prepare managerial accounting statements',
    'Compute necessary managerial accounting information',
    'Prepare simple budgets',
    'Analyze variance'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED322: Public Sector Accounting for Business Educators (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED322', 'Public Sector Accounting for Business Educators', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Public Sector Accounting for Business Educators', ARRAY[
    'Explain at an appropriate level of confidence the nature and objectives of public sector accounting',
    'Identify the various users of public sector accounting and their information needs',
    'Identify and apply the various bases of public sector accounting',
    'Identify the various sources of government revenue and revenue officers of government',
    'Prepare and present monthly transcripts from a set of information',
    'Prepare and present the final accounts of government in line with applicable standards'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED323: Management Information System (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED323', 'Management Information System', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Management Information System', ARRAY[
    'Differentiate between data and information',
    'Identify the components of a system',
    'Identify characteristics of a good management information system',
    'Explain the functions of management information systems',
    'Apply different information systems in business'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED324: Sales Management for Business Educators (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED324', 'Sales Management for Business Educators', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Sales Management for Business Educators', ARRAY[
    'Demonstrate knowledge of sales management',
    'Explain responsibilities of sales managers',
    'Identify factors that affect performance of sales persons',
    'Explain how to boost sales person performance',
    'Describe the selling process',
    'Plan and budget sales',
    'Organize the sales force'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED325: Creativity and Innovation in Business (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED325', 'Creativity and Innovation in Business', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Creativity and Innovation in Business', ARRAY[
    'Demonstrate knowledge of innovation',
    'Apply creativity in the process of innovation',
    'Generate business ideas',
    'Demonstrate ability to carry out feasibility studies and write a business plan',
    'Demonstrate ability for new product creation, implementation, management and sustenance'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED326: Nigeria Business Environment (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED326', 'Nigeria Business Environment', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigeria Business Environment', ARRAY[
    'Explain a business environment',
    'Describe the trends in enterprise promotion',
    'Identify the fundamentals of community-institution partnerships',
    'Identify emerging business platforms',
    'Discuss the various government interventions in business environments'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED327: Digital Skills in Business Education (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED327', 'Digital Skills in Business Education', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Digital Skills in Business Education', ARRAY[
    'Demonstrate knowledge of digital skills',
    'Identify types of digital skills needed in modern offices',
    'Utilize digital skills to handle information and solve problems',
    'Manage digital information and content',
    'Utilize digital techniques to market products on social media'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- BED329: SIWES (4 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BED329', 'SIWES', 4, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'SIWES', ARRAY[
    'Analyze the opportunity to gain practical work experience',
    'Demonstrate readiness and practical skills appropriate to work station',
    'Demonstrate ability to learn work habits',
    'Cooperate with industry-based trainers and supervisors'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

COMMIT;