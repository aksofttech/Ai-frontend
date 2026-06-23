import React from 'react';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div className={`glass-panel rounded-xl p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
