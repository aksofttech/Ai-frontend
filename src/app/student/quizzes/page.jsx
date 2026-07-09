"use client";

import React, { useEffect, useState } from 'react';
import { Gamepad2, Calendar, Trophy, Loader2, CheckCircle2, XCircle, ChevronRight, X, Sparkles, HelpCircle } from 'lucide-react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export default function MyQuizzesPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      let serverData = [];
      let localData = [];

      try {
        const res = await api.get('/quiz/my-results');
        serverData = res.data?.data || res.data || [];
      } catch (err) {
        console.error('Failed to fetch server quiz results', err);
      }

      try {
        const localStr = localStorage.getItem('my_quiz_history');
        if (localStr) {
          localData = JSON.parse(localStr);
        }
      } catch (err) {
        console.error('Failed to parse local quiz history', err);
      }

      // Merge server and local results, avoiding duplicates by id or timestamp
      const mergedMap = new Map();
      
      serverData.forEach((item) => {
        mergedMap.set(item.id || item.createdAt, {
          ...item,
          correctCount: item.correctCount ?? Math.round((item.score || 0) / 10),
          totalQuestions: item.totalQuestions ?? 10,
        });
      });

      localData.forEach((item) => {
        if (!mergedMap.has(item.id) && !mergedMap.has(item.createdAt)) {
          mergedMap.set(item.id || item.createdAt, item);
        } else {
          // If server data exists, enrich it with local question review details if available
          const existing = mergedMap.get(item.id || item.createdAt);
          if (!existing.questions && item.questions) {
            mergedMap.set(item.id || item.createdAt, { ...existing, ...item });
          }
        }
      });

      const mergedList = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      setResults(mergedList);
      setLoading(false);
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-fade-in px-2">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6" style={{ borderBottom: '1px solid rgba(107,92,231,0.12)' }}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs"
            style={{ background: 'linear-gradient(135deg, rgba(107,92,231,0.15), rgba(139,92,246,0.1))', border: '1.5px solid rgba(107,92,231,0.25)' }}
          >
            <Gamepad2 size={28} style={{ color: '#6B5CE7' }} />
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>My Quizzes History</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Review all your past gamified quiz scores, accuracy, and detailed question logs</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/student/quiz-gen')}
          className="cs-btn-purple px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <Sparkles size={16} /> Play New Quiz
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#6B5CE7' }} />
          <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Loading your complete quiz history...</p>
        </div>
      ) : results.length === 0 ? (
        <div
          className="text-center py-20 rounded-3xl p-8 space-y-4 max-w-lg mx-auto"
          style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(107,92,231,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(107,92,231,0.06)' }}
        >
          <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center" style={{ background: 'rgba(107,92,231,0.08)' }}>
            <Gamepad2 size={40} style={{ color: '#6B5CE7' }} />
          </div>
          <h3 className="text-2xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>No Quizzes Played Yet</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>
            Whenever you complete a gamified quiz from the Quiz Generator, your score, answers, and accuracy breakdown will be automatically saved right here!
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push('/student/quiz-gen')}
              className="cs-btn-purple px-6 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2 shadow-md"
            >
              Start First Quiz →
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((quiz) => {
            const correct = quiz.correctCount ?? Math.round((quiz.score || 0) / 10);
            const total = quiz.totalQuestions ?? 10;
            const accuracy = Math.min(100, Math.max(0, Math.round((correct / (total || 1)) * 100)));

            return (
              <div
                key={quiz.id || quiz.createdAt}
                onClick={() => setSelectedQuiz(quiz)}
                className="group p-6 rounded-2xl transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1.5px solid rgba(107,92,231,0.15)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 2px 14px rgba(107,92,231,0.06)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(107,92,231,0.14)';
                  e.currentTarget.style.borderColor = 'rgba(107,92,231,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 14px rgba(107,92,231,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(107,92,231,0.15)';
                }}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase"
                      style={{ background: 'rgba(107,92,231,0.1)', color: '#6B5CE7' }}>
                      Completed
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#9CA3AF' }}>
                      <Calendar size={13} style={{ color: '#6B5CE7' }} />
                      <span>
                        {new Date(quiz.createdAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black leading-snug mb-4 line-clamp-2" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
                    {quiz.title || 'Gamified Chapter Quiz'}
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Progress bar accuracy */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span style={{ color: '#5A5A72' }}>Accuracy: {accuracy}%</span>
                      <span style={{ color: '#059669' }}>{correct} / {total} Right</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${accuracy}%`,
                          background: accuracy >= 70 ? '#059669' : accuracy >= 40 ? '#F59E0B' : '#E11D48',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: '1px solid rgba(107,92,231,0.1)' }}
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#9CA3AF' }}>Points Earned</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Trophy size={18} style={{ color: '#F97316' }} />
                        <span className="text-2xl font-black" style={{ color: '#6B5CE7' }}>{quiz.score || 0}</span>
                      </div>
                    </div>

                    <button
                      className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all group-hover:bg-purple-600 group-hover:text-white"
                      style={{ background: 'rgba(107,92,231,0.08)', color: '#6B5CE7' }}
                    >
                      Review <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Review Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,15,30,0.6)', backdropFilter: 'blur(8px)' }}>
          <div
            className="w-full max-w-3xl rounded-3xl p-6 md:p-8 max-h-[85vh] flex flex-col overflow-hidden animate-scale-up"
            style={{ background: '#ffffff', border: '1.5px solid rgba(107,92,231,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 shrink-0" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Attempt Summary</span>
                <h2 className="text-2xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
                  {selectedQuiz.title || 'Gamified Chapter Quiz'}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                  Played on {new Date(selectedQuiz.createdAt || Date.now()).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                style={{ color: '#6B7280' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 mb-6 shrink-0">
              <div className="p-4 rounded-2xl text-center" style={{ background: 'rgba(107,92,231,0.06)', border: '1px solid rgba(107,92,231,0.15)' }}>
                <span className="text-xs font-bold text-gray-500 uppercase">Total Points</span>
                <p className="text-2xl md:text-3xl font-black text-purple-600 mt-1">{selectedQuiz.score || 0}</p>
              </div>
              <div className="p-4 rounded-2xl text-center" style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}>
                <span className="text-xs font-bold text-gray-500 uppercase">Right Answers</span>
                <p className="text-2xl md:text-3xl font-black text-emerald-600 mt-1">
                  {selectedQuiz.correctCount ?? Math.round((selectedQuiz.score || 0) / 10)} / {selectedQuiz.totalQuestions ?? 10}
                </p>
              </div>
              <div className="p-4 rounded-2xl text-center" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <span className="text-xs font-bold text-gray-500 uppercase">Accuracy</span>
                <p className="text-2xl md:text-3xl font-black text-orange-600 mt-1">
                  {Math.min(100, Math.max(0, Math.round(((selectedQuiz.correctCount ?? Math.round((selectedQuiz.score || 0) / 10)) / (selectedQuiz.totalQuestions ?? 10)) * 100)))}%
                </p>
              </div>
            </div>

            {/* Question Breakdown List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle size={18} className="text-purple-600" /> Detailed Questions Breakdown
              </h3>

              {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                selectedQuiz.questions.map((q, idx) => {
                  const userAnswerObj = (selectedQuiz.userAnswers || []).find((a) => a.questionId === q.id);
                  const selectedAnswer = userAnswerObj ? userAnswerObj.selectedAnswer : null;
                  const isCorrect = selectedAnswer === q.correctAnswer;

                  return (
                    <div
                      key={q.id || idx}
                      className="p-4 rounded-2xl border text-sm space-y-2"
                      style={{
                        background: isCorrect ? 'rgba(16,185,129,0.04)' : 'rgba(244,63,94,0.04)',
                        borderColor: isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-bold text-gray-900 leading-snug">
                          {idx + 1}. {q.question || q.questionText}
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 px-2.5 py-1 rounded-full bg-emerald-100 shrink-0">
                            <CheckCircle2 size={14} /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 px-2.5 py-1 rounded-full bg-rose-100 shrink-0">
                            <XCircle size={14} /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs font-medium">
                        <div className="p-2 rounded-lg" style={{ background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)' }}>
                          <span className="text-gray-500 font-normal block">Your Answer:</span>
                          <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                            {selectedAnswer || 'Not answered'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                            <span className="text-gray-500 font-normal block">Correct Answer:</span>
                            <span className="text-emerald-700 font-bold">{q.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 rounded-2xl bg-gray-50 border border-gray-200 text-gray-500 text-sm">
                  Detailed question-by-question review is only saved for locally tracked quizzes from now on. Points and basic accuracy are verified by server.
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t flex justify-end shrink-0">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
