-- Seed file for NUC Biology Curriculum
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Biology', 'BIO')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO101', 'General Biology I', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Biology I', ARRAY[
    'explain cells structure and organizations',
    'summarize functions of cellular organelles',
    'characterize living organisms and state their general reproductio',
    'escribe the interrelationship that exists between organisms; 5. discuss the concept',
    'enumerate habitat types and their characteristics.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO102', 'General Biology II', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Biology II', ARRAY[
    'state the unique characteristics of plant and animal kingdoms',
    'escribe ecological adaptations in the plant and animal kingdoms',
    'give a summary of the physiology of plants and animals',
    'explain nutrition, respiration, excretion and reproduction in plants and animals',
    'escribe growth and development in plants and animals.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO107', 'General Biology Practical I', 1, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Biology Practical I', ARRAY[
    'outline common laboratory hazards',
    'provide precautions on laboratory hazards',
    'state the functions of the different parts of microscope',
    'use the microscope and describe its maintenance',
    'raw biological diagrams and illustrations',
    'pply scaling and proportion to biological diagrams.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO108', 'General Biology Practical II', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Biology Practical II', ARRAY[
    'escribe the anatomy of flowering plants',
    'ifferentiate types of fruit and seeds',
    'state ways of handling and caring for biological wares',
    'escribe the basic histology of animal tissues',
    'identify various groups in the animal kingdom.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('SED Program', 'SED')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'SED'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'SED202', 'General Biology Methods I', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Biology Methods I', ARRAY[
    'lyse and critique the biology core curriculum',
    'evelop specific lesson notes from the biology core curriculum',
    'select appropriate objectives and learning experiences for different topics of the biology',
    'ssess different concepts through paper and pencil tests, observation and portfolios',
    'identify difficult concepts in biology with justificatio',
    'use appropriate methods in the teaching of difficult concepts in biology',
    'set up and manage zoom and google classroom platforms',
    'identify misconceptions, alternative conceptions and indigenous biology knowledge'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO201', 'Genetics I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Genetics I', ARRAY[
    'istinguish between heritable and non-heritable characteristics',
    'explain the likelihood of genetic events (Probability) and how well those events (results)',
    'iscuss polygenic variations',
    'escribe concepts in population genetics.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO202', 'Introductory Ecology', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introductory Ecology', ARRAY[
    'explain various concepts and terminologies associated with the ecosystem',
    'list and explain features of various habitat types',
    'explain natural destruction/disaster, community and natural cycles',
    'explain and describe factors responsible for changes in population.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO203', 'General Physiology', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Physiology', ARRAY[
    'escribe the chemistry of organic compounds and their biological importance',
    'state the general characteristics of enzymes',
    'escribe nutrition, digestion and absorption in plants and animals',
    'iscuss the cell membrane structure and list its functions',
    'summarize osmoregulation, excretion and transport in animals',
    'enumerate growth hormones in plants and their functions',
    'explain the homeostasis, their coordination and functions in animals 8.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO204', 'Biological Techniques', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Biological Techniques', ARRAY[
    'list the different parts of a light microscope and state their functions',
    'state and explain the stages involved in preparation of slides',
    'escribe the basic principles of spectrophotometry, colorimetry, photometry, polarimetry,',
    'escribe the basic collection and preservation processes of plant and animal materials',
    'explain the need for experimental design, basis of report writing and presentations.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO205', 'Introductory Developmental / Cell Biology', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Introductory Developmental / Cell Biology', ARRAY[
    'raw the detail structure of plant and animal cells and state the functions of the',
    'summarize and state the differences and similarities between mitosis and meiosis',
    'escribe cell differentiation and its growth',
    'explain the molecular basis of cell structure and development.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO206', 'Hydrobiology', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Hydrobiology', ARRAY[
    'iscuss the physical properties of water',
    'explain the thermal stratification of lakes',
    'summarize the importance and interplay of oxygen, carbon-dioxide and pH in water,',
    'escribe fresh water communities',
    'list factors influencing the distribution and productivity of aquatic macrophytes,',
    'iscuss the importance and adaptive features of Estuarine communities',
    'explain colonisation and succession in aquatic ecosystem.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('BCH Program', 'BCH')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BCH'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BCH201', 'General Biochemistry I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Biochemistry I', ARRAY[
    'identify the chemical and molecular chemical and molecular components of the cell as the',
    'state and decipher the different nomenclature of the chemical and molecular components',
    'iscuss the interrelationship of the components of the cell with each other 4 isolate'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('MCB Program', 'MCB')
ON CONFLICT (nuc_code) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'MCB'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'MCB221', 'General Microbiology', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Microbiology', ARRAY[
    'explain basic concepts and scope of microbiology',
    'classify organisms into prokaryotes and eukaryotes',
    'culture and isolate micro-organisms',
    'identify selected microbial groups and their economic importance',
    'iscuss the layout of a microbiology laboratory',
    'enumerate the different equipment and reagents in a microbiology laboratory',
    'explain the theory behind basic protocols in a microbiology laboratory.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO301', 'Genetics II', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Genetics II', ARRAY[
    'summarize various aspects of human genetics and pedigree analysis',
    'iscuss various aspects of gene interactions, biochemical mutants',
    'escribe the types and functions of nucleic acids and nucleotides',
    'explain DNA replication and mutatio',
    'iscuss proteins and regulation of gene expressio',
    'escribe the importance and processes involved in DNA technology and how it influences'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO302', 'Population Biology and Evolution', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Population Biology and Evolution', ARRAY[
    'explain the concept of natural selectio',
    'summarize evolution of some organisms',
    'iscuss how organisms adapt to their environment',
    'pply mathematical formulae and models to genetic variations and predictions i',
    'escribe factors responsible for population changes.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO303', 'Biogeography and Soil Biology', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Biogeography and Soil Biology', ARRAY[
    'explain the theories related to Gondwanaland, continental drift and land bridges',
    'outline the world key flora and fauna groups and reasons for their distributio',
    'explain succession, colonisation and dispersal of plants and animals',
    'escribe the concept of endemicity, refugia and Island biogeography',
    'iscuss physical and chemical nature of soil',
    'summarise the cycling of minerals and nutrients',
    'explain soil and animal soil water relationship',
    'outline the causes of soil erosion and alleviation methods.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO304', 'Nigerian Fauna and Flora', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigerian Fauna and Flora', ARRAY[
    'identify Nigerian plants and animals, and associate them with habitats',
    'confirm identified plants and animals with Herbarium and Museum specimens respectively',
    'escribe the life histories strategies of selected plants and animals',
    'iscuss the prospects, problems and problem alleviation strategies of protected areas i'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO306', 'Systematic Biology', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Systematic Biology', ARRAY[
    'escribe the Pre-Linnaean, Linnaean and Darwinian taxonomic concepts of species',
    'explain the binomial system of nomenclature',
    'classify organisms based on the binomial system of nomenclature',
    'explain the concept of keys and keying and their applications.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO307', 'Field Course I', 1, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Field Course I', ARRAY[
    'conduct basic field sampling techniques in terrestrial, aquatic and aerial environment',
    'collect plant and animal materials for identification, classification and preservation in the',
    'explain the importance of the institutes and industries visited to Biology.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO402', 'Principles of Plants and Animal Breeding', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Principles of Plants and Animal Breeding', ARRAY[
    'explain principles of plant and animal breeding',
    'enumerate the importance of heterosis, sterility and inbreeding consequences',
    'state management strategies for pests and diseases',
    'possess ability to conduct breeding exercises in plants and animals',
    'evelop appropriate management practices required for plant and animal breeding',
    'keep adequate farm records.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO403', 'Wildlife Conservation and Management', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Wildlife Conservation and Management', ARRAY[
    'state the principles/glossaries of wildlife management',
    'outline wildlife diseases',
    'identify problems and prospects in wildlife resources',
    'outline conservation policies related to wildlife',
    'explain the impact of climate change on wildlife resources.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO404', 'Nigerian Plants and Animals in Prophylactics and Therapeutics', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Nigerian Plants and Animals in Prophylactics and Therapeutics', ARRAY[
    'explain the historical development of plants and animals in prophylatics and therapeutics',
    'efine some terminologies used in pharmacognosy',
    'ppreciate the classification and uses of plants and animals in prophylatics',
    'understand crude traditional methods of preparation and uses',
    'identify and describe modern methods of preparation and uses of plants and animals as',
    'ccount for the evaluation and adulteration of crude drugs, and the need for quality'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO407', 'Field Course II', 1, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Field Course II', ARRAY[
    'cquire knowledge on various field aspects of biology',
    'emonstrate ability to plan and conduct a series of simple field experiments',
    'evelop the ability, to record, summarize, classify, preserve specimens collected from',
    'evelop thin working and individual skills, learn to manage time effectively 5.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO408', 'Applied Biotechnology', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Applied Biotechnology', ARRAY[
    'conduct DNA extraction from different tissues',
    'quantify DNA and proteins',
    'outline the types of chromatography',
    'escribe DNA amplificatio',
    'pply the knowledge of biotechnology to protein engineering, medicine, foo',
    'incorporate the knowledge of biotechnology in the treatment of wastes.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO410', 'Bio-Entrepreneurial Options', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Bio-Entrepreneurial Options', ARRAY[
    'cquire an understanding of the background, appropriate theory and methods relating',
    'ppraise and discuss how knowledge acquired can be used to become an independent',
    'iscuss project cycle, financial sourcing and management',
    'esign and plan how any of the products can be produced on a large scale for national'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO413', 'Bioinformatics', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Bioinformatics', ARRAY[
    'explain the history of bioinformatics',
    'identify basic instruments required in bioinformatics; 3. Outline',
    'escribe genomics and proteomics.'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'BIO'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'BIO414', 'Molecular Biology', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Molecular Biology', ARRAY[
    'escribe the structure and roles of DNA and RNA',
    'iscuss Gene regulation, DNA replication, genetic transformation and recombinant DNA',
    'summarize the roles of Nucleic acids and proteins in the cell division, growth',
    'list the importance and application of Molecular Biology in food production, medicine'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO NOTHING;

COMMIT;
