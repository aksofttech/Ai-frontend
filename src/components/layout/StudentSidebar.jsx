import React from 'react';
import Link from 'next/link';
import {
  Gamepad2, Trophy, LayoutDashboard, Settings,
  User, LogOut, X, Flame, BookOpen, Brain, FileText, Video
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';

const TOOLS = [
  { id: 'dashboard', href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', href: '/student/chat', label: 'Chat with Book', icon: BookOpen },
  { id: 'quiz-gen', href: '/student/quiz-gen', label: 'Quiz Generator', icon: Flame },
  { id: 'my-quizzes', href: '/student/quizzes', label: 'My Quizzes', icon: Gamepad2 },
  { id: 'homework', href: '/student/homework', label: 'My Homework', icon: FileText },
  { id: 'video-lectures', href: '/student/video-lectures', label: 'Video Lectures', icon: Video },
  { id: 'leaderboard', href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'settings', href: '/student/settings', label: 'Settings', icon: Settings },
];

export default function StudentSidebar({ isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const userRole = user?.role || 'student';
  const userEmail = user?.email || 'student@school.com';
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
        className={`fixed md:static inset-y-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-[250px] md:w-[250px] h-full flex flex-col z-50`}
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(107,92,231,0.15)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid rgba(107,92,231,0.1)' }}>
          <Link href="/student" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tight" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
              YugSoft <span style={{ color: '#6B5CE7' }}>Edu</span>
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

        {/* Section label */}
        <div className="px-4 pt-4 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
            Learning
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
          {TOOLS.map((tool) => {
            const isActive = pathname === tool.href || (pathname.startsWith(tool.href) && tool.href !== '/student');
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                onClick={() => { if (setIsMobileOpen) setIsMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium"
                style={isActive
                  ? { background: 'rgba(107,92,231,0.1)', color: '#6B5CE7', borderLeft: '3px solid #6B5CE7' }
                  : { color: '#5A5A72', borderLeft: '3px solid transparent' }
                }
              >
                <Icon size={16} style={isActive ? { color: '#6B5CE7' } : { color: '#9CA3AF' }} />
                {tool.label}
              </Link>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(107,92,231,0.1)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(107,92,231,0.05)', border: '1px solid rgba(107,92,231,0.12)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(107,92,231,0.12)', border: '1px solid rgba(107,92,231,0.3)' }}>
              <Flame size={15} style={{ color: '#6B5CE7' }} />
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
