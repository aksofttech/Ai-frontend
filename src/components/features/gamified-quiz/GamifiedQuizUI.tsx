import React from 'react';
import { useGamifiedQuiz, QuizQuestion } from '../../../hooks/useGamifiedQuiz';
import { CheckCircle, XCircle, Timer, Zap, Trophy } from 'lucide-react';

interface GamifiedQuizUIProps {
  questions: QuizQuestion[];
  title: string;
  onExit?: () => void;
  isTeacherPreview?: boolean;
}

import { useRouter } from 'next/navigation';

export const GamifiedQuizUI: React.FC<GamifiedQuizUIProps> = ({ questions, title, onExit, isTeacherPreview }) => {
  const router = useRouter();
  const {
    currentQuestion,
    currentIndex,
    streak,
    timeLeft,
    isSubmitting,
    isFinished,
    verifiedScore,
    userAnswers,
    handleAnswer,
    resetQuiz,
  } = useGamifiedQuiz(questions, title);

  if (isFinished) {
    const totalQuestions = questions.length;
    let correctCount = 0;
    let wrongCount = 0;

    userAnswers.forEach((ans) => {
      const q = questions.find((item) => item.id === ans.questionId);
      if (q) {
        if (ans.selectedAnswer === q.correctAnswer) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const accuracy = Math.round((correctCount / totalQuestions) * 100) || 0;
    const displayScore = verifiedScore !== null ? verifiedScore : correctCount * 10;

    return (
      <div 
        className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-3xl shadow-xl border text-center animate-fade-in my-auto transition-all"
        style={{ borderColor: 'rgba(107, 92, 231, 0.18)', boxShadow: '0 25px 50px -12px rgba(107, 92, 231, 0.1)' }}
      >
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6B5CE7', borderTopColor: 'transparent' }}></div>
            <h2 className="text-2xl font-bold animate-pulse" style={{ color: '#1A1A2E' }}>Calculating Score & Verifying Results...</h2>
          </div>
        ) : (
          <div className="py-2 space-y-8 flex flex-col items-center">
            {/* Celebration Header */}
            <div className="space-y-3">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg mx-auto"
                style={{ background: 'linear-gradient(135deg, #6B5CE7 0%, #8B5CF6 100%)', boxShadow: '0 10px 25px -5px rgba(107, 92, 231, 0.4)' }}
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: '#1A1A2E' }}>
                Quiz Completed!
              </h2>
              <p className="text-sm md:text-base max-w-lg mx-auto font-medium" style={{ color: '#5A5A72' }}>
                Here is your detailed performance summary for <span className="font-bold" style={{ color: '#6B5CE7' }}>"{title}"</span>
              </p>
            </div>

            {/* Right & Wrong Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col items-center justify-center shadow-xs">
                <span className="text-xs uppercase tracking-wider text-emerald-700 font-extrabold mb-1">Right Answers</span>
                <span className="text-3xl font-black text-emerald-600">{correctCount}</span>
                <span className="text-[11px] text-emerald-700/80 font-medium mt-0.5">out of {totalQuestions}</span>
              </div>

              <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 flex flex-col items-center justify-center shadow-xs">
                <span className="text-xs uppercase tracking-wider text-rose-700 font-extrabold mb-1">Wrong Answers</span>
                <span className="text-3xl font-black text-rose-600">{wrongCount}</span>
                <span className="text-[11px] text-rose-700/80 font-medium mt-0.5">out of {totalQuestions}</span>
              </div>

              <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 flex flex-col items-center justify-center shadow-xs">
                <span className="text-xs uppercase tracking-wider text-indigo-700 font-extrabold mb-1">Accuracy</span>
                <span className="text-3xl font-black text-indigo-600">{accuracy}%</span>
                <span className="text-[11px] text-indigo-700/80 font-medium mt-0.5">Overall Rate</span>
              </div>

              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col items-center justify-center shadow-xs">
                <span className="text-xs uppercase tracking-wider text-amber-700 font-extrabold mb-1">Total Score</span>
                <span className="text-3xl font-black text-amber-600">{displayScore}</span>
                <span className="text-[11px] text-amber-700/80 font-medium mt-0.5">Points Earned</span>
              </div>
            </div>

            {/* Detailed Question Review Table */}
            <div 
              className="w-full max-w-3xl text-left rounded-2xl border p-5 space-y-4 max-h-80 overflow-y-auto custom-scrollbar"
              style={{ background: '#F8F9FE', borderColor: 'rgba(107, 92, 231, 0.18)' }}
            >
              <h4 
                className="text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-2.5 border-b flex items-center justify-between"
                style={{ color: '#1A1A2E', borderColor: 'rgba(107, 92, 231, 0.15)' }}
              >
                <span>Question Review ({totalQuestions} Questions)</span>
                <span className="text-xs font-semibold" style={{ color: '#5A5A72' }}>Check right & wrong breakdown</span>
              </h4>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const userAnsObj = userAnswers.find((a) => a.questionId === q.id);
                  const userSelected = userAnsObj?.selectedAnswer || 'Not Answered / Timed Out';
                  const isCorrect = userSelected === q.correctAnswer;

                  return (
                    <div 
                      key={q.id || idx} 
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isCorrect 
                          ? 'bg-emerald-50/60 border-emerald-300' 
                          : 'bg-rose-50/60 border-rose-300'
                      }`}
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white text-slate-800 border shadow-2xs">
                            Q{idx + 1}
                          </span>
                          <span 
                            className="text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide border shadow-2xs"
                            style={{ background: 'rgba(107, 92, 231, 0.1)', color: '#6B5CE7', borderColor: 'rgba(107, 92, 231, 0.2)' }}
                          >
                            {q.type?.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{q.question}</p>
                        <div className="text-xs space-y-1 pt-1">
                          <p className={isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                            Your Answer: <span className="font-extrabold">{userSelected}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-emerald-700 font-semibold">
                              Correct Answer: <span className="font-extrabold">{q.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs">
                            <CheckCircle size={14} /> Right
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-2xs">
                            <XCircle size={14} /> Wrong
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button 
                onClick={resetQuiz}
                className="px-6 py-3.5 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:opacity-90 active:scale-95 cursor-pointer"
                style={{ background: '#6B5CE7' }}
              >
                <Zap size={18} /> Play Again
              </button>

              {onExit ? (
                <button 
                  onClick={onExit}
                  className="px-6 py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95 cursor-pointer"
                  style={{ background: '#F8F9FE', color: '#1A1A2E', border: '1.5px solid rgba(107,92,231,0.2)' }}
                >
                  ← Back to Generator
                </button>
              ) : !isTeacherPreview && (
                <button 
                  onClick={() => router.push('/student/leaderboard')}
                  className="px-6 py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95 cursor-pointer"
                  style={{ background: '#F8F9FE', color: '#1A1A2E', border: '1.5px solid rgba(107,92,231,0.2)' }}
                >
                  <Trophy size={18} /> View Leaderboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!currentQuestion) return null;

  const isLowTime = timeLeft <= 5;

  return (
    <div 
      className="w-full max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-3xl shadow-xl border transition-all duration-300"
      style={{ borderColor: 'rgba(107, 92, 231, 0.18)', boxShadow: '0 20px 40px -15px rgba(107, 92, 231, 0.1)' }}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <span 
            className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider"
            style={{ background: 'rgba(107, 92, 231, 0.1)', color: '#6B5CE7', border: '1px solid rgba(107, 92, 231, 0.2)' }}
          >
            {currentQuestion.type.replace('_', ' ')}
          </span>
          <span className="font-bold text-sm" style={{ color: '#5A5A72' }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div 
            className="flex items-center space-x-2 px-4 py-1.5 rounded-full border transition-colors font-bold text-sm"
            style={{ 
              background: streak >= 3 ? 'rgba(249, 115, 22, 0.12)' : '#F8F9FE', 
              color: streak >= 3 ? '#EA580C' : '#5A5A72', 
              borderColor: streak >= 3 ? 'rgba(249, 115, 22, 0.3)' : 'rgba(107, 92, 231, 0.15)' 
            }}
          >
            <span className="text-lg">🔥</span>
            <span>{streak}</span>
          </div>
          
          <div 
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border transition-colors font-mono font-bold text-sm ${isLowTime ? 'animate-pulse' : ''}`}
            style={{ 
              background: isLowTime ? 'rgba(239, 68, 68, 0.12)' : '#F8F9FE', 
              color: isLowTime ? '#EF4444' : '#1A1A2E', 
              borderColor: isLowTime ? 'rgba(239, 68, 68, 0.3)' : 'rgba(107, 92, 231, 0.15)' 
            }}
          >
            <Timer className="w-4 h-4" />
            <span className="text-base">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-2.5 rounded-full mb-8 overflow-hidden"
        style={{ background: 'rgba(107, 92, 231, 0.1)' }}
      >
        <div 
          className="h-full transition-all duration-1000 ease-linear rounded-full"
          style={{ 
            background: isLowTime ? '#EF4444' : 'linear-gradient(90deg, #6B5CE7 0%, #8B5CF6 100%)', 
            width: `${(timeLeft / 15) * 100}%` 
          }}
        />
      </div>

      {/* Question */}
      <div className="mb-10">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug tracking-tight" style={{ color: '#1A1A2E' }}>
          {currentQuestion.question}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            className="group relative flex items-center p-5 text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer"
            style={{ background: '#F8F9FE', borderColor: 'rgba(107, 92, 231, 0.18)' }}
          >
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold mr-4 group-hover:bg-[#6B5CE7] group-hover:text-white transition-colors shrink-0 shadow-2xs border"
              style={{ background: 'white', color: '#6B5CE7', borderColor: 'rgba(107, 92, 231, 0.2)' }}
            >
              {String.fromCharCode(65 + idx)}
            </div>
            <span className="font-bold text-base sm:text-lg leading-tight relative z-10" style={{ color: '#1A1A2E' }}>
              {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

