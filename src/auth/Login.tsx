import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form validation and API call
    console.log('Login data:', formData);
    // After successful login, you can use:
    // const navigate = useNavigate();
    // navigate('/home');
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    console.log('Forgot password clicked');
    // navigate('/forgot-password');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white justify-between overflow-x-hidden font-['Manrope','Noto_Sans',sans-serif]">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <h2 className="text-[#111418] tracking-tight text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          Welcome back
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3 mx-auto">
            <label className="flex flex-col flex-1 min-w-40">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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

          {/* Forgot Password */}
          <div className="flex justify-center px-4 py-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#617589] text-sm font-normal leading-normal underline hover:text-[#1172d4] transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <div className="flex px-4 py-3">
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-[#1172d4] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors duration-200 mx-auto"
            >
              <span className="truncate">Log In</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div>
        <p className="text-[#617589] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="underline hover:text-[#1172d4] transition-colors">
            Sign Up
          </Link>
        </p>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
};

export default Login;