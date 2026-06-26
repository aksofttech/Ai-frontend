import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`cs-input w-full px-4 py-2.5 text-sm ${className}`}
      style={{ color: '#1A1A2E' }}
      {...props}
    />
  );
}
