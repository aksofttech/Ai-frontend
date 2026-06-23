import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-neon-purple hover:bg-purple-600 text-white box-shadow-glow-purple",
    secondary: "glass-panel text-white hover:bg-white/10",
    accent: "bg-emerald-green hover:bg-green-600 text-white box-shadow-glow-green",
    ghost: "text-gray-300 hover:text-white hover:bg-white/5",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
