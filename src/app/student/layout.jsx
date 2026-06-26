"use client";

import React, { useState } from 'react';
import StudentSidebar from '@/components/layout/StudentSidebar';
import { Menu, Brain } from 'lucide-react';

export default function StudentLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#FFF5F0 0%,#EDE8F5 100%)' }}
    >
      <StudentSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative flex flex-col">
        {/* Mobile Header */}
        <div
          className="md:hidden flex items-center justify-between p-4 sticky top-0 z-30"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(107,92,231,0.12)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-black" style={{ color: '#1A1A2E' }}>
              YugSoft <span style={{ color: '#6B5CE7' }}>Edu</span>
            </h1>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl transition-colors"
            style={{ background: 'rgba(107,92,231,0.08)', color: '#6B5CE7' }}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
