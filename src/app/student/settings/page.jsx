"use client";

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette, Volume2,
  Sparkles, CheckCircle2, RefreshCw, LogOut, Key, Trash2, Award, Flame, BookOpen
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function StudentSettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Class 10');
  const [preferredDifficulty, setPreferredDifficulty] = useState('Medium (Standard AI Challenge)');

  // Toggles & Preferences
  const [soundEffects, setSoundEffects] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [leaderboardAlerts, setLeaderboardAlerts] = useState(true);
  const [themeMode, setThemeMode] = useState('glass');

  // Status indicators
  const [saving, setSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || user.email?.split('@')[0] || 'Student');
      setEmail(user.email || 'student@school.edu');
    } else {
      setName('Ajeet Ojha');
      setEmail('ajeetojha9057@gmail.com');
    }

    // Load saved preferences from localStorage if present
    try {
      const savedPrefsStr = localStorage.getItem('student_settings_prefs');
      if (savedPrefsStr) {
        const prefs = JSON.parse(savedPrefsStr);
        if (prefs.gradeLevel) setGradeLevel(prefs.gradeLevel);
        if (prefs.preferredDifficulty) setPreferredDifficulty(prefs.preferredDifficulty);
        if (prefs.soundEffects !== undefined) setSoundEffects(prefs.soundEffects);
        if (prefs.streakReminders !== undefined) setStreakReminders(prefs.streakReminders);
        if (prefs.leaderboardAlerts !== undefined) setLeaderboardAlerts(prefs.leaderboardAlerts);
        if (prefs.themeMode) setThemeMode(prefs.themeMode);
      }
    } catch (e) {}
  }, [user]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      try {
        const prefs = {
          gradeLevel,
          preferredDifficulty,
          soundEffects,
          streakReminders,
          leaderboardAlerts,
          themeMode,
        };
        localStorage.setItem('student_settings_prefs', JSON.stringify(prefs));

        // Also update auth store name locally if needed
        if (user && useAuthStore.setState) {
          useAuthStore.setState({ user: { ...user, name } });
        }
      } catch (err) {}

      setSaving(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);
    }, 600);
  };

  const handleClearLocalHistory = () => {
    if (window.confirm('Are you sure you want to clear your local device quiz history? Points stored on server will remain safe.')) {
      try {
        localStorage.removeItem('my_quiz_history');
        setCacheCleared(true);
        setTimeout(() => setCacheCleared(false), 3000);
      } catch (e) {}
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to log out of your student portal?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-fade-in px-2">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in font-bold text-sm">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>Settings & Preferences saved successfully!</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6" style={{ borderBottom: '1px solid rgba(107,92,231,0.12)' }}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs"
            style={{ background: 'linear-gradient(135deg, rgba(107,92,231,0.15), rgba(139,92,246,0.1))', border: '1.5px solid rgba(107,92,231,0.25)' }}
          >
            <SettingsIcon size={28} style={{ color: '#6B5CE7' }} />
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#1A1A2E', fontFamily: 'Outfit,sans-serif' }}>Account & Settings</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Manage your profile information, AI study parameters, and interactive notifications</p>
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
        {/* Left Column - Profile & Quick Stats Card */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div
            className="p-6 rounded-3xl space-y-6 text-center relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(107,92,231,0.06)' }}
          >
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-black text-white shadow-lg relative"
              style={{ background: 'linear-gradient(135deg, #6B5CE7, #A855F7)' }}>
              {name ? name.charAt(0).toUpperCase() : 'S'}
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Active Student">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900 truncate" style={{ fontFamily: 'Outfit,sans-serif' }}>
                {name}
              </h3>
              <p className="text-xs text-purple-600 font-bold mt-0.5 uppercase tracking-wider">Verified Student Account</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{email}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                <span className="text-[10px] font-bold uppercase text-purple-700 block">Current Class</span>
                <span className="text-sm font-black text-purple-900">{gradeLevel}</span>
              </div>
              <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-100">
                <span className="text-[10px] font-bold uppercase text-orange-700 block">Study Role</span>
                <span className="text-sm font-black text-orange-900">Student</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div
            className="p-6 rounded-3xl space-y-4"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(107,92,231,0.06)' }}
          >
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} className="text-purple-600" /> Security & Device Actions
            </h4>

            <button
              onClick={handleClearLocalHistory}
              className="w-full py-3 px-4 rounded-xl text-left text-xs font-bold text-rose-600 bg-rose-50/60 hover:bg-rose-100/80 border border-rose-200 transition-colors flex items-center justify-between group"
            >
              <span className="flex items-center gap-2">
                <Trash2 size={15} /> Clear Local Quiz Cache
              </span>
              {cacheCleared ? <span className="text-emerald-600 font-bold">Cleared!</span> : <span className="text-gray-400 group-hover:text-rose-600">→</span >}
            </button>

            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 rounded-xl text-left text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-between"
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
              style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(107,92,231,0.06)' }}
            >
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Outfit,sans-serif' }}>Personal Information</h3>
                  <p className="text-xs text-gray-500">Your profile details as shown across quizzes and leaderboards</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-sm font-semibold text-gray-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-500 outline-none cursor-not-allowed"
                    title="Email is verified by school administrator and cannot be edited locally"
                  />
                </div>
              </div>
            </div>

            {/* 2. Learning & Quiz AI Preferences */}
            <div
              className="p-6 md:p-8 rounded-3xl space-y-6"
              style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(107,92,231,0.06)' }}
            >
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Flame size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Outfit,sans-serif' }}>AI Study & Quiz Parameters</h3>
                  <p className="text-xs text-gray-500">Configure default generation rules and academic level for AI generated worksheets & quizzes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Academic Class Level
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-sm font-semibold text-gray-900 outline-none transition-all cursor-pointer"
                  >
                    <option value="Class 8">Class 8 (Middle School)</option>
                    <option value="Class 9">Class 9 (Foundation)</option>
                    <option value="Class 10">Class 10 (Board Exam Level)</option>
                    <option value="Class 11">Class 11 (Senior Secondary)</option>
                    <option value="Class 12">Class 12 (Advanced Level)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Default Quiz Difficulty
                  </label>
                  <select
                    value={preferredDifficulty}
                    onChange={(e) => setPreferredDifficulty(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 text-sm font-semibold text-gray-900 outline-none transition-all cursor-pointer"
                  >
                    <option value="Easy (Concept Building)">Easy (Concept Building)</option>
                    <option value="Medium (Standard AI Challenge)">Medium (Standard AI Challenge)</option>
                    <option value="Hard (Exam & Olympiad Level)">Hard (Exam & Olympiad Level)</option>
                    <option value="Adaptive (Auto-Scales with XP)">Adaptive (Auto-Scales with XP)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Gamification & Notifications Toggles */}
            <div
              className="p-6 md:p-8 rounded-3xl space-y-6"
              style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(107,92,231,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(107,92,231,0.06)' }}
            >
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Outfit,sans-serif' }}>Gamification & Notifications</h3>
                  <p className="text-xs text-gray-500">Control interactive sound feedback and study streak notifications</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Sound effects */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Volume2 size={20} className="text-purple-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Interactive Quiz Sound Effects</h4>
                      <p className="text-xs text-gray-500">Play celebratory audio cues when answering questions correctly</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundEffects(!soundEffects)}
                    className={`w-14 h-8 rounded-full transition-colors relative px-1 flex items-center ${soundEffects ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${soundEffects ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Streak reminders */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Award size={20} className="text-orange-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Study Streak & XP Reminders</h4>
                      <p className="text-xs text-gray-500">Receive motivational popups to maintain your daily study consistency</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStreakReminders(!streakReminders)}
                    className={`w-14 h-8 rounded-full transition-colors relative px-1 flex items-center ${streakReminders ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${streakReminders ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Leaderboard Alerts */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Leaderboard Rank Updates</h4>
                      <p className="text-xs text-gray-500">Alert me when my global rank changes or another student overtakes me</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLeaderboardAlerts(!leaderboardAlerts)}
                    className={`w-14 h-8 rounded-full transition-colors relative px-1 flex items-center ${leaderboardAlerts ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${leaderboardAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
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
                {saving ? 'Saving Settings...' : 'Save All Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
