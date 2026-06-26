import React from 'react';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(107,92,231,0.15)',
        boxShadow: '0 2px 16px rgba(107,92,231,0.08)',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
