"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Video, BookOpen, AlertCircle, Sparkles, Download,
  Loader2, ChevronDown, Eye, EyeOff, Trash2, Copy, Check, FileText
} from "lucide-react";

// Hardcoded playlist data nested under Classes and Subjects
const lectureData = {
  "Class 1": {
    "English": [
      { chapterName: 'Ch 1 | My Family', videoId: 'y_N9wN-owAc' },
      { chapterName: 'Ch 2 | Meet My Best Friend', videoId: '4FnBCkau74c' },
      { chapterName: 'Ch 3 | I Can', videoId: '-48gPO8fgfU' },
      { chapterName: 'Ch 4 | Jumbo\'s Friends', videoId: 'mAMYxZ6-OaA' },
      { chapterName: 'Ch 5 | The Little Sparrow', videoId: 'ZdWdqqY6XD8' },
      { chapterName: 'Ch 6 | White Sheep (Poem)', videoId: 'loO6q1JQIsA' },
      { chapterName: 'Ch 7 | The Lion and the Mouse', videoId: 'TK7cVAyeGT4' },
      { chapterName: 'Ch 8 | Rainbow (Poem)', videoId: 'ClhVs83e95s' },
      { chapterName: 'Ch 9 | In the Sky (Poem)', videoId: 'hnj4r6YINrs' },
      { chapterName: 'Ch 10 | Play Time', videoId: 'ddtGPOtYhzk' }
    ]
  },
  "Class 2": {
    "English": [
      { chapterName: 'Ch 1 | Fun Sunday', videoId: '9Uuhgvf7B_0' },
      { chapterName: 'Ch 2 | Goldilocks and Three Bears', videoId: 'RTp-hMO64zE' },
      { chapterName: 'Ch 3 | A Good Play', videoId: 'ThvgZ8sfMdc' },
      { chapterName: 'Ch 4 | God is Great', videoId: '3Pzer_QQEeE' },
      { chapterName: 'Ch 5 | A True Friend', videoId: 'W19JL0POgrY' },
      { chapterName: 'Ch 6 | A Drop of Water', videoId: 't7iujlHia-Y' },
      { chapterName: 'Ch 7 | How Do you Do?', videoId: 'nzQnsVmnuio' },
      { chapterName: 'Ch 8 | Dream of a Beggar', videoId: '_DYWGn8uY3E' },
      { chapterName: 'Ch 9 | Clever Birbal', videoId: 'bqrecQNLEL8' },
      { chapterName: 'Ch 10 | Do your Best', videoId: 'r4s9ZGQ2zW8' },
      { chapterName: 'Ch 11 | The Wise Minister', videoId: 'ue3beykCspY' }
    ]
  },
  "Class 3": {
    "English": [
      { chapterName: 'Ch 1 | English Class 03 (Intro)', videoId: 'KqH7VPZjEnA' },
      { chapterName: 'Ch 2 | Birthday Party', videoId: 'A8LExhS0_YU' },
      { chapterName: 'Ch 3 | My Granny\'s Laptop (Poem)', videoId: 'Ma7pRTu_OiY' },
      { chapterName: 'Ch 4 | At School', videoId: 'WM4hFXnPRvw' },
      { chapterName: 'Ch 5 | The Almighty God (Poem)', videoId: '-1JdVgPCO1I' },
      { chapterName: 'Ch 6 | Little Daisies (Poem)', videoId: 'jGsTKShqP1A' },
      { chapterName: 'Ch 7 | Mary Had A Little Lamb (Poem)', videoId: 'oT31pGWPtvk' },
      { chapterName: 'Ch 8 | A Serpent and the Crow Family', videoId: 'xnaGYQY-T44' },
      { chapterName: 'Ch 9 | Friendship A Boon (Poem)', videoId: 'cPZJCh-obkI' },
      { chapterName: 'Ch 10 | Study or Play', videoId: 'PHNuXaqXu20' },
      { chapterName: 'Ch 11 | Prince Siddhartha and the Wounded Swan', videoId: 'WCjeK51X-Zk' },
      { chapterName: 'Ch 12 | Cinderella', videoId: '5uTwyEnSxIs' }
    ]
  }
};

export default function VideoLectures() {
  // State management
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState(""); // videoId

  const [videoId, setVideoId] = useState("");
  const [resolvedMeta, setResolvedMeta] = useState(null);

  // Focus options
  const [cinemaMode, setCinemaMode] = useState(false);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const notesRef = useRef(null);

  // Dropdown list resolvers
  const classOptions = Object.keys(lectureData);
  const subjectOptions = selectedClass ? Object.keys(lectureData[selectedClass]) : [];
  const chapterOptions = (selectedClass && selectedSubject) ? lectureData[selectedClass][selectedSubject] : [];

  // Handlers
  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    setSelectedSubject("");
    setSelectedChapterId("");
    setVideoId("");
    setResolvedMeta(null);
  };

  const handleSubjectChange = (e) => {
    const sub = e.target.value;
    setSelectedSubject(sub);
    setSelectedChapterId("");
    setVideoId("");
    setResolvedMeta(null);
  };

  const handleChapterChange = (e) => {
    const vid = e.target.value;
    setSelectedChapterId(vid);
    if (vid) {
      const playlist = lectureData[selectedClass]?.[selectedSubject] || [];
      const chItem = playlist.find(item => item.videoId === vid);
      if (chItem) {
        setVideoId(vid);
        setResolvedMeta({
          class: selectedClass,
          subject: selectedSubject,
          chapter: chItem.chapterName
        });
      }
    } else {
      setVideoId("");
      setResolvedMeta(null);
    }
  };

  const handleCopyNotes = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadNotes = () => {
    if (!notes) return;
    const element = document.createElement("a");
    const file = new Blob([
      `Study Notes - Video Lecture\n`,
      `Class: ${resolvedMeta?.class || selectedClass}\n`,
      `Subject: ${resolvedMeta?.subject || selectedSubject}\n`,
      `Chapter: ${resolvedMeta?.chapter || 'Lecture'}\n`,
      `Date: ${new Date().toLocaleDateString()}\n`,
      `---------------------------------------\n\n`,
      notes
    ], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    const fileName = (resolvedMeta?.chapter || 'notes').replace(/\s+/g, "_");
    element.download = `StudyNotes_${fileName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClearNotes = () => {
    if (confirm("Are you sure you want to clear your study notes?")) {
      setNotes("");
    }
  };

  return (
    <div 
      className={`min-h-full w-full p-4 md:p-6 transition-all duration-500 rounded-3xl ${
        cinemaMode ? "bg-[#09090e] text-white shadow-2xl border border-gray-900" : "text-[#1A1A2E]"
      }`}
      style={!cinemaMode ? {
        background: 'linear-gradient(135deg, rgba(255,245,240,0.6) 0%, rgba(237,232,245,0.6) 100%)'
      } : {}}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ── Top Header Panel ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-purple-200/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#6B5CE7] bg-[#6B5CE7]/10">
              <Sparkles size={12} className="animate-pulse" /> Focus Learning Player
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Smart Video Lectures
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Watch ad-free, high-quality lectures matched directly to your textbook curriculum chapters.
            </p>
          </div>
          
          {videoId && (
            <button
              onClick={() => setCinemaMode(!cinemaMode)}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 duration-200 cursor-pointer ${
                cinemaMode 
                  ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" 
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cinemaMode ? <EyeOff size={14} /> : <Eye size={14} />}
              {cinemaMode ? "Cinema Mode: ON" : "Focus / Cinema Mode"}
            </button>
          )}
        </div>

        {/* ── Three Dropdowns Filter Section ── */}
        <div 
          className={`p-5 rounded-2xl border transition-all duration-300 ${
            cinemaMode 
              ? "bg-[#11111a] border-gray-800/80 shadow-inner" 
              : "bg-white/80 border-purple-200/40 shadow-sm"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Class Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Select Class
              </label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className={`w-full rounded-xl px-4 py-3.5 text-sm font-bold appearance-none cursor-pointer border focus:outline-none transition-all ${
                    cinemaMode 
                      ? "bg-[#191925] border-gray-800 text-white focus:ring-2 focus:ring-purple-900" 
                      : "bg-white border-purple-100 text-gray-800 focus:ring-2 focus:ring-[#6B5CE7]/20"
                  }`}
                >
                  <option value="">Select Class</option>
                  {classOptions.map((cls, idx) => (
                    <option key={idx} value={cls}>{cls}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* 2. Subject Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Select Subject
              </label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  disabled={!selectedClass}
                  className={`w-full rounded-xl px-4 py-3.5 text-sm font-bold appearance-none border focus:outline-none transition-all ${
                    !selectedClass 
                      ? "bg-gray-100/50 text-gray-400 cursor-not-allowed border-gray-200"
                      : cinemaMode 
                        ? "bg-[#191925] border-gray-800 text-white focus:ring-2 focus:ring-purple-900 cursor-pointer" 
                        : "bg-white border-purple-100 text-gray-800 focus:ring-2 focus:ring-[#6B5CE7]/20 cursor-pointer"
                  }`}
                >
                  <option value="">Select Subject</option>
                  {subjectOptions.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* 3. Chapter Dropdown */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Select Chapter
              </label>
              <div className="relative">
                <select
                  value={selectedChapterId}
                  onChange={handleChapterChange}
                  disabled={!selectedSubject}
                  className={`w-full rounded-xl px-4 py-3.5 text-sm font-bold appearance-none border focus:outline-none transition-all ${
                    !selectedSubject 
                      ? "bg-gray-100/50 text-gray-400 cursor-not-allowed border-gray-200"
                      : cinemaMode 
                        ? "bg-[#191925] border-gray-800 text-white focus:ring-2 focus:ring-purple-900 cursor-pointer" 
                        : "bg-white border-purple-100 text-gray-800 focus:ring-2 focus:ring-[#6B5CE7]/20 cursor-pointer"
                  }`}
                >
                  <option value="">Select Chapter</option>
                  {chapterOptions.map((ch, idx) => (
                    <option key={idx} value={ch.videoId}>
                      {ch.chapterName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
              </div>
            </div>

          </div>
        </div>

        {/* ── Video Player & Notes Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Video Section */}
          <div className="lg:col-span-8 space-y-4">
            <div 
              className={`relative overflow-hidden rounded-2xl border transition-all duration-500 aspect-video shadow-2xl ${
                cinemaMode ? "border-gray-800 bg-black" : "border-purple-200/50 bg-white"
              }`}
            >
              {videoId ? (
                /* YouTube Embedded Player with No Related Videos & Minimal Branding params */
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
                  title={resolvedMeta ? `${resolvedMeta.class} - ${resolvedMeta.chapter}` : "Video Lecture"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* Placeholder Screen */
                <div 
                  className={`w-full h-full flex flex-col items-center justify-center text-center p-8 transition-colors ${
                    cinemaMode ? "bg-[#0c0c14]" : "bg-white"
                  }`}
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-bounce border"
                    style={{
                      background: "rgba(107, 92, 231, 0.08)",
                      borderColor: "rgba(107, 92, 231, 0.2)"
                    }}
                  >
                    <Video size={36} className="text-[#6B5CE7]" />
                  </div>
                  <h3 
                    className="text-xl font-black mb-2" 
                    style={{ color: cinemaMode ? "white" : "#1A1A2E", fontFamily: "Outfit, sans-serif" }}
                  >
                    Select a Chapter to Start Learning
                  </h3>
                  <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                    Pick your Class, Subject, and Chapter to open video lectures instantly. Enjoy a distraction-free, focused learning mode!
                  </p>
                </div>
              )}
            </div>

            {/* Video Details Card */}
            {resolvedMeta && videoId && (
              <div 
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  cinemaMode 
                    ? "bg-[#11111a] border-gray-800" 
                    : "bg-white border-purple-200/20 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50">
                      {resolvedMeta.subject}
                    </span>
                    <h2 className="text-lg font-black tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {resolvedMeta.chapter}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Matched for Class: <span className="font-bold">{resolvedMeta.class}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-500 font-bold">
                    ✓ Embed Verified Ad-Free
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Notes Panel */}
          <div className="lg:col-span-4 h-full">
            <div 
              className={`p-5 rounded-2xl border h-full flex flex-col justify-between space-y-4 transition-all duration-300 ${
                cinemaMode 
                  ? "bg-[#11111a] border-gray-800" 
                  : "bg-white border-purple-200/20 shadow-sm"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#6B5CE7]/10">
                      <FileText size={16} className="text-[#6B5CE7]" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-wider" style={{ fontFamily: "Outfit, sans-serif" }}>
                      Study Notes
                    </h3>
                  </div>
                  {notes && (
                    <button 
                      onClick={handleClearNotes}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Clear Notes"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Jot down important formulas, keywords, and lecture timestamps as you watch.
                </p>

                <textarea
                  ref={notesRef}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Type your lecture notes here... (e.g. key concepts, formulas, or timestamps)"
                  rows={10}
                  className={`w-full p-4 rounded-xl text-sm font-semibold focus:outline-none transition-all resize-none border ${
                    cinemaMode 
                      ? "bg-[#191925] border-gray-800 text-white focus:ring-1 focus:ring-purple-700 placeholder:text-gray-600" 
                      : "bg-slate-50 border-purple-100 text-gray-800 focus:ring-1 focus:ring-[#6B5CE7] placeholder:text-gray-400"
                  }`}
                />
              </div>

              {/* Action Buttons for notes */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopyNotes}
                  disabled={!notes}
                  className={`flex-1 py-3.5 px-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 border active:scale-97 cursor-pointer ${
                    copied 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-white hover:bg-slate-50 border-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownloadNotes}
                  disabled={!notes}
                  className="flex-1 py-3.5 px-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 text-white active:scale-97 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#6B5CE7" }}
                >
                  <Download size={13} />
                  Download
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
