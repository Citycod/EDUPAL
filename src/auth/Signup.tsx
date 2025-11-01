import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface SignupFormData {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form validation and API call
    console.log('Signup data:', formData);
    
    // After successful signup, navigate to verification
    navigate('/verification');
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white justify-between overflow-x-hidden font-['Manrope','Noto_Sans',sans-serif]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between p-4 pb-2 bg-white">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="text-[#111418] flex size-12 shrink-0 items-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          
          {/* Title */}
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Sign Up
          </h2>
        </div>

        <form onSubmit={handleSignup}>
          {/* Email Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col flex-1 min-w-40">
              <input
                type="email"
                placeholder="Institutional Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#617589] p-4 text-base font-normal leading-normal focus:bg-[#e8eaed] transition-colors"
                required
              />
            </label>
          </div>

          {/* Full Name Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col flex-1 min-w-40">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#617589] p-4 text-base font-normal leading-normal focus:bg-[#e8eaed] transition-colors"
                required
              />
            </label>
          </div>

          {/* Password Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col flex-1 min-w-40">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#617589] p-4 text-base font-normal leading-normal focus:bg-[#e8eaed] transition-colors"
                required
              />
            </label>
          </div>

          {/* Confirm Password Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col flex-1 min-w-40">
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-14 placeholder:text-[#617589] p-4 text-base font-normal leading-normal focus:bg-[#e8eaed] transition-colors"
                required
              />
            </label>
          </div>

          {/* Terms & Conditions - FIXED LAYOUT */}
          <div className="flex items-center gap-4 px-4 py-4 bg-white mx-auto max-w-[480px]">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="h-5 w-5 rounded border-[#dbe0e6] border-2 bg-transparent text-[#1172d4] checked:bg-[#1172d4] checked:border-[#1172d4] focus:ring-0 focus:ring-offset-0 focus:border-[#dbe0e6] focus:outline-none cursor-pointer"
                required
              />
            </div>
            <p className="text-[#111418] text-base font-normal leading-normal flex-1">
              I agree to the{' '}
              <button 
                type="button"
                className="text-[#1172d4] underline hover:text-blue-700 transition-colors"
                onClick={() => console.log('Show terms modal')}
              >
                Terms & Conditions
              </button>
            </p>
          </div>

          {/* Sign Up Button */}
          <div className="flex px-4 py-3">
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-[#1172d4] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors duration-200 mx-auto"
            >
              <span className="truncate">Sign Up</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div>
        <p className="text-[#617589] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="underline hover:text-[#1172d4] transition-colors">
            Sign In
          </Link>
        </p>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
};

export default Signup;