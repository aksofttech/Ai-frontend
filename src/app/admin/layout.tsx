import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Yugsoft Admin',
  description: 'Administrative Workspace',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-cs-cream overflow-hidden font-sans">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative" style={{ background: 'linear-gradient(135deg, #FFF5F0 0%, #EDE8F5 100%)' }}>
        {children}
      </main>
    </div>
  );
}
