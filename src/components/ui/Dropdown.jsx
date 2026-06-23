import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ options, placeholder, value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-left text-sm text-white flex justify-between items-center hover:bg-white/10 transition-colors"
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 glass-panel border border-white/10 rounded-lg shadow-xl overflow-hidden">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-neon-purple/20 hover:text-white transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
