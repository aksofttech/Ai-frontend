"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Brain, Cpu, Globe, ArrowRight, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-obsidian text-white flex flex-col font-sans selection:bg-neon-purple selection:text-white relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-green/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="relative z-50 w-full px-6 md:px-12 py-4 flex justify-between items-center bg-obsidian/50 backdrop-blur-xl border-b border-white/5 sticky top-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-purple-900 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            YugSoft <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-emerald-green">AI</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">How it Works</Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="hidden md:block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-green" />
            <span className="text-sm font-medium text-gray-200">The Ultimate Operating System for Schools</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Transform Education with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-purple-400 to-emerald-green">
              Next-Gen AI
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Generate lesson plans, craft perfect worksheets, and automate homework grading with the most powerful AI suite designed exclusively for modern educators.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-neon-purple text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] transition-all"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md"
              >
                View Demo
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full px-4"
          id="features"
        >
          {/* Card 1 */}
          <div className="group relative glass-panel p-1 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-obsidian/90 backdrop-blur-xl h-full p-8 rounded-[22px] flex flex-col items-start border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-7 h-7 text-neon-purple shadow-neon-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">AI Lesson Planner</h3>
              <p className="text-gray-400 leading-relaxed text-left">Instantly generate comprehensive, curriculum-aligned lesson plans tailored to your specific class and period count.</p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="group relative glass-panel p-1 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-obsidian/90 backdrop-blur-xl h-full p-8 rounded-[22px] flex flex-col items-start border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-green/20 border border-emerald-green/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-7 h-7 text-emerald-green" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Worksheet Engine</h3>
              <p className="text-gray-400 leading-relaxed text-left">Create custom worksheets with MCQs, fill-in-the-blanks, true/false, and short answers in seconds. Auto-generate answer keys.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative glass-panel p-1 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-obsidian/90 backdrop-blur-xl h-full p-8 rounded-[22px] flex flex-col items-start border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Global Accessibility</h3>
              <p className="text-gray-400 leading-relaxed text-left">Access your teaching tools from anywhere, fully synced and backed up on the cloud. Collaborate with other educators seamlessly.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-obsidian/80 backdrop-blur-lg pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1 flex flex-col items-start">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6 text-neon-purple" />
                <span className="text-xl font-bold tracking-tight text-white">
                  YugSoft <span className="text-emerald-green">AI</span>
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Empowering educators worldwide with cutting-edge AI tools to simplify teaching and enhance student learning experiences.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-neon-purple hover:text-white hover:border-transparent transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-green hover:text-white hover:border-transparent transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-transparent transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-neon-purple transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-neon-purple transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-neon-purple transition-colors text-sm">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-neon-purple transition-colors text-sm">Reviews</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-emerald-green transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-green transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-green transition-colors text-sm">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-green transition-colors text-sm">Webinars</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a></li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} YugSoft Tech. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              Made with <span className="text-red-500">♥</span> for Educators
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
