"use client";

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette, Volume2,
  Sparkles, CheckCircle2, RefreshCw, LogOut, Key, Trash2, Award, Flame, BookOpen,
  Briefcase, Globe, FileText, CheckCircle
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';

export default function TeacherSettings() {
  const { user, logout } = useAuthStore();
  const { darkMode } = useThemeStore();

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [defaultClass, setDefaultClass] = useState('Class 10 (Board Exam Level)');
  const [defaultSubject, setDefaultSubject] = useState('Science & Mathematics');
  const [defaultLanguage, setDefaultLanguage] = useState('English (Standard Medium)');

  // Classroom & AI Generation Toggles
  const [autoSaveELibrary, setAutoSaveELibrary] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [liveLeaderboardProjection, setLiveLeaderboardProjection] = useState(true);

  // Status indicators
  const [saving, setSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || user.email?.split('@')[0] || 'Teacher Faculty');
      setEmail(user.email || 'teacher@yugsoft.com');
    } else {
      setName('Faculty Educator');
      setEmail('teacher@yugsoft.com');
    }

    // Load saved preferences from localStorage if present
    try {
      const savedPrefsStr = localStorage.getItem('teacher_settings_prefs');
      if (savedPrefsStr) {
        const prefs = JSON.parse(savedPrefsStr);
        if (prefs.defaultClass) setDefaultClass(prefs.defaultClass);
        if (prefs.defaultSubject) setDefaultSubject(prefs.defaultSubject);
        if (prefs.defaultLanguage) setDefaultLanguage(prefs.defaultLanguage);
        if (prefs.autoSaveELibrary !== undefined) setAutoSaveELibrary(prefs.autoSaveELibrary);
        if (prefs.soundEffects !== undefined) setSoundEffects(prefs.soundEffects);
        if (prefs.liveLeaderboardProjection !== undefined) setLiveLeaderboardProjection(prefs.liveLeaderboardProjection);
      }
    } catch (e) {}
  }, [user]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      try {
        const prefs = {
          defaultClass,
          defaultSubject,
          defaultLanguage,
          autoSaveELibrary,
          soundEffects,
          liveLeaderboardProjection,
        };
        localStorage.setItem('teacher_settings_prefs', JSON.stringify(prefs));

        if (user && useAuthStore.setState) {
          useAuthStore.setState({ user: { ...user, name } });
        }
      } catch (err) {}

      setSaving(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);
    }, 600);
  };

  const handleClearLocalCache = () => {
    if (window.confirm('Are you sure you want to clear local teacher workspace temporary cache and generation drafts?')) {
      try {
        localStorage.removeItem('teacher_settings_prefs');
        localStorage.removeItem('worksheet_drafts');
        setCacheCleared(true);
        setTimeout(() => setCacheCleared(false), 3000);
      } catch (e) {}
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out of the Faculty Portal?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in font-bold text-sm">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>Faculty Settings & AI Defaults saved successfully!</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6" style={{ borderBottom: darkMode ? '1px solid rgba(107,92,231,0.25)' : '1px solid rgba(107,92,231,0.12)' }}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs"
            style={{ background: 'linear-gradient(135deg, rgba(107,92,231,0.15), rgba(139,92,246,0.1))', border: '1.5px solid rgba(107,92,231,0.25)' }}
          >
            <SettingsIcon size={28} style={{ color: '#6B5CE7' }} />
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: darkMode ? '#F3F4F6' : '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>Faculty Account & Settings</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Configure AI lesson generation parameters, class targets, and workspace preferences</p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="cs-btn-purple px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile & Quick Actions Card */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div
            className="p-6 rounded-3xl space-y-6 text-center relative overflow-hidden"
            style={{
              background: darkMode ? 'rgba(20,15,40,0.85)' : 'rgba(255,255,255,0.85)',
              border: darkMode ? '1.5px solid rgba(107,92,231,0.25)' : '1.5px solid rgba(107,92,231,0.15)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 24px rgba(107,92,231,0.06)'
            }}
          >
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-black text-white shadow-lg relative"
              style={{ background: 'linear-gradient(135deg, #6B5CE7, #8B5CF6)' }}>
              {name ? name.charAt(0).toUpperCase() : 'T'}
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Verified Faculty">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black truncate" style={{ color: darkMode ? '#F3F4F6' : '#111827', fontFamily: 'Outfit,sans-serif' }}>
                {name}
              </h3>
              <p className="text-xs text-purple-600 font-bold mt-0.5 uppercase tracking-wider">Verified Educator Account</p>
              <p className="text-xs text-gray-400 mt-1 truncate">{email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100/20">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] font-bold uppercase text-purple-600 block">Default Target</span>
                <span className="text-sm font-black text-purple-800 dark:text-purple-200 truncate block">Class 10</span>
              </div>
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-[10px] font-bold uppercase text-orange-600 block">Access Level</span>
                <span className="text-sm font-black text-orange-800 dark:text-orange-200">Faculty</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div
            className="p-6 rounded-3xl space-y-4"
            style={{
              background: darkMode ? 'rgba(20,15,40,0.85)' : 'rgba(255,255,255,0.85)',
              border: darkMode ? '1.5px solid rgba(107,92,231,0.25)' : '1.5px solid rgba(107,92,231,0.15)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 24px rgba(107,92,231,0.06)'
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: darkMode ? '#E5E7EB' : '#111827' }}>
              <Shield size={16} className="text-purple-600" /> Security & Workspace Actions
            </h4>

            <button
              onClick={handleClearLocalCache}
              className="w-full py-3 px-4 rounded-xl text-left text-xs font-bold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center justify-between group"
            >
              <span className="flex items-center gap-2">
                <Trash2 size={15} /> Clear Workspace Cache
              </span>
              {cacheCleared ? <span className="text-emerald-500 font-bold">Cleared!</span> : <span className="text-gray-400 group-hover:text-rose-500">→</span >}
            </button>

            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 rounded-xl text-left text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-500/10 hover:bg-gray-500/20 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <LogOut size={15} /> Sign Out of Portal
              </span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right Column - Preferences & Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* 1. Profile Information */}
            <div
              className="p-6 md:p-8 rounded-3xl space-y-6"
              style={{
                background: darkMode ? 'rgba(20,15,40,0.85)' : 'rgba(255,255,255,0.85)',
                border: darkMode ? '1.5px solid rgba(107,92,231,0.25)' : '1.5px solid rgba(107,92,231,0.15)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 24px rgba(107,92,231,0.06)'
              }}
            >
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100/20">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black" style={{ color: darkMode ? '#F3F4F6' : '#111827', fontFamily: 'Outfit,sans-serif' }}>Personal Information</h3>
                  <p className="text-xs text-gray-400">Your educator name as displayed on generated worksheets, lesson plans, and classroom PPTs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: darkMode ? '#D1D5DB' : '#374151' }}>
                    Faculty Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-500/10 border border-gray-500/20 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-sm font-semibold outline-none transition-all"
                    style={{ color: darkMode ? '#F9FAFB' : '#111827' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: darkMode ? '#D1D5DB' : '#374151' }}>
                    Faculty Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-500/10 border border-gray-500/20 text-sm font-semibold text-gray-400 outline-none cursor-not-allowed"
                    title="Faculty email is managed by the institution administrator"
                  />
                </div>
              </div>
            </div>

            {/* 2. AI Generation & Curriculum Defaults */}
            <div
              className="p-6 md:p-8 rounded-3xl space-y-6"
              style={{
                background: darkMode ? 'rgba(20,15,40,0.85)' : 'rgba(255,255,255,0.85)',
                border: darkMode ? '1.5px solid rgba(107,92,231,0.25)' : '1.5px solid rgba(107,92,231,0.15)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 24px rgba(107,92,231,0.06)'
              }}
            >
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100/20">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <Flame size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black" style={{ color: darkMode ? '#F3F4F6' : '#111827', fontFamily: 'Outfit,sans-serif' }}>AI Generation & Curriculum Defaults</h3>
                  <p className="text-xs text-gray-400">Set standard academic parameters for quick AI lesson, worksheet, and question generation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: darkMode ? '#D1D5DB' : '#374151' }}>
                    Default Target Class
                  </label>
                  <select
                    value={defaultClass}
                    onChange={(e) => setDefaultClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-500/10 border border-gray-500/20 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-sm font-semibold outline-none transition-all cursor-pointer"
                    style={{ color: darkMode ? '#F9FAFB' : '#111827' }}
                  >
                    <option value="Class 8 (Middle School)">Class 8 (Middle School)</option>
                    <option value="Class 9 (Foundation)">Class 9 (Foundation)</option>
                    <option value="Class 10 (Board Exam Level)">Class 10 (Board Exam Level)</option>
                    <option value="Class 11 (Senior Secondary)">Class 11 (Senior Secondary)</option>
                    <option value="Class 12 (Advanced Level)">Class 12 (Advanced Level)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: darkMode ? '#D1D5DB' : '#374151' }}>
                    Primary Teaching Subject
                  </label>
                  <select
                    value={defaultSubject}
                    onChange={(e) => setDefaultSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-500/10 border border-gray-500/20 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-sm font-semibold outline-none transition-all cursor-pointer"
                    style={{ color: darkMode ? '#F9FAFB' : '#111827' }}
                  >
                    <option value="Science & Mathematics">Science & Mathematics</option>
                    <option value="Physics & Chemistry">Physics & Chemistry</option>
                    <option value="Biology & Environmental Science">Biology & Environmental Science</option>
                    <option value="English Literature & Grammar">English Literature & Grammar</option>
                    <option value="Social Studies & History">Social Studies & History</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: darkMode ? '#D1D5DB' : '#374151' }}>
                    Default Generation Language
                  </label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-500/10 border border-gray-500/20 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-sm font-semibold outline-none transition-all cursor-pointer"
                    style={{ color: darkMode ? '#F9FAFB' : '#111827' }}
                  >
                    <option value="English (Standard Medium)">English (Standard Medium)</option>
                    <option value="Hindi (Devanagari Medium)">Hindi (Devanagari Medium)</option>
                    <option value="Bilingual (English + Hindi Explanation)">Bilingual (English + Hindi Explanation)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Classroom Workflow & Automation Toggles */}
            <div
              className="p-6 md:p-8 rounded-3xl space-y-6"
              style={{
                background: darkMode ? 'rgba(20,15,40,0.85)' : 'rgba(255,255,255,0.85)',
                border: darkMode ? '1.5px solid rgba(107,92,231,0.25)' : '1.5px solid rgba(107,92,231,0.15)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 24px rgba(107,92,231,0.06)'
              }}
            >
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100/20">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black" style={{ color: darkMode ? '#F3F4F6' : '#111827', fontFamily: 'Outfit,sans-serif' }}>Classroom Workflow Automation</h3>
                  <p className="text-xs text-gray-400">Control auto-saving behavior and interactive sound cues during classroom presentations</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Auto Save to E-Library */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-500/5 border border-gray-500/15">
                  <div className="flex items-center gap-3">
                    <BookOpen size={20} className="text-purple-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: darkMode ? '#F3F4F6' : '#111827' }}>Auto-Save Worksheets to E-Library</h4>
                      <p className="text-xs text-gray-400">Automatically store generated worksheets and answer keys to your institutional E-Library repository</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoSaveELibrary(!autoSaveELibrary)}
                    className={`w-14 h-8 rounded-full transition-colors relative px-1 flex items-center ${autoSaveELibrary ? 'bg-purple-600' : 'bg-gray-400'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${autoSaveELibrary ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Sound effects */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-500/5 border border-gray-500/15">
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className="text-orange-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: darkMode ? '#F3F4F6' : '#111827' }}>Classroom Quiz Audio Feedback</h4>
                      <p className="text-xs text-gray-400">Play celebratory audio tones during live gamified quiz sessions when students answer</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundEffects(!soundEffects)}
                    className={`w-14 h-8 rounded-full transition-colors relative px-1 flex items-center ${soundEffects ? 'bg-purple-600' : 'bg-gray-400'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${soundEffects ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Leaderboard Projection */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-500/5 border border-gray-500/15">
                  <div className="flex items-center gap-3">
                    <Award size={20} className="text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: darkMode ? '#F3F4F6' : '#111827' }}>Live Leaderboard Projection Mode</h4>
                      <p className="text-xs text-gray-400">Optimize quiz results screen for large smartboards and classroom projector displays</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLiveLeaderboardProjection(!liveLeaderboardProjection)}
                    className={`w-14 h-8 rounded-full transition-colors relative px-1 flex items-center ${liveLeaderboardProjection ? 'bg-purple-600' : 'bg-gray-400'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${liveLeaderboardProjection ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit button bar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="cs-btn-purple px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                {saving ? 'Saving Faculty Settings...' : 'Save All Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
