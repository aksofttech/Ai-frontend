"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, BookOpen, Layers, Sparkles, Loader2, Maximize2, Minimize2, X, Check } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import api from '@/services/api';
import { GamifiedQuizUI } from './gamified-quiz/GamifiedQuizUI';

export default function GamifiedQuizGen() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedChapterIds, setSelectedChapterIds] = useState([]);
  const [isBooksLoading, setIsBooksLoading] = useState(false);
  const [isChaptersLoading, setIsChaptersLoading] = useState(false);
  
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState(['story_trivia', 'word_meaning', 'riddle', 'quick_task']);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const fullScreenRef = useRef(null);

  useEffect(() => {
    setIsBooksLoading(true);
    Promise.all([
      api.get("/curriculum/classes").catch(() => ({ data: [] })),
      api.get("/curriculum/books").catch(() => ({ data: [] }))
    ]).then(([clsRes, booksRes]) => {
      const clsData = clsRes.data?.data || clsRes.data || [];
      const bksData = booksRes.data?.data || booksRes.data || [];
      const booksList = Array.isArray(bksData) ? bksData : [];
      setBooks(booksList);

      let classList = Array.isArray(clsData) ? clsData : [];
      const bookClasses = booksList.map(b => b.class).filter(Boolean);
      const uniqueClasses = Array.from(new Set([...classList, ...bookClasses]));
      setClasses(uniqueClasses);
    }).finally(() => {
      setIsBooksLoading(false);
    });
  }, []);

  const filteredBooks = selectedClass
    ? books.filter(b => b.class === selectedClass || !b.class)
    : books;

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedBookId('');
    setSelectedChapterIds([]);
    setChapters([]);
  };

  useEffect(() => {
    if (!selectedBookId) {
      setChapters([]);
      setSelectedChapterIds([]);
      return;
    }
    setIsChaptersLoading(true);
    api.get(`/curriculum/books/${selectedBookId}/chapters`).then((res) => {
      const data = res.data?.data || res.data || [];
      setChapters(data);
    }).catch(console.error).finally(() => setIsChaptersLoading(false));
  }, [selectedBookId]);

  const toggleChapter = (chapterId) => {
    setSelectedChapterIds(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const toggleQuestionType = (typeId) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? (prev.length > 1 ? prev.filter(t => t !== typeId) : prev)
        : [...prev, typeId]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const reqDto = {
        prompt: `Generate a fun and challenging gamified quiz based on the selected chapters with ${questionCount} questions.`,
        bookId: selectedBookId,
        chapterIds: selectedChapterIds,
        questionCount: parseInt(questionCount, 10) || 10,
        questionTypes: selectedTypes,
      };
      
      const res = await api.post('/ai-tools/gamified-quiz/generate', reqDto);
      const rawData = res.data?.data?.content || res.data?.content || res.data;
      
      let parsed = null;
      if (typeof rawData === 'string') {
        const cleanStr = rawData.replace(/^```(?:json)?\s*/i, '').replace(/\\s*```\\s*$/i, '').trim();
        parsed = JSON.parse(cleanStr);
      } else {
        parsed = rawData;
      }
      
      setQuizData(parsed);
      setIsFullscreenMode(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate gamified quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (quizData && quizData.questions && isFullscreenMode) {
      const elem = fullScreenRef.current || document.documentElement;
      if (elem && elem.requestFullscreen && !document.fullscreenElement) {
        elem.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request error:", err);
        });
      }
    }
  }, [quizData, isFullscreenMode]);

  const handleExitQuiz = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    setQuizData(null);
    setIsFullscreenMode(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const elem = fullScreenRef.current || document.documentElement;
      if (elem && elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const isFormValid = selectedBookId && selectedChapterIds.length > 0 && selectedTypes.length > 0 && questionCount > 0 && !isGenerating;

  // Render the full-screen quiz player if generation is successful
  if (quizData && quizData.questions) {
    return (
      <div 
        ref={fullScreenRef}
        className="fixed inset-0 z-[99999] w-screen h-screen flex flex-col overflow-y-auto custom-scrollbar transition-all"
        style={{ background: '#F8F9FE', color: '#1A1A2E' }}
      >
        {/* Fullscreen Header (Light Theme) */}
        <div 
          className="w-full px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-sm transition-all"
          style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(107, 92, 231, 0.15)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs" style={{ background: 'rgba(107,92,231,0.1)', border: '1px solid rgba(107,92,231,0.2)' }}>
              <Gamepad2 size={22} style={{ color: '#6B5CE7' }} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight" style={{ color: '#1A1A2E' }}>
                {quizData.quizTitle || 'Gamified Quiz'}
              </h1>
              <p className="text-xs font-semibold" style={{ color: '#5A5A72' }}>
                Full-Screen Challenge Mode • {quizData.questions.length} Questions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-bold hover:opacity-80 shadow-xs cursor-pointer"
              style={{ background: 'white', color: '#1A1A2E', border: '1px solid rgba(107,92,231,0.2)' }}
              title="Toggle Fullscreen"
            >
              <Maximize2 size={15} style={{ color: '#6B5CE7' }} />
              <span className="hidden sm:inline">Toggle Fullscreen</span>
            </button>

            <button
              onClick={handleExitQuiz}
              className="px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-bold hover:opacity-85 shadow-xs cursor-pointer"
              style={{ background: '#EF4444', color: 'white' }}
            >
              <X size={15} />
              <span>Exit Quiz</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-6xl mx-auto my-auto">
          <GamifiedQuizUI 
            questions={quizData.questions} 
            title={quizData.quizTitle || 'Gamified Quiz'} 
            onExit={handleExitQuiz}
            isTeacherPreview={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
      <div className="max-w-3xl mx-auto space-y-8 pb-24 relative z-10">
        
        <GlassCard className="p-8 group flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all" style={{ background: 'rgba(107,92,231,0.1)', border: '1px solid rgba(107,92,231,0.2)' }}>
                <BookOpen size={22} style={{ color: '#6B5CE7' }} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1A1A2E' }}>Generate Gamified Quiz</h2>
                <p className="text-xs" style={{ color: '#5A5A72' }}>Select curriculum, question count & types to create an interactive learning experience</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Select Class */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A2E' }}>
                  Select Class <span style={{ color: '#6B5CE7' }}>*</span>
                </label>
                <div className="relative">
                  <select 
                    className="cs-input w-full px-4 py-3 text-sm appearance-none cursor-pointer"
                    style={{ color: '#1A1A2E', background: 'rgba(255,255,255,0.9)' }}
                    value={selectedClass}
                    onChange={handleClassChange}
                    disabled={isBooksLoading || isGenerating}
                  >
                    <option value="">All Classes / Select Class</option>
                    {classes.map((cls, idx) => (
                      <option key={idx} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <Layers size={16} style={{ color: '#9CA3AF' }} />
                  </div>
                </div>
              </div>

              {/* Select Book */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A2E' }}>
                  Select Book <span style={{ color: '#6B5CE7' }}>*</span>
                </label>
                <div className="relative">
                  <select 
                    className="cs-input w-full px-4 py-3 text-sm appearance-none cursor-pointer"
                    style={{ color: '#1A1A2E', background: 'rgba(255,255,255,0.9)' }}
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    disabled={isBooksLoading || isGenerating}
                  >
                    <option value="" disabled>{isBooksLoading ? 'Loading books...' : filteredBooks.length === 0 ? 'No books found for this class' : 'Select a book'}</option>
                    {filteredBooks.map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.title || b.name}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <BookOpen size={16} style={{ color: '#9CA3AF' }} />
                  </div>
                </div>
              </div>

              {/* Select Chapters */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A2E' }}>
                  Select Chapters <span style={{ color: '#6B5CE7' }}>*</span>
                </label>
                {selectedBookId ? (
                  <div className="w-full rounded-xl px-4 py-3 text-sm transition-all max-h-48 overflow-y-auto custom-scrollbar" style={{ background: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
                    {isChaptersLoading ? (
                      <span style={{ color: '#5A5A72' }}>Loading chapters...</span>
                    ) : chapters.length === 0 ? (
                      <span style={{ color: '#5A5A72' }}>No chapters found.</span>
                    ) : (
                      <div className="space-y-2.5 py-1">
                        {chapters.map(c => {
                          const cId = c.id || c._id;
                          const isChecked = selectedChapterIds.includes(cId);
                          return (
                            <label key={cId} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={isChecked} 
                                onChange={() => toggleChapter(cId)} 
                              />
                              <div className="w-5 h-5 rounded-lg flex items-center justify-center transition-colors" style={{ border: isChecked ? 'none' : '1.5px solid rgba(107,92,231,0.3)', background: isChecked ? '#6B5CE7' : 'transparent' }}>
                                {isChecked && <Sparkles size={12} className="text-white"/>}
                              </div>
                              <span className="text-sm font-medium" style={{ color: isChecked ? '#1A1A2E' : '#5A5A72' }}>
                                {c.title || c.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full rounded-xl px-4 py-5 text-center" style={{ background: 'rgba(107,92,231,0.04)', border: '1.5px dashed rgba(107,92,231,0.2)' }}>
                    <p className="text-sm italic" style={{ color: '#9CA3AF' }}>Please select a book above to view available chapters</p>
                  </div>
                )}
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A2E' }}>
                  Number of Questions
                </label>
                <div className="flex flex-wrap gap-2.5 items-center">
                  {[5, 10, 15, 20, 25].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className="px-4 py-2 rounded-xl text-xs font-bold transition-all border"
                      style={{
                        background: questionCount === num ? '#6B5CE7' : 'rgba(255,255,255,0.8)',
                        color: questionCount === num ? 'white' : '#5A5A72',
                        borderColor: questionCount === num ? '#6B5CE7' : 'rgba(107,92,231,0.2)',
                      }}
                    >
                      {num} Questions
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-xs text-[#5A5A72] font-semibold">Custom:</span>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value ? parseInt(e.target.value, 10) : "")}
                      className="cs-input w-20 px-3 py-1.5 text-xs text-center font-bold"
                      style={{ color: '#1A1A2E', background: 'white' }}
                    />
                  </div>
                </div>
              </div>

              {/* Question Types Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A2E' }}>
                  Select Question Types to Include
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'story_trivia', label: 'Story Trivia', desc: 'Facts & Events from text' },
                    { id: 'word_meaning', label: 'Word Meaning', desc: 'Vocabulary & Synonyms' },
                    { id: 'riddle', label: 'Creative Riddle', desc: 'Concept & character clues' },
                    { id: 'quick_task', label: 'Quick Task', desc: 'Logical ordering & deductions' }
                  ].map(type => {
                    const isChecked = selectedTypes.includes(type.id);
                    return (
                      <label 
                        key={type.id} 
                        className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border select-none group"
                        style={{
                          background: isChecked ? 'rgba(107,92,231,0.08)' : 'rgba(255,255,255,0.6)',
                          borderColor: isChecked ? '#6B5CE7' : 'rgba(107,92,231,0.18)',
                        }}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => toggleQuestionType(type.id)}
                        />
                        <div 
                          className="w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 mt-0.5" 
                          style={{ 
                            border: isChecked ? 'none' : '1.5px solid rgba(107,92,231,0.3)', 
                            background: isChecked ? '#6B5CE7' : 'transparent' 
                          }}
                        >
                          {isChecked && <Check size={12} className="text-white font-bold" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: isChecked ? '#1A1A2E' : '#5A5A72' }}>
                            {type.label}
                          </p>
                          <p className="text-[11px]" style={{ color: '#6B7280' }}>
                            {type.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="text-center flex flex-col items-center mx-auto">
          <button 
            disabled={!isFormValid}
            onClick={handleGenerate}
            className="w-full py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isFormValid ? '#6B5CE7' : 'rgba(107,92,231,0.1)',
              color: isFormValid ? 'white' : '#9CA3AF',
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin text-white"/>
                Generating Quiz ({questionCount} Questions)...
              </>
            ) : (
              <>
                <Gamepad2 size={20} />
                Generate & Play Fullscreen
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

