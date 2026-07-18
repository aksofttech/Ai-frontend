import React from 'react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export const metadata = {
  title: 'YugSoft Admin',
  description: 'Administrative Workspace',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
