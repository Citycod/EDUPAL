-- Seed file: NCE Approved Programme Combinations
-- Source: Sikiru Adetona College of Science Education & Technology / NCCE Minimum Standards
-- These are inserted as national_programs with nuc_code prefix NCE_
-- They are SEPARATE from Degree programs to avoid catalog collision.
-- Level mapping: NCE 1 = 100, NCE 2 = 200, NCE 3 = 300 (stored as integers)

BEGIN;

-- ============================================================
-- ARABIC COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Arabic / English', 'NCE_ARA_ENG') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Arabic / Islamic Studies', 'NCE_ARA_ISL') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Arabic / Social Studies', 'NCE_ARA_SOC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Arabic / Yoruba', 'NCE_ARA_YOR') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- AGRICULTURAL SCIENCE
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Agricultural Science', 'NCE_AGR') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- BIOLOGY COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Biology / Mathematics', 'NCE_BIO_MTH') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Biology / Integrated Science', 'NCE_BIO_INT') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Biology / Chemistry', 'NCE_BIO_CHM') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Biology / Geography', 'NCE_BIO_GEO') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- BUSINESS EDUCATION
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Business Education', 'NCE_BUS') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Business Studies', 'NCE_BUS_STU') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Accounting', 'NCE_ACC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Secretariat', 'NCE_SEC') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- CHEMISTRY COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Chemistry / Physics', 'NCE_CHM_PHY') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Chemistry / Mathematics', 'NCE_CHM_MTH') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- COMPUTER SCIENCE COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Computer Science / Geography', 'NCE_CSC_GEO') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Computer Science / Physics', 'NCE_CSC_PHY') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Computer Science / Chemistry', 'NCE_CSC_CHM') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Computer Science / Mathematics', 'NCE_CSC_MTH') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Computer Science / Biology', 'NCE_CSC_BIO') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Computer Science / Economics', 'NCE_CSC_ECO') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Computer Science / Integrated Science', 'NCE_CSC_INT') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- CHRISTIAN RELIGIOUS STUDIES COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Christian Religious Studies / French', 'NCE_CRS_FRN') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Christian Religious Studies / Yoruba', 'NCE_CRS_YOR') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Christian Religious Studies / Social Studies', 'NCE_CRS_SOC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Christian Religious Studies / Political Science', 'NCE_CRS_POL') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Christian Religious Studies / History', 'NCE_CRS_HIS') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Christian Religious Studies / English', 'NCE_CRS_ENG') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- ECONOMICS COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Economics / Political Science', 'NCE_ECO_POL') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Economics / History', 'NCE_ECO_HIS') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Economics / Mathematics', 'NCE_ECO_MTH') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Economics / Social Studies', 'NCE_ECO_SOC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Economics / Geography', 'NCE_ECO_GEO') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- ENGLISH COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('English', 'NCE_ENG') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('English / Social Studies', 'NCE_ENG_SOC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('English / Islamic Studies', 'NCE_ENG_ISL') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('English / Yoruba', 'NCE_ENG_YOR') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('English / History', 'NCE_ENG_HIS') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('English / French', 'NCE_ENG_FRN') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- EARLY CHILDHOOD
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Early Childhood and Care Education', 'NCE_ECE') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- FINE & APPLIED ARTS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Fine & Applied Arts', 'NCE_FAA') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- FRENCH COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('French', 'NCE_FRN') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('French / History', 'NCE_FRN_HIS') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('French / Social Studies', 'NCE_FRN_SOC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('French / Yoruba', 'NCE_FRN_YOR') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- GEOGRAPHY COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Geography / Mathematics', 'NCE_GEO_MTH') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Geography / Social Studies', 'NCE_GEO_SOC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Geography / History', 'NCE_GEO_HIS') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Geography / Political Science', 'NCE_GEO_POL') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Geography / Physics', 'NCE_GEO_PHY') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Geography / Integrated Science', 'NCE_GEO_INT') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- HISTORY COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('History / Social Studies', 'NCE_HIS_SOC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('History / Islamic Studies', 'NCE_HIS_ISL') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('History / Political Science', 'NCE_HIS_POL') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- HOME ECONOMICS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Home Economics (Double Major)', 'NCE_HEC') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- INTEGRATED SCIENCE
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Integrated Science / Mathematics', 'NCE_INT_MTH') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- ISLAMIC STUDIES COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Islamic Studies / Social Studies', 'NCE_ISL_SOC') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Islamic Studies / Yoruba', 'NCE_ISL_YOR') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Islamic Studies / Political Science', 'NCE_ISL_POL') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Islamic Studies / Economics', 'NCE_ISL_ECO') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- MATHEMATICS COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Mathematics / Physics', 'NCE_MTH_PHY') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- PHYSICAL & HEALTH EDUCATION
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Physical & Health Education (Double Major)', 'NCE_PHE') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- PRIMARY EDUCATION
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Primary Education (Double Major)', 'NCE_PED') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- POLITICAL SCIENCE COMBINATIONS
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Political Science / Social Studies', 'NCE_POL_SOC') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- SOCIAL STUDIES
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Social Studies (Double Major)', 'NCE_SOC') ON CONFLICT (nuc_code) DO NOTHING;

-- ============================================================
-- TECHNICAL EDUCATION (options as sub-specialisations)
-- ============================================================
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Technical Education - Automobile Technology', 'NCE_TEC_AUTO') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Technical Education - Building Technology', 'NCE_TEC_BLD') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Technical Education - Electrical / Electronic Technology', 'NCE_TEC_ELE') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Technical Education - Metalwork Technology', 'NCE_TEC_MET') ON CONFLICT (nuc_code) DO NOTHING;
INSERT INTO catalog.national_programs (name, nuc_code) VALUES ('Technical Education - Woodwork Technology', 'NCE_TEC_WOD') ON CONFLICT (nuc_code) DO NOTHING;

COMMIT;

-- ============================================================
-- VERIFICATION
-- Run after seeding to confirm all 68 programs inserted
-- ============================================================
-- SELECT COUNT(*) FROM catalog.national_programs WHERE nuc_code LIKE 'NCE_%';
-- Expected: 68
