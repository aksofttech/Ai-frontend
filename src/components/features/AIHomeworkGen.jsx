"use client";

import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { 
  Sparkles, Loader2, Download, Send, RefreshCw, Trash2, 
  Edit2, Check, X, FileText, CheckCircle, Info, BookOpen, Layers, 
  HelpCircle, Plus, Eye, EyeOff
} from 'lucide-react';
import api from '@/services/api';

/* ─────────────────────────────────────────────────────────────────
   Homework PDF Clean HTML Builder
   ───────────────────────────────────────────────────────────────── */
function buildHomeworkHTML(assignmentData) {
  let questionsHTML = '';

  assignmentData.questions.forEach((q, idx) => {
    let questionContent = '';
    
    if (q.type === 'mcq') {
      questionContent = `
        <div class="options-grid">
          ${q.options ? q.options.map((opt, oIdx) => `
            <div class="option-cell">
              <span class="opt-prefix">(${String.fromCharCode(97 + oIdx)})</span>
              <span>${opt}</span>
            </div>
          `).join('') : ''}
        </div>
      `;
    } else if (q.type === 'match_following') {
      questionContent = `
        <table class="match-table">
          <thead>
            <tr>
              <th style="width: 50%;">Column A</th>
              <th style="width: 50%;">Column B</th>
            </tr>
          </thead>
          <tbody>
            ${q.matchPairs ? q.matchPairs.map((pair, pIdx) => `
              <tr>
                <td>${pIdx + 1}. ${pair.left}</td>
                <td>( &nbsp; &nbsp; ) &nbsp;&nbsp;&nbsp; ${pair.right}</td>
              </tr>
            `).join('') : ''}
          </tbody>
        </table>
      `;
    } else if (q.type === 'fill_in_the_blank') {
      questionContent = `
        <div class="writing-line" style="border-bottom: 1px dotted #ccc; height: 15px; margin-top: 5px; width: 90%; margin-left: 20px;"></div>
      `;
    } else if (q.type === 'short_answer') {
      questionContent = `
        <div class="writing-line"></div>
        <div class="writing-line"></div>
      `;
    } else if (q.type === 'long_answer') {
      questionContent = `
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
      `;
    }

    questionsHTML += `
      <div class="question-item">
        <p class="q-text"><strong>Q${idx + 1}. ${q.question}</strong></p>
        ${questionContent}
      </div>
    `;
  });

  let hintsHTML = '';
  const hasHints = assignmentData.questions.some(q => q.parentHint);
  if (hasHints) {
    hintsHTML += `
      <div class="page-break"></div>
      <div class="hints-container">
        <h2 style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 5px; font-size: 14pt;">PARENT HINT SHEET & ANSWER KEY</h2>
        <p style="font-style: italic; font-size: 10pt; text-align: center; margin-bottom: 20px; color: #444;">Use this sheet to guide your child with their homework questions.</p>
        <div class="hints-list">
          ${assignmentData.questions.map((q, idx) => `
            <div class="hint-item" style="margin-bottom: 18px; page-break-inside: avoid;">
              <p><strong>Q${idx + 1} Correct Answer:</strong> ${q.answer || 'N/A'}</p>
              ${q.parentHint ? `<p style="margin-left: 15px; color: #555; font-size: 10.5pt; line-height: 1.4;"><em>Parent Helper Hint:</em> ${q.parentHint}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const css = `
    @page { size: A4; margin: 18mm 20mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      color: #000;
      background: #fff;
      margin: 0; padding: 0;
      line-height: 1.5;
    }
    .assignment-header { text-align: center; margin-bottom: 25px; }
    .school-name { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; }
    .assignment-title { font-size: 13pt; font-weight: bold; margin: 0 0 10px 0; }
    .class-subject { font-size: 11pt; font-style: italic; margin: 5px 0; }
    
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-table td { padding: 5px; font-size: 10pt; font-weight: bold; }
    .border-line { border-bottom: 1px dashed #000; display: inline-block; width: 75%; height: 12px; }
    
    .question-item { margin-bottom: 25px; page-break-inside: avoid; }
    .q-text { margin: 0 0 6px 0; font-size: 11.5pt; }
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 30px; padding-left: 20px; margin-top: 5px; }
    .option-cell { display: flex; gap: 6px; }
    .opt-prefix { font-weight: bold; }
    
    .match-table { width: 95%; border-collapse: collapse; margin-top: 8px; margin-left: 20px; }
    .match-table th, .match-table td { border: 1px solid #ccc; padding: 6px 10px; font-size: 10.5pt; text-align: left; }
    .match-table th { background-color: #f5f5f5; }

    .writing-line { border-bottom: 1px solid #999; height: 26px; width: 93%; margin-left: 20px; }
    .page-break { page-break-before: always; }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${assignmentData.title}</title>
  <style>${css}</style>
</head>
<body>
  <div class="assignment-header">
    <h1 class="school-name">HOMEWORK ASSIGNMENT</h1>
    <h2 class="assignment-title">${assignmentData.title}</h2>
    <div class="class-subject">${assignmentData.class} &bull; ${assignmentData.subject}</div>
  </div>

  <table class="info-table">
    <tr>
      <td style="width: 50%;">Student Name: <span class="border-line" style="width: 72%"></span></td>
      <td style="width: 50%;">Roll No: <span class="border-line" style="width: 80%"></span></td>
    </tr>
    <tr>
      <td>Section: <span class="border-line" style="width: 81%"></span></td>
      <td>Submission Date: <span class="border-line" style="width: 65%"></span></td>
    </tr>
  </table>
  <hr style="border: 0; border-top: 2px solid #000; margin-bottom: 20px;" />

  <div class="questions-container">
    ${questionsHTML}
  </div>

  ${hintsHTML}
</body>
</html>`;
}

export default function AIHomeworkGen() {
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
  
  // --- Config options ---
  const [questionTypes, setQuestionTypes] = useState(['mcq', 'short_answer']);
  const [difficulty, setDifficulty] = useState("Medium");
  const [qCount, setQCount] = useState(5);
  const [theme, setTheme] = useState("Traditional");
  const [includeParentHint, setIncludeParentHint] = useState(false);

  // --- UI/API states ---
  const [isClassLoading, setIsClassLoading] = useState(false);
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  const [isChapterLoading, setIsChapterLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showAnswerPreview, setShowAnswerPreview] = useState(false);

  // --- Homework data loaded after generation ---
  const [assignmentData, setAssignmentData] = useState(null);

  // --- Inline Editing State ---
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({
    question: "",
    answer: "",
    parentHint: "",
    options: ["", "", "", ""],
    matchPairs: []
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

  const toggleQuestionType = (type) => {
    if (questionTypes.includes(type)) {
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter(t => t !== type));
      }
    } else {
      setQuestionTypes([...questionTypes, type]);
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
      const res = await api.post("/ai-tools/homework/generate", {
        prompt: `Generate custom homework assignment questions. Style: ${theme}. Topic Focus: ${finalTopic || 'Entire Chapter'}. Question count: ${qCount}`,
        chapterId: selectedChapterId,
        bookId: selectedSubjectId,
        grade: selectedClass,
        subject: subjectName,
        homeworkConfig: {
          questionTypes,
          difficulty,
          qCount,
          theme,
          includeParentHint,
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
          console.error("Failed to parse homework content", rawContent);
          alert("Parsing error in AI response. Retrying generation might help.");
          setIsGenerating(false);
          return;
        }
      } else {
        parsed = rawContent;
      }

      if (parsed) {
        // Enforce basic fields if missing
        if (!parsed.title) parsed.title = `Homework: ${chapterTitle || 'Assigned Topic'}`;
        if (!parsed.questions || !Array.isArray(parsed.questions)) parsed.questions = [];

        // Save metadata info
        parsed.class = selectedClass;
        parsed.subject = subjectName;
        parsed.chapterTitle = chapterTitle;
        parsed.topic = (topics.length > 0 ? topics.join(", ") : "") || 'Entire Chapter';

        setAssignmentData(parsed);
        setIsGenerated(true);
      } else {
        alert("Received empty assignment data from server.");
      }
    } catch (err) {
      console.error("AI Generation failed", err);
      alert("Failed to generate homework. Please ensure API Key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Inline Edit handlers ---
  const startEditing = (q) => {
    setEditingId(q.id);
    setEditFields({
      question: q.question || "",
      answer: q.answer || "",
      parentHint: q.parentHint || "",
      options: q.options ? [...q.options] : ["", "", "", ""],
      matchPairs: q.matchPairs ? q.matchPairs.map(p => ({ ...p })) : []
    });
  };

  const saveEditing = (id) => {
    setAssignmentData(prev => {
      const updatedQuestions = prev.questions.map(q => {
        if (q.id === id) {
          return {
            ...q,
            question: editFields.question,
            answer: editFields.answer,
            parentHint: editFields.parentHint,
            options: q.type === 'mcq' ? [...editFields.options] : undefined,
            matchPairs: q.type === 'match_following' ? [...editFields.matchPairs] : undefined
          };
        }
        return q;
      });
      return { ...prev, questions: updatedQuestions };
    });
    setEditingId(null);
  };

  const deleteQuestion = (id) => {
    setAssignmentData(prev => {
      const filtered = prev.questions.filter(q => q.id !== id);
      return { ...prev, questions: filtered };
    });
  };

  const addQuestion = (type) => {
    const newId = `q_added_${Date.now()}`;
    const newQ = {
      id: newId,
      type,
      question: `New ${type.replace(/_/g, ' ')} question text`,
      answer: "Correct answer key",
      parentHint: includeParentHint ? "Hint for parents to guide the student" : undefined
    };

    if (type === 'mcq') {
      newQ.options = ["Option A", "Option B", "Option C", "Option D"];
      newQ.answer = "Option A";
    } else if (type === 'match_following') {
      newQ.matchPairs = [
        { left: "Item A", right: "Match A" },
        { left: "Item B", right: "Match B" }
      ];
    }

    setAssignmentData(prev => ({
      ...prev,
      questions: [...prev.questions, newQ]
    }));
    startEditing(newQ);
  };

  const handleExportPDF = () => {
    if (!assignmentData) return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert("Please allow popups to export PDF.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildHomeworkHTML(assignmentData));
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  const handleSendToStudentPortal = async () => {
    if (!assignmentData || assignmentData.questions.length === 0) {
      alert("No questions in assignment to send!");
      return;
    }
    setIsAssigning(true);
    try {
      await api.post("/assignment", {
        title: assignmentData.title,
        class: assignmentData.class,
        subject: assignmentData.subject,
        chapterTitle: assignmentData.chapterTitle,
        topic: assignmentData.topic,
        content: {
          title: assignmentData.title,
          questions: assignmentData.questions
        }
      });
      alert("🎉 Homework successfully assigned and sent to Student Portal!");
    } catch (err) {
      console.error("Failed to assign homework", err);
      alert("Failed to send homework to Student Portal. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  // --- View Phase ---
  if (isGenerated && assignmentData) {
    return (
      <div className="h-full flex flex-col gap-6 p-6 relative text-[#1A1A2E] overflow-y-auto custom-scrollbar">
        {/* Top Header */}
        <div className="w-full max-w-[1000px] mx-auto rounded-2xl p-6 flex flex-col gap-6 shadow-xs border" 
             style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(107,92,231,0.18)', backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B5CE7]">Generated Homework</span>
              <h2 className="text-2xl font-black mt-1" style={{ fontFamily: 'Outfit,sans-serif' }}>
                <input 
                  type="text" 
                  value={assignmentData.title}
                  onChange={e => setAssignmentData({ ...assignmentData, title: e.target.value })}
                  className="bg-transparent border-b border-transparent hover:border-[#6B5CE7] focus:border-[#6B5CE7] outline-none font-black py-0.5 w-full text-2xl"
                />
              </h2>
              <p className="text-xs text-[#5A5A72] mt-1.5 font-medium">
                {assignmentData.class} &bull; {assignmentData.subject} &bull; {assignmentData.chapterTitle}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAnswerPreview(!showAnswerPreview)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-colors text-xs border"
                style={{ 
                  background: showAnswerPreview ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: showAnswerPreview ? '#10b981' : '#5A5A72',
                  borderColor: showAnswerPreview ? 'rgba(16,185,129,0.2)' : 'rgba(107,92,231,0.15)'
                }}
              >
                {showAnswerPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                Answers & Hints
              </button>
              <button 
                onClick={() => {
                  setIsGenerated(false);
                  setAssignmentData(null);
                }}
                className="p-2.5 rounded-xl border border-dashed hover:bg-purple-50 transition-colors"
                style={{ color: '#6B5CE7', borderColor: 'rgba(107,92,231,0.3)' }}
                title="Change assignment config"
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
              <Download size={15} /> Download PDF
            </button>
            <button 
              onClick={handleSendToStudentPortal}
              disabled={isAssigning}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all text-sm shadow-xs border ml-auto"
              style={{ background: 'rgba(107,92,231,0.1)', color: '#6B5CE7', borderColor: 'rgba(107,92,231,0.2)' }}
            >
              {isAssigning ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
              Send to Student Portal
            </button>
          </div>
        </div>

        {/* Preview questions body */}
        <div className="w-full max-w-[1000px] mx-auto space-y-5">
          {assignmentData.questions.map((q, idx) => {
            const isEditing = editingId === q.id;

            return (
              <GlassCard key={q.id} className="p-6 rounded-2xl shadow-2xs border flex flex-col gap-4 relative transition-all"
                         style={{ background: 'rgba(255,255,255,0.75)', borderColor: 'rgba(107,92,231,0.12)' }}>
                {/* Q header */}
                <div className="flex justify-between items-center pb-2.5 border-b" style={{ borderColor: 'rgba(107,92,231,0.08)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#1A1A2E]">Question {idx + 1}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" 
                          style={{ background: 'rgba(107,92,231,0.08)', color: '#6B5CE7' }}>
                      {q.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEditing(q.id)} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg" title="Save">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg" title="Cancel">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(q)} className="p-2 hover:bg-purple-50 text-[#6B5CE7] rounded-lg" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteQuestion(q.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Q Text */}
                <div className="text-sm">
                  {isEditing ? (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A72]">Question Prompt</label>
                      <textarea
                        value={editFields.question}
                        onChange={e => setEditFields({ ...editFields, question: e.target.value })}
                        className="cs-input w-full px-3 py-2 text-sm font-semibold"
                        style={{ color: '#1A1A2E', background: 'white' }}
                        rows={2}
                      />
                    </div>
                  ) : (
                    <p className="font-bold text-[#1A1A2E]">{q.question}</p>
                  )}
                </div>

                {/* Q type specific options/match pairs */}
                {q.type === 'mcq' && (
                  <div className="pl-4 mt-2">
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-3">
                        {editFields.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#6B5CE7]">{String.fromCharCode(65 + oIdx)}.</span>
                            <input 
                              type="text"
                              value={opt}
                              onChange={e => {
                                const newOpts = [...editFields.options];
                                newOpts[oIdx] = e.target.value;
                                setEditFields({ ...editFields, options: newOpts });
                              }}
                              className="cs-input px-2 py-1 flex-1 text-xs"
                              style={{ color: '#1A1A2E', background: 'white' }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#5A5A72]">
                        {q.options && q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-1.5">
                            <span className="text-[#6B5CE7] font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {q.type === 'match_following' && (
                  <div className="pl-4 mt-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A72]">Match Pairs</label>
                        {editFields.matchPairs.map((pair, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-3">
                            <input
                              type="text"
                              placeholder="Left Side"
                              value={pair.left}
                              onChange={e => {
                                const newPairs = [...editFields.matchPairs];
                                newPairs[pIdx].left = e.target.value;
                                setEditFields({ ...editFields, matchPairs: newPairs });
                              }}
                              className="cs-input px-2 py-1 text-xs flex-1"
                              style={{ color: '#1A1A2E', background: 'white' }}
                            />
                            <span className="text-xs text-[#6B5CE7] font-bold">&harr;</span>
                            <input
                              type="text"
                              placeholder="Right Side"
                              value={pair.right}
                              onChange={e => {
                                const newPairs = [...editFields.matchPairs];
                                newPairs[pIdx].right = e.target.value;
                                setEditFields({ ...editFields, matchPairs: newPairs });
                              }}
                              className="cs-input px-2 py-1 text-xs flex-1"
                              style={{ color: '#1A1A2E', background: 'white' }}
                            />
                            <button
                              onClick={() => {
                                setEditFields({
                                  ...editFields,
                                  matchPairs: editFields.matchPairs.filter((_, idx) => idx !== pIdx)
                                });
                              }}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setEditFields({
                              ...editFields,
                              matchPairs: [...editFields.matchPairs, { left: "", right: "" }]
                            });
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#6B5CE7] hover:underline"
                        >
                          <Plus size={10} /> Add Pair
                        </button>
                      </div>
                    ) : (
                      <div className="w-full max-w-md border border-dashed rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-purple-50/50 text-[#5A5A72]">
                              <th className="p-2 border-b">Column A</th>
                              <th className="p-2 border-b">Column B</th>
                            </tr>
                          </thead>
                          <tbody className="text-[#1A1A2E]">
                            {q.matchPairs && q.matchPairs.map((pair, pIdx) => (
                              <tr key={pIdx}>
                                <td className="p-2 border-b">{pIdx + 1}. {pair.left}</td>
                                <td className="p-2 border-b">(&nbsp; &nbsp;) &nbsp; {pair.right}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Answers / Hints Section */}
                {(showAnswerPreview || isEditing) && (
                  <div className="mt-2 pt-3 border-t border-dashed flex flex-col gap-2 bg-[#10b981]/[0.02] p-3 rounded-xl border border-[#10b981]/10">
                    <div className="text-xs">
                      {isEditing ? (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#10b981]">Correct Answer Key</label>
                          <input 
                            type="text"
                            value={editFields.answer}
                            onChange={e => setEditFields({ ...editFields, answer: e.target.value })}
                            className="cs-input px-3 py-1.5 text-xs font-semibold"
                            style={{ color: '#1A1A2E', background: 'white' }}
                          />
                        </div>
                      ) : (
                        <p><strong className="text-[#10b981]">Correct Answer:</strong> {q.answer}</p>
                      )}
                    </div>
                    {((q.parentHint && !isEditing) || isEditing) && (
                      <div className="text-xs">
                        {isEditing ? (
                          <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B5CE7]">Parent Hint Sheet Info</label>
                            <textarea
                              value={editFields.parentHint}
                              onChange={e => setEditFields({ ...editFields, parentHint: e.target.value })}
                              className="cs-input w-full px-3 py-1.5 text-xs font-semibold"
                              style={{ color: '#1A1A2E', background: 'white' }}
                              rows={1}
                            />
                          </div>
                        ) : (
                          <p><strong className="text-[#6B5CE7]">Parent Hint:</strong> <span className="italic">{q.parentHint}</span></p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Add question type selector at bottom */}
        <div className="w-full max-w-[1000px] mx-auto py-6 text-center border border-dashed rounded-2xl flex flex-col items-center gap-3 bg-purple-50/10"
             style={{ borderColor: 'rgba(107,92,231,0.2)' }}>
          <span className="text-xs font-bold text-[#5A5A72]">Manually append a new question:</span>
          <div className="flex gap-2">
            {[
              { id: 'mcq', label: 'MCQ' },
              { id: 'fill_in_the_blank', label: 'Fill Blanks' },
              { id: 'short_answer', label: 'Short Answer' },
              { id: 'long_answer', label: 'Long Answer' },
              { id: 'match_following', label: 'Match Following' }
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
              <BookOpen className="w-5 h-5" style={{ color: '#6B5CE7' }} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1A1A2E]" style={{ fontFamily: 'Outfit,sans-serif' }}>
                AI Homework Generator
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Design custom home assignment worksheets using context-retrieved RAG textbook chapters.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Basic Selection Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5CE7] flex items-center gap-1.5">
            <Layers size={12} /> Step 1: Basic Syllabus Selection
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

        {/* 2. Homework Types and Levels */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5CE7] flex items-center gap-1.5">
            <HelpCircle size={12} /> Step 2: Customization & Rules
          </h3>
          
          {/* Checkboxes */}
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-bold text-[#5A5A72]">Question Types:</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'mcq', label: 'MCQs' },
                { id: 'fill_in_the_blank', label: 'Blanks' },
                { id: 'short_answer', label: 'Short' },
                { id: 'long_answer', label: 'Long / Essay' },
                { id: 'match_following', label: 'Match Columns' }
              ].map(type => {
                const isSelected = questionTypes.includes(type.id);
                return (
                  <label key={type.id} className="flex items-center gap-2 cursor-pointer group select-none">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected}
                      onChange={() => toggleQuestionType(type.id)}
                      disabled={isGenerating}
                    />
                    <div className="w-4 h-4 rounded flex items-center justify-center transition-all shadow-2xs border" 
                         style={{ 
                           background: isSelected ? '#6B5CE7' : 'white', 
                           borderColor: isSelected ? '#6B5CE7' : 'rgba(107,92,231,0.3)' 
                         }}>
                      {isSelected && <Check size={10} className="text-white font-bold" />}
                    </div>
                    <span className="text-xs font-semibold text-[#1A1A2E]">{type.label}</span>
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
                  <option value="Mixed">Mixed (Mixed Types)</option>
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

        {/* 3. Advanced AI Settings */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5CE7] flex items-center gap-1.5">
            <Sparkles size={12} /> Step 3: Advanced AI Style Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Homework Theme/Style */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="theme" className="text-xs font-bold text-[#5A5A72]">Homework Theme/Style</label>
              <div className="relative">
                <select
                  id="theme"
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className="w-full rounded-xl px-3 py-3 text-sm appearance-none cursor-pointer border"
                  style={{ background: 'white', borderColor: 'rgba(107,92,231,0.18)', color: '#1A1A2E' }}
                  disabled={isGenerating}
                >
                  <option value="Traditional">Traditional (Academic Questions)</option>
                  <option value="Real-World Application">Real-World Application (Case Studies & Careers)</option>
                  <option value="Fun / Gamified">Fun / Gamified (Riddles & Interactive Scenarios)</option>
                </select>
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Parent's Hint Sheet Toggle */}
            <div className="flex items-center gap-4 h-full md:mt-5 bg-white p-3.5 rounded-xl border" 
                 style={{ borderColor: 'rgba(107,92,231,0.15)' }}>
              <div className="flex-1">
                <label className="text-xs font-bold text-[#1A1A2E] block">Parent's Hint Sheet</label>
                <span className="text-[10px] text-gray-400">Include answer keys and helper tips for parents.</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIncludeParentHint(!includeParentHint)}
                className="w-12 h-6 rounded-full p-1 transition-colors relative duration-200"
                style={{ background: includeParentHint ? '#6B5CE7' : 'rgba(107,92,231,0.18)' }}
                disabled={isGenerating}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${includeParentHint ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
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
                Generating Custom Assignment...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                Generate Assignment
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
