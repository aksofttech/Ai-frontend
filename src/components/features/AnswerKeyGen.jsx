'use client';
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { 
  Award, CheckCircle2, Sparkles, Loader2, FileText, 
  BookOpen, Layers, Info, FilePenLine, RefreshCw, HelpCircle, UploadCloud, X, Check, ChevronDown, ChevronUp 
} from 'lucide-react';
import api from '@/services/api';

/* ─────────────────────────────────────────────────────────────────
   Clean HTML Print Builder for Official Answer Key & Marking Scheme
───────────────────────────────────────────────────────────────── */
function buildAnswerKeyHTML(generalDetails, answerKeyData) {
  const answers = answerKeyData?.answers || [];
  const meta = answerKeyData?.assessmentDetails || {};

  const css = `
    @page { size: A4; margin: 15mm 18mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11.5pt;
      color: #000;
      background: #fff;
      margin: 0; padding: 0;
      line-height: 1.5;
    }
    .exam-header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; text-align: center; }
    .school-name { text-transform: uppercase; font-size: 18pt; margin: 0 0 4px 0; font-weight: bold; }
    .paper-type { font-size: 13pt; margin: 0 0 15px 0; font-weight: bold; text-transform: uppercase; color: #333; }
    
    .meta-table { width: 100%; margin-top: 10px; border-collapse: collapse; }
    .meta-table td { padding: 5px 2px; font-size: 11pt; font-weight: bold; vertical-align: bottom; }

    .ak-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .ak-table th { background: #eaeaea; color: #000; border: 1.5px solid #000; padding: 10px 8px; text-align: left; font-size: 11pt; text-transform: uppercase; }
    .ak-table td { border: 1px solid #000; padding: 12px 8px; vertical-align: top; font-size: 11pt; }
    .marks-badge { font-weight: bold; font-family: monospace; font-size: 12pt; }
    .tips-text { font-style: italic; color: #333; font-size: 10.5pt; margin-top: 4px; }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Official Evaluation Answer Key</title>
  <style>${css}</style>
</head>
<body>
  <div class="exam-header">
    <div class="school-name">${generalDetails.schoolName || 'School Name'}</div>
    <div class="paper-type">Official Evaluation Answer Key & Marking Scheme</div>
    <table class="meta-table">
      <tr>
        <td style="width: 50%; text-align: left;">Assessment: ${meta.title || generalDetails.title || 'Examination'}</td>
        <td style="width: 50%; text-align: right;">Class: ${meta.className || generalDetails.className || 'N/A'}</td>
      </tr>
      <tr>
        <td style="text-align: left;">Subject: ${meta.subject || generalDetails.subject || 'N/A'}</td>
        <td style="text-align: right;">Total Max Marks: ${meta.totalMarks || generalDetails.totalMarks || 'N/A'}</td>
      </tr>
    </table>
  </div>

  <table class="ak-table">
    <thead>
      <tr>
        <th style="width: 8%; text-align: center;">Q.No</th>
        <th style="width: 32%;">Question Statement</th>
        <th style="width: 35%;">Authoritative Model Answer</th>
        <th style="width: 10%; text-align: center;">Marks</th>
        <th style="width: 15%;">Teacher Grading Tips</th>
      </tr>
    </thead>
    <tbody>
      ${answers.map(ans => `
        <tr>
          <td style="text-align: center; font-weight: bold;">${ans.qno || '-'}</td>
          <td>${ans.question || '-'}</td>
          <td><strong>${ans.answer || '-'}</strong></td>
          <td style="text-align: center;" class="marks-badge">${ans.marks || '1'}</td>
          <td><div class="tips-text">${ans.tips || '-'}</div></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;
}

export default function AnswerKeyGen() {
  const [generalDetails, setGeneralDetails] = useState({
    schoolName: 'YugSoft Academy',
    title: 'Mid Term Assessment',
    className: '10th Grade',
    subject: 'Computer Science',
    totalMarks: '25',
  });

  const [mode, setMode] = useState('upload'); // 'upload' | 'auto'
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isClassesLoading, setIsClassesLoading] = useState(false);

  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedChapterIds, setSelectedChapterIds] = useState([]);
  const [isBooksLoading, setIsBooksLoading] = useState(false);
  const [isChaptersLoading, setIsChaptersLoading] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [showOptionalRag, setShowOptionalRag] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [answerKeyData, setAnswerKeyData] = useState(null);

  // Fetch classes on mount
  useEffect(() => {
    setIsClassesLoading(true);
    api.get('/curriculum/classes').then((res) => {
      const data = res.data?.data || res.data || [];
      const raw = Array.isArray(data) ? data : [];
      const sorted = [...raw].sort((a, b) => {
        const nA = parseInt(String(a?.name ?? a?.className ?? a), 10);
        const nB = parseInt(String(b?.name ?? b?.className ?? b), 10);
        if (!isNaN(nA) && !isNaN(nB)) return nA - nB;
        return String(a).localeCompare(String(b));
      });
      setClasses(sorted);
    }).catch(console.error).finally(() => setIsClassesLoading(false));
  }, []);

  // Fetch books filtered by class
  useEffect(() => {
    if (!selectedClassId) {
      setBooks([]);
      setSelectedBookId('');
      setChapters([]);
      setSelectedChapterIds([]);
      return;
    }
    setIsBooksLoading(true);
    api.get(`/curriculum/subjects?classId=${encodeURIComponent(selectedClassId)}`).then((res) => {
      const data = res.data?.data || res.data || [];
      const raw = Array.isArray(data) ? data : [];
      const sorted = [...raw].sort((a, b) =>
        String(a?.title ?? a?.name ?? '').toLowerCase().localeCompare(
          String(b?.title ?? b?.name ?? '').toLowerCase()
        )
      );
      setBooks(sorted);
      setSelectedBookId('');
    }).catch(console.error).finally(() => setIsBooksLoading(false));
  }, [selectedClassId]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
    setUploadedFile(file);
    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/ai-tools/extract-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const text = res.data?.data?.text || res.data?.text || '';
      setExtractedText(text);
    } catch (err) {
      console.error('PDF extraction error:', err);
      alert('Failed to extract questions from PDF. Please ensure the PDF is valid.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (mode === 'upload' && !uploadedFile && !extractedText.trim()) {
      alert('Please upload an examination paper PDF first.');
      return;
    }
    if (mode === 'auto' && (!selectedClassId || !selectedBookId || selectedChapterIds.length === 0)) {
      alert('Please select class, textbook, and chapters.');
      return;
    }

    let currentPrompt = extractedText;
    if (mode === 'upload' && !currentPrompt.trim() && uploadedFile) {
      setIsExtracting(true);
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        const res = await api.post('/ai-tools/extract-pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        currentPrompt = res.data?.data?.text || res.data?.text || '';
        setExtractedText(currentPrompt);
      } catch (err) {
        console.error('Retry extraction error:', err);
      } finally {
        setIsExtracting(false);
      }
    }

    if (mode === 'upload' && !currentPrompt.trim()) {
      alert('Could not read text from this PDF. Please ensure the file contains readable questions.');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedBook = books.find(b => b.id === selectedBookId || b._id === selectedBookId);
      const selectedChapters = chapters.filter(c => selectedChapterIds.includes(c.id || c._id));

      const reqDto = {
        prompt: mode === 'upload' ? `Here are the extracted examination questions from the uploaded question paper PDF:\n\n${currentPrompt}` : `Auto generate comprehensive review Q&As and answer keys for selected chapters.`,
        bookId: selectedBookId || undefined,
        chapterIds: selectedChapterIds.length > 0 ? selectedChapterIds : undefined,
        subject: generalDetails.subject || selectedBook?.title || selectedBook?.name || 'General Assessment',
        grade: generalDetails.className || '10th Grade',
        chapterTitle: selectedChapters.map(c => c.title || c.name).join(', ') || 'Uploaded PDF Paper',
        answerKeyConfig: {
          generalDetails,
          mode
        }
      };

      const res = await api.post('/ai-tools/answer-key/generate', reqDto);
      const rawData = res.data?.data?.content || res.data?.content;

      let parsed = null;
      if (typeof rawData === 'string') {
        const cleanStr = rawData.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        parsed = JSON.parse(cleanStr);
      } else {
        parsed = rawData;
      }

      setAnswerKeyData(parsed);
      setIsGenerated(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate Answer Key. Please verify your inputs and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!answerKeyData) return;
    const printWindow = window.open('', '_blank', 'width=950,height=750');
    if (!printWindow) {
      alert('Please allow popups to export PDF.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildAnswerKeyHTML(generalDetails, answerKeyData));
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  const isFormValid = Boolean(
    generalDetails.schoolName && 
    generalDetails.title && 
    !isGenerating && 
    !isExtracting && 
    (mode === 'auto' 
      ? (selectedBookId && selectedChapterIds.length > 0) 
      : Boolean(uploadedFile || extractedText.trim().length > 0))
  );

  if (isGenerated && answerKeyData) {
    const answersList = answerKeyData.answers || [];
    const meta = answerKeyData.assessmentDetails || {};

    return (
      <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-8 relative text-[#1A1A2E]">
        {/* Top bar */}
        <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
          <button 
            onClick={() => setIsGenerated(false)} 
            className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-2 font-bold"
          >
            ← Back to Generator Configuration
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
            >
              <FileText size={16}/> Export Official PDF
            </button>
          </div>
        </div>

        {/* Main Results Container */}
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white">
          
          {/* Header Banner */}
          <div className="p-8 border-b border-gray-200" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2A2A4A 100%)' }}>
            <div className="text-center">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mb-3">
                Official AI Verified Evaluation Key
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">{generalDetails.schoolName}</h1>
              <h2 className="text-lg font-semibold text-purple-300 mt-1">{meta.title || generalDetails.title}</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-sm font-medium">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 block mb-1">Class / Grade</span>
                  <span className="font-bold text-white text-base">{meta.className || generalDetails.className}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 block mb-1">Subject</span>
                  <span className="font-bold text-white text-base">{meta.subject || generalDetails.subject}</span>
                </div>
                <div className="col-span-2 md:col-span-1 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 block mb-1">Total Maximum Marks</span>
                  <span className="font-extrabold text-emerald-300 text-base">{meta.totalMarks || generalDetails.totalMarks} Marks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-6 md:p-8 overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b-2 border-gray-200 text-xs font-black uppercase tracking-wider text-[#6B5CE7] bg-purple-50/70">
                  <th className="py-4 px-4 w-16 text-center">Q.No</th>
                  <th className="py-4 px-5 w-1/3">Question Statement</th>
                  <th className="py-4 px-5 w-1/3">Model Authoritative Answer</th>
                  <th className="py-4 px-4 w-24 text-center">Marks</th>
                  <th className="py-4 px-5">Teacher Grading Tips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {answersList.map((row, i) => (
                  <tr key={i} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="py-5 px-4 font-extrabold text-[#1A1A2E] text-center font-mono text-base bg-gray-50/50">{row.qno || i + 1}</td>
                    <td className="py-5 px-5 text-sm text-[#1A1A2E] font-bold leading-relaxed">{row.question || '-'}</td>
                    <td className="py-5 px-5">
                      <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-emerald-950 font-bold text-sm leading-relaxed shadow-2xs">
                        {row.answer || '-'}
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-100 text-purple-900 text-xs border border-purple-200 font-extrabold shadow-2xs">
                        <Award size={13} className="text-purple-600" /> {row.marks || 1}
                      </span>
                    </td>
                    <td className="py-5 px-5 text-xs text-gray-600 font-medium italic leading-relaxed">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        {row.tips || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-8 relative text-[#1A1A2E]">
      <div className="max-w-5xl mx-auto space-y-8 pb-24 relative z-10">
        
        {/* Banner */}
        <div className="p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, rgba(107,92,231,0.12), rgba(16,185,129,0.1))', border: '1.5px solid rgba(107,92,231,0.2)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight font-sans text-[#1A1A2E]">AI Answer Key Generator</h1>
              <p className="text-xs md:text-sm font-medium text-gray-600 mt-0.5">Generate authoritative model answers and grading criteria mapped directly to textbook RAG knowledge.</p>
            </div>
          </div>
          <div className="flex gap-2 self-start md:self-center bg-white p-1 rounded-xl shadow-2xs border border-purple-100">
            <button
              onClick={() => setMode('upload')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${mode === 'upload' ? 'bg-[#6B5CE7] text-white shadow-sm' : 'text-gray-600 hover:text-black'}`}
            >
              <UploadCloud size={14} /> Upload PDF Paper
            </button>
            <button
              onClick={() => setMode('auto')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${mode === 'auto' ? 'bg-[#10b981] text-white shadow-sm' : 'text-gray-600 hover:text-black'}`}
            >
              <Sparkles size={14} /> Auto Chapter Key
            </button>
          </div>
        </div>

        {/* Input Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* General Assessment Header */}
          <GlassCard className={`p-8 rounded-2xl shadow-xs ${mode === 'upload' ? 'md:col-span-2' : ''}`} style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xs bg-purple-100 text-[#6B5CE7]">
                <Info size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1A1A2E]">Assessment Metadata</h2>
                <p className="text-xs text-gray-500">Header details for the evaluation sheet</p>
              </div>
            </div>

            <div className="space-y-5 font-semibold text-sm">
              <div className={mode === 'upload' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-5'}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">School / Academy Name <span className="text-pink-500">*</span></label>
                  <input 
                    type="text" 
                    className="cs-input w-full px-4 py-3 text-sm font-semibold bg-white border border-gray-200 rounded-xl"
                    value={generalDetails.schoolName}
                    onChange={e => setGeneralDetails({...generalDetails, schoolName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Assessment Title <span className="text-pink-500">*</span></label>
                  <input 
                    type="text" 
                    className="cs-input w-full px-4 py-3 text-sm font-semibold bg-white border border-gray-200 rounded-xl"
                    placeholder="e.g. Unit Test 1 or Half Yearly Exam"
                    value={generalDetails.title}
                    onChange={e => setGeneralDetails({...generalDetails, title: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Class / Grade</label>
                  <input 
                    type="text" 
                    className="cs-input w-full px-4 py-3 text-sm font-semibold bg-white border border-gray-200 rounded-xl"
                    value={generalDetails.className}
                    onChange={e => setGeneralDetails({...generalDetails, className: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Total Marks</label>
                  <input 
                    type="text" 
                    className="cs-input w-full px-4 py-3 text-sm font-semibold bg-white border border-gray-200 rounded-xl text-emerald-600 font-bold"
                    value={generalDetails.totalMarks}
                    onChange={e => setGeneralDetails({...generalDetails, totalMarks: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Textbook RAG Source - Shown by default in Auto mode, hidden in Upload mode unless requested */}
          {mode === 'auto' && (
            <GlassCard className="p-8 rounded-2xl shadow-xs flex flex-col justify-between" style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xs bg-emerald-100 text-emerald-600">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A2E]">Syllabus Knowledge Source</h2>
                    <p className="text-xs text-gray-500">Syllabus mapped materials for accurate grading</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Class Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Select Class <span className="text-pink-500">*</span></label>
                    <div className="relative">
                      <select
                        className="cs-input w-full px-4 py-3 text-sm font-semibold bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer text-[#1A1A2E]"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        disabled={isClassesLoading || isGenerating}
                      >
                        <option value="" disabled>{isClassesLoading ? 'Loading classes...' : 'Select a class'}</option>
                        {classes.map((cls, idx) => (
                          <option key={idx} value={cls}>{cls}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-emerald-600">
                        <Layers size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Textbook Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Select Textbook <span className="text-pink-500">*</span></label>
                    <div className="relative">
                      <select 
                        className="cs-input w-full px-4 py-3 text-sm font-semibold bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer text-[#1A1A2E]"
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                        disabled={!selectedClassId || isBooksLoading || isGenerating}
                      >
                        <option value="" disabled>
                          {!selectedClassId ? 'Select a class first' : isBooksLoading ? 'Loading books...' : 'Select curriculum book'}
                        </option>
                        {books.map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.title || b.name}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-emerald-600">
                        <Layers size={16} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Select Chapters <span className="text-pink-500">*</span></label>
                    {selectedBookId ? (
                      <div className="cs-input w-full px-4 py-3 text-sm max-h-40 overflow-y-auto custom-scrollbar bg-white border border-gray-200 rounded-xl">
                        {isChaptersLoading ? (
                          <span className="text-gray-500 font-medium">Loading chapters...</span>
                        ) : chapters.length === 0 ? (
                          <span className="text-gray-500 font-medium">No chapters found.</span>
                        ) : (
                          <div className="space-y-2.5">
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
                                  <div className="w-4 h-4 rounded flex items-center justify-center transition-colors shadow-2xs" style={{ background: isChecked ? '#10b981' : 'white', border: isChecked ? 'none' : '1.5px solid rgba(107,92,231,0.3)' }}>
                                    {isChecked && <Sparkles size={10} className="text-white"/>}
                                  </div>
                                  <span className="text-sm font-semibold transition-colors" style={{ color: isChecked ? '#1A1A2E' : '#5A5A72' }}>
                                    {c.title || c.name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full rounded-xl px-4 py-6 text-center bg-purple-50/50 border border-dashed border-purple-200">
                        <p className="text-sm italic font-medium text-gray-400">Please select a textbook to load chapters</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Input Mode Container */}
        {mode === 'upload' ? (
          <div className="space-y-6">
            <GlassCard className="p-8 rounded-2xl shadow-xs" style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#6B5CE7] flex items-center justify-center">
                    <UploadCloud size={20}/>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A1A2E]">Upload Question Paper (PDF)</h3>
                    <p className="text-xs text-gray-500">AI will extract questions via OCR and generate verified model answers</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">PDF OCR Enabled</span>
              </div>

              {!uploadedFile ? (
                <label className="border-2 border-dashed border-purple-300 hover:border-[#6B5CE7] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-purple-50/30 hover:bg-purple-50/60 group">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isExtracting}
                  />
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#6B5CE7] group-hover:scale-110 transition-transform mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-base font-bold text-[#1A1A2E] mb-1">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-500 font-medium">Supports examination papers in PDF format (Max 10MB)</p>
                </label>
              ) : (
                <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white text-[#6B5CE7] flex items-center justify-center shadow-sm">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A2E] flex items-center gap-2">
                        {uploadedFile.name}
                        {isExtracting ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full font-semibold">
                            <Loader2 size={12} className="animate-spin"/> OCR Reading...
                          </span>
                        ) : extractedText ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                            <Check size={12}/> Questions Extracted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                            <Check size={12}/> Ready for Evaluation
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI answer evaluation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setExtractedText('');
                    }}
                    disabled={isExtracting}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white"
                    title="Remove file"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </GlassCard>

            {/* Optional RAG mapping accordion for uploaded PDFs */}
            <div className="border border-purple-200 rounded-2xl overflow-hidden bg-white/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setShowOptionalRag(!showOptionalRag)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-[#6B5CE7] hover:bg-purple-50/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={16} /> Advanced: Map evaluation strictly to a textbook chapter (Optional)
                </span>
                {showOptionalRag ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {showOptionalRag && (
                <div className="p-6 border-t border-purple-100 bg-white space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Select Textbook</label>
                      <select 
                        className="cs-input w-full px-4 py-3 text-sm font-semibold bg-white border border-gray-200 rounded-xl text-[#1A1A2E]"
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                      >
                        <option value="">No specific textbook (General AI)</option>
                        {books.map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.title || b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">Select Chapters</label>
                      {selectedBookId ? (
                        <div className="cs-input w-full px-4 py-3 text-sm max-h-32 overflow-y-auto custom-scrollbar bg-white border border-gray-200 rounded-xl space-y-2">
                          {chapters.map(c => {
                            const cId = c.id || c._id;
                            const isChecked = selectedChapterIds.includes(cId);
                            return (
                              <label key={cId} className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleChapter(cId)} />
                                <div className="w-4 h-4 rounded flex items-center justify-center transition-colors" style={{ background: isChecked ? '#10b981' : 'white', border: isChecked ? 'none' : '1.5px solid rgba(107,92,231,0.3)' }}>
                                  {isChecked && <Sparkles size={10} className="text-white"/>}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{c.title || c.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 text-xs text-gray-400 italic border border-dashed rounded-xl text-center">Select a textbook first to list chapters</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <GlassCard className="p-8 rounded-2xl shadow-xs text-center bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200">
            <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-pulse" />
            <h3 className="font-extrabold text-lg text-emerald-950 mb-1">Auto Chapter Review Evaluation Key</h3>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">AI will automatically generate comprehensive standard examination questions and an authoritative answer key covering all core learning objectives of the selected chapters.</p>
          </GlassCard>
        )}

        {/* Action Button */}
        <div className="mt-10 text-center flex flex-col items-center max-w-md mx-auto">
          <button 
            disabled={!isFormValid || isGenerating}
            onClick={handleGenerate}
            className="cs-btn-purple w-full py-4 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98"
          >
            {isGenerating ? (
              <>
                <Loader2 size={22} className="animate-spin text-white"/>
                Evaluating & Generating Answer Key...
              </>
            ) : (
              <>
                <CheckCircle2 size={22} className="text-white"/>
                Generate Authoritative Answer Key
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
