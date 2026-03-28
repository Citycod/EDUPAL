export type ProgramType = 'degree' | 'nce';

export const DEGREE_LEVELS = [
  { value: 100, label: '100 Level' },
  { value: 200, label: '200 Level' },
  { value: 300, label: '300 Level' },
  { value: 400, label: '400 Level' },
  { value: 500, label: '500 Level' },
];

export const NCE_LEVELS = [
  { value: 100, label: 'NCE 1' },
  { value: 200, label: 'NCE 2' },
  { value: 300, label: 'NCE 3' },
];

/**
 * Returns the correct level options based on program type.
 */
export function getLevelOptions(programType: ProgramType) {
  return programType === 'nce' ? NCE_LEVELS : DEGREE_LEVELS;
}

/**
 * Returns the display label for a numeric level given a program type.
 * e.g. displayLevel('100', 'nce') => 'NCE 1'
 *      displayLevel('100', 'degree') => '100 Level'
 */
export function displayLevel(level: string | number, programType: ProgramType): string {
  const numericLevel = typeof level === 'string' ? parseInt(level, 10) : level;
  const options = getLevelOptions(programType);
  return options.find(o => o.value === numericLevel)?.label ?? `${level} Level`;
}

/**
 * Validates that an NCE student is not selecting a level above 300.
 */
export function isValidLevelForProgram(level: number, programType: ProgramType): boolean {
  return getLevelOptions(programType).some(o => o.value === level);
}
