-- Seed file for NUC Economics Curriculum (CCMAS Structure)
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Economics', 'ECO')
ON CONFLICT (nuc_code) DO NOTHING;

-- ECO101: Principles of Economics I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO101', 'Principles of Economics I', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Principles of Economics I', ARRAY[
    'Explain the basic concepts in economics including scarcity, choice and scale of preference.',
    'Explain the basic laws of demand and supply.',
    'Discuss elasticity of demand and its applications.',
    'Discuss short and long run production functions.',
    'Discuss factors of production and market structure consisting of perfect competitive market and imperfect competitive markets.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO102: Principles of Economics II
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO102', 'Principles of Economics II', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Principles of Economics II', ARRAY[
    'Discuss the basic concept of function, index numbers and dependent variables in functions, as well as national income accounting.',
    'Discuss the circular flow of income with simple two-sector model, as well as elementary issues on consumption, saving, investment, and government''s revenue, expenditure and roles of domestic money and foreign exchange.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO103: Introductory Mathematics I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO103', 'Introductory Mathematics I', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introductory Mathematics I', ARRAY[
    'Discuss the roles of mathematics in social sciences, particularly in Economics and basic mathematics concepts in relation to modern mathematics such as set theory, factors and logarithms.',
    'Apply the basic concepts in advanced level Mathematics with reference to algebra and trigonometric functions which are useful tools in investigating economic issues.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO104: Introductory Mathematics II
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO104', 'Introductory Mathematics II', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introductory Mathematics II', ARRAY[
    'Discuss the roles and importance of mathematics in economics.',
    'Translate economic statements to mathematical formulation and explain mathematical formulation in economic terms.',
    'Discuss the roles of matrices and algebra in representation of economic statements and solving simple economic concepts in the range of introductory economics.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO201: Introduction to Microeconomics I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO201', 'Introduction to Microeconomics I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Microeconomics I', ARRAY[
    'Discuss the division of economics into microeconomics and macroeconomics.',
    'Discuss the laws of individual and market demand and supply and their elasticities.',
    'Explain the basic elements in microeconomics in terms of foundation subject matter of household consumer behaviour using indifference curves, elementary production and costs with isoquant and isocost, treated in graphical form and simple mathematical capsules.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO202: Introduction to Microeconomics II
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO202', 'Introduction to Microeconomics II', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Microeconomics II', ARRAY[
    'Identify the basic concepts and the working of market mechanism within the context of theories of demand, supply, consumer behaviour, and production in the short and long run and distribution of incomes to factors of production.',
    'Discuss the structure of markets.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO203: Introduction to Macroeconomics I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO203', 'Introduction to Macroeconomics I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Macroeconomics I', ARRAY[
    'Distinguish elements of microeconomics which deal with individual households, firms and market from elements of macroeconomics that is concerned with aggregates in terms of nature and scope.',
    'Discuss economic models, general equilibrium and disequilibrium.',
    'Explain the goals of macroeconomics; Gross Domestic Product''s measurement and components.',
    'Explain the basic theories of consumption, savings and investments in economic science as well as their determinants.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO204: Introduction to Macroeconomics II
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO204', 'Introduction to Macroeconomics II', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Macroeconomics II', ARRAY[
    'Discuss issues on the aggregate economy in relation to the functions and role of government with its policies.',
    'Discuss types of inflation and its positive and negative effects.',
    'Discuss types of unemployment and the Philips curve.',
    'Discuss external sector activities, particularly the international trade and role of exchange rate in payment system.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO205: Structure of the Nigerian Economy
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO205', 'Structure of the Nigerian Economy', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Structure of the Nigerian Economy', ARRAY[
    'Discuss the Nigerian economy in pre- and post-colonial era and up to the present time, with regards to economic growth and development.',
    'Identify the number of economic sectors and broad contributions of each to the Nigerian economy over time, as well as the changes that have taken place since independence, with future prospects.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO206: Statistics for Economists
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO206', 'Statistics for Economists', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Statistics for Economists', ARRAY[
    'Collect, analyse, utilise and present numerical data to make inferences as well as reach decisions both under certainty and uncertainty in economics, business, management and socio-political conditions.',
    'Apply both descriptive and inferential statistics using representative of a population and specified probability error.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO207: Mathematics for Economists
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO207', 'Mathematics for Economists', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Mathematics for Economists', ARRAY[
    'Convert economic statements into mathematical formulation.',
    'Solve and interpret mathematical models.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO301: Intermediate Microeconomic Theory I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO301', 'Intermediate Microeconomic Theory I', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Intermediate Microeconomic Theory I', ARRAY[
    'Apply some level of mathematics to solving optimization problems in consumer behaviour and production using Lagrangian analysis.',
    'Explain the optimising behaviour of households in the consumption decision and the optimisation decision making by firms in their production processes given available factor inputs.',
    'Make inferences from theorems and appreciate the simplicity of economic models vis-a-vis the complexity of the true world situation.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO302: Intermediate Microeconomic Theory II
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO302', 'Intermediate Microeconomic Theory II', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Intermediate Microeconomic Theory II', ARRAY[
    'Identify and distinguish between and among different market structures in industrial settings.',
    'State the behaviour, conduct and performance of businesses under different market structures.',
    'Discuss how consumers, businesses and government combine available resources to produce output at optimal levels.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO303: Intermediate Macroeconomic Theory I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO303', 'Intermediate Macroeconomic Theory I', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Intermediate Macroeconomic Theory I', ARRAY[
    'Present National Income multipliers for a 4-Sector model.',
    'Explain the theories of consumption and investments under certainty and uncertainty.',
    'Explain the economic fundamentals relating to public sector economics and finance.',
    'Proffer solutions to some public sector problems, with their understanding of government policies.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO304: Intermediate Macroeconomic Theory II
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO304', 'Intermediate Macroeconomic Theory II', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Intermediate Macroeconomic Theory II', ARRAY[
    'Discuss some policy issues on international economy.',
    'Undertake some analysis of government policies with respect to economic growth, treatment of monetary and fiscal policies in closed and open economy within the framework of the New Classical and Keynesian macroeconomics, as well as international trade and balance of payment adjustments.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO305: History of Economic Thought
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO305', 'History of Economic Thought', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'History of Economic Thought', ARRAY[
    'Distinguish the roles of Classical Economists in separating Economics subject matter from Political Economy as a stand-alone discipline.',
    'Discuss the forerunners of economics disciplines like the position of Physiocrats and Mercantilists as well as the position of such schools of thought like utilitarianism, German Romanticism, the Historical School and Institutionalists as well as Keynesian, Neo-Keynesian, New Classicals and other new schools of economic thoughts.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO306: Introductory Econometrics
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO306', 'Introductory Econometrics', 3, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introductory Econometrics', ARRAY[
    'Explain the various concepts used in Econometrics.',
    'Derive simple ordinary least squares estimates and the statistical relationship of data set like the goodness-of-fit, the t-statistics and make inferences from results of simple/multiple regression and interpret estimated models.',
    'Carry out data formatting, data mining, data processing and interpretation.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO307: Project Evaluation
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO307', 'Project Evaluation', 3, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Project Evaluation', ARRAY[
    'Explain the fundamentals of cost analysis.',
    'Define financial terminology and concepts.',
    'Conceptualize, prepare and execute/assess projects for small and medium scale enterprises.',
    'Carry out cash flow analysis, risks and uncertainty assessment, cost-benefit analysis, and other standard analytical techniques for evaluating investment proposals in the natural resource industries.',
    'Judge and select the right project alternatives.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO308: Public Sector Economics
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO308', 'Public Sector Economics', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Public Sector Economics', ARRAY[
    'Discuss the roles of governments under various fiscal systems of free, mixed and centrally planned economies.',
    'Explain the Allocation, Distribution and Stabilization functions of the government given the fiscal instruments at its disposal.',
    'Explain the background theories of public sector economics as a guide to higher level economics on the role of government in economic growth and development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO401: Advanced Microeconomics I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO401', 'Advanced Microeconomics I', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Advanced Microeconomics I', ARRAY[
    'Discuss confidently issues in behavioural/optimization construct in consumer behaviour, investments, production and pricing/distribution under different market or cost structures, maximisation and minimisation framework.',
    'Explain the issues of equilibrium in single and multimarket situations, multiperiod consumption, investment theory of the firm and the role of time.',
    'Explain welfare economics issues within the context of efficiency or inefficiency in resource use under perfect and imperfect competitive situations and optimality conditions.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO402: Advanced Microeconomics II
-- NOTE: This course was missing from the raw OCR text but is inferred from the I/II pairing pattern.
-- Objectives are derived from ECO401 course content. Update when NUC source text is available.
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO402', 'Advanced Microeconomics II', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Advanced Microeconomics II', ARRAY[
    'Analyse welfare economics issues including Pareto optimality, social welfare functions and the fundamental theorems of welfare economics.',
    'Discuss general equilibrium theory, existence and uniqueness of equilibrium and stability analysis.',
    'Evaluate market failures including externalities, public goods and asymmetric information and their policy implications.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO403: Advanced Macroeconomics I
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO403', 'Advanced Macroeconomics I', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Advanced Macroeconomics I', ARRAY[
    'Present a complete open economy model multiplier including the household, business unit, the government and the open economy.',
    'Discuss in detail the theories of consumption and investments relevant to emerging and developing economies.',
    'Explain the relevance of the IS-LM framework to macroeconomic policies.',
    'Identify the appropriate macroeconomic theories and policies on consumption and investment for emerging and developing economies desirous of sustainable growth and development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO404: Advanced Macroeconomics II
-- NOTE: This course was missing from the raw OCR text but is inferred from the I/II pairing pattern.
-- Objectives are derived from ECO403 course content. Update when NUC source text is available.
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO404', 'Advanced Macroeconomics II', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Advanced Macroeconomics II', ARRAY[
    'Discuss advanced economic growth theories including endogenous growth models and their implications for developing economies.',
    'Analyse the effectiveness of monetary and fiscal policies under different exchange rate regimes using the Mundell-Fleming framework.',
    'Evaluate contemporary macroeconomic issues including business cycles, rational expectations and new Keynesian models.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO405: Economic Planning
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO405', 'Economic Planning', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Economic Planning', ARRAY[
    'Prepare short, medium- and long-term plans with feedback mechanism for an economy.',
    'Discuss planning processes and policy formation given natural endowments including human resources.',
    'Compare national planning across economic blocs and relevance to economic development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO406: Monetary Theory and Policy
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO406', 'Monetary Theory and Policy', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Monetary Theory and Policy', ARRAY[
    'Explain the theoretical foundation for monetary policy formulation.',
    'Discuss the nature and functions of money, its use as credit instrument and the policy measures that control its usage, circulation and transmission mechanism to achieve the stated objectives of economic growth, employment of resources, stable prices and balance of payment equilibrium.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

-- ECO407: Fiscal Policy and Analysis
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'ECO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'ECO407', 'Fiscal Policy and Analysis', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Fiscal Policy and Analysis', ARRAY[
    'Discuss issues on government sources of revenue, particularly various types and relevance of taxes and objects/structure of expenditure.',
    'Discuss issues on fiscal relationship between and among the federating units of the economy (Fiscal federalism).',
    'Discuss issues relating to national debts and its consequences for debt management and national development.',
    'Discuss global debt issues, debt forgiveness and economic dependence and development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

COMMIT;
