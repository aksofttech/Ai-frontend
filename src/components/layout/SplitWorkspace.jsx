import React from 'react';
import useCurriculumStore from '@/store/curriculumStore';
import { Loader2 } from 'lucide-react';
import useThemeStore from '@/store/themeStore';

export default function SplitWorkspace({ children, showReader = true }) {
  const { chapterDetails, isChapterDetailsLoading } = useCurriculumStore();
  const chapterTitle = chapterDetails?.title || 'No Chapter Selected';
  const { darkMode } = useThemeStore();

  return (
    <div className="flex-1 flex overflow-hidden p-4 gap-4 pt-0">
      {/* Left Workspace Panel — Textbook Reader */}
      {showReader && (
        <div
          className="w-[40%] h-full flex flex-col rounded-2xl overflow-hidden relative transition-all"
          style={{
            background: darkMode ? 'rgba(20, 15, 45, 0.55)' : 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            border: darkMode ? '1.5px solid rgba(107,92,231,0.25)' : '1.5px solid rgba(107,92,231,0.15)',
            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 16px rgba(107,92,231,0.08)'
          }}
        >
          {/* Sticky Header */}
          <div
            className="sticky top-0 z-10 p-4 transition-colors"
            style={{
              background: darkMode ? 'rgba(15, 12, 35, 0.85)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              borderBottom: darkMode ? '1px solid rgba(107,92,231,0.2)' : '1px solid rgba(107,92,231,0.1)'
            }}
          >
            <h2 className="text-base font-bold" style={{ color: darkMode ? '#F3F4F6' : '#1A1A2E' }}>Textbook Reader</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{chapterTitle}</p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 text-sm leading-relaxed relative"
            style={{ color: darkMode ? '#D1D5DB' : '#5A5A72' }}>
            {isChapterDetailsLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 animate-fade-in"
                style={{ background: darkMode ? 'rgba(15, 12, 35, 0.7)' : 'rgba(255,255,255,0.7)' }}>
                <Loader2 className="animate-spin w-7 h-7" style={{ color: '#6B5CE7' }} />
              </div>
            )}

            {chapterDetails?.chunks?.length > 0 ? (
              chapterDetails.chunks.map((chunk, index) => (
                <p key={chunk.id || index}>{chunk.contentText}</p>
              ))
            ) : (
              !isChapterDetailsLoading && (
                <div className="italic text-center mt-10" style={{ color: '#9CA3AF' }}>
                  No content available for this chapter.
                </div>
              )
            )}
            <div className="h-20" />
          </div>
        </div>
      )}

      {/* Right Workspace Panel — AI Orchestration Canvas */}
      <div
        className={`${showReader ? 'w-[60%]' : 'w-full'} flex-1 overflow-y-auto custom-scrollbar flex flex-col relative rounded-2xl`}
      >
        {children}
      </div>
    </div>
  );
}
