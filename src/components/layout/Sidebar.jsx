import React from 'react';
import Link from 'next/link';
import {
  MessageSquare, BookOpen, FileText, LayoutDashboard,
  CheckCircle, Presentation, FilePenLine, User, LogOut, X, Gamepad2, Brain
} from 'lucide-react';
import useAuthStore from '@/store/authStore';

const TOOLS = [
  { id: 'chat', label: 'Chat with Book', icon: MessageSquare },
  { id: 'gamified-quiz', label: 'Quiz Generator', icon: Gamepad2 },
  { id: 'lesson', label: 'AI Lesson Plan', icon: BookOpen },
  { id: 'worksheet', label: 'Worksheet Gen', icon: FileText },
  { id: 'custom-worksheet', label: 'Custom Worksheet', icon: LayoutDashboard },
  { id: 'answer-key', label: 'Answer Key Gen', icon: CheckCircle },
  { id: 'ppt', label: 'AI PPT Gen', icon: Presentation },
  { id: 'test-paper', label: 'Test Paper Gen', icon: FilePenLine },
  { id: 'homework', label: 'AI Homework Gen', icon: BookOpen },
];

export default function Sidebar({ activeTool, setActiveTool, isMobileOpen, setIsMobileOpen }) {
  const { user, logout } = useAuthStore();
  const userRole = user?.role || 'teacher';
  const userEmail = user?.email || 'admin@yugsoft.com';
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  const displayEmail = userEmail.split('@')[0];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-sm z-40 transition-opacity"
          style={{ background: 'rgba(26,26,46,0.3)' }}
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <div
        className={`fixed md:static inset-y-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-[250px] md:w-[250px] h-full flex flex-col z-50 custom-scrollbar`}
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(107,92,231,0.15)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid rgba(107,92,231,0.1)' }}>
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tight" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
              YugSoft <span style={{ color: '#6B5CE7' }}>AI</span>
            </h1>
          </Link>
          <button
            className="md:hidden transition-colors"
            style={{ color: '#5A5A72' }}
            onClick={() => setIsMobileOpen?.(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-4 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
            AI Tools
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
          {TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${isActive ? '' : ''}`}
                style={isActive
                  ? { background: 'rgba(107,92,231,0.1)', color: '#6B5CE7', borderLeft: '3px solid #6B5CE7' }
                  : { color: '#5A5A72', borderLeft: '3px solid transparent' }
                }
              >
                <Icon size={16} style={isActive ? { color: '#6B5CE7' } : { color: '#9CA3AF' }} />
                {tool.label}
              </button>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(107,92,231,0.1)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(107,92,231,0.05)', border: '1px solid rgba(107,92,231,0.12)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(107,92,231,0.12)', border: '1px solid rgba(107,92,231,0.3)' }}>
              <User size={15} style={{ color: '#6B5CE7' }} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold max-w-[140px] truncate" style={{ color: '#1A1A2E' }}>{displayEmail}</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{displayRole}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(239,68,68,0.06)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <LogOut size={15} />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
