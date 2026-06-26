import React, { useState, useEffect } from 'react';
import { FileText, Github, Sparkles, Mail, ChevronUp, ExternalLink, Globe, Award } from 'lucide-react';
import Abstract from './components/Abstract';
import IntroVideo from './components/IntroVideo';
import Pipeline from './components/Pipeline';
import Comparison from './components/Comparison';
import Citation from './components/Citation';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeNav, setActiveNav] = useState('abstract');

  // Show scroll-to-top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Simple active nav tracker based on element offsets
      const sections = ['abstract', 'sandbox', 'pipeline', 'comparison', 'citation'];
      for (const sectionId of sections) {
        const el = document.getElementById(`${sectionId}-section`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveNav(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of sticky nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900" id="main-app">
      
      {/* 1. Academic Header & Author Info */}
      <header className="bg-gradient-to-b from-slate-50 to-white pt-20 pb-16 border-b border-slate-100" id="paper-header">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8" id="header-container">
          
          {/* Venue indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider" id="venue-badge">
            <Award className="w-3.5 h-3.5" /> ECCV 2026
          </div>

          {/* Paper Title */}
          <div className="space-y-4" id="title-box">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight" id="main-title">
              StructSplat: Generalizable 3D Gaussian Splatting from Uncalibrated Sparse Views
            </h1>
          </div>

          {/* Authors List */}
          <div className="space-y-3" id="authors-box">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm sm:text-base font-semibold text-slate-800" id="authors-list">
              <span id="author-1">Jia-Chen Zhao<sup>1,2</sup></span>
              <span id="author-2">Beiqi Chen<sup>1</sup></span>
              <span id="author-3" className="flex items-center gap-1">Xinyang Chen<sup>1 ✉</sup></span>
              <span id="author-4" className="flex items-center gap-1">Guangcong Wang<sup>2,3 ✉</sup></span>
              <span id="author-5">Liqiang Nie<sup>1</sup></span>
            </div>

            {/* Affiliations */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs sm:text-sm text-slate-500 font-medium" id="affiliations">
              <span id="affil-1"><sup>1</sup> Harbin Institute of Technology (Shenzhen)</span>
              <span id="affil-2"><sup>2</sup> Great Bay University</span>
              <span id="affil-3"><sup>3</sup> Guangzhou CloudButterfly Technology Co., Ltd.</span>
            </div>

            {/* Footnote marker */}
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium flex justify-center items-center gap-1" id="footnote-corresponding">
              <span><sup>✉</sup> Corresponding authors:</span>
              <span className="font-mono text-slate-500">chenxinyang95@gmail.com, wanggc3@gmail.com</span>
            </div>
          </div>

          {/* Styled Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-4" id="header-actions">
            <a
              href="#abstract-section"
              onClick={(e) => { e.preventDefault(); scrollToSection('abstract-section'); }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200/50 hover:shadow-indigo-300/60 transition-all flex items-center gap-2"
              id="action-paper"
            >
              <FileText className="w-4 h-4" /> Paper (TBD)
            </a>
            
            <a
              href="https://github.com/J-C-Zhao/StructSplat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-slate-200/50 hover:shadow-slate-300/30 transition-all flex items-center gap-2"
              id="action-code"
            >
              <Github className="w-4 h-4" /> Code Repo
            </a>

            {/* <a
              href="#sandbox-section"
              onClick={(e) => { e.preventDefault(); scrollToSection('intro-video-section'); }}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
              id="action-demo"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" /> Demo Video
            </a> */}
          </div>

        </div>
      </header>

      {/* 2. Sticky Secondary Navigation Menu */}
      <nav className="bg-white/85 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 py-3.5 shadow-sm" id="sticky-nav">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between gap-4" id="sticky-nav-container">
          <div className="font-mono font-bold text-xs sm:text-sm text-slate-900 tracking-tight" id="nav-brand">
            StructSplat 
            {/* <span className="text-indigo-600">ProjectPage</span> */}
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto" id="nav-items-box">
            {[
              { id: 'abstract', label: 'Abstract', targetId: 'abstract-section' },
              { id: 'video', label: 'Demo Video', targetId: 'intro-video-section' },
              { id: 'pipeline', label: 'Pipeline', targetId: 'pipeline-section' },
              { id: 'comparison', label: 'Comparisons', targetId: 'comparison-section' },
              { id: 'citation', label: 'Citation', targetId: 'citation-section' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.targetId)}
                className={`text-xs sm:text-sm font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                  activeNav === item.id
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. Core Page Content (Assembled Sections) */}
      <main className="flex-1" id="main-content">
        
        {/* Abstract Section */}
        <Abstract />

        {/* 3D Sandbox (Fulfills Intro Video demand interactively) */}
        <IntroVideo />

        {/* Pipeline Section */}
        <Pipeline />

        {/* Comparison Section (Qualitative & Quantitative results) */}
        <Comparison />

        {/* Citation (BibTeX block) */}
        <Citation />

      </main>

      {/* 4. Simple, Clean Academic Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800" id="page-footer">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4" id="footer-container">
          <p className="text-xs sm:text-sm text-slate-500" id="footer-text">
            Project Page for <strong>StructSplat: Generalizable 3D Gaussian Splatting from Uncalibrated Sparse Views</strong>. 
            ECCV 2026.
          </p>

        </div>
      </footer>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all z-40"
          title="Scroll to Top"
          id="btn-scroll-to-top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
