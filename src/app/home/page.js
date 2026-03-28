'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { companies } from '@/data/companies';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  const [stats, setStats] = useState({ companies: 0, results: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  // Count-up stats animation
  useEffect(() => {
    let start = null;
    const durationCompanies = 1500;
    const durationResults = 800;
    const animateStats = (timestamp) => {
      if (!start) start = timestamp;
      const progressCompanies = Math.min((timestamp - start) / durationCompanies, 1);
      const progressResults = Math.min((timestamp - start) / durationResults, 1);
      
      setStats({
        companies: Math.floor(progressCompanies * 53),
        results: Math.floor(progressResults * 10)
      });
      
      if (progressCompanies < 1 || progressResults < 1) {
        requestAnimationFrame(animateStats);
      }
    };
    requestAnimationFrame(animateStats);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const uniqueCompanies = Array.from(new Set(companies.map(c => c.name)))
    .map(name => companies.find(c => c.name === name));
  
  const displayedCompanies = showAllCompanies ? uniqueCompanies : uniqueCompanies.slice(0, 24);

  const steps = [
    { title: "Upload", description: "Upload your LinkedIn PDF or Resume in seconds." },
    { title: "AI Analyzes", description: "Our AI compares your skills against 53 top companies." },
    { title: "Get Roadmap", description: "Receive a personalized 2-week study plan to bridge gaps." }
  ];

  const features = [
    { title: "Company Board", description: "See exactly where you stand with 53 major recruiters.", color: "border-blue-500", icon: "🏢" },
    { title: "Skill Gaps", description: "Identify the exact technical and soft skills you're missing.", color: "border-red-500", icon: "🔍" },
    { title: "Study Plan", description: "A day-by-day roadmap tailored to your target companies.", color: "border-green-500", icon: "📅" },
    { title: "AI Interview", description: "Practice with our AI-powered mock interviewer.", color: "border-purple-500", icon: "🤖" }
  ];

  const difficultyColors = {
    easy: "bg-green-950 text-green-400 border-green-800",
    medium: "bg-amber-950 text-amber-400 border-amber-800",
    hard: "bg-red-950 text-red-400 border-red-800"
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-custom selection:bg-brand-green selection:text-white">
      {/* Dynamic Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-custom ${scrolled ? 'glass-card border-x-0 border-t-0 shadow-xl' : 'bg-transparent border-transparent'}`}>
        <Navbar />
      </div>

      <main>
        {/* Hero Section with Animated Background */}
        <section className="relative px-4 pt-32 md:pt-48 pb-20 md:pb-32 max-w-6xl mx-auto text-center overflow-hidden animate-gradient-bg bg-gradient-to-b from-gray-950 via-purple-950/10 to-gray-950">
          {/* Floating Blobs */}

          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className={`absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-3xl animate-float`} style={{ animationDuration: '8s' }}></div>
            <div className={`absolute top-1/2 right-1/4 w-[200px] h-[200px] bg-green-900/10 rounded-full blur-3xl animate-float`} style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
            <div className={`absolute bottom-1/4 left-1/2 w-[150px] h-[150px] bg-blue-900/10 rounded-full blur-3xl animate-float`} style={{ animationDuration: '6s', animationDelay: '0.5s' }}></div>
            <div className={`absolute top-1/3 right-1/2 w-[100px] h-[100px] bg-purple-900/20 rounded-full blur-3xl animate-float`} style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
            <div className={`absolute bottom-1/3 left-1/3 w-[80px] h-[80px] bg-green-900/20 rounded-full blur-3xl animate-float`} style={{ animationDuration: '9s', animationDelay: '1.5s' }}></div>
            <div className={`absolute top-3/4 right-1/3 w-[60px] h-[60px] bg-blue-900/20 rounded-full blur-3xl animate-float`} style={{ animationDuration: '11s', animationDelay: '0.2s' }}></div>
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0s' }}>
            <div className="inline-block bg-purple-900/40 text-purple-300 rounded-full px-4 py-1.5 text-xs font-medium border border-purple-800/50 mb-8 animate-pulse">
              Built for NIT Jalandhar · HackMol 7.0
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold mb-6 leading-tight tracking-tight">
              Know if you&apos;re ready for <br />
              <span className="text-brand-green relative inline-block" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 102, 51, 0.4))' }}>
                campus placements
              </span>
            </h1>
          </div>

          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            PlacementIQ uses AI to match your profile against NIT Jalandhar&apos;s top recruiters, revealing skill gaps and providing a custom roadmap to success.
          </p>

          <div className="flex flex-row gap-3 justify-center items-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/login"
              className="relative group w-auto px-10 py-4 bg-brand-green hover:bg-brand-green-hover text-white rounded-2xl text-base font-bold transition-custom shadow-xl shadow-brand-green/20 overflow-hidden active:scale-95"
            >
              <span className="relative z-10">Check readiness →</span>
              <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
            </Link>
            <Link
              href="#how"
              className="w-auto px-10 py-4 bg-gray-900/40 backdrop-blur-sm hover:bg-gray-800 text-gray-300 border border-gray-800/60 rounded-2xl text-base font-medium transition-custom active:scale-95"
            >
              How it works
            </Link>
          </div>

          {/* Quick Stats with vertical dividers */}
          <div className="mt-24 md:mt-36 flex justify-center items-stretch gap-0 border-t border-gray-900/50 pt-12 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <div className="px-8 md:px-16 flex flex-col border-r border-gray-800/50 last:border-r-0">
              <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{stats.companies}</span>
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mt-3 font-black">Companies</span>
            </div>
            <div className="px-8 md:px-16 flex flex-col border-r border-gray-800/50 last:border-r-0">
              <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{stats.results}s</span>
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mt-3 font-black">Results</span>
            </div>
            <div className="px-8 md:px-16 flex flex-col border-r border-gray-800/50 last:border-r-0">
              <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">4-wk</span>
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mt-3 font-black">Study Plan</span>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="px-4 py-24 md:py-32 bg-gray-950/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">How it works</h2>
              <div className="w-16 h-1.5 bg-brand-green mx-auto rounded-full"></div>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {/* Dashed Connector Lines */}
              <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-gray-800 z-0"></div>
              
              {steps.map((step, idx) => (
                <StepCard key={idx} step={step} index={idx} delay={idx * 0.15} />
              ))}
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="px-4 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">What you get</h2>
              <p className="text-gray-500 text-base">Everything you need to land your dream job from NITJ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`glass-card p-10 rounded-2xl flex items-start gap-8 transition-custom hover:border-gray-600 hover:shadow-2xl hover:shadow-brand-green/5 border-l-4 ${feature.color}`}
                >
                  <span className="text-4xl mt-1">{feature.icon}</span>
                  <div>
                    <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                    <p className="text-gray-400 text-base leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Improved Companies Section */}
        <section className="px-4 py-24 md:py-32 bg-gray-900/30 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Targeting 53 Companies</h2>
              <p className="text-gray-500 text-sm mb-10 max-w-sm mx-auto leading-relaxed">From service giants to premium product firms visiting NITJ campus</p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-12 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2.5 bg-red-950/30 px-3 py-1.5 rounded-full border border-red-900/30">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-red-400">Hard Category</span>
                </div>
                <div className="flex items-center gap-2.5 bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-900/30">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-amber-400">Medium Category</span>
                </div>
                <div className="flex items-center gap-2.5 bg-green-950/30 px-3 py-1.5 rounded-full border border-green-900/30">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-green-400">Easy Category</span>
                </div>
              </div>
            </div>

            <div className="relative max-w-5xl mx-auto overflow-hidden">
              <div className="flex flex-wrap gap-2.5 md:gap-3 justify-center transition-all duration-700">
                {displayedCompanies.map((company, idx) => (
                  <div
                    key={company.name}
                    className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold border transition-custom hover:scale-105 cursor-default ${difficultyColors[company.difficulty]} animate-fadeInUp`}
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    {company.name}
                  </div>
                ))}
              </div>
              
              {!showAllCompanies && uniqueCompanies.length > 24 && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none"></div>
              )}
            </div>

            <div className="mt-16 text-center">
              <button
                onClick={() => setShowAllCompanies(!showAllCompanies)}
                className="px-10 py-4 bg-gray-900/60 hover:bg-gray-800 text-gray-400 text-sm font-bold rounded-full border border-gray-800 transition-custom hover:text-white hover:border-gray-500 active:scale-95"
              >
                {showAllCompanies ? 'Show less recruiters' : `Show all ${uniqueCompanies.length} recruiters`}
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section className="px-4 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Loved by Students</h2>
              <p className="text-gray-500">Join 200+ NITJ students already using PlacementIQ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-2 text-[120px] leading-none text-purple-900/20 font-serif select-none pointer-events-none group-hover:text-purple-800/30 transition-all">&quot;</div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-200 text-lg md:text-xl font-medium mb-10 leading-relaxed relative z-10 italic">
                  &quot;The study plan was a lifesaver. It showed me exactly what I needed to learn for Atlassian in just 4 weeks. Best tool for final year prep.&quot;
                </p>
                <div className="flex items-center gap-4 border-t border-gray-800/50 pt-6">
                  <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center text-lg font-bold border-2 border-purple-700">AS</div>
                  <div>
                    <p className="font-bold text-white">Abhay Sharma</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">4th Year CSE · NIT Jalandhar</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-2 text-[120px] leading-none text-green-900/20 font-serif select-none pointer-events-none group-hover:text-green-800/30 transition-all">&quot;</div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-200 text-lg md:text-xl font-medium mb-10 leading-relaxed relative z-10 italic">
                  &quot;I didn&apos;t know I was missing so many soft skills for Google PM. PlacementIQ&apos;s analysis was really eye-opening and practical.&quot;
                </p>
                <div className="flex items-center gap-4 border-t border-gray-800/50 pt-6">
                  <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center text-lg font-bold border-2 border-green-700">PK</div>
                  <div>
                    <p className="font-bold text-white">Priya Kaur</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">3rd Year IT · NIT Jalandhar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Final CTA */}
        <section className="px-4 py-32 bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center">
          <div className="max-w-2xl text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to find out where you stand?</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">Free for all NIT Jalandhar students during HackMol 7.0. Analyze your profile in under 60 seconds.</p>
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center px-16 py-6 bg-brand-green hover:bg-brand-green-hover text-white rounded-2xl text-2xl font-black transition-custom transform hover:scale-105 shadow-2xl shadow-brand-green/30"
            >
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-2xl"></div>
            </Link>
            <p className="mt-8 text-sm text-gray-500 font-medium">✨ No sensitive college credentials required</p>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-gray-800/80 py-16 px-4 md:px-8 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <span className="text-3xl font-black italic tracking-tighter">
              Placement<span className="text-brand-green">IQ</span>
            </span>
            <p className="text-gray-500 text-xs md:text-sm max-w-xs">AI-powered placement intelligence platform built specifically for N.I.T. Jalandhar students.</p>
          </div>
          
          <div className="flex justify-center gap-8">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">𝕏</a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">GH</a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">IN</a>
          </div>

          <div className="flex flex-col gap-2 items-center md:items-end">
            <p className="text-sm font-bold text-white tracking-wide">Made with ❤️ at HackMol 7.0</p>
            <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">© 2026 NIT Jalandhar</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for Step Cards with scrollreveal
function StepCard({ step, index, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <div
      ref={ref}
      className={`glass-card p-12 rounded-3xl relative z-10 hover:border-gray-600 transition-custom duration-700 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="absolute -top-7 left-12 w-16 h-16 bg-brand-green text-white rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl shadow-brand-green/30 rotate-3 group-hover:rotate-0 transition-custom border-4 border-background">
        {index + 1}
      </div>
      <h3 className="text-3xl font-black mb-6 mt-6 tracking-tighter">{step.title}</h3>
      <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
    </div>
  );
}

