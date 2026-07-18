"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, ChevronDown, Loader2 } from "lucide-react";
import api from "@/services/api";

export default function BookSelectionForm({
  onGenerate,
  hidePeriods = false,
  buttonText,
  subtitle,
}: {
  onGenerate?: (plan: any) => void;
  hidePeriods?: boolean;
  buttonText?: string;
  subtitle?: string;
}) {
  const [classes, setClasses] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(""); // This is actually bookId
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [periods, setPeriods] = useState<number | "">(1);
  
  const [isClassLoading, setIsClassLoading] = useState(false);
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // Prevents SSR/client hydration mismatch on disabled props
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsClassLoading(true);
    api.get("/curriculum/classes").then((res) => {
      const data = res.data?.data || res.data || [];
      const raw = Array.isArray(data) ? data : [];
      // Sort numerically so Class 1, 2, 3... appear in order
      const sorted = [...raw].sort((a, b) => {
        const numA = parseInt(String(a?.name ?? a?.className ?? a), 10);
        const numB = parseInt(String(b?.name ?? b?.className ?? b), 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return String(a).localeCompare(String(b));
      });
      setClasses(sorted);

    }).catch(console.error).finally(() => setIsClassLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      setSubjects([]);
      setSelectedSubjectId("");
      return;
    }
    setIsSubjectLoading(true);
    api.get(`/curriculum/subjects?classId=${encodeURIComponent(selectedClassId)}`).then((res) => {
      const data = res.data?.data || res.data || [];
      const raw = Array.isArray(data) ? data : [];
      // Sort alphabetically by title/name
      const sorted = [...raw].sort((a, b) => {
        const nameA = String(a?.title ?? a?.name ?? '').toLowerCase();
        const nameB = String(b?.title ?? b?.name ?? '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setSubjects(sorted);

      setSelectedSubjectId("");
    }).catch(console.error).finally(() => setIsSubjectLoading(false));
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedSubjectId) {
      setChapters([]);
      setSelectedChapterId("");
      return;
    }
    setIsLoading(true);
    api.get(`/curriculum/chapters?subjectId=${encodeURIComponent(selectedSubjectId)}`).then((res) => {
      const data = res.data?.data || res.data || [];
      setChapters(Array.isArray(data) ? data : []);
      setSelectedChapterId("");
    }).catch(console.error).finally(() => setIsLoading(false));
  }, [selectedSubjectId]);

  const handleGenerate = async () => {
    if (!selectedSubjectId || !selectedChapterId) return;

    // In hidePeriods (chat) mode — just pass the selection, no lesson-plan API call
    if (hidePeriods) {
      const chapterTitle = selectedChapterData?.title || selectedChapterData?.name || '';
      const bookTitle = selectedSubjectData?.title || selectedSubjectData?.name || '';
      if (onGenerate) {
        onGenerate({
          classId: selectedClassId,
          bookId: selectedSubjectId,
          chapterId: selectedChapterId,
          chapterTitle,
          bookTitle,
          subjectsList: subjects,
          chaptersList: chapters,
        });
      }
      return;
    }

    if (!periods) return;

    setIsGenerating(true);
    try {
      const chapterTitle = selectedChapterData?.title || selectedChapterData?.name || '';
      const bookTitle = selectedSubjectData?.title || selectedSubjectData?.name || '';
      const res = await api.post("/ai-tools/lesson-plan/generate", {
        bookId: selectedSubjectId,
        chapterId: selectedChapterId,
        chapterTitle,
        subject: bookTitle,
        prompt: `Generate a detailed lesson plan for ${periods} period(s) for the chapter: "${chapterTitle}" from the book "${bookTitle}".`
      });

      // The orchestrator wraps the result as { tool, content, sources }
      // The actual lesson plan JSON lives inside `content`
      const responseData = res.data?.data || res.data;
      const plan = responseData?.content ?? responseData;
      const parsedPlan = typeof plan === 'string' ? JSON.parse(plan) : plan;

      console.log('[BookSelectionForm] Parsed plan:', parsedPlan);

      if (onGenerate) onGenerate(parsedPlan);
    } catch (err) {
      console.error("Failed to generate lesson plan", err);
      alert("Failed to generate lesson plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubjectId || s._id === selectedSubjectId);
  const selectedChapterData = chapters.find(c => c.id === selectedChapterId || c._id === selectedChapterId);

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, rgba(255,245,240,0.6) 0%, rgba(237,232,245,0.6) 100%)' }}
    >
      <div
        className="w-full max-w-xl rounded-2xl p-7 space-y-7"
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(107,92,231,0.15)',
          boxShadow: '0 4px 32px rgba(107,92,231,0.1)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(107,92,231,0.1)' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#6B5CE7' }} />
            </div>
            <h2 className="text-xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
              Book & Chapter Selection
            </h2>
          </div>
          <p className="text-sm ml-0.5" style={{ color: '#9CA3AF' }}>
            {subtitle || (hidePeriods ? 'Choose the book and chapter to get started' : 'Choose the book and chapter for your lesson plan')}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Select */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="class" className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
                Class {isClassLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1" style={{ color: '#6B5CE7' }} />}
              </label>
              <div className="relative">
                <select
                  id="class"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm appearance-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '1.5px solid rgba(107,92,231,0.2)',
                    color: '#1A1A2E',
                  }}
                  disabled={mounted && (isGenerating || isClassLoading)}
                >
                  <option value="" disabled>Select a class</option>
                  {classes.map((cls, idx) => (
                    <option key={idx} value={cls}>{cls}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
              </div>
            </div>

            {/* Subject Select */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="subject" className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
                Subject {isSubjectLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1" style={{ color: '#6B5CE7' }} />}
              </label>
              <div className="relative">
                <select
                  id="subject"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm appearance-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '1.5px solid rgba(107,92,231,0.2)',
                    color: '#1A1A2E',
                  }}
                  disabled={mounted && (!selectedClassId || isGenerating || isSubjectLoading)}
                >
                  <option value="" disabled>Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id || subject._id} value={subject.id || subject._id}>
                      {subject.title || subject.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
              </div>
            </div>

            {/* Chapter Select */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="chapter" className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
                Chapter {isLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1" style={{ color: '#6B5CE7' }} />}
              </label>
              <div className="relative">
                <select
                  id="chapter"
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm appearance-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '1.5px solid rgba(107,92,231,0.2)',
                    color: '#1A1A2E',
                  }}
                  disabled={mounted && (!selectedSubjectId || isGenerating || isLoading)}
                >
                  <option value="" disabled>Select a chapter</option>
                  {chapters.map(chapter => (
                    <option key={chapter.id || chapter._id} value={chapter.id || chapter._id}>
                      {chapter.title || chapter.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
              </div>
            </div>
          </div>

          {!hidePeriods && (
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="periods" className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>Number of Periods</label>
              <input
                type="number"
                id="periods"
                min="1"
                max="20"
                value={periods}
                onChange={(e) => setPeriods(e.target.value ? parseInt(e.target.value, 10) : "")}
                className="cs-input w-full px-3 py-2.5 text-sm"
                style={{ color: '#1A1A2E' }}
                placeholder="e.g., 5"
                disabled={isGenerating}
              />
              <p className="text-xs" style={{ color: '#9CA3AF' }}>
                Specify the number of periods (1–20) to generate lesson plans for
              </p>
            </div>
          )}
        </div>

        {/* Info Summary Box */}
        <div
          className="rounded-xl p-4 flex flex-col space-y-1 min-h-[80px]"
          style={{ background: 'rgba(107,92,231,0.05)', border: '1px solid rgba(107,92,231,0.15)' }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B5CE7' }}>
            Selected Chapter
          </span>
          {selectedChapterData ? (
            <div className="text-sm" style={{ color: '#1A1A2E' }}>
              <span className="font-bold">{selectedChapterData.title || selectedChapterData.name}</span>{' '}
              <span className="italic" style={{ color: '#5A5A72' }}>from {selectedSubjectData?.title || selectedSubjectData?.name}</span>
            </div>
          ) : (
            <div className="text-sm italic" style={{ color: '#9CA3AF' }}>
              Please select a book and chapter above.
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={mounted && (!selectedSubjectId || !selectedChapterId || (!hidePeriods && !periods) || isGenerating)}
          className="w-full py-3.5 px-4 rounded-full font-bold flex items-center justify-center gap-2 text-sm transition-all duration-200 shadow-sm disabled:cursor-not-allowed"
          style={{
            background: (!mounted || (selectedSubjectId && selectedChapterId && (hidePeriods || periods) && !isGenerating))
              ? '#6B5CE7'
              : 'rgba(107,92,231,0.12)',
            color: (!mounted || (selectedSubjectId && selectedChapterId && (hidePeriods || periods) && !isGenerating))
              ? 'white'
              : '#9CA3AF',
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {hidePeriods ? 'Loading...' : 'Generating AI Plan... please wait'}
            </>
          ) : (
            buttonText || (hidePeriods ? 'Start Chat' : 'Generate Lesson Plan')
          )}
        </button>
      </div>
    </div>
  );
}
