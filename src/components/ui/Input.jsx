import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-colors ${className}`}
      {...props}
    />
  );
}
