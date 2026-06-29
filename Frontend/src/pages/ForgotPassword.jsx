import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { success, error: toastError, info } = useToast();

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

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toastError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/password/forgot`, { email });
      if (response.data.success) {
        success('OTP sent to your email!');
        setStep(2);
        setCountdown(60);
        startCountdown();
     
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toastError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/password/verify-otp`, { email, otp });
      if (response.data.success) {
        success('OTP verified!');
        setStep(3);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toastError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toastError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/password/reset`, {
        email,
        otp,
        newPassword,
        confirmPassword
      });
      if (response.data.success) {
        success('Password reset successfully! Please login with your new password.');
        window.location.href = '/login';
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/password/forgot`, { email });
      if (response.data.success) {
        success('OTP resent successfully!');
        setCountdown(60);
        startCountdown();
        if (response.data.devOTP) {
          info(`Development OTP: ${response.data.devOTP}`);
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-primary px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Reset Password'}
          </h2>
          <p className="mt-2 text-text-secondary">
            {step === 1 && 'Enter your email to receive reset code'}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && 'Create your new password'}
          </p>
        </div>

        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-divider rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                placeholder="name@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white py-3.5 rounded-full font-semibold hover:bg-brand-orange-dark transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-brand-orange hover:text-brand-orange text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-3 input-field text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="000000"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white py-3.5 rounded-full font-semibold hover:bg-brand-orange-dark transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className="text-brand-orange hover:text-brand-orange text-sm disabled:opacity-50"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-divider rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-divider rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white py-3.5 rounded-full font-semibold hover:bg-brand-orange-dark transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;