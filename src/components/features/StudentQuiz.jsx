import React, { useState } from 'react';

export default function StudentQuiz() {
  const [selectedOption, setSelectedOption] = useState(null);
  const correctOption = 'B';
  const options = [
    { id: 'A', text: 'Central Processing Unit (CPU)' },
    { id: 'B', text: 'Artificial Neural Network' },
    { id: 'C', text: 'Random Access Memory (RAM)' },
    { id: 'D', text: 'Solid State Drive' },
  ];

  return (
    <div className="h-full flex flex-col p-6 font-sans overflow-y-auto custom-scrollbar">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto w-full mb-10">
        <div className="flex justify-between text-sm font-bold mb-2.5" style={{ color: '#5A5A72' }}>
          <span>Question 4 of 10</span>
          <span style={{ color: '#6B5CE7' }}>40% Completed</span>
        </div>
        <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(107,92,231,0.12)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: '40%', background: '#6B5CE7' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full pb-16">
        {/* Question text */}
        <h1 className="text-2xl md:text-3xl font-black text-center leading-tight mb-12 tracking-tight" style={{ color: '#1A1A2E' }}>
          What technology is designed to mimic the interconnected neurons of the human brain?
        </h1>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = isSelected && opt.id === correctOption;
            const isWrong = isSelected && opt.id !== correctOption;

            let borderStyle = '1.5px solid rgba(107,92,231,0.18)';
            let bgStyle = 'rgba(255,255,255,0.85)';
            let textStyle = '#1A1A2E';
            let badgeBg = 'rgba(107,92,231,0.1)';
            let badgeText = '#6B5CE7';

            if (isCorrect || (selectedOption && opt.id === correctOption)) {
              borderStyle = '2px solid #10b981';
              bgStyle = 'rgba(16,185,129,0.08)';
              textStyle = '#065f46';
              badgeBg = '#10b981';
              badgeText = 'white';
            } else if (isWrong) {
              borderStyle = '2px solid #ef4444';
              bgStyle = 'rgba(239,68,68,0.08)';
              textStyle = '#991b1b';
              badgeBg = '#ef4444';
              badgeText = 'white';
            }

            return (
              <div 
                key={opt.id} 
                onClick={() => !selectedOption && setSelectedOption(opt.id)}
                className="p-6 rounded-2xl flex items-center gap-5 cursor-pointer transition-all duration-200 shadow-xs hover:scale-[1.01]"
                style={{ background: bgStyle, border: borderStyle, color: textStyle }}
              >
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-extrabold shrink-0"
                  style={{ background: badgeBg, color: badgeText }}
                >
                  {opt.id}
                </div>
                <span className="text-base font-bold">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {/* Next Button */}
        <div className="h-16 mt-10 flex items-center justify-center">
          {selectedOption && (
            <button className="cs-btn-purple px-10 py-3.5 rounded-full font-bold text-base shadow-sm animate-fade-in">
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
