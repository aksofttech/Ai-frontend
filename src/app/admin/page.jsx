"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import AdminPanel from '@/components/features/AdminPanel';
import { Sparkles, ShieldAlert, Brain } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={null}>
      <AdminDashboardInner />
    </Suspense>
  );
}

function AdminDashboardInner() {
  const { user, userRole, isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab('overview');
    }
  }, [tabFromUrl]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isLoading) return; // Block premature redirection while reading from localStorage & initializing

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const resolvedRole = userRole || user?.role;
    if (resolvedRole !== 'admin') {
      router.push('/teacher');
    }
  }, [isLoading, isAuthenticated, user, userRole, router]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const resolvedRole = userRole || user?.role;

  if (isLoading && !resolvedRole) {
    return null;
  }

  if (!isAuthenticated || (!user && !resolvedRole)) {
    return null;
  }

  if (resolvedRole !== 'admin') {
    return (
      <div
        className="h-full w-full flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'transparent' }}
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
        {/* Dynamic Admin Panel */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <AdminPanel activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
