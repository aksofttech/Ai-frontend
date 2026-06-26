'use client';
import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { BrainCircuit, Download } from 'lucide-react';
import BookSelectionForm from '@/components/BookSelectionForm';

/* ─────────────────────────────────────────────────────────────────
   Build a self-contained HTML string from lessonPlan state data.
   This is injected into a new browser window which has ZERO
   Tailwind / Next.js containers — so multi-page works perfectly.
───────────────────────────────────────────────────────────────── */
function buildPrintHTML(lessonPlan) {
  const periods = lessonPlan.periods || [];
  const dateStr = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const css = `
    @page { size: A4; margin: 12mm 15mm; }

    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      color: #111;
      background: white;
      margin: 0;
      padding: 0;
    }

    /* ── Each period = one page ── */
    .period-page {
      page-break-before: always;
      break-before: page;
      padding: 0;
    }
    .period-page:first-child {
      page-break-before: auto;
      break-before: auto;
    }

    /* ── Document header bar ── */
    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3pt solid #16a34a;
      padding-bottom: 8pt;
      margin-bottom: 14pt;
    }
    .brand { font-size: 18pt; font-weight: 900; color: #1a1a2e; }
    .brand-green { color: #16a34a; }
    .doc-title { font-size: 12pt; font-weight: 700; color: #1e293b; flex: 1; text-align: center; margin: 0 16pt; }
    .doc-meta { font-size: 8pt; color: #64748b; text-align: right; white-space: nowrap; }

    /* ── Info summary table ── */
    .info-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5pt solid #334155;
      margin-bottom: 14pt;
      font-size: 10pt;
    }
    .info-table td {
      border: 1pt solid #94a3b8;
      padding: 7pt 9pt;
      vertical-align: top;
    }
    .cell-label {
      display: block;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #1e40af;
      margin-bottom: 3pt;
    }
    .cell-value {
      display: block;
      font-size: 10pt;
      color: #1e293b;
      line-height: 1.4;
    }
    .day-badge {
      display: inline-block;
      background: #dcfce7;
      color: #14532d;
      font-weight: 800;
      font-size: 9pt;
      padding: 2pt 9pt;
      border-radius: 20pt;
    }
    .obj-list {
      margin: 0;
      padding-left: 14pt;
    }
    .obj-list li {
      margin-bottom: 2pt;
      font-size: 9.5pt;
      line-height: 1.4;
    }
    .topic-value {
      font-size: 11pt;
      font-weight: 700;
      color: #1e293b;
    }

    /* ── Section blocks ── */
    .section-block {
      border: 1pt solid #cbd5e1;
      margin-bottom: 10pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .section-header {
      background: #1e3a5f;
      color: white;
      font-size: 10pt;
      font-weight: 700;
      padding: 5pt 10pt;
    }
    .section-body {
      padding: 9pt 11pt;
      font-size: 10pt;
      color: #1e293b;
      line-height: 1.55;
    }

    /* ── Homework banner ── */
    .hw-block {
      border: 1pt solid #bbf7d0;
      background: #f0fdf4;
      padding: 7pt 11pt;
      margin-bottom: 10pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .hw-label {
      display: block;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #15803d;
      margin-bottom: 3pt;
    }
    .hw-text { font-size: 10pt; color: #166534; }

    /* ── Footer ── */
    .doc-footer {
      border-top: 1pt solid #e2e8f0;
      padding-top: 5pt;
      margin-top: 14pt;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #94a3b8;
    }
  `;

  const periodsHTML = periods.map((period, i) => {
    const introHTML = period.introduction
      ? `<div class="section-block">
           <div class="section-header">Introduction</div>
           <div class="section-body">${period.introduction}</div>
         </div>` : '';

    const explorationHTML = period.exploration
      ? `<div class="section-block">
           <div class="section-header">Exploration</div>
           <div class="section-body">${period.exploration}</div>
         </div>` : '';

    const conclusionHTML = period.conclusion
      ? `<div class="section-block">
           <div class="section-header">Conclusion</div>
           <div class="section-body">${period.conclusion}</div>
         </div>` : '';

    const hwHTML = period.homework
      ? `<div class="hw-block">
           <span class="hw-label">Homework / Assignment</span>
           <div class="hw-text">${period.homework}</div>
         </div>` : '';

    const objectivesHTML = (lessonPlan.learningObjectives || [])
      .map(obj => `<li>${obj}</li>`).join('');

    return `
      <div class="period-page">

        <!-- Document header -->
        <div class="doc-header">
          <div class="brand">Yugsoft <span class="brand-green">Tech</span></div>
          <div class="doc-title">AI Lesson Plan — ${lessonPlan.chapterName || 'Chapter'}</div>
          <div class="doc-meta">Generated on ${dateStr}</div>
        </div>

        <!-- Info summary table -->
        <table class="info-table">
          <tbody>
            <tr>
              <td style="width:18%">
                <span class="cell-label">Period / Day</span>
                <span class="day-badge">Day ${period.day}</span>
              </td>
              <td style="width:20%">
                <span class="cell-label">Time</span>
                <span class="cell-value">${period.duration || '40 min'}</span>
              </td>
              <td style="width:62%">
                <span class="cell-label">Skill</span>
                <span class="cell-value">${period.skill || '—'}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <span class="cell-label">Theme</span>
                <span class="cell-value">${lessonPlan.theme || '—'}</span>
              </td>
              <td>
                <span class="cell-label">Chapter</span>
                <span class="cell-value">${lessonPlan.chapterName || '—'}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="vertical-align:top">
                <span class="cell-label">NCF Curriculum Goals</span>
                <span class="cell-value">${lessonPlan.ncfGoals || '—'}</span>
              </td>
              <td style="vertical-align:top">
                <span class="cell-label">Learning Objectives</span>
                <ul class="obj-list">${objectivesHTML}</ul>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <span class="cell-label">Topic for Day ${period.day}</span>
                <span class="topic-value">${period.topic || '—'}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Sections -->
        ${introHTML}
        ${explorationHTML}
        ${conclusionHTML}
        ${hwHTML}

        <!-- Footer -->
        <div class="doc-footer">
          <span>Yugsoft Tech — AI Lesson Plan Generator</span>
          <span>${lessonPlan.chapterName || ''} · Day ${period.day} of ${periods.length} · ${new Date().getFullYear()}</span>
        </div>

      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Lesson Plan — ${lessonPlan.chapterName || 'Chapter'}</title>
  <style>${css}</style>
</head>
<body>
  ${periodsHTML}
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────── */
export default function AILessonPlan() {
  const [lessonPlan, setLessonPlan] = useState(null);

  const handleExportPDF = () => {
    if (!lessonPlan) return;

    // Open a fresh, empty window — no Tailwind, no h-full, no overflow-hidden
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Please allow popups for this site to export PDF.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintHTML(lessonPlan));
    printWindow.document.close();

    // Wait for images/fonts to load, then trigger print dialog
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Close the helper window after the dialog closes
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  if (!lessonPlan) {
    return <BookSelectionForm onGenerate={(data) => setLessonPlan(data)} />;
  }

  const periods = lessonPlan.periods || [];

  return (
    <div className="h-full flex flex-col gap-6 p-4 overflow-y-auto custom-scrollbar">
      {/* Config Card */}
      <GlassCard className="flex flex-col gap-4 rounded-2xl p-6 shadow-xs" style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: '#1A1A2E' }}>
            <BrainCircuit style={{ color: '#6B5CE7' }} />
            {lessonPlan.chapterName || 'AI Lesson Plan Generated'}
          </h3>
          <div className="flex items-center gap-3">
            <Button
              variant="accent"
              className="flex items-center gap-2 bg-[#1A1A2E] hover:opacity-90 text-white text-sm px-4 py-2 rounded-xl transition-all shadow-xs font-bold"
              onClick={handleExportPDF}
            >
              <Download size={15} />
              Export PDF
            </Button>
            <Button
              variant="accent"
              className="text-sm px-4 py-2 rounded-xl font-bold transition-all shadow-xs hover:bg-purple-50"
              style={{ background: 'rgba(107,92,231,0.1)', color: '#6B5CE7', border: '1px solid rgba(107,92,231,0.2)' }}
              onClick={() => setLessonPlan(null)}
            >
              Reset / New Plan
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#5A5A72' }}>Theme</label>
            <Input defaultValue={lessonPlan.theme || 'N/A'} readOnly className="cs-input w-full font-semibold" style={{ color: '#1A1A2E', background: 'white' }} />
          </div>
          <div className="flex-[2]">
            <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#5A5A72' }}>NCF Goals</label>
            <Input defaultValue={lessonPlan.ncfGoals || 'N/A'} readOnly className="cs-input w-full font-semibold" style={{ color: '#1A1A2E', background: 'white' }} />
          </div>
        </div>

        <div className="mt-2 p-4 rounded-xl shadow-2xs" style={{ background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.25)' }}>
          <strong className="text-xs font-extrabold uppercase tracking-wider block mb-2" style={{ color: '#065f46' }}>
            Learning Objectives:
          </strong>
          <ul className="list-disc list-inside text-sm space-y-1 font-medium" style={{ color: '#047857' }}>
            {(lessonPlan.learningObjectives || []).map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* Timeline */}
      <GlassCard className="flex-1 rounded-2xl p-6 shadow-xs flex flex-col gap-6 relative" style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
        <div className="absolute left-[51px] top-10 bottom-10 w-1 rounded-full" style={{ background: 'rgba(107,92,231,0.15)' }} />
        {periods.map((period, i) => (
          <div key={i} className="flex gap-6 relative z-10">
            <div className="w-20 shrink-0 flex flex-col items-center pt-2">
              <div className="w-4 h-4 rounded-full mb-1.5 z-10 shadow-sm" style={{ background: '#6B5CE7', border: '3px solid white' }} />
              <span className="text-xs font-extrabold mt-1 uppercase" style={{ color: '#6B5CE7' }}>
                Day {period.day}
              </span>
              <span className="text-[11px] font-semibold text-center leading-tight mt-0.5" style={{ color: '#5A5A72' }}>
                {period.duration}
              </span>
            </div>

            <div className="flex-1 p-6 rounded-2xl shadow-xs transition-all hover:shadow-sm" style={{ background: 'white', border: '1px solid rgba(107,92,231,0.18)' }}>
              <div className="flex justify-between items-start mb-4 pb-3 border-b" style={{ borderColor: 'rgba(107,92,231,0.1)' }}>
                <h4 className="text-lg font-bold" style={{ color: '#1A1A2E' }}>{period.topic}</h4>
                <span className="px-3 py-1 text-xs font-extrabold uppercase rounded-full tracking-wide shadow-2xs" style={{ background: 'rgba(107,92,231,0.1)', color: '#6B5CE7' }}>
                  {period.skill}
                </span>
              </div>

              <div className="space-y-4">
                {period.introduction && (
                  <div>
                    <h5 className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: '#6B5CE7' }}>
                      Introduction
                    </h5>
                    <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>{period.introduction}</p>
                  </div>
                )}
                {period.exploration && (
                  <div>
                    <h5 className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: '#6B5CE7' }}>
                      Exploration
                    </h5>
                    <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>{period.exploration}</p>
                  </div>
                )}
                {period.conclusion && (
                  <div>
                    <h5 className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: '#6B5CE7' }}>
                      Conclusion
                    </h5>
                    <p className="text-sm leading-relaxed" style={{ color: '#5A5A72' }}>{period.conclusion}</p>
                  </div>
                )}
                {period.homework && (
                  <div className="pt-4 border-t mt-4" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                    <h5 className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: '#059669' }}>
                      Homework / Assignment
                    </h5>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: '#065f46' }}>{period.homework}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {periods.length === 0 && (
          <div className="text-center py-12 font-semibold text-base" style={{ color: '#9CA3AF' }}>
            No periods generated in this plan.
          </div>
        )}
      </GlassCard>
    </div>
  );
}
