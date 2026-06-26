"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import AdminPanel from '@/components/features/AdminPanel';
import { Sparkles, ShieldAlert, Brain } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, fetchProfile } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!user) {
      fetchProfile();
      return;
    }
    if (user.role !== 'admin') {
      router.push('/teacher');
    }
  }, [user, isAuthenticated, router, fetchProfile]);

  if (!isAuthenticated || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(105deg,#FFF5F0 0%,#EDE8F5 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6B5CE7', borderTopColor: 'transparent' }} />
          <span className="text-sm font-medium" style={{ color: '#5A5A72' }}>Authenticating...</span>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'linear-gradient(105deg,#FFF5F0 0%,#EDE8F5 100%)' }}
      >
        <ShieldAlert size={48} className="mb-4 animate-bounce" style={{ color: '#dc2626' }} />
        <h2 className="text-2xl font-black mb-2" style={{ color: '#1A1A2E' }}>Access Denied</h2>
        <p className="text-sm" style={{ color: '#5A5A72' }}>You do not have permission to view the Administration Portal.</p>
      </div>
    );
  }

  return (
    <div
      className="h-full flex overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#FFF5F0 0%,#EDE8F5 100%)' }}
    >
      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Admin Top Header */}
        <header
          className="h-[64px] w-full flex items-center justify-between px-6 shrink-0"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(107,92,231,0.12)' }}
        >
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
                <Brain className="w-4 h-4 text-white" />
              </div>
            </Link>
            <div className="w-px h-5" style={{ background: 'rgba(107,92,231,0.2)' }} />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#059669' }} />
              <h2 className="text-sm font-semibold" style={{ color: '#5A5A72' }}>
                Administrative Workspace &bull; <span style={{ color: '#1A1A2E' }}>{user.role.toUpperCase()}</span>
              </h2>
            </div>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(107,92,231,0.08)', border: '1px solid rgba(107,92,231,0.2)' }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6B5CE7', boxShadow: '0 0 6px rgba(107,92,231,0.5)' }} />
            <Sparkles size={13} style={{ color: '#6B5CE7' }} />
            <span className="text-sm font-semibold" style={{ color: '#6B5CE7' }}>RAG Engine Online</span>
          </div>
        </header>

        {/* Dynamic Admin Panel */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <AdminPanel activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
