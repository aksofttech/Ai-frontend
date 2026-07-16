'use client';

import React, { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import useAuthStore from '@/store/authStore';
import { Brain } from 'lucide-react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="flex h-screen w-screen bg-cs-cream overflow-hidden font-sans">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative" style={{ background: 'linear-gradient(135deg, #FFF5F0 0%, #EDE8F5 100%)' }}>
        {children}
      </main>
    </div>
  );
}
