"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Flame, Trophy, Play, CheckCircle2, BookOpen, Loader2, Sparkles, Video } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  const studentName = user?.name || user?.email?.split('@')[0] || 'Student';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    quizzesCompleted: 0,
    totalPoints: 0,
    currentStreak: 0,
    recentScores: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      let serverData = [];
      let localData = [];

      try {
        const res = await api.get('/quiz/my-results');
        serverData = res.data?.data || res.data || [];
      } catch (err) {
        console.error('Failed to fetch server dashboard data', err);
      }

      try {
        const localStr = localStorage.getItem('my_quiz_history');
        if (localStr) {
          localData = JSON.parse(localStr);
        }
      } catch (err) {
        console.error('Failed to parse local quiz history', err);
      }

      // Merge server and local results uniquely
      const mergedMap = new Map();
      serverData.forEach((item) => {
        mergedMap.set(item.id || item.createdAt, item);
      });
      localData.forEach((item) => {
        if (!mergedMap.has(item.id) && !mergedMap.has(item.createdAt)) {
          mergedMap.set(item.id || item.createdAt, item);
        }
      });

      const combined = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const completed = combined.length;
      const points = combined.reduce((sum, quiz) => sum + (quiz.score || 0), 0);

      let streak = 0;
      if (combined.length > 0) {
        const uniqueDates = Array.from(new Set(combined.map(q => new Date(q.createdAt || Date.now()).toDateString())));
        streak = uniqueDates.length;
      }

      setStats({
        quizzesCompleted: completed,
        totalPoints: points,
        currentStreak: streak,
        recentScores: combined.slice(0, 5)
      });
      setLoading(false);
    };

    fetchDashboardData();
    window.addEventListener('focus', fetchDashboardData);
    return () => window.removeEventListener('focus', fetchDashboardData);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in pb-12 px-2">

      {/* ── Welcome Banner ── */}
      <div
        className="relative p-8 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(107,92,231,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1.5px solid rgba(107,92,231,0.18)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-[0.06]">
          <Gamepad2 size={120} style={{ color: '#6B5CE7' }} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} style={{ color: '#6B5CE7' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6B5CE7' }}>Student Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
            Welcome back, <span style={{ color: '#6B5CE7' }}>{studentName}</span>!
          </h1>
          <p className="text-base max-w-xl" style={{ color: '#5A5A72' }}>
            Ready to learn something new today? Keep up the great work and maintain your streak!
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#6B5CE7' }} />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Current Streak', value: `${stats.currentStreak} Days`, icon: Flame, accent: '#F97316', bg: 'rgba(249,115,22,0.08)' },
              { label: 'Total Points', value: stats.totalPoints.toLocaleString(), icon: Trophy, accent: '#6B5CE7', bg: 'rgba(107,92,231,0.08)' },
              { label: 'Quizzes Completed', value: stats.quizzesCompleted, icon: CheckCircle2, accent: '#059669', bg: 'rgba(5,150,105,0.08)' },
            ].map(({ label, value, icon: Icon, accent, bg }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4 }}
                className="flex items-center gap-5 p-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(107,92,231,0.12)', backdropFilter: 'blur(16px)', boxShadow: '0 2px 12px rgba(107,92,231,0.06)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: bg }}>
                  <Icon size={28} style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>{label}</p>
                  <h3 className="text-2xl font-black" style={{ color: '#1A1A2E' }}>{value}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Ready to Practice */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-xl font-black flex items-center gap-2" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
                <Gamepad2 size={20} style={{ color: '#6B5CE7' }} /> Ready to Practice?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div
                  className="p-6 rounded-2xl flex flex-col justify-between gap-4 transition-all cursor-pointer group"
                  style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(107,92,231,0.12)', backdropFilter: 'blur(16px)', boxShadow: '0 2px 12px rgba(107,92,231,0.06)' }}
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'rgba(107,92,231,0.08)' }}>
                      <Gamepad2 size={22} style={{ color: '#6B5CE7' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A2E' }}>Quiz Generator</h3>
                    <p className="text-sm mb-4" style={{ color: '#5A5A72' }}>Generate interactive gamified quizzes from your textbook chapters instantly.</p>
                  </div>
                  <button
                    onClick={() => router.push('/student/quiz-gen')}
                    className="cs-btn-purple w-full py-3 flex items-center justify-center gap-2 text-sm"
                  >
                    <Play size={16} fill="currentColor" /> Generate Quiz
                  </button>
                </div>

                <div
                  className="p-6 rounded-2xl flex flex-col justify-between gap-4 transition-all cursor-pointer group"
                  style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(107,92,231,0.12)', backdropFilter: 'blur(16px)', boxShadow: '0 2px 12px rgba(107,92,231,0.06)' }}
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'rgba(139,92,246,0.08)' }}>
                      <Video size={22} style={{ color: '#8B5CF6' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A2E' }}>Video Lectures</h3>
                    <p className="text-sm mb-4" style={{ color: '#5A5A72' }}>Watch interactive AI-curated video lessons and boost your conceptual understanding anytime.</p>
                  </div>
                  <button
                    onClick={() => router.push('/student/video-lectures')}
                    className="w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1.5px solid rgba(139,92,246,0.3)' }}
                  >
                    Watch Lectures
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Scores */}
            <div className="space-y-5">
              <h2 className="text-xl font-black flex items-center gap-2" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
                <Trophy size={20} style={{ color: '#F97316' }} /> Recent Scores
              </h2>
              <div
                className="p-5 rounded-2xl space-y-3"
                style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(107,92,231,0.12)', backdropFilter: 'blur(16px)' }}
              >
                {stats.recentScores.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(107,92,231,0.04)', border: '1px solid rgba(107,92,231,0.1)' }}
                  >
                    <div>
                      <h4 className="text-sm font-semibold line-clamp-1" style={{ color: '#1A1A2E' }}>{quiz.title}</h4>
                      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                        {new Date(quiz.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-lg font-black" style={{ color: '#059669' }}>{quiz.score}</span>
                      <span className="text-xs ml-0.5" style={{ color: '#9CA3AF' }}>pts</span>
                    </div>
                  </div>
                ))}

                {stats.recentScores.length === 0 && (
                  <p className="text-center text-sm py-6" style={{ color: '#9CA3AF' }}>No completed quizzes yet.</p>
                )}

                {stats.recentScores.length > 0 && (
                  <button
                    onClick={() => router.push('/student/quizzes')}
                    className="w-full mt-2 py-2 text-sm font-semibold transition-colors"
                    style={{ color: '#6B5CE7' }}
                  >
                    View All History →
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
