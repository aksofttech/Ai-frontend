'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare, BookOpen, FileText, LayoutDashboard,
  CheckCircle, Presentation, FilePenLine, GraduationCap,
  ArrowRight, Brain, Gamepad2, Mic, Video,
  Settings, LogOut, ChevronDown,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';

/* ─── Tool card definitions ─────────────────────────────────────── */
const TOOLS = [
  {
    id: 'chat',
    href: '/teacher?tool=chat',
    label: 'Chat with Book',
    description: 'Ask your AI assistant anything about a textbook chapter — get cited, contextual answers instantly.',
    icon: MessageSquare,
    accent: '#6B5CE7',
    accentBg: 'rgba(107,92,231,0.08)',
    category: 'resources',
  },
  {
    id: 'gamified-quiz',
    href: '/teacher?tool=gamified-quiz',
    label: 'Quiz Generator',
    description: 'Instantly generate an interactive, gamified quiz for your students.',
    icon: Gamepad2,
    accent: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.08)',
    category: 'assessment',
  },
  {
    id: 'lesson',
    href: '/teacher?tool=lesson',
    label: 'AI Lesson Planner',
    description: 'Instantly generate comprehensive lesson plans tailored to your curriculum and period count.',
    icon: Brain,
    accent: '#059669',
    accentBg: 'rgba(5,150,105,0.08)',
    category: 'teaching',
  },
  {
    id: 'worksheet',
    href: '/teacher?tool=worksheet',
    label: 'Worksheet Engine',
    description: 'Create custom worksheets with MCQs, fill-in-the-blanks, true/false and short answers in seconds.',
    icon: FileText,
    accent: '#0284C7',
    accentBg: 'rgba(2,132,199,0.08)',
    category: 'assessment',
  },
  {
    id: 'custom-worksheet',
    href: '/teacher?tool=custom-worksheet',
    label: 'Custom Worksheet',
    description: 'Design fully customised worksheets with hand-picked question types and difficulty levels.',
    icon: LayoutDashboard,
    accent: '#D97706',
    accentBg: 'rgba(217,119,6,0.08)',
    category: 'assessment',
  },
  {
    id: 'answer-key',
    href: '/teacher?tool=answer-key',
    label: 'Answer Key Gen',
    description: 'Auto-generate accurate answer keys for any worksheet or test paper with one click.',
    icon: CheckCircle,
    accent: '#DC2626',
    accentBg: 'rgba(220,38,38,0.07)',
    category: 'assessment',
  },
  {
    id: 'ppt',
    href: '/teacher?tool=ppt',
    label: 'AI PPT Generator',
    description: 'Turn any chapter or topic into beautiful, ready-to-present slides with AI-crafted content.',
    icon: Presentation,
    accent: '#0891B2',
    accentBg: 'rgba(8,145,178,0.08)',
    category: 'teaching',
  },
  {
    id: 'test-paper',
    href: '/teacher?tool=test-paper',
    label: 'Test Paper Gen',
    description: 'Build structured exam papers with mixed question formats, marking schemes and difficulty control.',
    icon: FilePenLine,
    accent: '#9333EA',
    accentBg: 'rgba(147,51,234,0.08)',
    category: 'assessment',
  },
  {
    id: 'homework',
    href: '/teacher?tool=homework',
    label: 'AI Homework Gen',
    description: 'Generate differentiated homework assignments aligned to chapter objectives automatically.',
    icon: GraduationCap,
    accent: '#16A34A',
    accentBg: 'rgba(22,163,74,0.08)',
    category: 'teaching',
  },
  {
    id: 'oral-questions',
    href: '/teacher?tool=oral-questions',
    label: 'Oral Question Gen',
    description: 'Generate interactive oral drills, viva sheets, and rapid fire cards for classroom engagement.',
    icon: Mic,
    accent: '#EC4899',
    accentBg: 'rgba(236,72,153,0.08)',
    category: 'assessment',
  },
  {
    id: 'video-lectures',
    href: '/teacher?tool=video-lectures',
    label: 'Video Lectures',
    description: 'Watch distraction-free, ad-free video lectures directly matched to your chapters.',
    icon: Video,
    accent: '#6B5CE7',
    accentBg: 'rgba(107,92,231,0.08)',
    category: 'resources',
  },
  {
    id: 'e-library',
    href: '/e-library',
    label: 'E-Library',
    description: 'Browse, search, and download textbook PDF documents and digital resources directly.',
    icon: BookOpen,
    accent: '#6B5CE7',
    accentBg: 'rgba(107,92,231,0.08)',
    category: 'resources',
  },
];

const CATEGORIES = [
  {
    id: 'resources',
    title: 'Digital Resources Features',
    description: 'Enrich classroom learning with digital books, video lectures, and resource libraries.',
    icon: BookOpen,
    color: '#0891B2',
    bgLight: 'rgba(8,145,178,0.06)',
  },
  {
    id: 'teaching',
    title: 'Teaching & Preparation Tools / Features',
    description: 'Empower your instruction with lesson plans, presentations, and automated homework generation.',
    icon: Presentation,
    color: '#6B5CE7',
    bgLight: 'rgba(107,92,231,0.06)',
  },
  {
    id: 'assessment',
    title: 'Assessment & Testing Features',
    description: 'Evaluate understanding with quizzes, custom worksheets, test papers, and oral drills.',
    icon: CheckCircle,
    color: '#9333EA',
    bgLight: 'rgba(147,51,234,0.06)',
  }
];

/* ─── Component ─────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, userRole: storedRole, fetchProfile, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { darkMode, toggleDarkMode, syncTheme } = useThemeStore();

  useEffect(() => {
    syncTheme();
  }, [syncTheme]);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userRole = isMounted ? (storedRole || user?.role || 'teacher') : 'teacher';
  const userEmail = isMounted ? (user?.email || 'admin@yugsoft.com') : 'admin@yugsoft.com';
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  const displayEmail = userEmail.split('@')[0];
  const initial = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div
      className="h-full flex-1 min-h-0 overflow-y-auto custom-scrollbar relative transition-colors duration-300"
      style={{
        background: darkMode
          ? 'linear-gradient(135deg, #0A071E 0%, #120E2E 50%, #19143B 100%)'
          : 'linear-gradient(135deg, #FFF5F0 0%, #F5F0FF 50%, #EDE8F5 100%)',
      }}
    >
      {/* ── Top nav bar ── */}
      <header
        className="flex items-center justify-between px-8 py-4 sticky top-0 z-10 transition-colors duration-300"
        style={{
          background: darkMode ? 'rgba(10, 7, 30, 0.7)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: darkMode ? '1px solid rgba(107,92,231,0.2)' : '1px solid rgba(107,92,231,0.12)',
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight" style={{ color: darkMode ? '#F3F4F6' : '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
            YugSoft <span style={{ color: '#6B5CE7' }}>AI</span>
          </span>
        </Link>

        {/* Profile and Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2.5 p-1.5 rounded-full transition-colors cursor-pointer ${
              darkMode ? 'hover:bg-gray-805' : 'hover:bg-gray-100/50'
            }`}
            style={{
              border: darkMode ? '1px solid rgba(107,92,231,0.3)' : '1px solid rgba(107,92,231,0.15)',
              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
              {initial}
            </div>
            <span className={`text-sm font-semibold hidden md:inline-block pr-1 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {displayEmail}
            </span>
            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay to close the dropdown when clicking outside */}
              <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
              
              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl z-30 py-2 border animate-in fade-in slide-in-from-top-2 duration-200 ${
                  darkMode ? 'border-gray-800' : 'border-gray-100'
                }`}
                style={{
                  background: darkMode ? 'rgba(18, 14, 46, 0.95)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className={`px-4 py-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                  <p className={`text-sm font-bold truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{userEmail}</p>
                  <p className="text-xs font-medium text-purple-600 mt-0.5">{displayRole}</p>
                </div>
                
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setSettingsModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      darkMode
                        ? 'text-gray-300 hover:bg-purple-950/40 hover:text-purple-400'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    <Settings size={16} className="text-gray-500 group-hover:text-purple-700" />
                    Account Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Page Heading ── */}
      <main className="px-8 pt-10 pb-20 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2" style={{ color: darkMode ? '#FFFFFF' : '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
            AI Tool Suite
          </h1>
          <p className="text-base" style={{ color: darkMode ? '#9CA3AF' : '#5A5A72' }}>
            Choose an AI tool to supercharge your teaching workflow.
          </p>
        </div>

        {/* ── Grouped Tool Sections ── */}
        <div className="space-y-12">
          {CATEGORIES.map((category) => {
            const categoryTools = TOOLS.filter((t) => t.category === category.id);
            const CategoryIcon = category.icon;
            
            return (
              <section key={category.id} className="space-y-6">
                {/* Section Header */}
                <div className={`flex items-center gap-3 pb-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200/60'}`}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ background: category.bgLight, border: darkMode ? `1px solid ${category.color}40` : `1px solid ${category.color}20` }}
                  >
                    <CategoryIcon size={20} style={{ color: category.color }} />
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight" style={{ color: darkMode ? '#F3F4F6' : '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
                    {category.title}
                  </h2>
                </div>

                {/* Tool Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categoryTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="group relative flex flex-col p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                        style={{
                          background: darkMode ? 'rgba(20, 15, 45, 0.55)' : 'rgba(255,255,255,0.75)',
                          border: darkMode ? '1.5px solid rgba(107,92,231,0.2)' : '1.5px solid rgba(107,92,231,0.12)',
                          backdropFilter: 'blur(16px)',
                          boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(107,92,231,0.06)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = darkMode ? `0 8px 32px rgba(107,92,231,0.25)` : `0 8px 32px rgba(107,92,231,0.14)`;
                          e.currentTarget.style.borderColor = `rgba(107,92,231,0.4)`;
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(107,92,231,0.06)';
                          e.currentTarget.style.borderColor = darkMode ? 'rgba(107,92,231,0.2)' : 'rgba(107,92,231,0.12)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div className="flex flex-col items-center text-center gap-4">
                          {/* Icon */}
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                            style={{ background: tool.accentBg }}
                          >
                            <Icon size={26} style={{ color: tool.accent }} />
                          </div>

                          {/* Text */}
                          <div>
                            <h3 className="text-base font-bold mb-1.5" style={{ color: darkMode ? '#F3F4F6' : '#1A1A2E' }}>{tool.label}</h3>
                            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tool.description}</p>
                          </div>

                          {/* CTA */}
                          <div
                            className="flex items-center gap-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                            style={{ color: tool.accent }}
                          >
                            Open tool <ArrowRight size={12} />
                          </div>
                        </div>

                        {/* Accent dot */}
                        <div
                          className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-30 group-hover:opacity-80 transition-opacity"
                          style={{ background: tool.accent }}
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="text-center pb-8 text-xs transition-colors duration-300" style={{ color: darkMode ? '#5A5A72' : '#9CA3AF' }}>
        Yugsoft Tech — Enterprise Educational AI SaaS · {new Date().getFullYear()}
      </footer>

      {/* Account Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSettingsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div
            className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl z-10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 ${
              darkMode ? 'border-gray-800 border' : 'border-purple-100 border'
            }`}
            style={{
              background: darkMode ? 'rgba(18, 14, 46, 0.98)' : 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(30px)',
            }}
          >
            <div className={`flex justify-between items-center pb-2 border-b ${darkMode ? 'border-gray-800' : 'border-purple-50'}`}>
              <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`} style={{ fontFamily: 'Outfit,sans-serif' }}>
                <Settings size={20} className="text-purple-600 animate-spin-slow" />
                Account Settings
              </h2>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className={`transition-colors p-1.5 rounded-lg ${
                  darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="text"
                  disabled
                  value={userEmail}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-medium ${
                    darkMode
                      ? 'bg-gray-900/60 border-gray-800 text-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label>
                <input
                  type="text"
                  disabled
                  value={displayRole}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-medium ${
                    darkMode
                      ? 'bg-gray-900/60 border-gray-800 text-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                />
              </div>


            </div>

            <div className={`flex justify-end gap-3 pt-3 border-t ${darkMode ? 'border-gray-800' : 'border-purple-50'}`}>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Settings saved successfully!");
                  setSettingsModalOpen(false);
                }}
                className="px-5 py-2 text-sm font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
