"use client";

import React, { useState, useEffect } from 'react';
import { Gamepad2, BookOpen, Layers, Sparkles, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import api from '@/services/api';
import { GamifiedQuizUI } from './gamified-quiz/GamifiedQuizUI';

export default function GamifiedQuizGen() {
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedChapterIds, setSelectedChapterIds] = useState([]);
  const [isBooksLoading, setIsBooksLoading] = useState(false);
  const [isChaptersLoading, setIsChaptersLoading] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    setIsBooksLoading(true);
    api.get("/curriculum/books").then((res) => {
      const data = res.data?.data || res.data || [];
      setBooks(data);
    }).catch(console.error).finally(() => setIsBooksLoading(false));
  }, []);

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

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const reqDto = {
        prompt: "Generate a fun and challenging gamified quiz based on the selected chapters.",
        bookId: selectedBookId,
        chapterIds: selectedChapterIds,
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
    } catch (err) {
      console.error(err);
      alert('Failed to generate gamified quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = selectedBookId && selectedChapterIds.length > 0 && !isGenerating;

  // Render the quiz player if generation is successful
  if (quizData && quizData.questions) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
        <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center rounded-xl p-4 shadow-sm" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(107,92,231,0.15)' }}>
          <button 
            onClick={() => setQuizData(null)} 
            className="text-sm font-semibold transition-colors flex items-center gap-2 hover:opacity-70"
            style={{ color: '#6B5CE7' }}
          >
            ← Back to Generator
          </button>
        </div>
        <div className="max-w-5xl mx-auto">
          <GamifiedQuizUI questions={quizData.questions} title={quizData.quizTitle || 'Gamified Quiz'} />
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
                <p className="text-xs" style={{ color: '#5A5A72' }}>Select chapters to create an interactive learning experience</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A2E' }}>Select Book <span style={{ color: '#6B5CE7' }}>*</span></label>
                <div className="relative">
                  <select 
                    className="cs-input w-full px-4 py-3 text-sm appearance-none cursor-pointer"
                    style={{ color: '#1A1A2E', background: 'rgba(255,255,255,0.9)' }}
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    disabled={isBooksLoading || isGenerating}
                  >
                    <option value="" disabled>{isBooksLoading ? 'Loading books...' : 'Select a book'}</option>
                    {books.map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.title || b.name}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <Layers size={16} style={{ color: '#9CA3AF' }} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A2E' }}>Select Chapters <span style={{ color: '#6B5CE7' }}>*</span></label>
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
                Generating Quiz...
              </>
            ) : (
              <>
                <Gamepad2 size={20} />
                Generate & Play
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
