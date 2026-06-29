import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { otpService } from '../services/otpService';

const RegisterPage = () => {
  const { setAuthSession } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();
  
  // Step 1: Registration Form
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Step 2: OTP Form
  const [otp, setOtp] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [emailPreviewUrl, setEmailPreviewUrl] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toastError('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      toastError('Please enter your email');
      return;
    }
    if (!formData.password) {
      toastError('Please enter a password');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toastError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toastError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await otpService.sendOTP({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        if (result.emailSent) {
          success(`Verification code sent to ${formData.email}`);
        } else if (result.emailPreviewUrl) {
          success('Email preview is ready');
          info('Open the preview link below to view your verification email.');
        } else if (result.devOTP) {
          success('Verification code generated');
          info(`Development code: ${result.devOTP}`);
        } else {
          info(result.message || 'Verification code generated. Please check your email.');
        }
        setOtpEmail(formData.email);
        if (result.devOTP) setDevOtp(result.devOTP);
        setEmailPreviewUrl(result.emailPreviewUrl || '');
        setStep(2);
        setCountdown(60);
        startCountdown();
      } else {
        toastError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toastError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await otpService.verifyOTP(otpEmail, otp);
      
      if (result.success && result.token && result.user) {
        setAuthSession(result.token, result.user);
        success('Account created successfully!');
        if (result.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toastError(result.message || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const result = await otpService.resendOTP(otpEmail);
      if (result.success) {
        if (result.emailSent) {
          success(`Verification code resent to ${otpEmail}`);
        } else if (result.devOTP) {
          success('New verification code generated');
          info(`Development code: ${result.devOTP}`);
        } else {
          info(result.message || 'Verification code resent');
        }
        setCountdown(60);
        startCountdown();
        if (result.devOTP) setDevOtp(result.devOTP);
        setEmailPreviewUrl(result.emailPreviewUrl || '');
      } else {
        toastError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-auth px-4 pb-20 md:pb-0">
      <div className="max-w-md w-full card-premium p-8">
        {step === 1 ? (
          // Step 1: Registration Form
          <>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-light border border-brand-orange/20 rounded-full text-brand-orange text-sm mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                </span>
                Join Us Today
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">Create Account</h2>
              <p className="text-text-secondary">Join MeroGadget today</p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-divider rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-divider rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-divider rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-divider rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300"
                    placeholder="Repeat your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white py-3.5 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending OTP...
                  </span>
                ) : 'Send Verification Code'}
              </button>
              
              <div className="text-center">
                <Link to="/login" className="text-brand-orange hover:text-brand-orange transition-colors text-sm">
                  Already have an account? <span className="font-semibold">Sign in</span>
                </Link>
              </div>
            </form>
          </>
        ) : (
          // Step 2: OTP Verification Form
          <>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-orange/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">Verify Email</h2>
              <p className="text-text-secondary">
                We sent a 6-digit code to<br />
                <span className="text-brand-orange font-medium">{otpEmail}</span>
              </p>
              <p className="text-xs text-text-muted mt-2">
                Check your inbox and spam folder. The code expires in 10 minutes.
              </p>
              {devOtp && (
                <div className="mt-4 p-3 rounded-xl bg-brand-light border border-brand-orange/20">
                  <p className="text-xs text-text-muted mb-1">Your verification code</p>
                  <p className="text-2xl font-bold tracking-[0.4em] text-brand-orange">{devOtp}</p>
                </div>
              )}
              {emailPreviewUrl && (
                <div className="mt-4 p-3 rounded-xl bg-brand-light border border-brand-orange/20 text-left">
                  <p className="text-xs text-text-muted mb-2">Email could not reach your inbox (SMTP not configured). Open this preview instead:</p>
                  <a
                    href={emailPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-brand-orange hover:text-brand-orange-dark break-all"
                  >
                    View verification email
                  </a>
                </div>
              )}
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-text-secondary mb-2 text-center">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    maxLength="6"
                    className="w-full px-4 py-4 input-field text-center text-3xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300"
                    placeholder="000000"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-xs text-text-muted mt-2">
                  Enter the 6-digit verification code
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white py-3.5 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify & Register'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || resendLoading}
                  className="text-brand-orange hover:text-brand-orange transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {countdown > 0 
                    ? `Resend code in ${countdown}s` 
                    : resendLoading ? (
                      <span className="flex items-center justify-center gap-1">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : 'Resend code'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;