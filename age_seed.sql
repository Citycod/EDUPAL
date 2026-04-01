-- Seed file for NUC Agricultural Science Education
-- Fixed: WITH p AS (...) CTE re-declared for every course INSERT block
-- Fixed: AGE402 missing topics INSERT block added
-- Fixed: AGE201 broken grammar ('will be farmer' → 'would-be farmer')
-- Fixed: AGE302 merged objective split and typo 'ad' → 'and'
-- Fixed: AGE303 raw outline capitalisation normalised
-- Fixed: AGE304 split sentence across entries 5 and 6 merged and corrected
-- Fixed: AGE401 colon at end of objective 1 corrected
-- Fixed: AGE404 merged objective 6/7 split into two
-- Fixed: AGE406 merged objective 1 split into two
-- Fixed: vague 'understand' verbs replaced with measurable action verbs throughout
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Agricultural Science Education', 'AGE')
ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- LEVEL 100
-- ============================================================

-- AGE101: Introduction to Agriculture (2 credits, Level 100, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE101', 'Introduction to Agriculture', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Agriculture', ARRAY[
    'Explain the fundamental concepts and principles of land resources with a focus on sustainable development and production in Nigeria',
    'Demonstrate basic competencies in the management of land resources and food production',
    'Apply knowledge, skills and attitudes needed to manage a sustainable food production enterprise or qualify for entry-level employment in an agriculture-related agency',
    'Demonstrate a sound scientific background that supports transfer to a higher degree programme related to land resources and food systems',
    'Describe the historical development of agriculture',
    'Explain how to manage natural resources sustainably, identify major plant parts and their functions, and manage a home garden',
    'Describe the nutritional requirements of animals, explain how to maintain animal health and demonstrate appropriate animal management practices'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE102: Practical Farm Work 1 (2 credits, Level 100, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE102', 'Practical Farm Work 1', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Practical Farm Work 1', ARRAY[
    'Demonstrate competent agricultural skills with ethical standards in developing their respective agricultural sectors',
    'Apply scientific knowledge and skills as a prospective agricultural entrepreneur',
    'Recognise the value of environmental diversity and demonstrate awareness in preserving it',
    'Deliver relevant agricultural extension services that provide quality assistance to agriculture sectors'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE103: Farm Biometrics (2 credits, Level 100, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE103', 'Farm Biometrics', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Farm Biometrics', ARRAY[
    'Work independently in a chosen field of agricultural research specialisation',
    'Analyse complex agricultural processes at different spatial and temporal scales',
    'Search and critically evaluate scientific literature relevant to agricultural research',
    'Synthesise scientific information and research results and communicate findings effectively to both scientists and non-scientists'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE124: Farm Technology (2 credits, Level 100, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE124', 'Farm Technology', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Farm Technology', ARRAY[
    'Describe methods of field crop production and identify common plant diseases',
    'Apply animal breeding techniques and compare different feeding methods',
    'Describe the relationships and problems between humans, the environment and agriculture',
    'Explain the connection between natural resources and agricultural inputs',
    'Demonstrate basic knowledge of ICT applications in agriculture',
    'Participate in crop production activities under the supervision of an agricultural engineer',
    'Use technology appropriately in agricultural activities under the supervision of an agricultural engineer'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- ============================================================
-- LEVEL 200
-- ============================================================

-- AGE201: Principles of Farmstead Planning (2 credits, Level 200, Semester 1)
-- FIXED: 'will be farmer' → 'would-be farmer'; corrected verb agreement throughout
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE201', 'Principles of Farmstead Planning', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Principles of Farmstead Planning', ARRAY[
    'Determine the area of a parcel of farm land',
    'Explain the hydrology of agricultural land',
    'Describe how a would-be farmer can establish legal security over farm land',
    'Explain measures that protect a would-be farmer against intruders and boundary disputes',
    'Identify the various uses of land in agricultural planning',
    'Identify the principles and basis for effective farm design'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE202: Introduction to Soil Education (2 credits, Level 200, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE202', 'Introduction to Soil Education', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Soil Education', ARRAY[
    'Explain how the environment influences plant growth and crop yields and identify ways to modify the environment to improve them',
    'Identify soil types and describe ways to improve soil fertility, reduce erosion and improve water quality and availability',
    'Explain how soils are formed and describe ways to modify soil structure and drainage to reduce erosion and improve water availability to plants',
    'Determine soil fertility levels, identify plant nutrient deficiencies and describe means of improving soil fertility for plant growth'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE203: Forest Management Education (2 credits, Level 200, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE203', 'Forest Management Education', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Forest Management Education', ARRAY[
    'Demonstrate an understanding of the complex interactions between humans and forest ecosystems in a global context',
    'Apply forest mensuration skills and techniques for ecological measurements',
    'Use quantitative and analytical skills for data collection, analysis and interpretation in forest ecology and management',
    'Independently locate and apply relevant forest ecology and management literature to assigned problems or research and management issues',
    'Interpret forest conservation, ecology and resource management conflicts and solutions from multiple perspectives including private landowners, industry and public lands'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE204: Anatomy and Physiology of Farm Animals (2 credits, Level 200, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE204', 'Anatomy and Physiology of Farm Animals', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Anatomy and Physiology of Farm Animals', ARRAY[
    'Apply concepts of breeding, physiology, nutrition, herd health, economics and management to practical and profitable animal production programmes',
    'Explain the role of nutrition in animal production',
    'Explain the mechanisms and role of reproductive physiology in livestock production',
    'Develop feeding systems for farm animal production and companion animals',
    'Apply scientific principles to a variety of animal production systems through critical thinking and problem solving',
    'Explain how modern animal production technologies and management practices impact production facilities, communities and the wider world'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE205: Introduction to Agricultural Economics (2 credits, Level 200, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE205', 'Introduction to Agricultural Economics', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Agricultural Economics', ARRAY[
    'Describe fundamental macro- and micro-economic principles',
    'Apply economic principles to agricultural production, marketing and consumption',
    'Describe the different fields of agricultural economics including food industry, demand theory, supply theory and competitive environments'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE206: Teaching Vocational Agriculture in Schools (2 credits, Level 200, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE206', 'Teaching Vocational Agriculture in Schools', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Teaching Vocational Agriculture in Schools', ARRAY[
    'Implement the philosophy and apply instructional methods used in agricultural education settings',
    'Plan and organise units of instruction for topics in agriculture',
    'Develop and use teaching plans on agriculture topics for both regular and special needs students',
    'Effectively manage a diverse population of students in an agricultural education setting',
    'Prepare effective assessment instruments to evaluate and grade students in agricultural education',
    'Demonstrate the ability to utilise a variety of teaching techniques and strategies in the classroom to positively influence student learning',
    'Apply skills in individualised assessment, instructional planning and data-based decision-making through completion of all checkpoints prior to student teaching'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE207: Techniques of Vegetable Crop Production (2 credits, Level 200, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE207', 'Techniques of Vegetable Crop Production', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Techniques of Vegetable Crop Production', ARRAY[
    'Identify plant vegetative and reproductive structures',
    'Explain basic principles, processes and functions of plant growth and reproduction including photosynthesis, respiration, transpiration, vegetative and reproductive growth, fertilisation and fruit formation',
    'Identify factors affecting crop production and evaluate sustainable practices for producing food, feed and fibre crops',
    'Describe how to propagate plants and sustainably grow, manage and harvest a variety of crops across diverse environmental, marketing and financial conditions'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE208: Farm Tools and Equipment (2 credits, Level 200, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE208', 'Farm Tools and Equipment', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Farm Tools and Equipment', ARRAY[
    'Explain why agricultural machinery and equipment are important to modern farming',
    'Identify different areas of agriculture where machinery and equipment are used',
    'Describe the different types of agricultural machinery and equipment used in crop production'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- ============================================================
-- LEVEL 300
-- ============================================================

-- AGE301: Horticulture Education (2 credits, Level 300, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE301', 'Horticulture Education', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Horticulture Education', ARRAY[
    'Identify plant vegetative and reproductive structures',
    'Explain the basic principles, processes and functions of plant growth and reproduction including photosynthesis, respiration, transpiration, vegetative and reproductive growth, fertilisation and fruit formation',
    'Explain how the environment influences plant growth and crop yields and identify ways to modify the environment to improve them',
    'Describe factors affecting sustainable production of food, feed and fibre crops and evaluate strategies for implementing and assessing such practices',
    'Identify commonly used herbaceous and woody ornamental plants and describe how to propagate, establish and care for them',
    'Explain the nutritive value of fruits, nuts and vegetables in the human diet'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE302: Ruminant Animal Production (2 credits, Level 300, Semester 2)
-- FIXED: split merged objective 5 into two; corrected typo 'ad' → 'and'
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE302', 'Ruminant Animal Production', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Ruminant Animal Production', ARRAY[
    'Quantify the economic impact of the beef, dairy, sheep and goat industries',
    'Describe an overview of the domestic and international dairy, beef, sheep and goat industries',
    'Compare and contrast purebred versus commercial ruminant livestock segments',
    'List the primary facilities and equipment required for ruminant livestock production',
    'Compare and contrast the performance and selection criteria of ruminant breeds',
    'Compare and contrast the genetic and selection tools available to ruminant livestock breeders',
    'Discuss selection strategies for improved productivity in ruminant livestock',
    'Analyse the various types of ruminant livestock production systems',
    'Compare and contrast profitable and unprofitable ruminant livestock production systems'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE303: Agricultural Marketing (2 credits, Level 300, Semester 1)
-- FIXED: normalised inconsistent mid-sentence capitalisation; rewrote as proper objectives
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE303', 'Agricultural Marketing', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Agricultural Marketing', ARRAY[
    'Describe the agricultural marketing system and its key components',
    'Explain the role of price discovery in the economic system',
    'Describe value-added processing in agricultural marketing',
    'Analyse competition in the agricultural marketplace',
    'Explain consumer demand issues affecting agricultural products',
    'Describe food marketing management principles and practices',
    'Explain the concept of marketing margins in agricultural trade',
    'Identify and describe the key marketing functions in the agricultural sector'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE304: Technology of Breeding Crop (2 credits, Level 300, Semester 2)
-- FIXED: split merged entries 5/6 into two separate objectives; corrected trailing colon and 'and' fragment
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE304', 'Technology of Breeding Crop', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Technology of Breeding Crop', ARRAY[
    'Identify the characteristics of self- and cross-pollinated plants',
    'Identify sources of genetic variation relevant to conducting a plant breeding programme',
    'Determine breeding methodology appropriate for plants with different mating systems',
    'Conduct basic statistical analyses related to plant breeding',
    'Analyse journal articles related to cultivar development',
    'Conduct and analyse a selection experiment',
    'Communicate background information and original ideas related to breeding a specific crop'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE305: Farm Business Management Education (2 credits, Level 300, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE305', 'Farm Business Management Education', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Farm Business Management Education', ARRAY[
    'Examine the relationships between inputs and outputs in their agricultural field to make effective and profitable management decisions',
    'Evaluate the impact of trade policy, common markets, trading blocs, market instability, commodity issues, trade agreements and environmental regulations on agricultural imports and exports',
    'Explain how all aspects of agriculture combine and are used by scientists, marketers and producers',
    'Explain how employer characteristics and decision-making at various levels enhances the success of an agricultural enterprise'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE306: Introduction to Animal Breeding (2 credits, Level 300, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE306', 'Introduction to Animal Breeding', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Animal Breeding', ARRAY[
    'Demonstrate applied competence in all areas of animal breeding, genetics and selection',
    'Apply problem-solving skills based on quantitative and analytical reasoning to animal breeding challenges',
    'Communicate effectively in written and oral forms on animal breeding topics',
    'Demonstrate leadership and interpersonal skills needed for career placement and advancement in animal breeding'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE307: Field and Tree Crop Production (2 credits, Level 300, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE307', 'Field and Tree Crop Production', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Field and Tree Crop Production', ARRAY[
    'Explain sustainable practices for the production of food, feed and fibre crops and evaluate how to implement them',
    'Apply knowledge of plant growth and crop science to solve problems related to crop production and natural resource management',
    'Explain how crop science relates to the economy and environment both currently and in the future',
    'Critically evaluate public information related to crop science as either scientifically-based or opinion-based',
    'Write in a style appropriate for technical or informative publications for various audiences related to crop science',
    'Demonstrate supervised, hands-on work experience related to field and tree crop production'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE308: Fish Farming and Management (2 credits, Level 300, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE308', 'Fish Farming and Management', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Fish Farming and Management', ARRAY[
    'Explain the foundational technologies of fisheries and aquaculture',
    'Describe the principles, importance, purpose and application of fisheries and aquaculture',
    'Explain the conditions for the development of aquatic organisms, habitat requirements and how yield patterns change in response to environmental and anthropogenic influences',
    'Describe fisheries and aquaculture schemes used in breeding, rearing and feeding, including design and construction principles consistent with relevant legislation',
    'Describe business management features, strategies and marketing approaches applicable to fisheries and aquaculture enterprise development',
    'Apply research methods, scientific literature, information technologies and statistical tools to conduct, summarise and present aquaculture research',
    'Use modern laboratory equipment and computer programmes for the design and management of fisheries and aquaculture farms',
    'Describe fisheries and aquaculture technological processes, identify problems, analyse environmental effects and implement preventive safety measures',
    'Apply methods and techniques used in fisheries and aquaculture design, construction, management and quality assurance',
    'Solve technological and management challenges in fisheries and aquaculture farms and organise activities to ensure entrepreneurship and competitiveness',
    'Critically and logically evaluate evidence, form reasoned opinions and present scientific information effectively to diverse audiences'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE309: Techniques of Non-Ruminant Animal Production (2 credits, Level 300, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE309', 'Techniques of Non-Ruminant Animal Production', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Techniques of Non-Ruminant Animal Production', ARRAY[
    'Identify and compare methods of rearing chickens',
    'Demonstrate a complete package of practical skills for quality broiler production',
    'Explain how to produce table eggs and hatchable eggs',
    'Describe the skills involved in caring for and managing chicks'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE310: Introduction to Farm Machinery and Mechanization (2 credits, Level 300, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE310', 'Introduction to Farm Machinery and Mechanization', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introduction to Farm Machinery and Mechanization', ARRAY[
    'Demonstrate sound knowledge of agricultural power and machinery and its relevance to agricultural engineering',
    'Identify suitable materials and equipment for local agricultural problems affecting tropical farming systems',
    'Discuss the various power sources available for agricultural work',
    'Select, use, repair and maintain appropriate agricultural machinery',
    'Apply knowledge relevant to operating an Agro Service Centre for farm machinery'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- ============================================================
-- LEVEL 400
-- ============================================================

-- AGE401: Water and Land Conservation Education (2 credits, Level 400, Semester 1)
-- FIXED: corrected trailing colon on objective 1
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE401', 'Water and Land Conservation Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Water and Land Conservation Education', ARRAY[
    'Identify soil types and explain how they are formed',
    'Develop strategies to modify soil structure and drainage in order to reduce erosion and improve water quality',
    'Determine soil fertility levels using appropriate assessment methods',
    'Demonstrate ways of improving soil fertility to support sustainable crop production',
    'Develop strategies for adding nutrients to support plant growth'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE402: Husbandry of Ruminant Animals (2 credits, Level 400, Semester 2)
-- FIXED: added missing topics INSERT block
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE402', 'Husbandry of Ruminant Animals', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Husbandry of Ruminant Animals', ARRAY[
    'Describe the systems and principles of ruminant animal husbandry',
    'Explain the nutritional requirements of ruminant animals and design appropriate feeding programmes',
    'Describe breeding and reproductive management practices for ruminant livestock',
    'Apply health management strategies to prevent and control diseases in ruminant animals',
    'Demonstrate housing and welfare standards appropriate for ruminant animal production',
    'Evaluate the economics and profitability of ruminant husbandry enterprises'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE403: Livestock Health Education (2 credits, Level 400, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE403', 'Livestock Health Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Livestock Health Education', ARRAY[
    'Discuss health protection measures and strategies to safeguard the wellbeing of livestock animals',
    'Explain veterinary care practices including preventive medicine',
    'Demonstrate reproduction management, disease surveillance and eradication strategies',
    'Explain monitoring programmes for animal diseases',
    'Identify and explain methods for the treatment and disposal of animal waste',
    'Apply hands-on problem-solving skills relevant to career development in animal health'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE404: Entrepreneurship in Agriculture (2 credits, Level 400, Semester 2)
-- FIXED: split merged objectives 6/7 into two separate entries
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE404', 'Entrepreneurship in Agriculture', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Entrepreneurship in Agriculture', ARRAY[
    'Develop a typology of agricultural entrepreneurial firms',
    'Develop a framework for an entrepreneurial venture in agriculture',
    'Conduct a SWOT analysis for an agricultural entrepreneur',
    'Describe the processes of generation, incubation and commercialisation of agricultural ideas and innovations',
    'Explain the role of MSMEs in agricultural entrepreneurship development',
    'Identify the steps involved in becoming a successful agricultural entrepreneur',
    'Develop effective communication skills applicable to agricultural entrepreneurship contexts',
    'Describe and compare models of entrepreneurship relevant to the agricultural sector'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE405: Livestock Nutrition Education (2 credits, Level 400, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE405', 'Livestock Nutrition Education', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Livestock Nutrition Education', ARRAY[
    'Demonstrate the role of nutrition in livestock animal production',
    'Develop feeding systems for farm animal production and companion animals',
    'Apply scientific principles to a variety of animal production systems through critical thinking and problem solving',
    'Explain how modern animal production technologies and management practices impact production facilities, communities and the wider world'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE406: Poultry Production Education (2 credits, Level 400, Semester 2)
-- FIXED: split merged objective 1 into two separate entries
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE406', 'Poultry Production Education', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Poultry Production Education', ARRAY[
    'Manage responsibly the key aspects of a poultry production system',
    'Apply basic knowledge of genetic selection of commercial hybrid poultry breeds',
    'Apply the techniques of artificial incubation of eggs',
    'Explain the management of the rearing environment for poultry',
    'Describe the production and management of laying hens and broilers for chicken meat',
    'Discuss the different feeding phases of poultry birds across the production cycle',
    'Discuss issues related to poultry welfare and animal protection legislation'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE407: Forestry and Wild Life Conservation (2 credits, Level 400, Semester 1)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE407', 'Forestry and Wild Life Conservation', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Forestry and Wild Life Conservation', ARRAY[
    'Identify native and non-native herbaceous and woody plant species',
    'Apply general principles of ecology to terrestrial and aquatic plant and animal conservation and management',
    'Identify species, characteristics, habitat requirements and life cycles of birds, fish and mammalian wildlife',
    'Solve problems related to wildlife conservation and management',
    'Explain factors affecting sustainable production of food, feed and fibre crops and describe how to implement sustainable practices',
    'Apply basic forest management principles and evaluate forest stands for health, wildlife habitat and timber use',
    'Explain how the environment influences plant growth and crop yields and identify ways to modify growing conditions',
    'Describe how to propagate, plant, sustainably grow, manage and harvest grain or forage crops across diverse conditions',
    'Explain how wildlife conservation and management relates to the economy and environment both currently and in the future',
    'Critically evaluate public information related to wildlife conservation and management as scientifically-based or opinion-based'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- AGE408: Animal Products Handling, Processing and Storage (2 credits, Level 400, Semester 2)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'AGE'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'AGE408', 'Animal Products Handling, Processing and Storage', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Animal Products Handling, Processing and Storage', ARRAY[
    'Explain how the animal processing industry has evolved over time',
    'Identify career opportunities related to animal product processing',
    'Explain the economic importance of animal processing to the agricultural sector',
    'Describe how processing affects the value of animal products',
    'Apply principles of comparative anatomy and physiology within various animal production systems',
    'Comply with government regulations and safety standards for animal production and processing facilities',
    'Work effectively with industry organisations, groups and regulatory agencies affecting food products and the processing industry',
    'Implement procedures to ensure that animal products are safe for human consumption',
    'Apply safety and sanitation procedures in the handling, processing and storage of animal food products',
    'Demonstrate worker safety procedures when operating food product processing equipment and working in processing facilities'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

COMMIT;