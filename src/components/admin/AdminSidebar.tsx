'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, BookOpen, FileText, Users, LogOut } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export default function AdminSidebar() {
  return (
    <Suspense fallback={<aside className="w-64 h-full bg-white/85 backdrop-blur-md border-r border-purple-200/70 shrink-0" />}>
      <AdminSidebarInner />
    </Suspense>
  );
}

function AdminSidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get('tab');
  const { user, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userEmail = (isMounted && user?.email) ? user.email : 'admin@yugsoft.com';
  const displayEmail = userEmail.split('@')[0];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Curriculum Canvas', href: '/admin?tab=curriculum', icon: BookOpen, tab: 'curriculum' },
    { label: 'Books Table View', href: '/admin/curriculum', icon: FileText },
    { label: 'User Directory', href: '/admin?tab=users', icon: Users, tab: 'users' },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-white/85 backdrop-blur-md border-r border-purple-200/70 font-sans shrink-0 shadow-xs z-10">
      {/* Logo Section */}
      <div className="p-6 pb-8">
        <h1 className="text-2xl font-black flex items-center gap-2 tracking-tight">
          <span className="text-[#6B5CE7]">YugSoft</span>
          <span className="text-cs-dark">Admin</span>
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4">
        <div className="text-[10px] uppercase tracking-wider text-cs-gray font-bold mb-4 px-2">
          Administration
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.tab
              ? pathname === '/admin' && activeTab === item.tab
              : item.exact
              ? pathname === '/admin' && !activeTab
              : pathname === item.href || (item.href !== '/admin' && !item.tab && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#6B5CE7] text-white font-extrabold shadow-md shadow-[#6B5CE7]/30'
                    : 'text-cs-gray hover:text-cs-dark hover:bg-purple-50 font-bold'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-[#6B5CE7]'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-purple-100">
        <div className="bg-purple-50/70 rounded-xl p-3 border border-purple-100 mb-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center border border-purple-200">
            <Users size={14} className="text-[#6B5CE7]" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-cs-dark truncate">{displayEmail}</div>
            <div className="text-[10px] text-[#6B5CE7] font-black">ADMIN</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200 text-xs font-bold cursor-pointer"
        >
          <LogOut size={14} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
