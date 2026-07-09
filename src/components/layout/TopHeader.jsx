import React from 'react';
import { Menu } from 'lucide-react';
import useThemeStore from '@/store/themeStore';

export default function TopHeader({ toggleSidebar }) {
  const { darkMode } = useThemeStore();
  
  return (
    <header
      data-id="top-header"
      className="h-[64px] shrink-0 w-full flex items-center justify-between md:justify-end px-4 md:px-6 z-20 transition-colors duration-300"
      style={{
        background: darkMode ? 'rgba(10, 7, 30, 0.7)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(16px)',
        borderBottom: darkMode ? '1px solid rgba(107,92,231,0.2)' : '1px solid rgba(107,92,231,0.1)'
      }}
    >
      {/* Mobile Menu Button */}
      {toggleSidebar && (
        <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 transition-colors" style={{ color: darkMode ? '#A1A1AA' : '#5A5A72' }}>
          <Menu size={22} />
        </button>
      )}
    </header>
  );
}
