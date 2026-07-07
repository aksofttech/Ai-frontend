"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import api from '@/services/api';
import { 
  Loader2, Download, BookOpen, Search, AlertCircle, 
  Sparkles, SlidersHorizontal, BookMarked, Layers, 
  ArrowUpDown, Filter, Lock, HelpCircle 
} from 'lucide-react';

// Helper to assign a premium gradient and icon design based on the book's subject
const getSubjectTheme = (subject) => {
  const s = subject?.toLowerCase() || '';
  if (s.includes('science') || s.includes('physics') || s.includes('chem') || s.includes('bio')) {
    return {
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      accent: '#3B82F6',
      badgeBg: 'rgba(59,130,246,0.1)',
      pattern: 'bg-radial-at-t from-blue-400/20 to-transparent'
    };
  }
  if (s.includes('math') || s.includes('geometry') || s.includes('arithmetic')) {
    return {
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      accent: '#F59E0B',
      badgeBg: 'rgba(245,158,11,0.1)',
      pattern: 'bg-radial-at-t from-amber-400/20 to-transparent'
    };
  }
  if (s.includes('english') || s.includes('hindi') || s.includes('language') || s.includes('reader') || s.includes('lit')) {
    return {
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
      accent: '#EC4899',
      badgeBg: 'rgba(236,72,153,0.1)',
      pattern: 'bg-radial-at-t from-pink-400/20 to-transparent'
    };
  }
  if (s.includes('computer') || s.includes('code') || s.includes('ai') || s.includes('tech') || s.includes('science')) {
    return {
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)',
      accent: '#8B5CF6',
      badgeBg: 'rgba(139,92,246,0.1)',
      pattern: 'bg-radial-at-t from-violet-400/20 to-transparent'
    };
  }
  if (s.includes('history') || s.includes('social') || s.includes('geography') || s.includes('civics')) {
    return {
      gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
      accent: '#10B981',
      badgeBg: 'rgba(16,185,129,0.1)',
      pattern: 'bg-radial-at-t from-emerald-400/20 to-transparent'
    };
  }
  // Default theme
  return {
    gradient: 'linear-gradient(135deg, #6B5CE7 0%, #4F46E5 100%)',
    accent: '#6B5CE7',
    badgeBg: 'rgba(107,92,231,0.1)',
    pattern: 'bg-radial-at-t from-[#6B5CE7]/30 to-transparent'
  };
};

export default function ELibraryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [sortBy, setSortBy] = useState('title-asc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/e-library/books');
        const data = response.data?.data || response.data;
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load books:', err);
        setError(err.message || 'Failed to load library resources');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All' || book.class === selectedClass;
    const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '');
    } else if (sortBy === 'title-desc') {
      return (b.title || '').localeCompare(a.title || '');
    } else if (sortBy === 'class-asc') {
      return (a.class || '').localeCompare(b.class || '', undefined, { numeric: true });
    }
    return 0;
  });

  // Extract filters
  const uniqueClasses = ['All', ...new Set(books.map(b => b.class).filter(Boolean))].sort((a, b) => 
    a.localeCompare(b, undefined, { numeric: true })
  );
  const uniqueSubjects = ['All', ...new Set(books.map(b => b.subject).filter(Boolean))].sort();

  return (
    <div className="h-full flex overflow-hidden">
      <Sidebar
        activeTool="e-library"
        setActiveTool={() => {}}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Main Scrollable Workspace */}
        <div 
          className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar w-full"
          style={{ background: 'linear-gradient(135deg, #FFF5F0 0%, #F5F0FF 50%, #EDE8F5 100%)' }}
        >
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header / Hero Section */}
            <div 
              className="p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border"
              style={{
                background: 'linear-gradient(135deg, rgba(107,92,231,0.08) 0%, rgba(139,92,246,0.03) 100%)',
                borderColor: 'rgba(107,92,231,0.18)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 8px 32px rgba(107,92,231,0.04)',
              }}
            >
              <div className="space-y-2.5 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-[#6B5CE7] bg-[#6B5CE7]/10 border border-[#6B5CE7]/15">
                  <Sparkles size={11} className="animate-pulse" /> E-Learning Resource Hub
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[#1A1A2E]" style={{ fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.02em' }}>
                  Digital Book Library
                </h1>
                <p className="text-sm text-[#5A5A72] font-semibold max-w-xl leading-relaxed">
                  Access and download core curriculum textbooks, study materials, and reference guides instantly.
                </p>
              </div>

              {/* Quick statistics widgets */}
              <div className="flex gap-4 relative z-10 w-full md:w-auto">
                <div className="flex-1 md:flex-initial px-5 py-4 rounded-2xl bg-white/70 border border-purple-200/40 text-center min-w-[90px] shadow-xs">
                  <div className="text-xl font-black text-[#6B5CE7]">{books.length}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Total Books</div>
                </div>
                <div className="flex-1 md:flex-initial px-5 py-4 rounded-2xl bg-white/70 border border-purple-200/40 text-center min-w-[90px] shadow-xs">
                  <div className="text-xl font-black text-[#1A1A2E]">{uniqueSubjects.length - 1}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Subjects</div>
                </div>
              </div>

              {/* Decorative background blobs */}
              <div className="absolute right-0 top-0 w-64 h-64 rounded-full filter blur-3xl opacity-20 pointer-events-none -mr-20 -mt-20 bg-purple-400" />
              <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full filter blur-3xl opacity-10 pointer-events-none -ml-20 -mb-20 bg-pink-400" />
            </div>

            {/* Filter Section (Taller & Expanded) */}
            <div 
              className="p-6 rounded-3xl space-y-6 border"
              style={{
                background: 'rgba(255,255,255,0.8)',
                borderColor: 'rgba(107,92,231,0.14)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 10px 30px rgba(107,92,231,0.03)',
              }}
            >
              {/* Filter Section Title */}
              <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'rgba(107,92,231,0.08)' }}>
                <SlidersHorizontal size={16} className="text-[#6B5CE7]" />
                <h2 className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]">
                  Search & Filters Configuration
                </h2>
              </div>

              {/* Large Search Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* 1. Large Search Input */}
                <div className="relative md:col-span-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search books by title, topic, or subject keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#6B5CE7]/20 transition-all font-semibold shadow-xs"
                    style={{ borderColor: 'rgba(107,92,231,0.2)', color: '#1A1A2E', background: 'white' }}
                  />
                </div>

                {/* 2. Subject Selector */}
                <div className="relative md:col-span-3">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
                    <Filter size={14} />
                  </div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm border bg-white focus:outline-none cursor-pointer font-bold shadow-xs transition-all appearance-none"
                    style={{ borderColor: 'rgba(107,92,231,0.2)', color: '#1A1A2E' }}
                  >
                    <option value="All">All Subjects</option>
                    {uniqueSubjects.filter(s => s !== 'All').map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none font-bold text-xs">▼</div>
                </div>

                {/* 3. Sort Selector */}
                <div className="relative md:col-span-3">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
                    <ArrowUpDown size={14} />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm border bg-white focus:outline-none cursor-pointer font-bold shadow-xs transition-all appearance-none"
                    style={{ borderColor: 'rgba(107,92,231,0.2)', color: '#1A1A2E' }}
                  >
                    <option value="title-asc">Title: A to Z</option>
                    <option value="title-desc">Title: Z to A</option>
                    <option value="class-asc">Class: Low to High</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none font-bold text-xs">▼</div>
                </div>
              </div>

              {/* Large Grade/Class Pill Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#5A5A72] flex items-center gap-1.5">
                  <Layers size={12} className="text-[#6B5CE7]" /> Filter by Grade / Class
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {uniqueClasses.map((cls, idx) => {
                    const isActive = selectedClass === cls;
                    // Format display label
                    const displayLabel = cls === 'All' ? 'All Classes' : (isNaN(Number(cls)) ? cls : `Class ${cls}`);
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedClass(cls)}
                        className="px-4.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border active:scale-95 duration-200"
                        style={isActive ? {
                          background: 'linear-gradient(135deg, #6B5CE7 0%, #5B21B6 100%)',
                          color: '#fff',
                          borderColor: '#6B5CE7',
                          boxShadow: '0 4px 12px rgba(107,92,231,0.2)'
                        } : {
                          background: '#fff',
                          color: '#5A5A72',
                          borderColor: 'rgba(107,92,231,0.18)',
                        }}
                      >
                        {displayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Error Message Box */}
            {error && (
              <div className="p-4 rounded-2xl flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 shadow-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Loading Indicator */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-[#6B5CE7]" />
                <p className="text-sm text-gray-500 font-bold tracking-wide">Syncing resources from secure library server...</p>
              </div>
            ) : sortedBooks.length === 0 ? (
              /* Empty State */
              <div className="text-center py-24 bg-white/60 border rounded-3xl p-8" style={{ borderColor: 'rgba(107,92,231,0.12)' }}>
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-black text-[#1A1A2E]">No Textbooks Match Your Search</p>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Try clearing your search query or choosing another subject/class tab.
                </p>
              </div>
            ) : (
              /* Books Responsive Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedBooks.map((book) => {
                  const hasPdf = !!book.pdfUrl;
                  const theme = getSubjectTheme(book.subject);
                  
                  // Clean display for class badge
                  const classDisplay = book.class ? (isNaN(Number(book.class)) ? book.class : `Class ${book.class}`) : '';

                  return (
                    <div
                      key={book.id}
                      className="group flex flex-col rounded-3xl overflow-hidden transition-all duration-300 relative border"
                      style={{
                        background: 'rgba(255,255,255,0.85)',
                        borderColor: 'rgba(107,92,231,0.12)',
                        backdropFilter: 'blur(24px)',
                        boxShadow: '0 4px 16px rgba(107,92,231,0.03)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = `0 16px 36px rgba(107,92,231,0.15)`;
                        e.currentTarget.style.borderColor = `rgba(107,92,231,0.35)`;
                        e.currentTarget.style.transform = 'translateY(-6px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(107,92,231,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(107,92,231,0.12)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Premium Cover Design */}
                      <div 
                        className="aspect-[4/5] relative w-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden border-b transition-all duration-300" 
                        style={{ 
                          background: book.coverImageUrl ? '#f8fafc' : theme.gradient,
                          borderColor: 'rgba(107,92,231,0.06)'
                        }}
                      >
                        {book.coverImageUrl ? (
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          /* Elegant Geometric Book Cover Placeholder */
                          <div className={`w-full h-full flex flex-col justify-between items-center text-white relative z-10 ${theme.pattern}`}>
                            
                            {/* Top row: Subject Badge */}
                            <div className="w-full flex justify-start">
                              <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-xs text-white">
                                {book.subject}
                              </span>
                            </div>

                            {/* Middle row: Large Icon + Styled Book Graphic */}
                            <div className="flex flex-col items-center gap-2 my-auto">
                              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <BookOpen size={28} className="text-white" />
                              </div>
                            </div>

                            {/* Bottom row: Book Title embossed inside book cover */}
                            <div className="w-full text-left space-y-1">
                              <p className="text-xs font-black uppercase tracking-widest text-white/60">Textbook</p>
                              <h4 className="text-sm font-black line-clamp-2 text-white leading-tight">
                                {book.title}
                              </h4>
                            </div>
                          </div>
                        )}

                        {/* Top Right Grade Badge */}
                        {classDisplay && (
                          <span 
                            className="absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-wider shadow-sm z-20" 
                            style={{ background: '#1A1A2E' }}
                          >
                            {classDisplay}
                          </span>
                        )}
                        
                        {/* Decorative Gradient Overlay (Only for Cover Placeholder) */}
                        {!book.coverImageUrl && (
                          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-80" />
                        )}
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          {/* Subject display */}
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider"
                              style={{ background: theme.badgeBg, color: theme.accent }}
                            >
                              {book.subject}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-extrabold text-sm text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#6B5CE7] transition-colors pt-1" title={book.title}>
                            {book.title}
                          </h3>
                        </div>

                        {/* Action Download / Lock Buttons */}
                        {hasPdf ? (
                          <a
                            href={book.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all text-white hover:opacity-95 shadow-xs active:scale-97 cursor-pointer hover:gap-2.5"
                            style={{ background: '#6B5CE7' }}
                          >
                            <Download size={13} />
                            Download Book
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/50"
                          >
                            <Lock size={12} />
                            No PDF Available
                          </button>
                        )}
                      </div>

                      {/* Small accent corner dot for hover active */}
                      <div
                        className="absolute top-3.5 left-3.5 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: theme.accent }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
