"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/signup', {
        email,
        password,
        tenantName: name ? `${name}'s School` : undefined
      });
      alert('Signup successful! Redirecting to login...');
      window.location.href = '/login';
    } catch (err) {
      const apiError = err.response?.data?.message;
      let errorMsg = '';
      if (typeof apiError === 'string') {
        errorMsg = apiError;
      } else if (Array.isArray(apiError)) {
        errorMsg = apiError.join(', ');
      } else if (apiError && typeof apiError === 'object') {
        errorMsg = apiError.message || JSON.stringify(apiError);
      } else {
        errorMsg = err.response?.data?.error || err.message || 'An error occurred during signup.';
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-full flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col justify-center items-center px-4 relative"
      style={{ background: 'linear-gradient(105deg, #EDE8F5 0%, #FFF5F0 100%)' }}
    >
      {/* Decorative orbs */}
      <div className="absolute w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(107,92,231,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,180,150,0.18) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 relative"
      >
        <div className="rounded-3xl p-10 cs-shadow-lg"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(107,92,231,0.15)' }}>

          {/* Logo & heading */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 cursor-pointer transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #6B5CE7, #8B7CF6)' }}>
                <Brain className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>Create an Account</h2>
            <p className="mt-2 text-sm text-center" style={{ color: '#5A5A72' }}>Join YugSoft AI and supercharge your teaching.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-xl text-sm text-center"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cs-input block w-full pl-10 pr-3 py-3 text-sm"
                  style={{ color: '#1A1A2E' }}
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cs-input block w-full pl-10 pr-3 py-3 text-sm"
                  style={{ color: '#1A1A2E' }}
                  placeholder="you@school.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A2E' }}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cs-input block w-full pl-10 pr-3 py-3 text-sm"
                  style={{ color: '#1A1A2E' }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cs-btn-purple w-full py-3 px-4 mt-2 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(107,92,231,0.15)' }} />
            <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(107,92,231,0.15)' }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="w-full py-3 px-4 rounded-full font-semibold flex items-center justify-center gap-3 text-sm transition-all"
            style={{ background: 'white', color: '#1A1A2E', border: '1.5px solid rgba(107,92,231,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <p className="mt-6 text-center text-sm" style={{ color: '#5A5A72' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold transition-colors" style={{ color: '#6B5CE7' }}>
              Log in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
