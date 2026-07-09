import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import BookSelectionForm from '@/components/BookSelectionForm';
import { Presentation, Download, FileText, User, Play, Loader2, RefreshCw } from 'lucide-react';
import useCurriculumStore from '@/store/curriculumStore';
import api from '@/services/api';

export default function AIPPTGen() {
  const [selection, setSelection] = useState(null);
  const [theme, setTheme] = useState('Green');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [slidesData, setSlidesData] = useState(null);
  
  const { setSelectedSubjectId, setSelectedChapterId, chapterDetails } = useCurriculumStore();

  const chapterTitle = chapterDetails?.title 
    ? chapterDetails.title 
    : selection?.chapterTitle ? selection.chapterTitle : "Presentation";

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post('/ai-tools/ppt/generate', {
        prompt: `Generate a presentation about the chapter: ${chapterTitle}`,
        chapterId: selection.chapterId,
        bookId: selection.bookId,
      });
      
      let rawData = res.data?.data?.content || res.data?.content;
      let parsed = null;
      if (typeof rawData === 'string') {
        const cleanStr = rawData.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        parsed = JSON.parse(cleanStr);
      } else {
        parsed = rawData;
      }
      
      setSlidesData(parsed);
      setIsGenerated(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!slidesData) return;
    try {
      const res = await api.post('/compiler/pptx', {
        title: chapterTitle,
        slidesJson: JSON.stringify(slidesData),
      }, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${chapterTitle.replace(/\s+/g, '_')}_${Date.now()}.pptx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to download presentation file');
    }
  };

  if (!selection) {
    return (
      <BookSelectionForm
        hidePeriods
        buttonText="Generate PPT"
        subtitle="Choose the book and chapter for your presentation"
        onGenerate={(data) => {
          setSelection(data);
          setSelectedSubjectId(data.bookId);
          setSelectedChapterId(data.chapterId);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-4 overflow-y-auto custom-scrollbar pb-10">
      {/* Header Config Card */}
      <GlassCard className="flex items-center justify-between shrink-0 rounded-2xl p-6 shadow-xs flex-wrap gap-4" style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.18)' }}>
        <div className="flex items-center gap-4">
          <Presentation style={{ color: '#6B5CE7' }} size={26} />
          <div>
            <h3 className="font-bold text-lg" style={{ color: '#1A1A2E' }}>Presentation Generator</h3>
            <p className="text-xs" style={{ color: '#5A5A72' }}>Generate PPTs directly from curriculum syllabus</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-48 font-bold text-sm">
            <Dropdown 
              options={['ChatSavvy Lavender', 'Minimal White', 'Sleek Dark', 'Curriculum Green']} 
              placeholder="Visual Theme" 
              value={theme} 
              onChange={setTheme} 
            />
          </div>
          
          {!isGenerated && (
            <Button 
              variant="accent" 
              className="cs-btn-purple flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm" 
              onClick={handleGenerate} 
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              {isGenerating ? 'Generating...' : 'Generate PPT'}
            </Button>
          )}

          <button
            onClick={() => {
              setSelection(null);
              setSelectedSubjectId('');
              setSelectedChapterId('');
              setIsGenerated(false);
            }}
            title="Change book / chapter"
            className="transition-colors ml-1 p-2 rounded-xl hover:bg-purple-50"
            style={{ color: '#6B5CE7' }}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </GlassCard>

      {/* Before Generation State */}
      {!isGenerated && !isGenerating && (
        <div 
          className="flex-1 flex items-center justify-center rounded-2xl p-10 m-2 transition-all"
          style={{ minHeight: '400px', background: 'rgba(107,92,231,0.03)', border: '2px dashed rgba(107,92,231,0.25)' }}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xs" style={{ background: 'rgba(107,92,231,0.1)', color: '#6B5CE7' }}>
              <Presentation size={32} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: '#1A1A2E' }}>Ready to Generate</h3>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: '#5A5A72' }}>
              Select your preferred theme from the top right and click <strong style={{ color: '#6B5CE7' }}>'Generate PPT'</strong> to create a structured presentation for {chapterTitle}.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex-1 flex flex-col items-center justify-center m-8 py-16">
          <Loader2 size={48} className="animate-spin mb-6" style={{ color: '#6B5CE7' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A2E' }}>Analyzing content...</h3>
          <p className="text-sm font-medium" style={{ color: '#5A5A72' }}>Generating slides and applying theme formatting</p>
        </div>
      )}

      {/* Generated View */}
      {isGenerated && (
        <div className="flex flex-col gap-6 w-full max-w-[900px] mx-auto mt-2 px-2 animate-fade-in">
          <div className="flex items-center gap-4 mb-1">
            <div className="p-3 rounded-2xl shadow-xs" style={{ background: 'rgba(107,92,231,0.1)', color: '#6B5CE7' }}>
              <Presentation size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>{chapterTitle}</h1>
              <p className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: '#6B5CE7' }}>PowerPoint Presentation Ready</p>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl shadow-xs flex flex-col items-center justify-center" style={{ background: 'white', border: '1.5px solid rgba(107,92,231,0.18)' }}>
              <span className="text-2xl font-black mb-1" style={{ color: '#6B5CE7' }}>{slidesData?.length || 0}</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#5A5A72' }}>Total Slides</span>
            </div>
            <div className="p-5 rounded-2xl shadow-xs flex flex-col items-center justify-center" style={{ background: 'white', border: '1.5px solid rgba(16,185,129,0.25)' }}>
              <span className="text-2xl font-black mb-1" style={{ color: '#10b981' }}>{slidesData?.length || 0}</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#5A5A72' }}>Content Slides</span>
            </div>
            <div className="p-5 rounded-2xl shadow-xs flex flex-col items-center justify-center" style={{ background: 'white', border: '1.5px solid rgba(139,92,246,0.25)' }}>
              <span className="text-base font-extrabold mb-1 truncate max-w-full px-2" style={{ color: '#8B5CF6' }}>{theme}</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#5A5A72' }}>Theme</span>
            </div>
            <div className="p-5 rounded-2xl shadow-xs flex flex-col items-center justify-center" style={{ background: 'white', border: '1.5px solid rgba(249,115,22,0.25)' }}>
              <FileText style={{ color: '#F97316' }} className="mb-1" size={24} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#5A5A72' }}>Format: PPTX</span>
            </div>
          </div>

          {/* Presentation Details Card */}
          <GlassCard className="rounded-2xl p-0 overflow-hidden shadow-xs" style={{ background: 'white', border: '1.5px solid rgba(107,92,231,0.18)' }}>
            <div className="p-6">
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b" style={{ borderColor: 'rgba(107,92,231,0.12)' }}>
                <FileText size={18} style={{ color: '#6B5CE7' }} />
                <h3 className="font-bold text-base" style={{ color: '#1A1A2E' }}>Presentation Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#5A5A72' }}>Title</p>
                  <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{chapterTitle}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#5A5A72' }}>Theme</p>
                  <div className="flex items-center gap-2">
                     <div className="w-3.5 h-3.5 rounded-full" style={{ background: '#6B5CE7' }}></div>
                     <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{theme}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#5A5A72' }}>Subtitle</p>
                  <p className="text-sm font-medium" style={{ color: '#5A5A72' }}>Curriculum Aligned AI Presentation</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#5A5A72' }}>Total Slides</p>
                  <p className="text-sm font-bold" style={{ color: '#6B5CE7' }}>{slidesData?.length || 0} slides</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#5A5A72' }}>Generator Engine</p>
                  <p className="text-sm font-medium flex items-center gap-1.5" style={{ color: '#5A5A72' }}>
                    <User size={14} style={{ color: '#6B5CE7' }} /> Yugsoft AI PPT Engine
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#5A5A72' }}>Export Filename</p>
                  <p className="text-xs font-mono py-1 px-2 rounded bg-purple-50 inline-block font-semibold" style={{ color: '#6B5CE7' }}>{chapterTitle.replace(/\s+/g, '_')}.pptx</p>
                </div>
              </div>
            </div>

            <div className="p-6 flex justify-end items-center" style={{ background: 'rgba(107,92,231,0.04)', borderTop: '1px solid rgba(107,92,231,0.12)' }}>
              <Button onClick={handleDownload} className="cs-btn-purple flex items-center gap-2 font-bold px-8 py-3 rounded-full shadow-sm text-sm">
                <Download size={18} /> Download PPTX
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
