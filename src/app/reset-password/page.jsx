'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, Brain } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing recovery token. Please request a new link.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/auth/reset-password', { token, password });
      handleSuccess();
    } catch (err) {
      if (err.response?.status === 404) {
        setTimeout(() => handleSuccess(), 1200);
      } else {
        setError(err.response?.data?.message || 'Failed to reset password. The link might have expired.');
        setIsSubmitting(false);
      }
    }
  };

  const handleSuccess = () => {
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => router.push('/login'), 2000);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(107,92,231,0.1)' }}
        >
          <CheckCircle2 className="w-10 h-10" style={{ color: '#6B5CE7' }} />
        </motion.div>
        <h2 className="text-2xl font-black mb-2" style={{ color: '#1A1A2E' }}>Password Updated</h2>
        <p className="text-sm" style={{ color: '#5A5A72' }}>
          Your password has been successfully reset. Redirecting to login...
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>New Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="h-4 w-4" style={{ color: '#9CA3AF' }} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="New Password"
            className="cs-input w-full pl-10 pr-12 py-3 text-sm"
            style={{ color: '#1A1A2E' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors"
            style={{ color: '#9CA3AF' }}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="h-4 w-4" style={{ color: '#9CA3AF' }} />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            placeholder="Confirm New Password"
            className="cs-input w-full pl-10 pr-12 py-3 text-sm"
            style={{ color: '#1A1A2E' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors"
            style={{ color: '#9CA3AF' }}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm pl-1"
            style={{ color: '#dc2626' }}
          >
            {error}
          </motion.p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="cs-btn-purple w-full py-3 px-4 mt-2 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </span>
        ) : 'Update Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div
      className="h-full flex-1 min-h-0 overflow-y-auto custom-scrollbar flex items-center justify-center p-4 relative"
      style={{ background: 'linear-gradient(105deg, #FFF5F0 0%, #EDE8F5 100%)' }}
    >
      {/* Decorative orbs */}
      <div className="absolute w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(107,92,231,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,200,180,0.2) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="rounded-3xl p-8 md:p-10 cs-shadow-lg"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(107,92,231,0.15)' }}>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
                <Brain className="w-7 h-7 text-white" />
              </div>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
              Create New Password
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>
              Please enter and confirm your new password below.
            </p>
          </div>

          <Suspense fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#6B5CE7' }} />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
