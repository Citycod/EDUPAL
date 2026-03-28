// lib/nce-departments.ts
// NCE approved programme combinations — sourced from NCCE / Sikiru Adetona College
// Used to populate the department dropdown when program_type === 'nce' on signup/profile

export interface NceDepartment {
  label: string;       // Display name shown in dropdown
  nuc_code: string;    // Matches catalog.national_programs.nuc_code
}

export interface NceSchool {
  school: string;      // Group label shown as optgroup header
  departments: NceDepartment[];
}

export const NCE_DEPARTMENTS: NceSchool[] = [
  {
    school: 'Arabic Combinations',
    departments: [
      { label: 'Arabic / English',        nuc_code: 'NCE_ARA_ENG' },
      { label: 'Arabic / Islamic Studies', nuc_code: 'NCE_ARA_ISL' },
      { label: 'Arabic / Social Studies',  nuc_code: 'NCE_ARA_SOC' },
      { label: 'Arabic / Yoruba',          nuc_code: 'NCE_ARA_YOR' },
    ],
  },
  {
    school: 'Agricultural Science',
    departments: [
      { label: 'Agricultural Science', nuc_code: 'NCE_AGR' },
    ],
  },
  {
    school: 'Biology Combinations',
    departments: [
      { label: 'Biology / Mathematics',        nuc_code: 'NCE_BIO_MTH' },
      { label: 'Biology / Integrated Science', nuc_code: 'NCE_BIO_INT' },
      { label: 'Biology / Chemistry',          nuc_code: 'NCE_BIO_CHM' },
      { label: 'Biology / Geography',          nuc_code: 'NCE_BIO_GEO' },
    ],
  },
  {
    school: 'Business Education',
    departments: [
      { label: 'Business Education', nuc_code: 'NCE_BUS' },
      { label: 'Business Studies',   nuc_code: 'NCE_BUS_STU' },
      { label: 'Accounting',         nuc_code: 'NCE_ACC' },
      { label: 'Secretariat',        nuc_code: 'NCE_SEC' },
    ],
  },
  {
    school: 'Chemistry Combinations',
    departments: [
      { label: 'Chemistry / Physics',      nuc_code: 'NCE_CHM_PHY' },
      { label: 'Chemistry / Mathematics',  nuc_code: 'NCE_CHM_MTH' },
    ],
  },
  {
    school: 'Computer Science Combinations',
    departments: [
      { label: 'Computer Science / Geography',         nuc_code: 'NCE_CSC_GEO' },
      { label: 'Computer Science / Physics',           nuc_code: 'NCE_CSC_PHY' },
      { label: 'Computer Science / Chemistry',         nuc_code: 'NCE_CSC_CHM' },
      { label: 'Computer Science / Mathematics',       nuc_code: 'NCE_CSC_MTH' },
      { label: 'Computer Science / Biology',           nuc_code: 'NCE_CSC_BIO' },
      { label: 'Computer Science / Economics',         nuc_code: 'NCE_CSC_ECO' },
      { label: 'Computer Science / Integrated Science', nuc_code: 'NCE_CSC_INT' },
    ],
  },
  {
    school: 'Christian Religious Studies Combinations',
    departments: [
      { label: 'Christian Religious Studies / French',           nuc_code: 'NCE_CRS_FRN' },
      { label: 'Christian Religious Studies / Yoruba',           nuc_code: 'NCE_CRS_YOR' },
      { label: 'Christian Religious Studies / Social Studies',   nuc_code: 'NCE_CRS_SOC' },
      { label: 'Christian Religious Studies / Political Science', nuc_code: 'NCE_CRS_POL' },
      { label: 'Christian Religious Studies / History',          nuc_code: 'NCE_CRS_HIS' },
      { label: 'Christian Religious Studies / English',          nuc_code: 'NCE_CRS_ENG' },
    ],
  },
  {
    school: 'Economics Combinations',
    departments: [
      { label: 'Economics / Political Science', nuc_code: 'NCE_ECO_POL' },
      { label: 'Economics / History',           nuc_code: 'NCE_ECO_HIS' },
      { label: 'Economics / Mathematics',       nuc_code: 'NCE_ECO_MTH' },
      { label: 'Economics / Social Studies',    nuc_code: 'NCE_ECO_SOC' },
      { label: 'Economics / Geography',         nuc_code: 'NCE_ECO_GEO' },
    ],
  },
  {
    school: 'English Combinations',
    departments: [
      { label: 'English',                nuc_code: 'NCE_ENG' },
      { label: 'English / Social Studies', nuc_code: 'NCE_ENG_SOC' },
      { label: 'English / Islamic Studies', nuc_code: 'NCE_ENG_ISL' },
      { label: 'English / Yoruba',        nuc_code: 'NCE_ENG_YOR' },
      { label: 'English / History',       nuc_code: 'NCE_ENG_HIS' },
      { label: 'English / French',        nuc_code: 'NCE_ENG_FRN' },
    ],
  },
  {
    school: 'Early Childhood Education',
    departments: [
      { label: 'Early Childhood and Care Education', nuc_code: 'NCE_ECE' },
    ],
  },
  {
    school: 'Fine & Applied Arts',
    departments: [
      { label: 'Fine & Applied Arts', nuc_code: 'NCE_FAA' },
    ],
  },
  {
    school: 'French Combinations',
    departments: [
      { label: 'French',                nuc_code: 'NCE_FRN' },
      { label: 'French / History',      nuc_code: 'NCE_FRN_HIS' },
      { label: 'French / Social Studies', nuc_code: 'NCE_FRN_SOC' },
      { label: 'French / Yoruba',       nuc_code: 'NCE_FRN_YOR' },
    ],
  },
  {
    school: 'Geography Combinations',
    departments: [
      { label: 'Geography / Mathematics',      nuc_code: 'NCE_GEO_MTH' },
      { label: 'Geography / Social Studies',   nuc_code: 'NCE_GEO_SOC' },
      { label: 'Geography / History',          nuc_code: 'NCE_GEO_HIS' },
      { label: 'Geography / Political Science', nuc_code: 'NCE_GEO_POL' },
      { label: 'Geography / Physics',          nuc_code: 'NCE_GEO_PHY' },
      { label: 'Geography / Integrated Science', nuc_code: 'NCE_GEO_INT' },
    ],
  },
  {
    school: 'History Combinations',
    departments: [
      { label: 'History / Social Studies',   nuc_code: 'NCE_HIS_SOC' },
      { label: 'History / Islamic Studies',  nuc_code: 'NCE_HIS_ISL' },
      { label: 'History / Political Science', nuc_code: 'NCE_HIS_POL' },
    ],
  },
  {
    school: 'Home Economics',
    departments: [
      { label: 'Home Economics (Double Major)', nuc_code: 'NCE_HEC' },
    ],
  },
  {
    school: 'Integrated Science',
    departments: [
      { label: 'Integrated Science / Mathematics', nuc_code: 'NCE_INT_MTH' },
    ],
  },
  {
    school: 'Islamic Studies Combinations',
    departments: [
      { label: 'Islamic Studies / Social Studies',   nuc_code: 'NCE_ISL_SOC' },
      { label: 'Islamic Studies / Yoruba',           nuc_code: 'NCE_ISL_YOR' },
      { label: 'Islamic Studies / Political Science', nuc_code: 'NCE_ISL_POL' },
      { label: 'Islamic Studies / Economics',        nuc_code: 'NCE_ISL_ECO' },
    ],
  },
  {
    school: 'Mathematics Combinations',
    departments: [
      { label: 'Mathematics / Physics', nuc_code: 'NCE_MTH_PHY' },
    ],
  },
  {
    school: 'Physical & Health Education',
    departments: [
      { label: 'Physical & Health Education (Double Major)', nuc_code: 'NCE_PHE' },
    ],
  },
  {
    school: 'Primary Education',
    departments: [
      { label: 'Primary Education (Double Major)', nuc_code: 'NCE_PED' },
    ],
  },
  {
    school: 'Political Science Combinations',
    departments: [
      { label: 'Political Science / Social Studies', nuc_code: 'NCE_POL_SOC' },
    ],
  },
  {
    school: 'Social Studies',
    departments: [
      { label: 'Social Studies (Double Major)', nuc_code: 'NCE_SOC' },
    ],
  },
  {
    school: 'Technical Education',
    departments: [
      { label: 'Technical Education - Automobile Technology',          nuc_code: 'NCE_TEC_AUTO' },
      { label: 'Technical Education - Building Technology',            nuc_code: 'NCE_TEC_BLD' },
      { label: 'Technical Education - Electrical / Electronic Technology', nuc_code: 'NCE_TEC_ELE' },
      { label: 'Technical Education - Metalwork Technology',           nuc_code: 'NCE_TEC_MET' },
      { label: 'Technical Education - Woodwork Technology',            nuc_code: 'NCE_TEC_WOD' },
    ],
  },
];

/**
 * Flat list of all NCE departments — useful for search/filter or simple selects.
 */
export const NCE_DEPARTMENTS_FLAT: NceDepartment[] = NCE_DEPARTMENTS.flatMap(
  (school) => school.departments,
);

/**
 * Look up a department label by its nuc_code.
 * e.g. getNceDepartmentLabel('NCE_BIO_MTH') => 'Biology / Mathematics'
 */
export function getNceDepartmentLabel(nuc_code: string): string {
  return (
    NCE_DEPARTMENTS_FLAT.find((d) => d.nuc_code === nuc_code)?.label ?? nuc_code
  );
}
