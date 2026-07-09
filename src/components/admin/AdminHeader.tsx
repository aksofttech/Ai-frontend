'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
}

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Overview', href: '/admin' },
    { name: 'Curriculum Manager', href: '/admin/curriculum' },
    { name: 'User Directory', href: '/admin/users' },
  ];

  return (
    <>
      {/* Top Indicators */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-cs-gray">
          <div className="w-2 h-2 rounded-full bg-emerald-green"></div>
          Administrative Workspace • ADMIN
        </div>
      </div>

      {/* Header Area */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2 bg-linear-to-r from-[#6B5CE7] to-blue-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-sm text-cs-gray font-semibold">
            {description}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 transition-colors text-sm font-bold text-[#6B5CE7] shadow-2xs cursor-pointer">
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-purple-200/60 mb-8">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-3 text-sm transition-colors relative ${
                isActive ? 'text-[#6B5CE7] font-extrabold' : 'text-cs-gray hover:text-cs-dark font-semibold'
              }`}
            >
              {tab.name}
              {isActive && (
                <div className="absolute -bottom-px left-0 w-full h-[2.5px] bg-[#6B5CE7] rounded-t-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
