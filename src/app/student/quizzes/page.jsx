"use client";

import React, { useEffect, useState } from 'react';
import { Gamepad2, Calendar, Trophy, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function MyQuizzesPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/quiz/my-results');
        const data = res.data?.data || res.data || [];
        setResults(data);
      } catch (err) {
        console.error('Failed to fetch quiz results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-center gap-4 pb-6" style={{ borderBottom: '1px solid rgba(107,92,231,0.12)' }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(107,92,231,0.08)', border: '1px solid rgba(107,92,231,0.2)' }}
        >
          <Gamepad2 size={26} style={{ color: '#6B5CE7' }} />
        </div>
        <div>
          <h1 className="text-3xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>My Quizzes</h1>
          <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>View your past gamified quiz results and scores</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#6B5CE7' }} />
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Loading your history...</p>
        </div>
      ) : results.length === 0 ? (
        <div
          className="text-center py-20 rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px solid rgba(107,92,231,0.12)', backdropFilter: 'blur(16px)' }}
        >
          <Gamepad2 size={48} className="mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>No quizzes played yet</h3>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Go to Quiz Generator and play your first quiz!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((quiz) => (
            <div
              key={quiz.id}
              className="group p-6 rounded-2xl transition-all duration-300 relative overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: '1.5px solid rgba(107,92,231,0.12)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 2px 12px rgba(107,92,231,0.06)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,92,231,0.14)';
                e.currentTarget.style.borderColor = 'rgba(107,92,231,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(107,92,231,0.06)';
                e.currentTarget.style.borderColor = 'rgba(107,92,231,0.12)';
              }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold leading-snug line-clamp-2" style={{ color: '#1A1A2E' }}>
                  {quiz.title}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} style={{ color: '#6B5CE7' }} />
                  <span style={{ color: '#9CA3AF' }}>
                    {new Date(quiz.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>

                <div
                  className="flex items-center justify-between pt-3"
                  style={{ borderTop: '1px solid rgba(107,92,231,0.1)' }}
                >
                  <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Verified Score</span>
                  <div className="flex items-center gap-1.5">
                    <Trophy size={16} style={{ color: '#F97316' }} />
                    <span className="text-2xl font-black" style={{ color: '#6B5CE7' }}>{quiz.score}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
