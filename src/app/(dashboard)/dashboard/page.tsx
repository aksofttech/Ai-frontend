'use client';

import Link from 'next/link';
import {
  MessageSquare, BookOpen, FileText, LayoutDashboard,
  CheckCircle, Presentation, FilePenLine, GraduationCap,
  Sparkles, ArrowRight, Brain, Gamepad2, Mic,
} from 'lucide-react';

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
  },
  {
    id: 'gamified-quiz',
    href: '/teacher?tool=gamified-quiz',
    label: 'Quiz Generator',
    description: 'Instantly generate an interactive, gamified quiz for your students.',
    icon: Gamepad2,
    accent: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.08)',
  },
  {
    id: 'lesson',
    href: '/teacher?tool=lesson',
    label: 'AI Lesson Planner',
    description: 'Instantly generate comprehensive lesson plans tailored to your curriculum and period count.',
    icon: Brain,
    accent: '#059669',
    accentBg: 'rgba(5,150,105,0.08)',
  },
  {
    id: 'worksheet',
    href: '/teacher?tool=worksheet',
    label: 'Worksheet Engine',
    description: 'Create custom worksheets with MCQs, fill-in-the-blanks, true/false and short answers in seconds.',
    icon: FileText,
    accent: '#0284C7',
    accentBg: 'rgba(2,132,199,0.08)',
  },
  {
    id: 'custom-worksheet',
    href: '/teacher?tool=custom-worksheet',
    label: 'Custom Worksheet',
    description: 'Design fully customised worksheets with hand-picked question types and difficulty levels.',
    icon: LayoutDashboard,
    accent: '#D97706',
    accentBg: 'rgba(217,119,6,0.08)',
  },
  {
    id: 'answer-key',
    href: '/teacher?tool=answer-key',
    label: 'Answer Key Gen',
    description: 'Auto-generate accurate answer keys for any worksheet or test paper with one click.',
    icon: CheckCircle,
    accent: '#DC2626',
    accentBg: 'rgba(220,38,38,0.07)',
  },
  {
    id: 'ppt',
    href: '/teacher?tool=ppt',
    label: 'AI PPT Generator',
    description: 'Turn any chapter or topic into beautiful, ready-to-present slides with AI-crafted content.',
    icon: Presentation,
    accent: '#0891B2',
    accentBg: 'rgba(8,145,178,0.08)',
  },
  {
    id: 'test-paper',
    href: '/teacher?tool=test-paper',
    label: 'Test Paper Gen',
    description: 'Build structured exam papers with mixed question formats, marking schemes and difficulty control.',
    icon: FilePenLine,
    accent: '#9333EA',
    accentBg: 'rgba(147,51,234,0.08)',
  },
  {
    id: 'homework',
    href: '/teacher?tool=homework',
    label: 'AI Homework Gen',
    description: 'Generate differentiated homework assignments aligned to chapter objectives automatically.',
    icon: GraduationCap,
    accent: '#16A34A',
    accentBg: 'rgba(22,163,74,0.08)',
  },
  {
    id: 'oral-questions',
    href: '/teacher?tool=oral-questions',
    label: 'Oral Question Gen',
    description: 'Generate interactive oral drills, viva sheets, and rapid fire cards for classroom engagement.',
    icon: Mic,
    accent: '#EC4899',
    accentBg: 'rgba(236,72,153,0.08)',
  },
  {
    id: 'e-library',
    href: '/e-library',
    label: 'E-Library',
    description: 'Browse, search, and download textbook PDF documents and digital resources directly.',
    icon: BookOpen,
    accent: '#6B5CE7',
    accentBg: 'rgba(107,92,231,0.08)',
  },
];

/* ─── Component ─────────────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div
      className="h-full flex-1 min-h-0 overflow-y-auto custom-scrollbar"
      style={{ background: 'linear-gradient(135deg, #FFF5F0 0%, #F5F0FF 50%, #EDE8F5 100%)' }}
    >
      {/* ── Top nav bar ── */}
      <header
        className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(107,92,231,0.12)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
            YugSoft <span style={{ color: '#6B5CE7' }}>AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'rgba(107,92,231,0.08)', border: '1px solid rgba(107,92,231,0.2)' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#6B5CE7', boxShadow: '0 0 6px rgba(107,92,231,0.6)' }} />
          <Sparkles size={13} style={{ color: '#6B5CE7' }} />
          <span className="text-sm font-semibold" style={{ color: '#6B5CE7' }}>RAG Engine Active</span>
        </div>
      </header>

      {/* ── Page Heading ── */}
      <main className="px-8 pt-10 pb-20 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
            AI Tool Suite
          </h1>
          <p className="text-base" style={{ color: '#5A5A72' }}>
            Choose an AI tool to supercharge your teaching workflow.
          </p>
        </div>

        {/* ── Tool Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative flex flex-col p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  border: '1.5px solid rgba(107,92,231,0.12)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 2px 12px rgba(107,92,231,0.06)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(107,92,231,0.14)`;
                  e.currentTarget.style.borderColor = `rgba(107,92,231,0.3)`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(107,92,231,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(107,92,231,0.12)';
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
                    <h3 className="text-base font-bold mb-1.5" style={{ color: '#1A1A2E' }}>{tool.label}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>{tool.description}</p>
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
      </main>

      {/* ── Footer ── */}
      <footer className="text-center pb-8 text-xs" style={{ color: '#9CA3AF' }}>
        Yugsoft Tech — Enterprise Educational AI SaaS · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
