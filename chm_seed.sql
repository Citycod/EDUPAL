-- Seed file for Chemistry Program (Multiple Schools - Dual Listing)
-- Generated with active-verb normalisation and CTE safety
BEGIN;

INSERT INTO catalog.national_programs (name, nuc_code)
VALUES ('Chemistry', 'CHM')
ON CONFLICT (nuc_code) DO NOTHING;

-- CHM 101: General Chemistry I (3 units, Level 100, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM101', 'General Chemistry I', 3, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Chemistry I', ARRAY[
    'Define atom, molecules, and chemical reactions',
    'Discuss the modern electronic theory of atoms',
    'Write electronic configurations of elements on the periodic table',
    'Justify the trends of atomic radii, ionization energies, and electronegativity of elements based on their position in the periodic table',
    'Identify and balance oxidation-reduction equations and solve redox titration problems',
    'Illustrate shapes of simple molecules and hybridized orbitals',
    'Identify the characteristics of acids, bases, and salts, and solve problems based on their quantitative relationships',
    'Apply the principles of equilibrium to aqueous systems using Le Chatelier''s principle to predict the effect of concentration, pressure, and temperature changes on equilibrium mixtures',
    'Analyse and perform calculations with the thermodynamic functions: enthalpy, entropy, and free energy',
    'Determine rates of reactions and its dependence on concentration, time, and temperature'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 102: General Chemistry II (3 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM102', 'General Chemistry II', 3, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Chemistry II', ARRAY[
    'State the importance and development of organic chemistry',
    'Define fullerenes and their applications',
    'Discuss electronic theory',
    'Determine the qualitative and quantitative structures in organic chemistry',
    'Describe rules guiding nomenclature and functional group classes of organic compounds',
    'Determine rate of reaction to predict mechanisms of reaction',
    'Identify classes of organic functional groups with brief descriptions of their chemistry',
    'Discuss comparative chemistry of Group IA, Group IIA, and Group IVA elements',
    'Describe basic properties of transition metals'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 107: General Chemistry Practical I (1 unit, Level 100, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM107', 'General Chemistry Practical I', 1, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Chemistry Practical I', ARRAY[
    'Describe the general laboratory rules and safety procedures',
    'Collect scientific data and correctly carry out chemical experiments',
    'Identify the basic glassware and equipment in the laboratory',
    'Tell the differences between primary and secondary standards',
    'Perform redox titration',
    'Record observations and measurements in laboratory notebooks',
    'Analyse the data to arrive at scientific conclusions'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 108: General Chemistry Practical II (1 unit, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM108', 'General Chemistry Practical II', 1, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Chemistry Practical II', ARRAY[
    'Identify the general laboratory rules and safety procedures',
    'Collect scientific data and correctly carry out chemical experiments',
    'Identify the basic glassware and equipment in the laboratory',
    'Identify and carry out preliminary tests which include ignition, boiling point, melting point, tests on known and unknown organic compounds',
    'Execute solubility tests on known and unknown organic compounds',
    'Execute elemental tests on known and unknown compounds',
    'Conduct functional group and confirmatory tests on known and unknown compounds which could be acidic, basic, or neutral organic compounds'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 207: General Chemistry Practical III (1 unit, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM207', 'General Chemistry Practical III', 1, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Chemistry Practical III', ARRAY[
    'Describe the measurement of pH',
    'Determine the relative molar mass from colligative properties',
    'Demonstrate the partition coefficient of two immiscible solvents',
    'Demonstrate temperature measurements and heat of dissolution and heat of neutralization',
    'Determine the critical solution temperature of water-phenol systems',
    'Measure the molar volume of a gas and universal gas constant'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 208: General Chemistry Practical IV (1 unit, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM208', 'General Chemistry Practical IV', 1, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Chemistry Practical IV', ARRAY[
    'Identify general laboratory rules',
    'Describe the processes involved in the preparation of simple organic compounds (esters, aldehydes, and ketones)',
    'Describe the analysis of vinegar',
    'Demonstrate a simple experiment on thin layer chromatography',
    'Perform an experiment on the dehydration of alcohol',
    'Conduct experiments on qualitative analysis of common functional groups'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 210: Physical Chemistry I (2 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM210', 'Physical Chemistry I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Physical Chemistry I', ARRAY[
    'State the kinetic theory of gases and solve problems related to ideal and real gases',
    'Derive the formula for molecular velocity of gases and use the derived formula to solve problems',
    'Describe and explain the fundamental concepts of physical chemistry including those of statistical mechanics, chemical kinetics, quantum mechanics, and spectroscopy',
    'Apply simple models to predict properties of chemical systems',
    'Define and state types of solutions and explain vapour pressure lowering, boiling point elevation, freezing point depression, and osmotic pressure measurement',
    'Apply numerical or computational methods to calculate physical properties of chemical systems',
    'Design and plan an investigation by selecting and applying appropriate practical, theoretical, and/or computational techniques',
    'State Ohm''s law and describe electrolytic conduction and electrical conductance calculations'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 211: Organic Chemistry I (2 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM211', 'Organic Chemistry I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Organic Chemistry I', ARRAY[
    'Describe and solve problems in chemistry of aromatic compounds',
    'Describe the structures of simple sugars, starch, and cellulose, peptides, and proteins',
    'Describe and solve problems in chemistry of bifunctional compounds',
    'Explain the mechanisms of substitution, elimination, addition, and rearrangement',
    'Describe stereochemistry and its application',
    'Describe conditions and pathways of Grignard reaction, Aldol and related reactions',
    'Describe simple alicyclic carbon compounds and their synthesis'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 212: Inorganic Chemistry I (2 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM212', 'Inorganic Chemistry I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Inorganic Chemistry I', ARRAY[
    'List the first-row transition elements and explain their characteristics and properties',
    'Explain crystal field theory and draw diagrams to illustrate coordination compounds',
    'State the advantages of crystal field theory over other bonding theories',
    'Discuss the comparative chemistry of Ga, In, Tl, Ge, Sn, Pb, As, Sb, Bi, Se, Te, Po',
    'Define organometallic chemistry and provide relevant examples',
    'Classify organometallic compounds with examples',
    'List the roles of metals in biochemical systems',
    'Discuss the concepts of hard and soft acids and bases',
    'Explain oxidation and reduction reactions with appropriate illustrations'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 213: Analytical Chemistry I (2 units, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM213', 'Analytical Chemistry I', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Analytical Chemistry I', ARRAY[
    'Explain analytical processes and the chemist as a problem solver',
    'Describe and differentiate forms of error',
    'Explain error implications on laboratory analysis',
    'State different statistical tools used in treatment of data',
    'Solve practical problems using statistical tools',
    'Define sampling and give reasons for sampling in field work',
    'State and describe different sampling techniques',
    'State different forms of sample collection and processing',
    'Describe volumetric method of analysis and solve practical problems',
    'Describe gravimetric method of analysis and solve practical problems'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 214: Structure and Bonding (2 units, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM214', 'Structure and Bonding', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Structure and Bonding', ARRAY[
    'Explain the idea of quantum states, orbitals, shapes, and energy',
    'Explain simple valency theory, electron repulsion theory, and atomic spectra',
    'Explain symmetry, molecular geometry, structure, and molecular orbital theory of bonding',
    'Sketch illustrations with specific examples for molecular geometry and bonding',
    'Express how molecular orbital theory explains magnetic properties in main group compounds',
    'Explain the methods used in the determination of molecular shapes, bond lengths, and angles',
    'Explain the structure and chemistry of some representatives of main group elements'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 301: Physical Chemistry II (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM301', 'Physical Chemistry II', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Physical Chemistry II', ARRAY[
    'Explain Gibbs energy and its relationship to spontaneity of processes',
    'Determine Gibbs free energy using standard free energies of formation',
    'Describe what information the first law of thermodynamics provides about directionality of changes',
    'Describe spontaneous and non-spontaneous processes',
    'Describe what entropy is and why positional entropy is an oversimplification',
    'Predict the sign of entropy change for physical and chemical changes',
    'Explain why entropy of gases is greater than liquids and solids',
    'State the Third Law of Thermodynamics and describe its significance',
    'Calculate the standard entropy change for physical or chemical processes',
    'State the Second Law of Thermodynamics and describe its significance',
    'Use the Second Law to predict spontaneity of physical and chemical changes',
    'Quantify entropy changes using statistical approach and heat changes',
    'Describe the obstructions to the Second Law that make life possible',
    'Describe the meaning of positive, negative, and zero values for ΔSuniv',
    'Describe the change in free energy in terms of enthalpy and entropy changes',
    'Describe the meaning of positive, negative, and zero values for ΔG',
    'Describe the relationship between free energy change and maximum work',
    'Explain why physical or chemical change is spontaneous only if ΔG is negative',
    'Calculate standard free energy changes using ΔGo = ΔHo – TΔSo',
    'Predict whether a physical or chemical change is spontaneous',
    'Describe why a system is at equilibrium if ΔG is equal to zero',
    'Use the equation ΔG = ΔGo + RTlnQ to calculate free energy changes',
    'Use the equation ΔGo = -RTlnK to calculate equilibrium constants',
    'Explain why chemical reactions occur and the driving forces responsible',
    'Describe and apply principles of probability to predict molecular behaviour',
    'Describe the Boltzmann distribution law and molecular partition functions',
    'Predict macroscopic properties from atomic and molecular structures',
    'Describe the molecular interpretation of macroscopic properties',
    'Predict gas-phase chemical reaction equilibria from atomic structures',
    'Describe phase equilibria based on chemical potential concepts'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 302: Inorganic Chemistry II (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM302', 'Inorganic Chemistry II', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Inorganic Chemistry II', ARRAY[
    'Analyse inorganic chemistry information',
    'Demonstrate and apply knowledge of inorganic chemistry',
    'Explain the electronic structure and general properties of Group IA and Group IIA elements',
    'Compare Group IA and Group IIA in terms of electronic structure and properties',
    'Explain the chemistry of boron, carbon, silicon, nitrogen, phosphorus, oxygen, and sulphur',
    'Explain halogen chemistry',
    'Explain the periodic properties of transition metals',
    'Use crystal field theory to explain complexes of first-row transition metals',
    'Synthesize and characterise a metal coordination compound',
    'Describe ligand and crystal field theories',
    'Draw diagrams showing crystal and ligand field theories',
    'List advantages and limitations of bonding theories',
    'Define radioactive decay processes and nuclear radiation',
    'Enumerate principles for utilizing radioactivity in chemistry',
    'Discuss principles of radiation hygiene and radiation-matter interaction',
    'Enumerate current methods in radiochemistry',
    'Define and describe all three types of radioactivity',
    'Explain the roles of metals in living systems'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 303: Organic Chemistry II (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM303', 'Organic Chemistry II', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Organic Chemistry II', ARRAY[
    'Recognize and distinguish between aromatic and alicyclic compounds by their structures',
    'Identify the properties of aromatic and alicyclic compounds',
    'Recognize and write the mechanism of electrophilic aromatic and alicyclic substitution',
    'Outline completed electrophilic aromatic substitution reactions',
    'Explain the chemistry of heterocyclic compounds',
    'Describe reactive intermediates: carbocations, carbanions, carbenes, nitrenes',
    'Express rearrangement reactions such as Beckmann and Baeyer-Villiger',
    'Illustrate various reaction mechanisms and types',
    'Organize forensic analysis of biological and pharmaceutical samples'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 304: Atomic and Molecular Structure and Symmetry (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM304', 'Atomic and Molecular Structure and Symmetry', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Atomic and Molecular Structure and Symmetry', ARRAY[
    'Illustrate the Schrödinger wave equation for the hydrogen molecule and ion',
    'Define the terms in the time-independent Schrödinger wave equation',
    'Express the equation for the 3D Schrödinger wave equation',
    'Define Pauli Exclusion Principle and Hund''s rule',
    'Illustrate electron configurations for atoms in subshell or orbital box notations',
    'Illustrate electron configurations of ions',
    'Explain how molecular orbitals are formed',
    'Draw molecular orbital diagrams for diatomic molecules',
    'Define modern valence theory',
    'Explain the concept of resonance and configuration interaction',
    'Explain Hückel theory',
    'Outline Walsh rules with specific examples',
    'Explain the theory of electronic spectroscopy',
    'Explain Franck-Condon principle and vibrational structure of electronic transitions',
    'Explain Russell-Saunders coupling, orbital and spin angular momentum',
    'Explain use of symmetry in chemistry'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 305: Petroleum Chemistry (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM305', 'Petroleum Chemistry', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Petroleum Chemistry', ARRAY[
    'Give an overview of the chemical composition and physical properties of petroleum and renewable motor fuels',
    'Specify quality criteria for petroleum products and renewable motor fuels',
    'Present the chemistry of the most important refinery processes',
    'Give an overview of the resource base for petroleum and renewable alternatives',
    'Find information and perform evaluations of questions on petroleum production and use',
    'Use geophysical and geological knowledge to interpret data for identification of prospects',
    'Contribute to development of geo-based technology for exploration and improved recovery',
    'Explain the theory of hydraulics applied to fuels in pump-pipeline systems',
    'Explain the fundamentals of electricity with emphasis on electrical safety in petroleum',
    'List lubrication and wear with importance to physical and chemical properties of lubricants'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 319: Environmental Chemistry (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM319', 'Environmental Chemistry', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Environmental Chemistry', ARRAY[
    'Explain the elemental cycles of oxygen, nitrogen, sulphur, and others',
    'Describe the stratification of the Earth''s atmosphere and characteristics of each stratum',
    'State and describe different sources of environmental pollution',
    'State and describe different types of environmental pollution and their effects',
    'Describe water and state qualities that define the uses of water',
    'Describe and explain different sources of water contamination and its impact',
    'State and describe different methods used in treatment of wastewater',
    'State and justify chemical and physical instrumentation in environmental chemistry',
    'Describe environmental impact assessment',
    'State and describe the twelve principles of green chemistry and practical applications'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 406: Reaction Kinetics (2 units, Level 400, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM406', 'Reaction Kinetics', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Reaction Kinetics', ARRAY[
    'Identify the first, second, and third-order rate equations',
    'Use the coefficients of balanced chemical equations to express the rate of reaction',
    'Distinguish between instantaneous rates and average rates from a graph',
    'Determine the rate law from initial rate data',
    'Recognize the integrated rate laws and determine reaction order',
    'Use collision theory to explain how reactions occur at the molecular level',
    'Explain the concept of activation energy and its relation to reaction rate',
    'Define a catalyst and identify reaction intermediates and catalysts',
    'Explain how enzymes act as biological catalysts',
    'Explain why enzymatic reactions respond differently to temperature changes',
    'Recognize selected classes of toxic agents of military importance',
    'Explain the mechanism by which sarin inhibits acetylcholinesterase',
    'Identify photochemical reaction mechanisms'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 410: Analytical Chemistry II (2 units, Level 400, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM410', 'Analytical Chemistry II', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Analytical Chemistry II', ARRAY[
    'Describe different thermal methods of analyses: TG, DTG, DTA, DSC',
    'Describe the potentiometric method of analysis using pH',
    'Describe the conductometric method of analysis',
    'Describe the colorimetric method of analysis',
    'Describe the polarography methods of analysis',
    'Explain and perform calculations using chromatography principles',
    'Explain principles of different chromatographic techniques',
    'Explain the principle of radiochemical methods in environmental analysis'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 423: Organometallic Chemistry (2 units, Level 400, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM423', 'Organometallic Chemistry', 2, 400, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Organometallic Chemistry', ARRAY[
    'Identify the classifications of organometallic compounds by bonding and ligands',
    'Explain preparation, structure, and reactions of organometallic compounds',
    'Identify electron rules, bonding, and chemistry of ferrocene and related compounds',
    'Explain the roles of organometallic compounds in catalytic reactions'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- CHM 424: Coordination Chemistry (2 units, Level 400, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'CHM424', 'Coordination Chemistry', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Coordination Chemistry', ARRAY[
    'Define coordination compounds',
    'Recognize coordination compounds and their applications',
    'Understand the nomenclature, coordination formula, and isomerism in complexes',
    'Explain the stereochemistry of complex molecules',
    'Identify theories of bonding: Werner, valence bond, crystal field, and molecular bond theories',
    'Discuss advantages, disadvantages, and limitations of bonding theories',
    'Discuss physicochemical methods for structural elucidation of coordination compounds',
    'Identify spectrochemical series, nephelauxetic series, and Jahn-Teller distortions',
    'Identify stabilization of unusual oxidation states by complex formation',
    'Discuss preparation and reactions of complexes, kinetics, and mechanisms',
    'Discuss domain structures, magnetostrictions, magnetic relaxation, and magnetohydrodynamics',
    'Identify technological applications of magnetohydrodynamics'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- SED 202: Chemistry Methods I (2 units, Level 200, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'SED202', 'Chemistry Methods I', 2, 200, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Chemistry Methods I', ARRAY[
    'Distinguish among aims, goals, and objectives in science education',
    'Briefly trace the history and development of chemistry education in schools',
    'Justify the relevance of the study of chemistry',
    'Describe the layout, guiding principles, organization, and contents of the SSS chemistry curriculum',
    'Define and explain the concepts of pre-active and interactive teaching',
    'Write lesson plans on chemistry concepts',
    'State the roles of the laboratory in effective chemistry education',
    'Use a variety of contemporary methods to teach chemistry',
    'Define basic terms used in the evaluation of student chemistry learning',
    'List and use resources for chemistry teaching and learning',
    'Improvize instructional materials required for chemistry teaching',
    'Discuss challenges of science teaching and problems confronting chemistry education in Nigeria',
    'Participate in micro-teaching sessions for the demonstration of teaching skills'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- SED 302: Chemistry Methods II (2 units, Level 300, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'SED302', 'Chemistry Methods II', 2, 300, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Chemistry Methods II', ARRAY[
    'Present the nature of chemistry as a subject',
    'Identify the physical, inorganic, and organic concepts in the SSS chemistry curriculum',
    'Succinctly describe the chemistry curriculum',
    'Appreciate best practices in chemistry teaching',
    'Discuss the merits and demerits of various innovative methods of teaching chemistry',
    'Identify the supporting theories for methods of teaching',
    'Demonstrate practical skills for practical work in chemistry',
    'List the laboratory equipment, facilities, and common reagents used for chemistry practicals',
    'Organise practical lessons based on past WASSCE examination questions',
    'Identify difficult concepts in SSS chemistry and suggest practical solutions',
    'Use ICT facilities for planning and delivery of chemistry lessons'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- SED 303: Entrepreneurship in Chemistry Education (2 units, Level 300, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'SED303', 'Entrepreneurship in Chemistry Education', 2, 300, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Entrepreneurship in Chemistry Education', ARRAY[
    'Define entrepreneurship, chemistry entrepreneurship, and entrepreneurship education',
    'Appreciate the role of entrepreneurship in chemistry education',
    'Discuss entrepreneurship knowledge, skills, and attitudes and their roles in successful chemistry education',
    'Formulate and present business ideas from different aspects and topics of chemistry',
    'Identify specific societal needs and business interests relevant to chemistry students',
    'Enumerate the economic benefits of entrepreneurship in chemistry',
    'Discuss the strategies for developing entrepreneurship skills in chemistry education',
    'List and discuss with possible solutions the barriers to entrepreneurship in chemistry',
    'Present individual proposals for entrepreneurship ventures in chemistry and chemistry education',
    'Participate in group work on entrepreneurship proposals and projects',
    'Exhibit products from entrepreneurship projects carried out'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- SED 402: School Science Laboratory (2 units, Level 400, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'SED402', 'School Science Laboratory', 2, 400, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'School Science Laboratory', ARRAY[
    'Discuss the purpose and importance of the laboratory in science teaching',
    'Implement safety in the laboratory and outline waste disposal procedures',
    'Discuss the various hazards associated with science laboratories',
    'Describe the design and organization of the preparation room and store',
    'Outline the roles of different personnel with regards to the school laboratory',
    'Plan and conduct experiments as well as evaluate the results',
    'Acquire skills in simulating experiments',
    'Develop and improvise simple laboratory equipment',
    'Facilitate the establishment of a laboratory in new and older schools',
    'Manage a school science laboratory including procurement, storage, and maintenance',
    'Use the computer in the laboratory and navigate virtual laboratories in remote learning'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- STA 202: Statistics for Physical Sciences and Engineering (2 units, Level 200, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'STA202', 'Statistics for Physical Sciences and Engineering', 2, 200, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Statistics for Physical Sciences and Engineering', ARRAY[
    'Understand the scope for statistical methods in physical sciences and engineering',
    'Define the measures of location, partition, and dispersion',
    'Explain the elements of probability and probability distributions',
    'Differentiate point from interval estimation',
    'Conduct tests for hypotheses concerning population means, proportions, and variances',
    'Compute regression and correlation and conduct non-parametric tests',
    'Explain the elements of design of experiments and analysis of variance'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- PHY 101: General Physics I (Mechanics) (2 units, Level 100, First Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'PHY101', 'General Physics I (Mechanics)', 2, 100, 'first'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'General Physics I (Mechanics)', ARRAY[
    'Identify and deduce the physical quantities and their units',
    'Differentiate between vectors and scalars',
    'Describe and evaluate motion of systems on the basis of fundamental laws of mechanics',
    'Apply Newton''s laws to describe and solve simple problems of motion',
    'Evaluate work, energy, velocity, momentum, acceleration, and torque of moving or rotating objects',
    'Explain and apply the principles of conservation of energy, linear momentum, and angular momentum',
    'Describe the laws governing motion under gravity',
    'Explain motion under gravity and quantitatively determine behaviour of objects moving under gravity'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

-- MTH 102: Elementary Mathematics II (2 units, Level 100, Second Semester)
WITH p AS (SELECT id FROM catalog.national_programs WHERE nuc_code = 'CHM'),
inserted_course AS (
    INSERT INTO catalog.national_courses (program_id, course_code_standard, title_standard, credit_units, level, semester)
    SELECT id, 'MTH102', 'Elementary Mathematics II', 2, 100, 'second'
    FROM p
    ON CONFLICT (program_id, course_code_standard) DO UPDATE
      SET title_standard = EXCLUDED.title_standard,
          credit_units = EXCLUDED.credit_units,
          level = EXCLUDED.level,
          semester = EXCLUDED.semester
    RETURNING id
)
INSERT INTO catalog.national_topics (course_id, topic_name, learning_objectives)
SELECT id, 'Elementary Mathematics II', ARRAY[
    'Explain types of rules in differentiation and integration',
    'Give the meaning of function of a real variable, graphs, limits, and continuity',
    'Solve applications of definite integrals in areas and volumes'
]::text[]
FROM inserted_course
ON CONFLICT (course_id, topic_name) DO UPDATE
  SET learning_objectives = EXCLUDED.learning_objectives;

COMMIT;