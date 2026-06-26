import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm";

  const variants = {
    primary: "text-white",
    secondary: "text-cs-dark",
    accent: "text-white",
    ghost: "text-cs-gray",
  };

  const variantStyles = {
    primary: { background: '#6B5CE7', color: 'white', border: 'none' },
    secondary: { background: 'rgba(255,255,255,0.7)', color: '#1A1A2E', border: '1.5px solid rgba(107,92,231,0.2)', backdropFilter: 'blur(12px)' },
    accent: { background: '#059669', color: 'white', border: 'none' },
    ghost: { background: 'transparent', color: '#5A5A72', border: '1px solid rgba(107,92,231,0.15)' },
  };

  return (
    <button
      className={`${baseStyles} ${className}`}
      style={variantStyles[variant] || variantStyles.primary}
      {...props}
    >
      {children}
    </button>
  );
}
