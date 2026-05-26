import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        success('Welcome back!');
        if (result.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toastError(result.error || 'Login failed');
      }
    } catch (err) {
      toastError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2540] px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-300">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#111827] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#111827] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6200] text-white py-3.5 rounded-full font-semibold hover:bg-[#E05500] transition-all duration-300 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
<div className="flex justify-center ">
          <div className="text-center">
            <Link
              to="/register"
              className="text-[#22D3EE] hover:text-[#FF6200] transition-colors text-sm"
            >
              Don't have an account? <span className="font-semibold">Create one</span>
            </Link>
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-[#22D3EE] hover:text-[#FF6200] transition-colors text-sm"
            >
              Forgot Password?
            </Link>
          </div>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;