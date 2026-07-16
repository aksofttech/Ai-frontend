'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Brain } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSuccess(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setTimeout(() => setIsSuccess(true), 1200);
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className="h-full flex-1 min-h-0 overflow-y-auto custom-scrollbar flex items-center justify-center p-4 relative py-8"
      style={{ background: '#1A1A2E' }}
    >
      {/* Blurred Background Image */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/auth-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px)',
          transform: 'scale(1.04)',
        }}
      />
      {/* Soft overlay to make card and text pop */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'rgba(255, 248, 245, 0.45)' }} />

      {/* Decorative orbs */}
      <div className="absolute w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(107,92,231,0.2) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,200,180,0.25) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="rounded-3xl p-8 md:p-10 cs-shadow-lg"
          style={{ background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(107,92,231,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>

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
              Reset Your Password
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>
              Enter your email to receive a secure recovery link.
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(107,92,231,0.1)' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: '#6B5CE7' }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>Check your email</h2>
              <p className="text-sm" style={{ color: '#5A5A72' }}>
                We've sent a recovery link to <strong style={{ color: '#6B5CE7' }}>{email}</strong>
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    className="cs-input w-full pl-10 pr-3 py-3 text-sm"
                    style={{ color: '#1A1A2E' }}
                  />
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
                className="cs-btn-purple w-full py-3 px-4 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>
                ) : 'Send Recovery Link'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium transition-colors"
              style={{ color: '#5A5A72' }}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
