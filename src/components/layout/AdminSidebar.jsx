import React from 'react';
import {
  LayoutDashboard, BookOpen, Users, LogOut, User, Brain
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuthStore();
  const userEmail = user?.email || 'admin@yugsoft.com';
  const displayEmail = userEmail.split('@')[0];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'curriculum', label: 'Curriculum Manager', icon: BookOpen },
    { id: 'users', label: 'User Directory', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div
      className="w-[260px] h-full flex flex-col"
      style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', borderRight: '1px solid rgba(107,92,231,0.15)' }}
    >
      {/* Brand Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(107,92,231,0.1)' }}>
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6B5CE7,#8B7CF6)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
          <h1 className="text-lg font-black tracking-tight" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>
            YugSoft <span style={{ color: '#6B5CE7' }}>Admin</span>
          </h1>
        </Link>
      </div>

      {/* Section label */}
      <div className="px-4 pt-4 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
          Administration
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium"
              style={isActive
                ? { background: 'rgba(107,92,231,0.1)', color: '#6B5CE7', borderLeft: '3px solid #6B5CE7' }
                : { color: '#5A5A72', borderLeft: '3px solid transparent' }
              }
            >
              <Icon size={16} style={isActive ? { color: '#6B5CE7' } : { color: '#9CA3AF' }} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User Profile Pill */}
      <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(107,92,231,0.1)' }}>
        <div className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: 'rgba(107,92,231,0.05)', border: '1px solid rgba(107,92,231,0.12)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(107,92,231,0.12)', border: '1px solid rgba(107,92,231,0.3)' }}>
            <User size={15} style={{ color: '#6B5CE7' }} />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#1A1A2E' }}>{displayEmail}</p>
            <p className="text-xs font-semibold uppercase" style={{ color: '#6B5CE7' }}>Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(239,68,68,0.06)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          <LogOut size={15} />
          Log Out
        </button>
      </div>
    </div>
  );
}
