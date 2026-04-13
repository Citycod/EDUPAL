-- Seed file for Philosophy Program (DELSU / CCMAS)
-- Generated with active-verb normalisation
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Philosophy', 'PHL')
ON CONFLICT (nuc_code) DO NOTHING;

-- PHL 101: Introduction to Philosophy (2 units, Level 100, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL101', 'Introduction to Philosophy', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Philosophy', ARRAY[
    'Explain the general concept of Philosophy and the professional activities of Philosophers',
    'Analyze the historical origins of Philosophy',
    'Trace the developments of Philosophy from ancient to modern times',
    'Identify major philosophical doctrines, eras, and dominant personalities/thinkers'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 102: Arguments and Critical Thinking (2 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL102', 'Arguments and Critical Thinking', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Arguments and Critical Thinking', ARRAY[
    'Explain the nature and structure of arguments',
    'Identify and analyze flaws and fallacies in arguments',
    'Differentiate between valid and invalid arguments',
    'Demonstrate the habit of critical thinking in logical analysis'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 103: Elementary Ethics (2 units, Level 100, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL103', 'Elementary Ethics', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Elementary Ethics', ARRAY[
    'Explain basic ethical concepts including good, bad, right, and wrong',
    'Analyze the grounds upon which actions are judged to be right or wrong',
    'Apply ethical knowledge to personal conduct and social interaction'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 104: History of Philosophy (3 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL104', 'History of Philosophy', 3, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'History of Philosophy', ARRAY[
    'Analyze the philosophical thoughts and ideas of eminent philosophers from ancient to contemporary times',
    'Examine major philosophical doctrines including Idealism, Empiricism, Rationalism, and Existentialism',
    'Demonstrate advanced skills in the art of philosophising',
    'Apply philosophical ideas to practical issues of contemporary life'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 105: Introduction to Social and Political Philosophy (2 units, Level 100, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL105', 'Introduction to Social and Political Philosophy', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Social and Political Philosophy', ARRAY[
    'Define the scope and nature of Social and Political Philosophy',
    'Explain the notions of society, the origin of the state, and political obligations',
    'Assess the role of the citizen in shaping relationships within a social constituent',
    'Evaluate the nature of man in relation to the origins of the state'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 106: Introduction to African Philosophy (2 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL106', 'Introduction to African Philosophy', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to African Philosophy', ARRAY[
    'Critically examine the rich philosophical heritage of African cultures',
    'Analyze the historical debates regarding the existence and methodology of African Philosophy',
    'Employ philosophical tools to analyze traditional African systems of governance and cultural values',
    'Compare traditional and contemporary African philosophical doctrines'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 107: Oriental Philosophies (2 units, Level 100, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL107', 'Oriental Philosophies', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Oriental Philosophies', ARRAY[
    'Identify major Oriental Philosophies including Buddhist, Hindu, and Confucian systems',
    'Analyse continental philosophies and their relationship to indigenous thought systems',
    'Evaluate Oriental systems of logic, world-views, and ethics',
    'Perform a comparative analysis of Oriental Philosophies with Western and African traditions'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 108: Ancient Philosophy (2 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL108', 'Ancient Philosophy', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Ancient Philosophy', ARRAY[
    'Trace the beginnings of Western Philosophy from the Pre-Socratics to Roman times',
    'Explain the cosmological and epistemological doctrines of Graeco-Roman Philosophers',
    'Trace the evolution of philosophical ideas from ancient foundations to modern times',
    'Identify the original issues raised regarding the fusion of cosmology, epistemology, and ethics'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 201: Medieval Philosophy (2 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL201', 'Medieval Philosophy', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Medieval Philosophy', ARRAY[
    'Analyze major philosophical doctrines of the Medieval period from St. Augustine to William of Ockham',
    'Examine the influence of the Church on philosophical thought and vice-versa',
    'Explain the philosophical traditions relating to nature, man, and society during the Middle Ages',
    'Assess the impact of Medieval thinking on contemporary philosophical issues'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 202: Introduction to Logic (2 units, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL202', 'Introduction to Logic', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Logic', ARRAY[
    'Demonstrate a sophisticated understanding of the structure of arguments and categorical propositions',
    'Distinguish between valid and invalid inferences using rules for categorical syllogisms',
    'Apply logical reasoning to academic disciplines and day-to-day decision making',
    'Analyze the traditional square of opposition and existential import'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 203: Theories of Ethics (3 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL203', 'Theories of Ethics', 3, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Theories of Ethics', ARRAY[
    'Analyze contemporary ethical issues including abortion, euthanasia, capital punishment, and LGBT rights',
    'Evaluate standard ethical theories in relation to the Nigerian and African experience',
    'Formulate informed perspectives on matters of morality and social justice',
    'Assess the ethical implications of technology transfer and ethnic relations'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 204: Social and Political Philosophy (2 units, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL204', 'Social and Political Philosophy', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Social and Political Philosophy', ARRAY[
    'Examine major themes in the history of social and political thought from Plato to contemporary theorists',
    'Analyze the Nigerian political scene and broader African political developments',
    'Critically evaluate the relationship between the individual and the state',
    'Demonstrate preparedness for higher academic research through rigorous dialectical engagement'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 205: Introduction to Epistemology (2 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL205', 'Introduction to Epistemology', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Epistemology', ARRAY[
    'Differentiate between types of knowledge, belief, and truth',
    'Critically evaluate various sources of information and knowledge claims',
    'Analyze the core schools of thought: Empiricism, Rationalism, and Pragmatism',
    'Explain the scope and justification of human knowledge in scientific and religious contexts'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 206: Introduction to Metaphysics (2 units, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL206', 'Introduction to Metaphysics', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Metaphysics', ARRAY[
    'Distinguish between physical and non-physical (metaphysical) realities',
    'Analyze the traditional mind-body problem and the relationship between appearance and reality',
    'Contrast scientific explanations with metaphysical claims',
    'Evaluate the problem of universals and particulars in philosophical discourse'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 301: Early Modern Philosophy (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL301', 'Early Modern Philosophy', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Early Modern Philosophy', ARRAY[
    'Critically evaluate the doctrines propounded by Modern thinkers including Bacon, Locke, Hume, Hobbes, Kant, and Descartes',
    'Analyze the evolution of Western Philosophy from the 17th to the 19th Century',
    'Assess the value of Modern philosophical doctrines as sources of intellectual empowerment',
    'Examine the transition from Medieval to Early Modern modes of thought'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 302: Symbolic Logic (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL302', 'Symbolic Logic', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Symbolic Logic', ARRAY[
    'Master advanced logical skills including propositional and first-order quantificational logic',
    'Employ formal tests to determine the validity of complex arguments',
    'Identify logical flaws and weaknesses in oral and written presentations',
    'Adapt the tools of logic for application across diverse human endeavours'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 303: Professional Ethics (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL303', 'Professional Ethics', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Professional Ethics', ARRAY[
    'Analyze the practical ethical challenges confronting medical, legal, engineering, and media professionals',
    'Demonstrate competence in tackling moral dilemmas within various professional contexts',
    'Apply ethical principles to specific cases in accountancy and business practice',
    'Assess the role of ethics in maintaining professional integrity and public trust'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 304: Contemporary Analytic Philosophy (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL304', 'Contemporary Analytic Philosophy', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Contemporary Analytic Philosophy', ARRAY[
    'Critically examine the doctrines of notable Analytic Philosophers such as Wittgenstein, Frege, Russell, and Quine',
    'Employ advanced techniques of philosophical analysis within the analytic tradition',
    'Analyze the impact of 20th-century Analytic Philosophy on contemporary thought',
    'Evaluate the linguistic and conceptual turn in modern philosophical discourse'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 305: Contemporary Issues in African Philosophy (3 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL305', 'Contemporary Issues in African Philosophy', 3, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Contemporary Issues in African Philosophy', ARRAY[
    'Demonstrate an in-depth understanding of the major philosophical issues in the African cultural context',
    'Analyze the concepts of man and society within the African worldview',
    'Formulate original philosophical thoughts based on contemporary African life experiences',
    'Examine the works and debates of leading contemporary African Philosophers'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 306: Existentialism and Phenomenology (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL306', 'Existentialism and Phenomenology', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Existentialism and Phenomenology', ARRAY[
    'Examine major themes in Existentialism and Phenomenology through the works of Kierkegaard, Nietzsche, Sartre, and Heidegger',
    'Analyze the concepts of freedom, choice, and determinism in human actions',
    'Evaluate the philosophical significance of existence, meaning, and the existence of God',
    'Analyze the tension between the self and society in practical life'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 307: Philosophy of the Social Sciences (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL307', 'Philosophy of the Social Sciences', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Philosophy of the Social Sciences', ARRAY[
    'Analyze the methodologies and modes of enquiry adopted within the social sciences',
    'Critically examine the concepts of causation and induction in social research',
    'Evaluate ideological models and their impact on the study of man and society',
    'Describe the conceptual relationship between the individual and society'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 401: Late Modern Philosophy (2 units, Level 400, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL401', 'Late Modern Philosophy', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Late Modern Philosophy', ARRAY[
    'Analyze Contemporary Philosophical Movements including Speculative Philosophy, Pragmatism, and Positivism',
    'Critically evaluate the views of late modern philosophers such as Marx, Mill, Bentham, and Schopenhauer',
    'Construct coherent arguments for and against different philosophical doctrines',
    'Examine technical philosophical materials and relationships between divergent philosophical views'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 402: Further Logic (2 units, Level 400, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL402', 'Further Logic', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Further Logic', ARRAY[
    'Perform advanced logical analysis using the theory of quantification and logic of identity',
    'Demonstrate sophisticated skills in the art of philosophical analysis and formal relations',
    'Apply definite descriptions and relative logic to complex propositional structures',
    'Master the highest level of rigorous logical reasoning'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 403: Classics in Ethics (3 units, Level 400, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL403', 'Classics in Ethics', 3, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Classics in Ethics', ARRAY[
    'Examine profound ethical theories formulated by Kant, Mill, Marx, and Nietzsche',
    'Define and analyze what constitutes a moral agent across various historical eras',
    'Interpret complex academic doctrines and their implications for human conduct',
    'Critically evaluate the application of classical ethical theories to modern moral agency'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 404: Epistemology (2 units, Level 400, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL404', 'Epistemology', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Epistemology', ARRAY[
    'Evaluate the epistemological contributions of Continental Rationalists and British Empiricists',
    'Examine recent contributions to the Theory of Knowledge and contemporary debates',
    'Demonstrate an advanced ability to process complex academic materials in epistemology',
    'Analyze specific topics including Locke, Hume, Berkeley, Descartes, Leibniz, and Spinoza'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 405: Philosophy of Mind (2 units, Level 400, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL405', 'Philosophy of Mind', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Philosophy of Mind', ARRAY[
    'Critically evaluate major theories and presuppositions in the Philosophy of Mind',
    'Analyze the conceptual relationship between mental phenomena and the physical world',
    'Argue persuasively for a philosophical position on the problem of consciousness',
    'Examine Brentano''s theory of intentionality and Husserl''s phenomenology'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 406: Marxist Philosophy (2 units, Level 400, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL406', 'Marxist Philosophy', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Marxist Philosophy', ARRAY[
    'Critically evaluate the basic theories of Karl Marx as originally formulated',
    'Analyze contemporary interpretations and the global influence of Marxist doctrine',
    'Evaluate the relevance of Marxism in the 21st century and its impact on development',
    'Assess the application of Marxist theory to the African and Third World experiences'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 407: Seminar (2 units, Level 400, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL407', 'Seminar', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Seminar', ARRAY[
    'Select and present rigorous academic papers on complex philosophical issues',
    'Critically assess and discuss philosophical presentations within a professional colloquium',
    'Conduct intensive study on a selected notable work or philosophical era',
    'Demonstrate the capacity for high-level academic communication and peer review'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 409: Philosophy of Science (2 units, Level 400, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL409', 'Philosophy of Science', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Philosophy of Science', ARRAY[
    'Analyze epistemological concepts including truth, hypothesis, theory, and scientific law',
    'Examine the nature of scientific truth and paradigms in scientific discoveries',
    'Evaluate scientific revolutions and experimental procedures from a philosophical perspective',
    'Analyze the concepts of induction and probability in scientific reasoning'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHL 410: The Long Essay /Project (6 units, Level 400, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'PHL'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHL410', 'The Long Essay /Project', 6, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'The Long Essay /Project', ARRAY[
    'Demonstrate advanced capacity for original thought and independent research in philosophy',
    'Synthesize complex ideas into a structured and coherent academic long essay',
    'Master the style and format required for professional philosophical academic writing',
    'Establish academic independence through the completion of a culminating original project'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

COMMIT;