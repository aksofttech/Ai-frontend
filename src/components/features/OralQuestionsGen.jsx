"use client";

import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { 
  Sparkles, Loader2, Download, RefreshCw, Trash2, 
  Edit2, Check, X, FileText, Info, BookOpen, Layers, 
  HelpCircle, Plus, Eye, EyeOff, Play, Mic, ChevronLeft, 
  ChevronRight, Maximize2, Minimize2
} from 'lucide-react';
import api from '@/services/api';

/* ─────────────────────────────────────────────────────────────────
   Oral Questions PDF Clean HTML Builder
   ───────────────────────────────────────────────────────────────── */
function buildOralQuestionsHTML(assignmentData) {
  let questionsHTML = '';

  assignmentData.oralQuestions.forEach((q, idx) => {
    let modeBadge = q.type.toUpperCase().replace(/_/g, ' ');
    questionsHTML += `
      <div class="question-item" style="margin-bottom: 20px; page-break-inside: avoid;">
        <p class="q-text">
          <strong>Q${idx + 1}. ${q.question}</strong>
          <span style="font-size: 8.5pt; font-weight: bold; border: 1px solid #777; padding: 1px 4px; border-radius: 3px; margin-left: 8px; text-transform: uppercase;">
            ${modeBadge}
          </span>
        </p>
        <p class="a-text"><strong>Expected Answer:</strong> ${q.expectedAnswer}</p>
      </div>
    `;
  });

  const css = `
    @page { size: A4; margin: 18mm 20mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11.5pt;
      color: #000;
      background: #fff;
      margin: 0; padding: 0;
      line-height: 1.5;
    }
    .header-block { text-align: center; margin-bottom: 25px; }
    .title-main { font-size: 17pt; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; }
    .title-sub { font-size: 13pt; font-weight: bold; margin: 0 0 10px 0; }
    .metadata { font-size: 11pt; font-style: italic; margin: 5px 0; }
    
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px solid #000; }
    .info-table td { padding: 6px 4px; font-size: 10pt; font-weight: bold; }
    
    .question-item { margin-bottom: 22px; }
    .q-text { margin: 0 0 6px 0; font-size: 12pt; }
    .a-text { margin: 0 0 0 15px; font-size: 11pt; color: #333; font-style: italic; }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${assignmentData.title}</title>
  <style>${css}</style>
</head>
<body>
  <div class="header-block">
    <h1 class="title-main">ORAL QUESTIONS & REVISION DRILL</h1>
    <h2 class="title-sub">${assignmentData.title}</h2>
    <div class="metadata">${assignmentData.class} &bull; ${assignmentData.subject}</div>
  </div>

  <table class="info-table">
    <tr>
      <td style="width: 50%;">Teacher Name: <span style="font-weight: normal; border-bottom: 1px dashed #000; padding-bottom: 2px; width: 60%; display: inline-block;"></span></td>
      <td style="width: 50%;">Date of Drill: <span style="font-weight: normal; border-bottom: 1px dashed #000; padding-bottom: 2px; width: 60%; display: inline-block;"></span></td>
    </tr>
    <tr>
      <td>Chapter: <span style="font-weight: normal;">${assignmentData.chapterTitle}</span></td>
      <td>Topic Focus: <span style="font-weight: normal;">${assignmentData.topic}</span></td>
    </tr>
  </table>

  <div class="questions-container" style="margin-top: 15px;">
    ${questionsHTML}
  </div>
</body>
</html>`;
}

export default function OralQuestionsGen() {
  // --- Dropdown options loaded from server ---
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  // --- Form selections ---
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(""); // actually bookId
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  
  // --- Config options ---
  const [modes, setModes] = useState(['rapid_fire', 'true_false']);
  const [difficulty, setDifficulty] = useState("Medium");
  const [qCount, setQCount] = useState(5);

  // --- UI/API states ---
  const [isClassLoading, setIsClassLoading] = useState(false);
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  const [isChapterLoading, setIsChapterLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [revealedIds, setRevealedIds] = useState([]);

  // --- Generated Oral Questions data ---
  const [drillData, setDrillData] = useState(null);

  // --- Slide Presentation Mode States ---
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlideAnswerRevealed, setIsSlideAnswerRevealed] = useState(false);

  // --- Inline Editing State ---
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({
    question: "",
    expectedAnswer: "",
    type: "rapid_fire",
    difficulty: "Medium"
  });

  // Load Classes
  useEffect(() => {
    setIsClassLoading(true);
    api.get("/curriculum/classes")
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setClasses(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setIsClassLoading(false));
  }, []);

  // Load Subjects when Class changes
  useEffect(() => {
    if (!selectedClass) {
      setSubjects([]);
      setSelectedSubjectId("");
      return;
    }
    setIsSubjectLoading(true);
    api.get(`/curriculum/subjects?classId=${encodeURIComponent(selectedClass)}`)
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setSubjects(Array.isArray(data) ? data : []);
        setSelectedSubjectId("");
      })
      .catch(console.error)
      .finally(() => setIsSubjectLoading(false));
  }, [selectedClass]);

  // Load Chapters when Subject changes
  useEffect(() => {
    if (!selectedSubjectId) {
      setChapters([]);
      setSelectedChapterId("");
      return;
    }
    setIsChapterLoading(true);
    api.get(`/curriculum/chapters?subjectId=${encodeURIComponent(selectedSubjectId)}`)
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setChapters(Array.isArray(data) ? data : []);
        setSelectedChapterId("");
      })
      .catch(console.error)
      .finally(() => setIsChapterLoading(false));
  }, [selectedSubjectId]);

  const handleTopicKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = topicInput.trim().replace(/,$/, '');
      if (val && !topics.includes(val)) {
        setTopics([...topics, val]);
        setTopicInput("");
      }
    } else if (e.key === 'Backspace' && !topicInput && topics.length > 0) {
      setTopics(topics.slice(0, -1));
    }
  };

  const removeTopic = (t) => {
    setTopics(topics.filter(item => item !== t));
  };

  const toggleMode = (mode) => {
    if (modes.includes(mode)) {
      if (modes.length > 1) {
        setModes(modes.filter(m => m !== mode));
      }
    } else {
      setModes([...modes, mode]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedSubjectId || !selectedChapterId) {
      alert("Please select Class, Subject, and Chapter!");
      return;
    }
    setIsGenerating(true);
    try {
      const selectedChapterData = chapters.find(c => c.id === selectedChapterId || c._id === selectedChapterId);
      const selectedSubjectData = subjects.find(s => s.id === selectedSubjectId || s._id === selectedSubjectId);
      const chapterTitle = selectedChapterData?.title || selectedChapterData?.name || '';
      const subjectName = selectedSubjectData?.title || selectedSubjectData?.name || '';
      const finalTopic = topics.length > 0 ? topics.join(", ") : "";

      const res = await api.post("/ai-tools/oral-questions/generate", {
        prompt: `Generate engaging verbal oral revision questions. Modes: ${modes.join(', ')}. Focus topics: ${finalTopic || 'Entire Chapter'}. Count: ${qCount}`,
        chapterId: selectedChapterId,
        bookId: selectedSubjectId,
        grade: selectedClass,
        subject: subjectName,
        oralQuestionsConfig: {
          modes,
          difficulty,
          qCount,
          topic: finalTopic
        }
      });

      let rawContent = res.data?.data?.content || res.data?.content;
      let parsed = null;
      if (typeof rawContent === 'string') {
        try {
          const cleanStr = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
          parsed = JSON.parse(cleanStr);
        } catch (e) {
          console.error("Failed to parse oral questions content", rawContent);
          alert("Parsing error in AI response. Retrying generation might help.");
          setIsGenerating(false);
          return;
        }
      } else {
        parsed = rawContent;
      }

      if (parsed) {
        if (!parsed.title) parsed.title = `Oral Questions: ${chapterTitle || 'Assigned Topic'}`;
        if (!parsed.oralQuestions || !Array.isArray(parsed.oralQuestions)) parsed.oralQuestions = [];

        parsed.class = selectedClass;
        parsed.subject = subjectName;
        parsed.chapterTitle = chapterTitle;
        parsed.topic = finalTopic || 'Entire Chapter';

        setDrillData(parsed);
        setIsGenerated(true);
        setRevealedIds([]);
      } else {
        alert("Received empty questions data from server.");
      }
    } catch (err) {
      console.error("AI Generation failed", err);
      alert("Failed to generate oral questions. Please ensure API Key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Toggle Answer visibility ---
  const toggleAnswer = (id) => {
    if (revealedIds.includes(id)) {
      setRevealedIds(revealedIds.filter(x => x !== id));
    } else {
      setRevealedIds([...revealedIds, id]);
    }
  };

  // --- Inline Edit handlers ---
  const startEditing = (q) => {
    setEditingId(q.id);
    setEditFields({
      question: q.question || "",
      expectedAnswer: q.expectedAnswer || "",
      type: q.type || "rapid_fire",
      difficulty: q.difficulty || "Medium"
    });
  };

  const saveEditing = (id) => {
    setDrillData(prev => {
      const updated = prev.oralQuestions.map(q => {
        if (q.id === id) {
          return {
            ...q,
            question: editFields.question,
            expectedAnswer: editFields.expectedAnswer,
            type: editFields.type,
            difficulty: editFields.difficulty
          };
        }
        return q;
      });
      return { ...prev, oralQuestions: updated };
    });
    setEditingId(null);
  };

  const deleteQuestion = (id) => {
    setDrillData(prev => {
      const filtered = prev.oralQuestions.filter(q => q.id !== id);
      return { ...prev, oralQuestions: filtered };
    });
  };

  const addQuestion = (type) => {
    const newId = `oq_added_${Date.now()}`;
    const newQ = {
      id: newId,
      type,
      question: `New verbal question for ${type.replace(/_/g, ' ')} mode?`,
      expectedAnswer: "Correct answer key",
      difficulty: "Medium"
    };

    setDrillData(prev => ({
      ...prev,
      oralQuestions: [...prev.oralQuestions, newQ]
    }));
    startEditing(newQ);
  };

  const handleExportPDF = () => {
    if (!drillData) return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert("Please allow popups to export PDF.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildOralQuestionsHTML(drillData));
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  // --- Presentation Slide Controls ---
  const launchPresentation = () => {
    if (!drillData || drillData.oralQuestions.length === 0) return;
    setCurrentSlideIndex(0);
    setIsSlideAnswerRevealed(false);
    setIsPresentationMode(true);
  };

  const nextSlide = () => {
    if (currentSlideIndex < drillData.oralQuestions.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setIsSlideAnswerRevealed(false);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setIsSlideAnswerRevealed(false);
    }
  };

  // Keyboard controls for slides
  useEffect(() => {
    if (!isPresentationMode) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        if (isSlideAnswerRevealed) {
          nextSlide();
        } else {
          setIsSlideAnswerRevealed(true);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setIsPresentationMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, currentSlideIndex, isSlideAnswerRevealed]);

  // --- Presentation Mode Render ---
  if (isPresentationMode && drillData && drillData.oralQuestions.length > 0) {
    const currentQ = drillData.oralQuestions[currentSlideIndex];
    return (
      <div 
        className="fixed inset-0 flex flex-col z-50 p-6 animate-fade-in justify-between"
        style={{ background: 'linear-gradient(105deg, #FFF5F0 0%, #EDE8F5 100%)' }}
      >
        {/* Top Control Bar */}
        <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: 'rgba(107,92,231,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#6B5CE7]/10 border border-[#6B5CE7]/25">
              <Mic className="w-4 h-4" style={{ color: '#6B5CE7' }} />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#1A1A2E]" style={{ fontFamily: 'Outfit,sans-serif' }}>{drillData.title}</h2>
              <p className="text-[10px] text-[#5A5A72] font-semibold">{drillData.class} &bull; {drillData.subject}</p>
            </div>
          </div>
          <div 
            className="text-xs font-bold px-4 py-1.5 rounded-full font-mono border"
            style={{ background: 'white', borderColor: 'rgba(107,92,231,0.15)', color: '#6B5CE7' }}
          >
            SLIDE {currentSlideIndex + 1} OF {drillData.oralQuestions.length}
          </div>
          <button 
            onClick={() => setIsPresentationMode(false)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border hover:bg-red-50 text-xs text-red-500 font-bold transition-all bg-white"
            style={{ borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <Minimize2 size={13} /> Exit Presentation
          </button>
        </div>

        {/* Slide Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center px-4 py-10 w-full">
          <span 
            className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border mb-6"
            style={{ background: 'rgba(107,92,231,0.08)', borderColor: 'rgba(107,92,231,0.2)', color: '#6B5CE7' }}
          >
            {currentQ.type.replace(/_/g, ' ')}
          </span>

          <h1 
            className="text-3xl md:text-5xl font-black leading-relaxed tracking-tight transition-all select-none"
            style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}
          >
            {currentQ.question}
          </h1>

          {/* Expected Answer Display */}
          <div className="min-h-[120px] flex items-center justify-center w-full mt-10">
            {isSlideAnswerRevealed ? (
              <div 
                className="p-6 rounded-2xl border max-w-2xl w-full animate-fade-in shadow-md"
                style={{ background: 'rgba(16,185,129,0.04)', borderColor: 'rgba(16,185,129,0.2)' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#10b981] block mb-2">EXPECTED ANSWER</span>
                <p className="text-xl md:text-2xl font-black text-[#047857] leading-relaxed">
                  {currentQ.expectedAnswer}
                </p>
              </div>
            ) : (
              <button 
                onClick={() => setIsSlideAnswerRevealed(true)}
                className="px-8 py-4 rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-md text-white active:scale-98"
                style={{ background: '#6B5CE7' }}
              >
                <Eye size={16} /> Reveal Expected Answer
              </button>
            )}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex justify-between items-center border-t pt-4" style={{ borderColor: 'rgba(107,92,231,0.1)' }}>
          <button 
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-bold text-[#5A5A72] disabled:opacity-30 disabled:pointer-events-none transition-all bg-white"
            style={{ borderColor: 'rgba(107,92,231,0.15)' }}
          >
            <ChevronLeft size={16} /> Previous Question
          </button>

          <div className="flex gap-2">
            {!isSlideAnswerRevealed && (
              <button 
                onClick={() => setIsSlideAnswerRevealed(true)}
                className="px-6 py-3 rounded-xl border text-sm font-bold text-emerald-600 transition-all bg-white"
                style={{ borderColor: 'rgba(16,185,129,0.25)' }}
              >
                Reveal Answer
              </button>
            )}
            <button 
              onClick={nextSlide}
              disabled={currentSlideIndex === drillData.oralQuestions.length - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-black disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
              style={{ background: '#1A1A2E' }}
            >
              Next Question <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- View Phase (Questions list review) ---
  if (isGenerated && drillData) {
    return (
      <div className="h-full flex flex-col gap-6 p-6 relative text-[#1A1A2E] overflow-y-auto custom-scrollbar">
        {/* Top Header */}
        <div className="w-full max-w-[1000px] mx-auto rounded-2xl p-6 flex flex-col gap-6 shadow-xs border" 
             style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(107,92,231,0.18)', backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B5CE7]">Oral Drilling Worksheet</span>
              <h2 className="text-2xl font-black mt-1" style={{ fontFamily: 'Outfit,sans-serif' }}>
                <input 
                  type="text" 
                  value={drillData.title}
                  onChange={e => setDrillData({ ...drillData, title: e.target.value })}
                  className="bg-transparent border-b border-transparent hover:border-[#6B5CE7] focus:border-[#6B5CE7] outline-none font-black py-0.5 w-full text-2xl"
                />
              </h2>
              <p className="text-xs text-[#5A5A72] mt-1.5 font-medium">
                {drillData.class} &bull; {drillData.subject} &bull; {drillData.chapterTitle}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={launchPresentation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all text-xs text-white"
                style={{ background: '#6B5CE7' }}
              >
                <Play size={13} fill="currentColor" /> Project Slide Show
              </button>
              <button 
                onClick={() => {
                  setIsGenerated(false);
                  setDrillData(null);
                }}
                className="p-2.5 rounded-xl border border-dashed hover:bg-purple-50 transition-colors"
                style={{ color: '#6B5CE7', borderColor: 'rgba(107,92,231,0.3)' }}
                title="Change config parameters"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-4 border-t" style={{ borderColor: 'rgba(107,92,231,0.1)' }}>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all text-sm shadow-xs"
              style={{ background: '#1A1A2E', color: 'white' }}
            >
              <Download size={15} /> Download PDF Revision sheet
            </button>
          </div>
        </div>

        {/* Review list */}
        <div className="w-full max-w-[1000px] mx-auto space-y-4">
          {drillData.oralQuestions.map((q, idx) => {
            const isEditing = editingId === q.id;
            const isRevealed = revealedIds.includes(q.id);

            return (
              <GlassCard key={q.id} className="p-5 rounded-2xl shadow-2xs border flex flex-col gap-3 relative transition-all"
                         style={{ background: 'rgba(255,255,255,0.75)', borderColor: 'rgba(107,92,231,0.12)' }}>
                {/* Header */}
                <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'rgba(107,92,231,0.08)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1A1A2E]">Oral Question {idx + 1}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase" 
                          style={{ background: 'rgba(107,92,231,0.08)', color: '#6B5CE7' }}>
                      {q.type.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-orange-100 text-orange-600">
                      {q.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEditing(q.id)} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg" title="Save">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg" title="Cancel">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => toggleAnswer(q.id)} className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg" title="Toggle Answer Details">
                          {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => startEditing(q)} className="p-1.5 hover:bg-purple-50 text-[#6B5CE7] rounded-lg" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteQuestion(q.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Form / Render prompt */}
                <div className="text-sm font-semibold">
                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A72]">Oral Question prompt</label>
                        <textarea
                          value={editFields.question}
                          onChange={e => setEditFields({ ...editFields, question: e.target.value })}
                          className="cs-input w-full px-3 py-2 text-xs font-semibold"
                          style={{ color: '#1A1A2E', background: 'white' }}
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A72]">Expected Answer</label>
                          <input
                            type="text"
                            value={editFields.expectedAnswer}
                            onChange={e => setEditFields({ ...editFields, expectedAnswer: e.target.value })}
                            className="cs-input w-full px-3 py-1.5 text-xs font-semibold"
                            style={{ color: '#1A1A2E', background: 'white' }}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A72]">Question Mode</label>
                          <select
                            value={editFields.type}
                            onChange={e => setEditFields({ ...editFields, type: e.target.value })}
                            className="cs-input w-full px-3 py-1.5 text-xs font-semibold"
                            style={{ color: '#1A1A2E', background: 'white' }}
                          >
                            <option value="rapid_fire">Rapid Fire</option>
                            <option value="true_false">True / False</option>
                            <option value="vocabulary">Vocabulary Check</option>
                            <option value="concept_recall">Concept Recall</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A72]">Difficulty</label>
                          <select
                            value={editFields.difficulty}
                            onChange={e => setEditFields({ ...editFields, difficulty: e.target.value })}
                            className="cs-input w-full px-3 py-1.5 text-xs font-semibold"
                            style={{ color: '#1A1A2E', background: 'white' }}
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base text-[#1A1A2E]">{q.question}</p>
                  )}
                </div>

                {/* Expected Answer Box */}
                {(isRevealed || isEditing) && !isEditing && (
                  <div className="mt-1 pt-2 border-t border-dashed bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-500/10 text-xs">
                    <p><strong className="text-[#10b981] font-bold uppercase tracking-wider text-[9px] mr-1.5">Expected Answer:</strong> {q.expectedAnswer}</p>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Append Question */}
        <div className="w-full max-w-[1000px] mx-auto py-5 text-center border border-dashed rounded-2xl flex flex-col items-center gap-2 bg-purple-50/10"
             style={{ borderColor: 'rgba(107,92,231,0.2)' }}>
          <span className="text-xs font-bold text-[#5A5A72]">Manually append a new oral question:</span>
          <div className="flex gap-2">
            {[
              { id: 'rapid_fire', label: 'Rapid Fire' },
              { id: 'true_false', label: 'True/False' },
              { id: 'vocabulary', label: 'Vocabulary' },
              { id: 'concept_recall', label: 'Concept Recall' }
            ].map(type => (
              <button 
                key={type.id} 
                onClick={() => addQuestion(type.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-white text-xs font-bold text-[#6B5CE7] transition-all bg-white/50"
                style={{ borderColor: 'rgba(107,92,231,0.2)' }}
              >
                <Plus size={12} /> {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Configuration Form Phase ---
  return (
    <div className="h-full flex items-center justify-center p-6 overflow-y-auto custom-scrollbar w-full"
         style={{ background: 'linear-gradient(135deg, rgba(255,245,240,0.6) 0%, rgba(237,232,245,0.6) 100%)' }}>
      <div className="w-full max-w-3xl rounded-3xl p-7 space-y-7 border"
           style={{
             background: 'rgba(255,255,255,0.82)',
             backdropFilter: 'blur(24px)',
             borderColor: 'rgba(107,92,231,0.18)',
             boxShadow: '0 8px 32px rgba(107,92,231,0.08)',
           }}>
        
        {/* Header */}
        <div className="flex flex-col space-y-1 pb-4 border-b" style={{ borderColor: 'rgba(107,92,231,0.1)' }}>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(107,92,231,0.1)' }}>
              <Mic className="w-5 h-5" style={{ color: '#6B5CE7' }} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1A1A2E]" style={{ fontFamily: 'Outfit,sans-serif' }}>
                Oral Question Generator
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Generate oral drill questions, rapid fires, and viva cards mapping RAG contexts.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Basic Selection Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5CE7] flex items-center gap-1.5">
            <Layers size={12} /> Step 1: Syllabus Selection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="class" className="text-xs font-bold text-[#5A5A72]">
                Select Class {isClassLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1 text-[#6B5CE7]" />}
              </label>
              <div className="relative">
                <select
                  id="class"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-xl px-3 py-3 text-sm appearance-none cursor-pointer border"
                  style={{ background: 'white', borderColor: 'rgba(107,92,231,0.18)', color: '#1A1A2E' }}
                  disabled={isGenerating}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls, idx) => (
                    <option key={idx} value={cls}>{cls}</option>
                  ))}
                </select>
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Subject Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="subject" className="text-xs font-bold text-[#5A5A72]">
                Select Subject {isSubjectLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1 text-[#6B5CE7]" />}
              </label>
              <div className="relative">
                <select
                  id="subject"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full rounded-xl px-3 py-3 text-sm appearance-none cursor-pointer border"
                  style={{ background: 'white', borderColor: 'rgba(107,92,231,0.18)', color: '#1A1A2E' }}
                  disabled={!selectedClass || isGenerating}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id || subject._id} value={subject.id || subject._id}>
                      {subject.title || subject.name}
                    </option>
                  ))}
                </select>
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Chapter Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="chapter" className="text-xs font-bold text-[#5A5A72]">
                Select Chapter {isChapterLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1 text-[#6B5CE7]" />}
              </label>
              <div className="relative">
                <select
                  id="chapter"
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full rounded-xl px-3 py-3 text-sm appearance-none cursor-pointer border"
                  style={{ background: 'white', borderColor: 'rgba(107,92,231,0.18)', color: '#1A1A2E' }}
                  disabled={!selectedSubjectId || isGenerating}
                >
                  <option value="">Select Chapter</option>
                  {chapters.map(chapter => (
                    <option key={chapter.id || chapter._id} value={chapter.id || chapter._id}>
                      {chapter.title || chapter.name}
                    </option>
                  ))}
                </select>
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          {/* Topic Focus Input */}
          <div className="flex flex-col space-y-1.5 pt-2">
            <label htmlFor="topic-input" className="text-xs font-bold text-[#5A5A72]">Specific Topic Focus (Optional)</label>
            <div 
              className="w-full flex flex-wrap gap-2 items-center p-2.5 rounded-xl border transition-all"
              style={{ 
                background: 'white', 
                borderColor: 'rgba(107,92,231,0.18)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)'
              }}
            >
              {topics.map((t, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-[#6B5CE7]"
                  style={{ background: 'rgba(107,92,231,0.08)', border: '1px solid rgba(107,92,231,0.15)' }}
                >
                  <span>{t}</span>
                  <button 
                    type="button" 
                    onClick={() => removeTopic(t)} 
                    className="hover:text-red-500 rounded-full transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <input
                id="topic-input"
                type="text"
                placeholder={topics.length === 0 ? "Type a topic and press Enter..." : "Add another topic..."}
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                onKeyDown={handleTopicKeyDown}
                className="flex-1 min-w-[150px] outline-none text-sm px-2 py-0.5 bg-transparent"
                style={{ color: '#1A1A2E' }}
                disabled={isGenerating}
              />
            </div>
            <p className="text-[10px] text-gray-400">
              Type a topic and press **Enter** or **Comma** to add it. You can select multiple specific topics.
            </p>
          </div>
        </div>

        {/* 2. Customization and rules */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5CE7] flex items-center gap-1.5">
            <HelpCircle size={12} /> Step 2: Customization & Modes
          </h3>
          
          {/* Checkboxes */}
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-bold text-[#5A5A72]">Oral Modes:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'rapid_fire', label: 'Rapid Fire (Verbal)' },
                { id: 'true_false', label: 'True / False (Viva)' },
                { id: 'vocabulary', label: 'Vocabulary Check' },
                { id: 'concept_recall', label: 'Concept Recall' }
              ].map(mode => {
                const isSelected = modes.includes(mode.id);
                return (
                  <label key={mode.id} className="flex items-center gap-2 cursor-pointer group select-none">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected}
                      onChange={() => toggleMode(mode.id)}
                      disabled={isGenerating}
                    />
                    <div className="w-4 h-4 rounded flex items-center justify-center transition-all shadow-2xs border" 
                         style={{ 
                           background: isSelected ? '#6B5CE7' : 'white', 
                           borderColor: isSelected ? '#6B5CE7' : 'rgba(107,92,231,0.3)' 
                         }}>
                      {isSelected && <Check size={10} className="text-white font-bold" />}
                    </div>
                    <span className="text-xs font-semibold text-[#1A1A2E]">{mode.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Difficulty Level */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="difficulty" className="text-xs font-bold text-[#5A5A72]">Difficulty Level</label>
              <div className="relative">
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full rounded-xl px-3 py-3 text-sm appearance-none cursor-pointer border"
                  style={{ background: 'white', borderColor: 'rgba(107,92,231,0.18)', color: '#1A1A2E' }}
                  disabled={isGenerating}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Mixed">Mixed</option>
                </select>
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Questions Count */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="qCount" className="text-xs font-bold text-[#5A5A72]">Number of Questions</label>
              <input 
                type="number"
                id="qCount"
                min="1"
                max="25"
                value={qCount}
                onChange={e => setQCount(e.target.value ? parseInt(e.target.value, 10) : "")}
                className="cs-input w-full px-4 py-3 text-sm"
                style={{ color: '#1A1A2E', background: 'white' }}
                disabled={isGenerating}
              />
            </div>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-6 border-t flex justify-end" style={{ borderColor: 'rgba(107,92,231,0.1)' }}>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedClass || !selectedSubjectId || !selectedChapterId || isGenerating}
            className="px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{
              background: '#6B5CE7'
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Generating Oral Drilling Sheet...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                Generate Oral Questions
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
