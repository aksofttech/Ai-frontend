import React from 'react';

export default function Slider({ value, min = 0, max = 100, onChange, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-green"
      />
    </div>
  );
}
