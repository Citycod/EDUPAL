import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    navigate('/home')
    console.log('Login attempted with:', { email, password });
  };

  const handleForgotPassword = () => {
    // Add forgot password navigation logic here
    navigate('/reset-password');
  };

  const handleCreateAccount = () => {
    // Add create account navigation logic here
    navigate('/signup'); // Adjust route as needed
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8fbfc] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Main Content */}
      <div className="flex-1">
        {/* Welcome Header */}
        <h3 className="text-[#0d191c] tracking-light text-2xl font-bold leading-tight px-4 text-left pb-2 pt-5">
          Welcome back, scholar 👋🏾
        </h3>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col">
          {/* Email Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col flex-1 min-w-40">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d191c] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f4] focus:border-none h-14 placeholder:text-[#498a9c] p-4 text-base font-normal leading-normal focus:bg-[#dde9ec] transition-colors"
                required
              />
            </label>
          </div>

          {/* Password Input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col flex-1 min-w-40">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d191c] focus:outline-0 focus:ring-0 border-none bg-[#e7f1f4] focus:border-none h-14 placeholder:text-[#498a9c] p-4 text-base font-normal leading-normal focus:bg-[#dde9ec] transition-colors"
                required
              />
            </label>
          </div>

          {/* Forgot Password */}
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[#498a9c] text-sm font-normal leading-normal pb-3 pt-1 px-4 underline hover:text-[#0ba9d5] transition-colors text-left w-fit"
          >
            Forgot Password?
          </button>

          {/* Login Button */}
          <div className="flex px-4 py-3">
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#0ba9d5] text-[#f8fbfc] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0a95c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!email || !password}
            >
              <span className="truncate">Login</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div>
        <button
          onClick={handleCreateAccount}
          className="text-[#498a9c] text-sm font-normal  leading-normal pb-3 pt-1 px-4 text-center underline hover:text-[#0ba9d5] transition-colors w-full"
        >
          Don't have an account? Create Account
        </button>
        <div className="h-5 bg-[#f8fbfc]"></div>
      </div>
    </div>
  );
};

export default Login;