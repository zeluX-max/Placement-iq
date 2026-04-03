'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Leaderboard from '@/components/Leaderboard'; // Added Leaderboard import

export default function HomePage() {
  const [stats, setStats] = useState({ companies: 0, results: 0 });
  const [scrolled, setScrolled] = useState(false);

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

  const companies5 = [
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg' },
    { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
  ];

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
            
            <div className="absolute w-1.5 h-1.5 bg-green-400/60 rounded-full animate-float" style={{top:'15%', left:'20%', animationDuration:'7s'}} />
            <div className="absolute w-1 h-1 bg-purple-400/50 rounded-full animate-float" style={{top:'25%', right:'25%', animationDuration:'9s', animationDelay:'1s'}} />
            <div className="absolute w-2 h-2 bg-green-500/40 rounded-full animate-float" style={{top:'45%', left:'8%', animationDuration:'11s', animationDelay:'2s'}} />
            <div className="absolute w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-float" style={{top:'60%', right:'10%', animationDuration:'8s', animationDelay:'0.5s'}} />
            <div className="absolute w-1 h-1 bg-purple-300/50 rounded-full animate-float" style={{top:'70%', left:'30%', animationDuration:'13s', animationDelay:'3s'}} />
            <div className="absolute w-2 h-2 bg-green-400/30 rounded-full animate-float" style={{top:'35%', right:'40%', animationDuration:'10s', animationDelay:'1.5s'}} />
            <div className="absolute w-1 h-1 bg-blue-300/40 rounded-full animate-float" style={{top:'80%', right:'35%', animationDuration:'6s', animationDelay:'2.5s'}} />
            <div className="absolute w-1.5 h-1.5 bg-purple-500/40 rounded-full animate-float" style={{top:'12%', left:'60%', animationDuration:'12s', animationDelay:'0.8s'}} />
            <div className="absolute w-1 h-1 bg-green-300/50 rounded-full animate-float" style={{top:'50%', left:'50%', animationDuration:'9s', animationDelay:'4s'}} />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0s' }}>
            <div className="inline-block bg-purple-900/40 text-purple-300 rounded-full px-4 py-1.5 text-xs font-medium border border-purple-800/50 mb-8 animate-pulse">
              Built for NIT Jalandhar
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold mb-6 leading-tight tracking-tight">
              Know if you&apos;re ready for <br />
              <span className="text-brand-green relative inline-block" >
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

        {/* Simplified Companies Marquee Section */}
        <section className="px-4 py-24 md:py-32 bg-gray-900/30 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Targeting 53 Companies</h2>
              <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">Top recruiters visiting NIT Jalandhar campus every year</p>
            </div>

            <div style={{ overflow: 'hidden' }} className="relative">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950/50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950/50 to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex animate-marquee gap-12 md:gap-16 w-max py-4 items-center px-6">
                {/* Duplicate for seamless loop */}
                {[...companies5, ...companies5].map((company, i) => (
                  <Image
                    key={i}
                    src={company.logo}
                    alt={company.name}
                    width={100}
                    height={40}
                    className="h-12 md:h-16 w-auto object-contain opacity-80"
                    unoptimized
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center mt-12 mb-6">
              ...and 48 more companies
            </p>

            <div className="text-center">
              <Link
                href="/login"
                className="px-8 py-3 bg-gray-900/60 hover:bg-gray-800 text-gray-400 text-sm font-bold rounded-full border border-gray-800 transition-custom hover:text-white hover:border-gray-500 active:scale-95 inline-flex items-center gap-2"
              >
                View all 53 recruiters →
              </Link>
            </div>
          </div>
        </section>

        {/* Live Leaderboard Section */}
        <section className="px-4 py-24 md:py-32 bg-gray-900/50 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-purple-900/40 text-purple-300 rounded-full px-4 py-1.5 text-xs font-medium border border-purple-800/50 mb-4 animate-pulse">
                Live Rankings
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">How do you stack up?</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                See real-time placement readiness scores from your peers at NIT Jalandhar.
              </p>
            </div>

            {/* Render the Leaderboard Component */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-2xl transform hover:scale-[1.01] transition-transform duration-500">
                <Leaderboard />
              </div>
            </div>
            
          </div>
        </section>

        {/* Dynamic Final CTA */}
        <section className="px-4 py-32 bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center">
          <div className="max-w-2xl text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to find out where you stand?</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">Free for all NIT Jalandhar students. Analyze your profile in under 60 seconds.</p>
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center px-16 py-6 bg-brand-green hover:bg-brand-green-hover text-white rounded-2xl text-2xl font-black transition-custom transform hover:scale-105 shadow-2xl shadow-brand-green/30"
            >
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-2xl"></div>
            </Link>
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

          <div className="flex flex-col gap-2 items-center md:items-end">
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

