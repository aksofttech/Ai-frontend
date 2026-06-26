import React from 'react';
import { Sparkles, Menu } from 'lucide-react';

export default function TopHeader({ toggleSidebar }) {
  return (
    <header
      data-id="top-header"
      className="h-[64px] shrink-0 w-full flex items-center justify-between md:justify-end px-4 md:px-6 z-20"
      style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(107,92,231,0.1)' }}
    >
      {/* Mobile Menu Button */}
      {toggleSidebar && (
        <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 transition-colors" style={{ color: '#5A5A72' }}>
          <Menu size={22} />
        </button>
      )}

      {/* RAG Engine Status */}
      <div
        className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full"
        style={{ background: 'rgba(107,92,231,0.08)', border: '1px solid rgba(107,92,231,0.2)' }}
      >
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6B5CE7', boxShadow: '0 0 6px rgba(107,92,231,0.6)' }} />
        <Sparkles size={13} style={{ color: '#6B5CE7' }} />
        <span className="text-xs md:text-sm font-semibold hidden sm:inline" style={{ color: '#6B5CE7' }}>RAG Engine Active</span>
        <span className="text-xs font-semibold sm:hidden" style={{ color: '#6B5CE7' }}>RAG Active</span>
      </div>
    </header>
  );
}
