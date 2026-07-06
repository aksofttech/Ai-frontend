"use client";

import React, { useEffect, useState } from 'react';
import { FileText, Calendar, BookOpen, Loader2, Download, Eye, X, Award } from 'lucide-react';
import api from '@/services/api';

/* ─────────────────────────────────────────────────────────────────
   Homework PDF HTML Builder (Student View)
   ───────────────────────────────────────────────────────────────── */
function buildHomeworkHTML(assignmentData) {
  let questionsHTML = '';

  assignmentData.content.questions.forEach((q, idx) => {
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
</body>
</html>`;
}

export default function MyHomeworkPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/assignment');
        const data = res.data?.data || res.data || [];
        setAssignments(data);
      } catch (err) {
        console.error('Failed to fetch assignments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleDownloadPDF = (assign) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert("Please allow popups to export PDF.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildHomeworkHTML(assign));
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-fade-in text-[#1A1A2E]">
      
      {/* Page Header */}
      <div className="flex items-center gap-4 pb-6" style={{ borderBottom: '1px solid rgba(107,92,231,0.12)' }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: 'rgba(107,92,231,0.08)', border: '1px solid rgba(107,92,231,0.2)' }}
        >
          <FileText size={26} style={{ color: '#6B5CE7' }} />
        </div>
        <div>
          <h1 className="text-3xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>My Homework</h1>
          <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>View and download homework assignments assigned by your teachers</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#6B5CE7' }} />
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Loading homework assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div
          className="text-center py-20 rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px solid rgba(107,92,231,0.12)', backdropFilter: 'blur(16px)' }}
        >
          <BookOpen size={48} className="mx-auto mb-4 text-[#D1D5DB]" />
          <h3 className="text-xl font-bold mb-2">No homework assigned yet</h3>
          <p className="text-sm text-[#9CA3AF]">You're all caught up! Enjoy your free time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((assign) => (
            <div
              key={assign.id}
              className="p-6 rounded-2xl transition-all duration-300 relative border flex flex-col justify-between min-h-[220px]"
              style={{
                background: 'rgba(255,255,255,0.75)',
                borderColor: 'rgba(107,92,231,0.12)',
                boxShadow: '0 2px 12px rgba(107,92,231,0.06)',
              }}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(107,92,231,0.08)', color: '#6B5CE7' }}>
                    {assign.subject}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {assign.class}
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-snug line-clamp-2 mb-2">
                  {assign.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1 mb-4 italic">
                  Chapter: {assign.chapterTitle} {assign.topic ? `(${assign.topic})` : ''}
                </p>
              </div>

              <div className="space-y-4 pt-3 border-t border-dashed" style={{ borderColor: 'rgba(107,92,231,0.12)' }}>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={13} style={{ color: '#6B5CE7' }} />
                  <span>
                    Assigned: {new Date(assign.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedAssignment(assign)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-[#6B5CE7] hover:bg-[#6B5CE7]/5 border"
                    style={{ borderColor: 'rgba(107,92,231,0.2)' }}
                  >
                    <Eye size={14} /> View Task
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(assign)}
                    className="p-2.5 rounded-xl border flex items-center justify-center bg-[#1A1A2E] text-white"
                    title="Download Task PDF"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 backdrop-blur-md bg-obsidian/30 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl rounded-3xl p-6 flex flex-col max-h-[85vh] bg-white border shadow-2xl relative"
               style={{ borderColor: 'rgba(107,92,231,0.2)' }}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b" style={{ borderColor: 'rgba(107,92,231,0.12)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5CE7]">{selectedAssignment.subject} &bull; {selectedAssignment.class}</span>
                <h2 className="text-xl font-black mt-1" style={{ fontFamily: 'Outfit,sans-serif' }}>{selectedAssignment.title}</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Assigned on: {new Date(selectedAssignment.createdAt).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Questions list body (scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-6 space-y-6">
              {selectedAssignment.content.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xs font-black text-gray-700">Question {idx + 1}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase" 
                          style={{ background: 'rgba(107,92,231,0.06)', color: '#6B5CE7' }}>
                      {q.type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#1A1A2E] mb-3">{q.question}</p>

                  {q.type === 'mcq' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pl-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-1.5 text-gray-500 font-medium">
                          <span className="text-[#6B5CE7] font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'match_following' && q.matchPairs && (
                    <div className="w-full max-w-md border rounded-xl overflow-hidden text-xs pl-3">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-100 text-gray-500">
                            <th className="p-2 border-b">Column A</th>
                            <th className="p-2 border-b">Column B</th>
                          </tr>
                        </thead>
                        <tbody>
                          {q.matchPairs.map((pair, pIdx) => (
                            <tr key={pIdx}>
                              <td className="p-2 border-b text-gray-600">{pIdx + 1}. {pair.left}</td>
                              <td className="p-2 border-b text-gray-600">(&nbsp; &nbsp;) &nbsp; {pair.right}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Lines preview for text-responses */}
                  {(q.type === 'short_answer' || q.type === 'long_answer') && (
                    <div className="space-y-1.5 pl-3 mt-2">
                      <div className="border-b border-gray-200 h-6 w-11/12"></div>
                      <div className="border-b border-gray-200 h-6 w-11/12"></div>
                      {q.type === 'long_answer' && (
                        <>
                          <div className="border-b border-gray-200 h-6 w-11/12"></div>
                          <div className="border-b border-gray-200 h-6 w-11/12"></div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t flex justify-end gap-2" style={{ borderColor: 'rgba(107,92,231,0.12)' }}>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  handleDownloadPDF(selectedAssignment);
                  setSelectedAssignment(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#1A1A2E] text-white shadow-sm"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
