// components/NceDepartmentSelect.tsx
// Grouped dropdown for NCE programme combinations.
// Used on signup and profile pages when program_type === 'nce'.

import { NCE_DEPARTMENTS } from '@/lib/nce-departments';

interface NceDepartmentSelectProps {
  value: string;
  onChange: (nuc_code: string) => void;
  disabled?: boolean;
  className?: string;
}

export function NceDepartmentSelect({
  value,
  onChange,
  disabled = false,
  className = '',
}: NceDepartmentSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={className}
    >
      <option value="" disabled>
        Select your NCE programme...
      </option>

      {NCE_DEPARTMENTS.map((group) => (
        <optgroup key={group.school} label={group.school}>
          {group.departments.map((dept) => (
            <option key={dept.nuc_code} value={dept.nuc_code}>
              {dept.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}


// ─── USAGE EXAMPLE ON SIGNUP PAGE ────────────────────────────────────────────
//
// import { NceDepartmentSelect } from '@/components/NceDepartmentSelect';
//
// const [programType, setProgramType] = useState<'degree' | 'nce'>('degree');
// const [nceDepartment, setNceDepartment] = useState('');
// const [degreeMajor, setDegreeMajor] = useState('');
//
// {programType === 'nce' ? (
//   <NceDepartmentSelect
//     value={nceDepartment}
//     onChange={setNceDepartment}
//   />
// ) : (
//   <input
//     type="text"
//     value={degreeMajor}
//     onChange={(e) => setDegreeMajor(e.target.value)}
//     placeholder="Enter your department / major"
//   />
// )}
//
// Then in the signup payload, send:
//   major: programType === 'nce' ? nceDepartment : degreeMajor
//   program_type: programType
//
// The nuc_code (e.g. 'NCE_BIO_MTH') becomes the major value stored in
// public.profiles.major and used to look up catalog.national_programs.
// ─────────────────────────────────────────────────────────────────────────────
