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
    <div className="min-h-screen bg-obsidian text-white flex flex-col p-8 font-sans">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto w-full mb-12">
        <div className="flex justify-between text-sm text-gray-400 mb-2 font-medium">
          <span>Question 4 of 10</span>
          <span>40% Completed</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-green box-shadow-glow-green w-[40%] rounded-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
        {/* Question text */}
        <h1 className="text-4xl md:text-5xl font-bold text-center leading-tight mb-16 text-shadow-glow-purple">
          What technology is designed to mimic the interconnected neurons of the human brain?
        </h1>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = isSelected && opt.id === correctOption;
            const isWrong = isSelected && opt.id !== correctOption;

            let cardClasses = "p-8 rounded-2xl border-2 flex items-center gap-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ";
            
            if (isCorrect) {
              cardClasses += "bg-emerald-green/10 border-emerald-green box-shadow-glow-green text-white";
            } else if (isWrong) {
              cardClasses += "bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] text-white";
            } else if (selectedOption && opt.id === correctOption) {
               cardClasses += "bg-emerald-green/10 border-emerald-green box-shadow-glow-green text-white"; // Show correct answer if they got it wrong
            } else {
              cardClasses += "bg-white/5 border-white/10 hover:bg-white/10 hover:border-neon-purple text-gray-300";
            }

            return (
              <div 
                key={opt.id} 
                onClick={() => !selectedOption && setSelectedOption(opt.id)}
                className={cardClasses}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                  isCorrect ? 'bg-emerald-green text-obsidian' :
                  isWrong ? 'bg-red-500 text-white' :
                  selectedOption && opt.id === correctOption ? 'bg-emerald-green text-obsidian' :
                  'bg-white/10 text-white group-hover:bg-neon-purple group-hover:text-white'
                }`}>
                  {opt.id}
                </div>
                <span className="text-2xl font-medium">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {/* Next Button (Appears after selection) */}
        <div className="h-20 mt-12 flex items-center justify-center">
          {selectedOption && (
            <button className="px-12 py-4 rounded-full bg-neon-purple text-white font-bold text-xl box-shadow-glow-purple hover:bg-purple-600 transition-colors animate-pulse">
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
