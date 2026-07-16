"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Cpu, Globe, ArrowRight, Sparkles, MessageSquare, SendHorizonal,
  Mail, Phone, MapPin, Link2, Code2, MessageCircle, BookOpen, FileText,
  Gamepad2, Presentation, GraduationCap, Shield, Zap, Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginPage from './(auth)/login/page';

/* ── Floating holo orb ── */
function Orb({ size = 200 }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none select-none"
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 35% 35%, rgba(200,180,255,0.95), rgba(107,92,231,0.65) 50%, rgba(80,50,200,0.25))',
        boxShadow: '0 0 60px 20px rgba(107,92,231,0.22), inset 0 0 40px rgba(255,255,255,0.22)',
        backdropFilter: 'blur(2px)',
      }}
    />
  );
}

/* ── Chat feature chip ── */
function Chip({ label }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
      style={{
        background: 'white',
        border: '1px solid rgba(107,92,231,0.15)',
        color: '#1A1A2E',
        boxShadow: '0 2px 8px rgba(107,92,231,0.08)',
      }}
    >
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#6B5CE7', opacity: 0.7 }} />
      <span style={{ color: '#1A1A2E' }}>{label}</span>
    </div>
  );
}

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);
  return <LoginPage />;
}

export function LandingPage() {
  const waveRef = useRef(null);
  const pageRef = useRef(null);

  /* ── Scroll-driven wave parallax ── */
  useEffect(() => {
    const container = pageRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

      // Wave moves up as you scroll down — parallax shift + path morph via CSS var
      if (waveRef.current) {
        const yShift = progress * 60; // max 60px upward shift
        const scaleX = 1 + progress * 0.08; // slight width expansion
        waveRef.current.style.transform = `translateY(-${yShift}px) scaleX(${scaleX})`;
        waveRef.current.style.opacity = `${0.08 + progress * 0.14}`;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={pageRef}
      className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col"
      style={{ background: 'linear-gradient(105deg, #FFF5F0 0%, #EDE8F5 100%)' }}
    >
      {/* ── Fixed decorative background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #d8d0f8 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #f5d0c8 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #c8c0f5 0%, transparent 70%)' }} />

        {/* ── Scroll-animated wave ── */}
        <div
          ref={waveRef}
          className="absolute bottom-0 left-0 w-full"
          style={{
            opacity: 0.08,
            transition: 'transform 0.1s linear, opacity 0.1s linear',
            transformOrigin: 'bottom center',
          }}
        >
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '320px', display: 'block' }}
          >
            {/* Back wave — slower, wider */}
            <path
              d="M0,160 C200,240 400,80 600,160 C800,240 1000,80 1200,160 C1320,200 1380,140 1440,160 L1440,320 L0,320 Z"
              fill="#8B7CF6"
              opacity="0.4"
            />
            {/* Mid wave */}
            <path
              d="M0,200 C180,140 360,260 540,200 C720,140 900,260 1080,200 C1260,140 1360,220 1440,200 L1440,320 L0,320 Z"
              fill="#6B5CE7"
              opacity="0.6"
            />
            {/* Front wave — fastest */}
            <path
              d="M0,240 C120,200 300,280 480,240 C660,200 840,280 1020,240 C1200,200 1340,260 1440,240 L1440,320 L0,320 Z"
              fill="#5040C8"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Second animated wave layer (CSS keyframe) */}
        <div
          className="absolute bottom-0 left-0 w-full animate-float-slow"
          style={{ opacity: 0.05, transformOrigin: 'bottom center' }}
        >
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ width: '100%', height: '200px', display: 'block' }}>
            <path d="M0,80 C360,160 720,0 1080,100 C1260,150 1360,60 1440,80 L1440,200 L0,200 Z" fill="#6B5CE7" />
          </svg>
        </div>
      </div>

      {/* ── Navigation ── */}
      <header
        className="z-50 w-full px-6 md:px-12 py-5 flex justify-between items-center sticky top-0"
        style={{ background: 'rgba(255,245,240,0.65)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(107,92,231,0.1)' }}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6B5CE7, #8B7CF6)' }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: '#1A1A2E' }}>
            YugSoft <span style={{ color: '#6B5CE7' }}>AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'About', 'Pricing'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-semibold tracking-widest uppercase transition-colors hover:opacity-70"
              style={{ color: '#5A5A72', letterSpacing: '0.1em' }}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="hidden md:block px-4 py-2 text-sm font-semibold rounded-full transition-all hover:opacity-70"
              style={{ color: '#1A1A2E' }}>Log In</button>
          </Link>
          <Link href="/signup">
            <button className="cs-btn-purple px-5 py-2 text-sm">Get Started →</button>
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10 flex-1 flex flex-col">

        {/* ── Hero ── */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 md:px-12 py-16 max-w-7xl mx-auto w-full">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start cs-shadow"
              style={{ background: 'rgba(107,92,231,0.08)', border: '1px solid rgba(107,92,231,0.2)' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#6B5CE7' }} />
              <span className="text-sm font-semibold" style={{ color: '#6B5CE7' }}>The Ultimate OS for Schools</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
              style={{ color: '#1A1A2E', fontFamily: 'Outfit, sans-serif' }}>
              CREATE UNIQUE<br />
              EXPERIENCE<br />
              <span style={{ color: '#6B5CE7' }}>EXPLORING AI</span>
            </h1>

            <p className="text-lg leading-relaxed max-w-md" style={{ color: '#5A5A72' }}>
              Revolutionize education with our intelligent AI suite. Generate lesson plans, craft
              worksheets, and automate grading — your reliable partner in delivering exceptional
              learning experiences.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link href="/login">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="cs-btn-primary px-8 py-3.5 text-base flex items-center gap-2 cursor-pointer">
                  Learn more <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="px-8 py-3.5 text-base font-semibold rounded-full transition-all cursor-pointer"
                  style={{ background: 'rgba(107,92,231,0.1)', color: '#6B5CE7', border: '1.5px solid rgba(107,92,231,0.3)' }}>
                  Start Free Trial
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT — Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="animate-float absolute -left-12 top-1/2 -translate-y-1/2 z-10">
              <Orb size={160} />
            </div>
            <div className="animate-float-delay absolute -top-8 right-4 z-20">
              <Orb size={60} />
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-30 w-full max-w-sm rounded-3xl overflow-hidden cs-shadow-lg"
              style={{
                background: '#E8E6F8',
                border: '1.5px solid rgba(107,92,231,0.2)',
                transform: 'perspective(1000px) rotateY(-3deg) rotateX(2deg)',
              }}
            >
              <div className="flex items-center gap-3 px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(107,92,231,0.12)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>YugSoft AI</p>
                  <p className="text-xs" style={{ color: '#6B5CE7' }}>● Our bot is active instantly</p>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex justify-end">
                  <div className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm font-medium text-white max-w-[85%]"
                    style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
                    How could you be useful in education?
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-3 px-1" style={{ color: '#5A5A72' }}>
                    Here is the list I can help you with:
                  </p>
                  <div className="space-y-2">
                    {['Lesson Plan Generation', 'Quiz & Worksheet Engine', 'Homework Automation', 'PPT & Test Paper Gen', 'Student Chat Assistant'].map((item) => (
                      <Chip key={item} label={item} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(107,92,231,0.15)' }}>
                  <MessageSquare className="w-4 h-4 shrink-0" style={{ color: '#9CA3AF' }} />
                  <span className="flex-1 text-sm" style={{ color: '#9CA3AF' }}>Ask a question...</span>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: '#6B5CE7' }}>
                    <SendHorizonal className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Feature Cards ── */}
        <section id="features" className="px-6 md:px-12 pb-20 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            <h2 className="text-center text-3xl md:text-4xl font-black mb-3"
              style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
              Everything an Educator Needs
            </h2>
            <p className="text-center text-base mb-12" style={{ color: '#9CA3AF' }}>
              Powerful AI tools designed exclusively for modern educators and institutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Brain, color: '#6B5CE7', bg: 'rgba(107,92,231,0.08)', title: 'AI Lesson Planner', desc: 'Instantly generate comprehensive, curriculum-aligned lesson plans tailored to your specific class and period count.' },
                { icon: Cpu, color: '#10b981', bg: 'rgba(16,185,129,0.08)', title: 'Worksheet Engine', desc: 'Create custom worksheets with MCQs, fill-in-the-blanks, true/false and short answers in seconds. Auto-generate answer keys.' },
                { icon: Globe, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', title: 'Global Accessibility', desc: 'Access your teaching tools from anywhere, fully synced and backed up on the cloud. Collaborate with other educators seamlessly.' },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <motion.div key={title} whileHover={{ y: -6 }}
                  className="rounded-2xl p-7 cs-card cs-shadow cursor-pointer group transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                    style={{ background: bg }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#1A1A2E' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Why Choose Us ── */}
        <section id="about" className="px-6 md:px-12 py-20 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(107,92,231,0.08)', border: '1px solid rgba(107,92,231,0.2)' }}>
                <Zap className="w-3.5 h-3.5" style={{ color: '#6B5CE7' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6B5CE7' }}>Why YugSoft AI</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6"
                style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
                Built for Real Classrooms,<br />
                <span style={{ color: '#6B5CE7' }}>Powered by Real AI</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#5A5A72' }}>
                YugSoft AI is not just another edtech tool. It's a full AI operating system for educational institutions — handling everything from curriculum planning to gamified student assessments, all in one intelligent platform.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'Enterprise-Grade Security', desc: 'Your data is encrypted, private, and never used to train external models.' },
                  { icon: Users, title: 'Multi-Role Support', desc: 'Separate dashboards for Admins, Teachers, and Students with role-specific AI tools.' },
                  { icon: Zap, title: 'RAG-Powered Intelligence', desc: 'Our Retrieval-Augmented Generation engine grounds every AI response in your actual textbooks.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(107,92,231,0.1)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(107,92,231,0.1)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#6B5CE7' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-0.5" style={{ color: '#1A1A2E' }}>{title}</h4>
                      <p className="text-xs leading-relaxed" style={{ color: '#5A5A72' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, label: 'Chat with Book', color: '#6B5CE7', bg: 'rgba(107,92,231,0.08)' },
                { icon: Gamepad2, label: 'Quiz Generator', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
                { icon: FileText, label: 'Worksheet Engine', color: '#0284C7', bg: 'rgba(2,132,199,0.08)' },
                { icon: Presentation, label: 'AI PPT Generator', color: '#0891B2', bg: 'rgba(8,145,178,0.08)' },
                { icon: GraduationCap, label: 'Homework Gen', color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
                { icon: Brain, label: 'Lesson Planner', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <motion.div key={label} whileHover={{ y: -4, scale: 1.02 }}
                  className="p-5 rounded-2xl flex flex-col items-center text-center gap-3 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(107,92,231,0.12)', backdropFilter: 'blur(16px)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <p className="text-xs font-bold" style={{ color: '#1A1A2E' }}>{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-6 md:px-12 pb-20 max-w-7xl mx-auto w-full">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-12 text-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #6B5CE7 0%, #8B7CF6 50%, #a78bfa 100%)' }}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4"
                style={{ fontFamily: 'Outfit,sans-serif' }}>
                Ready to Transform Your Classroom?
              </h2>
              <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
                Join 10,000+ educators already using YugSoft AI to save time, engage students, and deliver world-class education.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/signup">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 rounded-full font-bold text-base transition-all"
                    style={{ background: 'white', color: '#6B5CE7' }}>
                    Start Free Trial →
                  </motion.button>
                </Link>
                <Link href="/login">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 rounded-full font-bold text-base transition-all"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                    Log In
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════ */}
      {/* ── BIG DETAILED FOOTER ── */}
      {/* ══════════════════════════════════════════════ */}
      <footer
        className="relative z-10"
        style={{ background: 'linear-gradient(180deg, rgba(237,232,245,0.6) 0%, rgba(255,245,240,0.9) 100%)', borderTop: '1px solid rgba(107,92,231,0.15)' }}
      >
        {/* Decorative top wave */}
        <div className="w-full overflow-hidden" style={{ marginTop: '-2px' }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: '60px', display: 'block' }}>
            <path d="M0,40 C360,0 720,60 1080,30 C1260,15 1380,45 1440,40 L1440,0 L0,0 Z"
              fill="rgba(107,92,231,0.06)" />
          </svg>
        </div>

        {/* ── Main Footer Grid ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* ── Column 1: Brand ── */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
                  YugSoft <span style={{ color: '#6B5CE7' }}>AI</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#5A5A72' }}>
                The ultimate AI operating system for modern educational institutions — empowering educators worldwide with intelligent, curriculum-aligned tools that save time and inspire students.
              </p>

              {/* Social links */}
              <div className="flex gap-3 mb-6">
                {[
                  { icon: MessageCircle, href: '#', label: 'Twitter' },
                  { icon: Link2, href: '#', label: 'LinkedIn' },
                  { icon: Code2, href: '#', label: 'GitHub' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(107,92,231,0.1)', color: '#6B5CE7', border: '1px solid rgba(107,92,231,0.2)' }}
                    aria-label={label}>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-2">
                {['AI', 'EdTech', 'RAG', 'NLP', 'SaaS'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(107,92,231,0.08)', color: '#6B5CE7', border: '1px solid rgba(107,92,231,0.18)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Column 2: Product ── */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-5"
                style={{ color: '#1A1A2E', letterSpacing: '0.12em' }}>Product</h3>
              <ul className="space-y-3">
                {[
                  { label: 'AI Lesson Planner', href: '/teacher?tool=lesson' },
                  { label: 'Quiz Generator', href: '/teacher?tool=gamified-quiz' },
                  { label: 'Worksheet Engine', href: '/teacher?tool=worksheet' },
                  { label: 'PPT Generator', href: '/teacher?tool=ppt' },
                  { label: 'Answer Key Gen', href: '/teacher?tool=answer-key' },
                  { label: 'Test Paper Gen', href: '/teacher?tool=test-paper' },
                  { label: 'AI Homework Gen', href: '/teacher?tool=homework' },
                  { label: 'Student Dashboard', href: '/student' },
                  { label: 'Admin Portal', href: '/admin' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="text-sm transition-colors hover:opacity-70 flex items-center gap-2 group"
                      style={{ color: '#5A5A72' }}>
                      <span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: '#6B5CE7' }} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 3: Resources & Company ── */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-5"
                style={{ color: '#1A1A2E', letterSpacing: '0.12em' }}>Resources</h3>
              <ul className="space-y-3 mb-8">
                {[
                  { label: 'Documentation', href: '#' },
                  { label: 'API Reference', href: '#' },
                  { label: 'Help Center', href: '#' },
                  { label: 'Community Forum', href: '#' },
                  { label: 'Blog & Updates', href: '#' },
                  { label: 'Video Tutorials', href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-sm transition-colors hover:opacity-70"
                      style={{ color: '#5A5A72' }}>{label}</a>
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-black uppercase tracking-widest mb-4"
                style={{ color: '#1A1A2E', letterSpacing: '0.12em' }}>Company</h3>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', href: '#about' },
                  { label: 'Careers', href: '#' },
                  { label: 'Partners', href: '#' },
                  { label: 'Press Kit', href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-sm transition-colors hover:opacity-70"
                      style={{ color: '#5A5A72' }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 4: Contact & Newsletter ── */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-5"
                style={{ color: '#1A1A2E', letterSpacing: '0.12em' }}>Get in Touch</h3>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Mail, text: 'hello@yugsoft.com', href: 'mailto:hello@yugsoft.com' },
                  { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: MapPin, text: 'Bangalore, India 🇮🇳', href: '#' },
                ].map(({ icon: Icon, text, href }) => (
                  <a key={text} href={href}
                    className="flex items-center gap-3 text-sm transition-colors hover:opacity-70 group"
                    style={{ color: '#5A5A72' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(107,92,231,0.08)' }}>
                      <Icon className="w-4 h-4" style={{ color: '#6B5CE7' }} />
                    </div>
                    {text}
                  </a>
                ))}
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-sm font-bold mb-3" style={{ color: '#1A1A2E' }}>Stay Updated</h4>
                <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>
                  Get the latest AI education insights delivered to your inbox.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@school.edu"
                    className="cs-input flex-1 px-3 py-2.5 text-xs"
                    style={{ color: '#1A1A2E' }}
                  />
                  <button
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shrink-0 transition-all hover:opacity-90"
                    style={{ background: '#6B5CE7' }}
                  >
                    Join
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(107,92,231,0.1)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                  Trusted by
                </p>
                <div className="flex gap-3 flex-wrap">
                  {['CBSE', 'RBSE'].map((board) => (
                    <span key={board}
                      className="px-3 py-1 rounded-lg text-xs font-bold"
                      style={{ background: 'rgba(107,92,231,0.08)', color: '#6B5CE7', border: '1px solid rgba(107,92,231,0.2)' }}>
                      {board}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Mid Footer: Tag Bar ── */}
          <div
            className="mt-14 pt-8 pb-6 flex items-center justify-between flex-wrap gap-6"
            style={{ borderTop: '1px solid rgba(107,92,231,0.12)' }}
          >
            <div className="flex items-center gap-5">
              <div className="pr-5" style={{ borderRight: '1px solid rgba(107,92,231,0.2)' }}>
                <span className="text-xs font-black tracking-widest uppercase block" style={{ color: '#5A5A72' }}>LET'S WORK</span>
                <span className="text-xs font-black tracking-widest uppercase block" style={{ color: '#5A5A72' }}>TOGETHER</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Artificial Intelligence', 'Chat', 'Support', 'Education', 'Worksheets', 'Lesson Plans', '+'].map((tag) => (
                  <span key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all hover:opacity-70"
                    style={{ background: 'rgba(107,92,231,0.08)', color: '#6B5CE7', border: '1px solid rgba(107,92,231,0.18)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span
              className="text-2xl font-black tracking-[0.25em] uppercase"
              style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}
            >
              YUGSOFT
            </span>
          </div>

          {/* ── Bottom Bar ── */}
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-3 pt-5"
            style={{ borderTop: '1px solid rgba(107,92,231,0.1)' }}
          >
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              © {new Date().getFullYear()} YugSoft Tech Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a key={item} href="#"
                  className="text-xs transition-colors hover:opacity-70"
                  style={{ color: '#9CA3AF' }}>
                  {item}
                </a>
              ))}
            </div>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              Made with ♥ for Educators
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
