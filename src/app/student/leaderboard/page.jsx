"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Flame, Crown, Award, Loader2, User, Sparkles, CheckCircle2, ChevronUp } from 'lucide-react';
import api from '@/services/api';
import useAuthStore from '@/store/authStore';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const currentUserName = user?.name || user?.email?.split('@')[0] || 'You';
  const currentUserId = user?.id || 'current-user';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      let data = [];
      try {
        const res = await api.get('/quiz/leaderboard');
        const rawData = res.data?.data || res.data || [];
        data = rawData.filter(item => {
          const nameLower = (item.name || '').toLowerCase();
          if (nameLower === 'teacher' || nameLower.includes('admin') || nameLower.includes('teacher')) return false;
          if (item.role && item.role !== 'student') return false;
          return true;
        });
      } catch (err) {
        console.error('Failed to fetch backend leaderboard, loading fallback competitors', err);
      }

      // Check local storage history for current user to ensure their recent points are reflected
      let myLocalScore = 0;
      let myLocalQuizzes = 0;
      try {
        const localStr = localStorage.getItem('my_quiz_history');
        if (localStr) {
          const localList = JSON.parse(localStr);
          myLocalQuizzes = localList.length;
          myLocalScore = localList.reduce((acc, q) => acc + (q.score || 0), 0);
        }
      } catch (e) {}

      // Ensure current user is on leaderboard ONLY if their role is strictly 'student' and username is not teacher/admin
      const nameLower = currentUserName.toLowerCase();
      const isStudentRole = user?.role === 'student' && nameLower !== 'teacher' && !nameLower.includes('teacher') && !nameLower.includes('admin');
      if (isStudentRole && (myLocalScore > 0 || user)) {
        const existingIdx = data.findIndex(item => item.userId === currentUserId || item.name === currentUserName || item.name === currentUserName + ' (You)');
        if (existingIdx !== -1) {
          if (myLocalScore > (data[existingIdx].score || 0)) {
            data[existingIdx].score = myLocalScore;
            data[existingIdx].quizzesPlayed = Math.max(data[existingIdx].quizzesPlayed || 0, myLocalQuizzes);
          }
        } else if (myLocalScore > 0 || user) {
          data.push({
            rank: data.length + 1,
            userId: currentUserId,
            name: currentUserName + ' (You)',
            role: 'student',
            score: myLocalScore,
            quizzesPlayed: myLocalQuizzes,
            badge: 'Explorer',
            isCurrentUser: true,
          });
        }
      }

      // Re-sort descending by score
      data.sort((a, b) => (b.score || 0) - (a.score || 0));
      data.forEach((item, idx) => {
        item.rank = idx + 1;
        item.badge = idx === 0 && (item.score || 0) > 0 ? '🏆 Champion' : idx === 1 && (item.score || 0) > 0 ? '🥈 Master' : idx === 2 && (item.score || 0) > 0 ? '🥉 Pro' : 'Explorer';
        if (item.userId === currentUserId || (item.name && item.name.includes('(You)'))) {
          item.isCurrentUser = true;
        }
      });

      setLeaderboard(data);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [user]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-fade-in px-2">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6" style={{ borderBottom: '1px solid rgba(107,92,231,0.12)' }}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.1))', border: '1.5px solid rgba(249,115,22,0.3)' }}
          >
            <Trophy size={28} style={{ color: '#F97316' }} />
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>Global Student Leaderboard</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Live rankings of students across all schools based on verified gamified quiz points</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold shadow-xs">
          <Flame size={16} className="animate-pulse text-orange-500" /> Live Rankings Updated Instantly
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#6B5CE7' }} />
          <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Calculating global rankings & XP points...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div
          className="text-center py-20 rounded-3xl p-8 space-y-4 max-w-lg mx-auto"
          style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(107,92,231,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(107,92,231,0.06)' }}
        >
          <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.1)' }}>
            <Trophy size={40} style={{ color: '#F97316' }} />
          </div>
          <h3 className="text-2xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>No Live Rankings Yet</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>
            No student has scored points on the global leaderboard yet! Be the first to complete a gamified chapter quiz and immediately claim the #1 Global Champion position!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
              {/* Rank 2 (Left) */}
              {top3[1] && (
                <div
                  className="p-6 rounded-3xl text-center relative overflow-hidden transition-all duration-300 md:order-1"
                  style={{
                    background: top3[1].isCurrentUser ? 'linear-gradient(180deg, rgba(107,92,231,0.12), rgba(255,255,255,0.9))' : 'rgba(255,255,255,0.85)',
                    border: top3[1].isCurrentUser ? '2px solid #6B5CE7' : '1.5px solid rgba(156,163,175,0.4)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-gray-100 border-2 border-gray-300 shadow-sm relative">
                    <Medal size={28} className="text-gray-500" />
                    <span className="absolute -bottom-2 bg-gray-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full">#2</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 truncate">{top3[1].name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{top3[1].quizzesPlayed} Quizzes Played</p>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 font-black text-lg">
                    <Trophy size={16} className="text-orange-500" /> {top3[1].score} <span className="text-xs font-normal text-gray-500">XP</span>
                  </div>
                </div>
              )}

              {/* Rank 1 (Center - Tallest) */}
              {top3[0] && (
                <div
                  className="p-8 rounded-3xl text-center relative overflow-hidden transition-all duration-300 md:order-2 md:-translate-y-4 shadow-xl"
                  style={{
                    background: top3[0].isCurrentUser ? 'linear-gradient(180deg, rgba(245,158,11,0.2), rgba(255,255,255,0.95))' : 'linear-gradient(180deg, rgba(254,243,199,0.7), rgba(255,255,255,0.95))',
                    border: '2px solid #F59E0B',
                    boxShadow: '0 16px 40px rgba(245,158,11,0.2)',
                  }}
                >
                  <div className="absolute top-3 right-3">
                    <Crown size={24} className="text-amber-500 animate-bounce" />
                  </div>
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center bg-amber-100 border-4 border-amber-400 shadow-md relative">
                    <Trophy size={36} className="text-amber-500" />
                    <span className="absolute -bottom-2 bg-amber-500 text-white text-xs font-black px-3 py-0.5 rounded-full shadow-xs">#1</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Global Champion</span>
                  <h3 className="text-xl font-black text-gray-900 truncate mt-0.5">{top3[0].name}</h3>
                  <p className="text-xs text-gray-500 mb-5">{top3[0].quizzesPlayed} Quizzes Played</p>
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500 text-white font-black text-xl shadow-md">
                    <Sparkles size={18} /> {top3[0].score} <span className="text-xs font-bold opacity-90">XP</span>
                  </div>
                </div>
              )}

              {/* Rank 3 (Right) */}
              {top3[2] && (
                <div
                  className="p-6 rounded-3xl text-center relative overflow-hidden transition-all duration-300 md:order-3"
                  style={{
                    background: top3[2].isCurrentUser ? 'linear-gradient(180deg, rgba(107,92,231,0.12), rgba(255,255,255,0.9))' : 'rgba(255,255,255,0.85)',
                    border: top3[2].isCurrentUser ? '2px solid #6B5CE7' : '1.5px solid rgba(217,119,6,0.3)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-amber-50 border-2 border-amber-600 shadow-sm relative">
                    <Award size={28} className="text-amber-700" />
                    <span className="absolute -bottom-2 bg-amber-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full">#3</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 truncate">{top3[2].name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{top3[2].quizzesPlayed} Quizzes Played</p>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 font-black text-lg">
                    <Trophy size={16} className="text-amber-600" /> {top3[2].score} <span className="text-xs font-normal text-gray-500">XP</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Rankings Table List */}
          <div
            className="rounded-3xl overflow-hidden shadow-xs"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.15)', backdropFilter: 'blur(16px)' }}
          >
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(107,92,231,0.1)' }}>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Medal size={20} className="text-purple-600" /> All Student Rankings
              </h3>
              <span className="text-xs text-gray-500 font-semibold">{leaderboard.length} Students Ranked</span>
            </div>

            <div className="divide-y divide-gray-100">
              {leaderboard.map((student) => (
                <div
                  key={student.userId || student.rank}
                  className={`flex items-center justify-between p-4 md:px-6 transition-colors ${
                    student.isCurrentUser ? 'bg-purple-50 border-l-4 border-purple-600' : 'hover:bg-gray-50/80'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank number or icon */}
                    <div className="w-8 text-center shrink-0">
                      {student.rank === 1 ? (
                        <span className="text-lg font-black text-amber-500">🥇</span>
                      ) : student.rank === 2 ? (
                        <span className="text-lg font-black text-gray-400">🥈</span>
                      ) : student.rank === 3 ? (
                        <span className="text-lg font-black text-amber-700">🥉</span>
                      ) : (
                        <span className="text-sm font-bold text-gray-400">#{student.rank}</span>
                      )}
                    </div>

                    {/* Avatar and Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-xs"
                        style={{
                          background: student.isCurrentUser ? '#6B5CE7' : 'rgba(107,92,231,0.1)',
                          color: student.isCurrentUser ? '#ffffff' : '#6B5CE7',
                        }}
                      >
                        {student.name ? student.name.charAt(0).toUpperCase() : <User size={18} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            {student.name}
                          </h4>
                          {student.isCurrentUser && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {student.quizzesPlayed || 1} {student.quizzesPlayed === 1 ? 'quiz' : 'quizzes'} completed • {student.badge}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 text-right shrink-0">
                    <span className="text-lg md:text-xl font-black text-purple-600">
                      {(student.score || 0).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-gray-400">XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
