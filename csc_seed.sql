-- Seed file for NUC Computer Science Curriculum
BEGIN;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'national_topics_course_topic_unique') THEN
    ALTER TABLE catalog.national_topics ADD CONSTRAINT national_topics_course_topic_unique UNIQUE (course_id, topic_name);
  END IF;
END $$;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Computer Science', 'CSC')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GST111', 'Communication I English', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Communication I English', '{"identify possible sound patterns in English Language","list notable Language skills","classify word formation processes","construct simple and fairly complex sentences in English","apply logical and critical reasoning skills for meaningful presentations","demonstrate an appreciable level of the art of public speaking and listening","write simple and technical reports","learn the major word formation process","apply ICT in to modern language learning, and practice report writing."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GST112', 'Nigerian Peoples and Culture', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigerian Peoples and Culture', '{"analyse the historical foundation of the Nigerian culture and arts in pre-colonial times","list and identify the major linguistic groups in Nigeria","explain the gradual evolution of Nigeria as a political unit","analyse the concepts of Trade, Economic and Self-reliance status of the Nigerian peoples towards national development","enumerate the challenges of the Nigerian State towards Nation building","analyse the role of the Judiciary in upholding people’s fundamental rights","identify acceptable norms and values of the major ethnic groups in Nigeria","list and suggest possible solutions to identifiable Nigerian environmental, moral and value problems","demonstrate knowledge of the concepts of trade and economics of self-reliance, and","identify with the current socio-political and cultural developments in Nigeria."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU101', 'Introduction to Teaching and Foundations of Education', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Teaching and Foundations of Education', '{"state the important roles of teaching as a profession","raise and judge some ethical issues in education","list the intellectual and practical competencies required by the teacher","justify the need for education in the development of a nation","give an account of the history of education from ancient times to the present day modern education in Nigeria","present an overview of the National Policy on Education","identify the stages of child and adolescent development","state the behaviourist, cognitive and socio-cultural perspectives of learning","enumerate historical and current developments in sociology of education, and","highlight the historical and current developments in philosophy of education."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'COS101', 'Introduction to Computing Sciences', 3, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Computing Sciences', '{"trace historical development of computing to the current programmes in the discipline","distinguish the salient characteristics of the different programmes of the computing discipline","identify the roles and applications of computers and computing in different areas of human endeavour","identify and explain the basic components of a computer system","develop basic literacy on the use of computer systems","develop competence on the use of common Office productivity applications; and","make purposeful use of the Internet for information gathering, learning and continuous professional development."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'COS102', 'Problem Solving', 3, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Problem Solving', '{"explain concepts related to problem solving and identify problem types","identify and explain problem solving methods","exemplify solvable and unsolvable problems","interpret given problems and formulate solutions to them using flowchart, pseudocode and/or other formalisms","apply appropriate strategies and procedures to arrive at workable solutions to problems; and","develop critical thinking and problem solving skills required throughout the computing career."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'MTH101', 'Elementary Mathematics I (Algebra and Trigonometry)', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Elementary Mathematics I (Algebra and Trigonometry)', '{"state basic definition of Set, Subset, Union, Intersection, Complements and use of Venn diagrams","solve quadratic equations","solve trigonometric functions","use various types of numbers; and","solve some problems using Binomial theorem."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHY102', 'General Physics II (Behaviour of Matter)', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Physics II (Behaviour of Matter)', '{"explain the concepts of heat and temperature and relate the temperature scales","define, derive, and apply the fundamental thermodynamic relations to thermal systems","describe and explain the first and second laws of thermodynamics, and the concept of entropy","state the assumptions of the kinetic theory and apply techniques of describing macroscopic behaviour","deduce the formalism of thermodynamics and apply it to simple systems in thermal equilibrium; and","describe and determine the effect of forces and deformation of materials and surfaces."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHY107', 'General Practical Physics I', 1, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Practical Physics I', '{"conduct measurements of some physical quantities","make observations of events, collect and tabulate data","identify and evaluate some common experimental errors","plot and analyse graphs; and","draw conclusions from numerical and graphical analysis of data."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GST212', 'Philosophy, Logic And Human Existence', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Philosophy, Logic And Human Existence', '{"explain the basic features of philosophy as an academic discipline","identify the main branches of philosophy & the centrality of logic in philosophical discourse","explain the elementary rules of reasoning","distinguish between valid and invalid arguments","think critically and assess arguments in texts, conversations and day-to-day discussions","critically asses the rationality or otherwise of human conduct under different existential conditions","develop the capacity to extrapolate and deploy expertise in logic to other areas of knowledge; and","guide his or her actions, using the knowledge and expertise acquired in philosophy and logic."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENT211', 'Entrepreneurship and Innovation', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Entrepreneurship and Innovation', '{"explain the concepts and theories of entrepreneurship, entrepreneurships opportunity seeking, new value creation, and risk taking","state the characteristics of an entrepreneur","analyse the importance of micro and small businesses in wealth creation, employment, and financial independence","engage in entrepreneurial thinking","identify key elements in innovation","describe stages in enterprise formation, partnership and networking including business planning","describe contemporary entrepreneurial issues in Nigeria, Africa and the rest of the world","state the basic principles of e-commerce","demonstrate ability to perform reflective and creative thinking; and","apply the basics of a business plan."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU201', 'Curriculum, Curriculum Delivery and Teaching Methods', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Curriculum, Curriculum Delivery and Teaching Methods', '{"explain at an appropriate level of confidence the meaning and types of curriculum","describe the process of curriculum development; analyse and critique the Nigerian Core curricula as guide to curricula delivery","use different methods in the delivery of curriculum content","identify local epistemologies and context and the use of CTCA in the Nigerian context","plan and schedule lessons as well as monitor and evaluate the outcome of each lesson","identify and use learning resources and media and improvise, when necessary","manage classrooms under different conditions and address the needs of individual students, especially, those with special needs including the gifted","demonstrate skills in ICT, set up and manage online classes","demonstrate the application of general classroom management and","skilfully attend to students with special needs."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'COS201', 'Computer Programming I', 3, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Computer Programming I', '{"identify different programming paradigms and their approach to programming","write programs using basic data types and strings","design and implement programming problems using selection","design and implement programming problems using loops","use and implement classes as data abstractions in an object-oriented approach","implement simple exception handling in programs","develop programs with input/output from text files; and","design and implement programming problems involving arrays."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC203', 'Discrete Structures', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Discrete Structures', '{"convert logical statements from informal language to propositional and predicate logic expressions.","describe the strengths and limitations of propositional and predicate logic.","outline the basic structure of each proof technique (direct proof, proof by contradiction, and induction) described in this unit.","apply each of the proof techniques (direct proof, proof by contradiction, and induction) correctly in the construction of a sound argument.","apply the pigeonhole principle in the context of a formal proof.","compute permutations and combinations of a set, and interpret the meaning in the context of the particular application.","map real-world applications to appropriate counting formalisms, such as determining the number of ways to arrange people around a table, subject to constraints on the seating arrangement, or the number of ways to determine certain hands in cards (such as, a full house).","solve a variety of basic recurrence relations."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'IFT211', 'Digital Logic Design', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Digital Logic Design', '{"explain why everything is data, including instructions, in computers","describe how negative integers, fixed-length numbers, and non-numeric data are represented","convert numerical data from one format to another","describe computations as a system characterized by a known set of configurations with transitions from one unique configuration (state) to another (state)","describe the distinction between systems whose output is only a function of their input (Combinational) and those with memory/history (Sequential)","describe a computer as a state machine that interprets machine instructions","articulate that there are many equivalent representations of computer functionality, including logical expressions and gates, and be able to use mathematical expressions to describe the functions of simple combinational and sequential circuits; and","design the basic building blocks of a computer: arithmetic-logic unit (gate-level), registers (gate-level), central processing unit (register transfer-level), and memory (register transfer-level)."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'IFT212', 'Computer Architecture and Organization', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Computer Architecture and Organization', '{"explain different instruction formats, such as addresses per instruction and variable length vs. fixed length formats","explain the organization of the classical von Neumann machine and its major functional units","explain how subroutine calls are handled at the assembly level","explain the basic concepts of interrupts and I/O operations","write simple assembly language program segments","show how fundamental high-level programming constructs are implemented at the machine-language level","compare alternative implementation of datapaths","discuss the concept of control points and the generation of control signals using hardwired or microprogrammed implementations","describe how the use of memory hierarchy (cache, virtual memory) is used to reduce the effective memory latency; and","explain how interrupts are used to implement I/O control and data transfers."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'MTH201', 'Mathematical Methods 1', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Mathematical Methods 1', '{"describe Real-valued functions of a real variable","solve some problems using Mean value Theorem and Taylor Series expansion and","evaluate Line Integral, Surface Integral and Volume Integrals."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'MTH202', 'Elementary Differential Equations', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Elementary Differential Equations', '{"define the following: order and degree of a differential equation","describe some techniques for solving first and second order linear and nonlinear equations; and","solve some problems related to geometry and physics."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'SEN201', 'Introduction to Software Engineering', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Software Engineering', '{"explain the concept of the software life cycle and comprehend the phases of requirements analysis, design, development, testing and maintenance.","differentiate amongst the various software development models.","use UML for object-oriented analysis and design.","describe different design architectures.","undertake a group project involving requirements analysis, design, programming and testing."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC299', 'SIWES I', 3, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'SIWES I', '{"explain how a typical computer firm/unit operates","describe the various assignments carried out and the skills acquired during the SIWES period; and","submit a comprehensive report on the knowledge acquired and the experience gained during the exercise."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'GST312', 'Peace and Conflict Resolution', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Peace and Conflict Resolution', '{"analyse the concepts of peace, conflict and security","list major forms, types and root causes of conflict and violence","differentiate between conflict and terrorism","enumerate security and peace building strategies; and","describe roles of international organisations, media and traditional institutions in peace building."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ENT312', 'Venture Creation', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Venture Creation', '{"describe the key steps in venture creation","spot opportunities in problems and in high potential sectors regardless of geographical location","state how original products, ideas, and concepts are developed","develop business concept for further incubation or pitching for funding","identify key sources of entrepreneurial finance","implement the requirements for establishing and managing micro and small enterprises","conduct entrepreneurial marketing and e-commerce","apply a wide variety of emerging technological solutions to entrepreneurship; and","appreciate why ventures fail due to lack of planning and poor implementation."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU301', 'Teaching Practice I', 3, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Teaching Practice I', '{"demonstrate comprehensive knowledge of the subject matter being taught","apply appropriate pedagogical skills in lesson delivery","apply understanding of child psychology to support student learning in real classroom situations","maintain a positive and professional attitude towards the teaching profession","make proper use of instructional facilities and teaching aids","address individual differences in actual classroom situations to assist children in real time","demonstrate effective classroom management skills."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU302', 'Educational Measurements, Tests, Research Methods and Statistics', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Educational Measurements, Tests, Research Methods and Statistics', '{"measure and assess learning outcomes and use the results in decision making and judgments","identify the different domains of learning; develop and use appropriate instruments for measuring each","identify the different kinds of data that can be yielded in different contexts and the appropriate statistical tool for analyzing each type of data","explain the meaning, aim, types, role and processes of research in educational settings.","acquire communication skills and skills in reporting of research","carry out hypothesis testing, and employ the knowledge of critical values and error in interpretation of results and making of inferences","gain skills in the use of IBM-SPSS and other relevant packages in the analysis of data; and","judge and address ethical issues in research."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC301', 'Data Structures', 3, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Data Structures', '{"discuss the appropriate use of built-in data structures.","apply object-oriented concepts (inheritance, polymorphism, design patterns and others) in software design","implement various data structures and their algorithms, and apply them in implementing simple applications","choose the appropriate data structure for modelling a given problem","analyze simple algorithms and determine their efficiency using big-O notation and","apply the knowledge of data structures to other application domains like data compression and memory management."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC308', 'Operating System', 3, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Operating System', '{"recognize operating system types and structure","describe OS support for processes and threads","recognize CPU scheduling, synchronization, and deadlock","resolve OS issues related to synchronization and failure for distributed systems","explain OS support for virtual memory, disk scheduling, I/O, and file systems","identify security and protection issues in computer systems; and","use C and Unix commands, examine behaviour and performance of Linux, and develop various system programs under Linux to make use of OS concepts related to process synchronization, shared memory, mailboxes, file systems and others."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC309', 'Artificial Intelligence', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Artificial Intelligence', '{"explain AI fundamentals, concepts, goals, types, techniques, branches, applications","understand AI technology and tools","discuss intelligent agents, their performance, examples, faculties, environment and architectures, and determine the characteristics of a given problem that an intelligent system must solve","describe the Turing test and the ''Chinese Room'' thought experiment, and differentiate between the concepts of optimal reasoning/behaviour and humanlike reasoning/behaviour","describe the role of heuristics and the trade-offs among completeness, optimality, time complexity, and space complexity","analyze the types of search and their applications in AI and describe the problem of combinatorial explosion of search space and its consequences","demonstrate knowledge representation, semantic network and frames along with their applicable uses","practice Natural Language Processing, translate a natural language (such as English) sentence into a predicate logic statement, convert a logic statement into clause form, apply resolution to a set of logic statements to answer a query","analyze programming languages for AI and expert systems technology, and employ application domains of AI"}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC322', 'Computer Science Innovation and New Technologies', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Computer Science Innovation and New Technologies', '{"identify the key elements of the process of founding a start-up firm","state and explain the different aspects and challenges of entrepreneurship","list and explain the skills required for technology-driven innovation and entrepreneurship in the age of disruptive technologies","generate an innovative business and build a business plan around it","identify different strategies for raising capital to support an innovation","employ modern technologies to enhance or disrupt an existing business model and","assess and critique a given business proposal from different perspectives."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CYB201', 'Introduction to Cyber Security and Strategy', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Cyber Security and Strategy', '{"explain cybersecurity concepts, its methods, elements, and terminologies of cyber security -cyber, security, threat, attack, defence, and operations","describe common cyber-attacks and threats, cyber security issues, challenges and proffered solutions, and build an enhanced view of main actors of cyberspace and cyber operations","apply the techniques for identifying, detecting, and defending against cybersecurity threats, attacks and protecting information assets","explain the impact of cybersecurity on civil and military institutions, privacy, business and government applications","identify the methods and motives of cybersecurity incident perpetrators, and the countermeasures employed by organizations and agencies to prevent and detect those incidences and software application vulnerabilities; and","state the ethical obligations of security professionals, evaluate cybersecurity and national security strategies to the typologies of cyber-attacks that require policy tools and domestic response, and define the cybersecurity requirements and strategies evolving in the face of big risk."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'DTS304', 'Data Management', 3, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Data Management', '{"identify the careers/roles associated with information management","explain the characteristics that distinguish the database approach from the approach of programming with data files","describe the components of a database system and give examples of their use.","describe concepts in modeling notation","describe the differences between relational and semi-structured data models","apply the modeling concepts and notation of the relational data model","explain and demonstrate the concepts of entity integrity constraint and referential integrity constrain","apply queries, query optimizations and functional dependencies in relational databases","describe properties of normal forms and explain the impact of normalization on the efficiency of database operations","describe database security and integrity issues and their importance in database design; and","explain the concepts of concurrency control and recovery mechanisms in databases."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ICT305: objectives reconstructed from CCMAS course contents, verify against official document
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ICT305', 'Data Communication Systems and Network', 3, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Data Communication Systems and Network', '{"explain types and sources of data, transmission modes, and synchronization techniques","describe the seven-layer ISO-OSI model, transport protocols, and IEEE 802 standards","apply error detection and data compression methods including parity checking and Huffman coding","describe LAN topologies, medium access control techniques, and client-server architectures","explain internet protocols (IPv4, IPv6), TCP/IP networking, and network operating systems"}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC399', 'SIWES II', 3, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'SIWES II', '{"explain how a typical computer firm/unit operates","describe the various assignments carried out and the skills acquired during the SIWES period; and","submit a comprehensive report on the knowledge acquired and the experience gained during the exercise."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU400', 'Project', 3, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Project', '{"identify researchable project topics on contemporary problems in relevant subject specialization in education; and","search and review literature pertinent to identified topical issues."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'EDU401', 'Teaching Practice II', 3, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Teaching Practice II', '{"demonstrate comprehensive knowledge of the subject matter being taught","apply appropriate pedagogical skills in lesson delivery","apply understanding of child psychology to support student learning in real classroom situations","maintain a positive and professional attitude towards the teaching profession","make proper use of instructional facilities and teaching aids","address individual differences in actual classroom situations to assist children in real time","demonstrate effective classroom management skills."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC401', 'Algorithms and Complexity Analysis', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Algorithms and Complexity Analysis', '{"explain the use of big O, omega, and theta notation to describe the amount of work done by an algorithm","use big O, omega, and theta notation to give asymptotic upper, lower, and tight bounds on time and space complexity of algorithms","determine the time and space complexity of simple algorithms","deduce recurrence relations that describe the time complexity of recursively defined algorithms","solve elementary recurrence relations","for each of the strategies (brute-force, greedy, divide-and-conquer, recursive backtracking, and dynamic programming), identify a practical example to which it would apply","use pattern matching to analyze substrings; and","use numerical approximation to solve mathematical problems, such as finding the roots of a polynomial."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'INS401', 'Project Management', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Project Management', '{"describe project management planning","describe project scheduling","explain management of project resources","discuss project procurement, monitoring and execution; and","explain project communication and time management."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CSC'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CSC402', 'Ethics and Legal Issues in Computer Science', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Ethics and Legal Issues in Computer Science', '{"understand laws and regulations related to ethics","identify and explain relevant codes of ethics for computing practice","identify social and ethical issues in different areas of computing practice","review real-life ethical cases and be able to develop ethical resolutions and policies","explain the consequences of ignoring and non-compliance with ethical provisions; and","develop a sound methodology in resolving ethical conflicts and crisis."}'::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

COMMIT;
