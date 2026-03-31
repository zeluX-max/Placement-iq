'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import StrengthCard from '@/components/dashboard/StrengthCard';
import StatsRow from '@/components/dashboard/StatsRow';
import CompanyBoard from '@/components/dashboard/CompanyBoard';
import WeeklyPlan from '@/components/plan/WeeklyPlan';
import ProgressTracker from '@/components/plan/ProgressTracker';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('placementResults');
    if (!saved) {
      router.push('/');
      return;
    }

    try {
      setResults(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to parse placement results', e);
      router.push('/');
    }
  }, [router]);

  const handleReAnalyze = () => {
    localStorage.removeItem('placementResults');
    router.push('/');
  };

  if (!results) return null;

  const { gapAnalysis, studyPlan, profile } = results;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Analysis for {profile.name || 'Student'}
          </h1>
          <p className="text-sm text-gray-500">
            Based on your {profile.cgpa} CGPA and {profile.skills?.length || 0} skills
          </p>
        </div>

        {/* Top Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-12">
          <div className="space-y-4">
            {/* FIXED: Mapped to gapAnalysis.strengthSummary instead of summary */}
            <StrengthCard 
              summary={gapAnalysis.strengthSummary} 
              urgentActions={gapAnalysis.urgentActions} 
            />
          </div>
          <div className="flex flex-col justify-between gap-4">
            {/* NOTE: If you used my updated StatsRow from the previous message, 
                you would pass analysis={gapAnalysis} here instead of ready, stretch, future.
                I am keeping your original prop structure here so it doesn't break! */}
            <StatsRow 
              ready={gapAnalysis.ready?.length || 0} 
              stretch={gapAnalysis.stretch?.length || 0} 
              future={gapAnalysis.future?.length || 0} 
            />
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 flex-1 flex flex-col justify-center">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Role</h4>
              <p className="text-xl font-medium text-purple-400">{studyPlan.targetCompany} Candidate</p>
            </div>
          </div>
        </div>

        {/* Company Board */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-bold">Company Readiness</h2>
          </div>
          <CompanyBoard 
            ready={gapAnalysis.ready} 
            stretch={gapAnalysis.stretch} 
            future={gapAnalysis.future} 
          />
        </div>

        {/* Roadmap Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 pt-8 border-t border-gray-900">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-8">Personalized Roadmap</h2>
            <WeeklyPlan plan={studyPlan} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-8">Daily Progress Tracker</h2>
            <ProgressTracker 
              key={`${profile.name}_${studyPlan.targetCompany}`}
              tasks={studyPlan.weeks.flatMap(w => w.tasks)} 
              planId={`${profile.name}_${studyPlan.targetCompany}`}
            />
          </div>
        </div>

        {/* Leaderboard Section - FIXED: Added id="leaderboard" */}
        <div id="leaderboard" className="pt-8 border-t border-gray-900 scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-2">NIT Jalandhar Leaderboard</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium italic">How you compare to your peers</p>
          </div>
          <Leaderboard />
        </div>
      </main>

      {/* Re-analyze Button - Mobile Fixed / Desktop Floating */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-4 z-50">
        <button
          onClick={handleReAnalyze}
          className="w-full bg-[#006633] hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
        >
          Re-analyze Profile
        </button>
      </div>

      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReAnalyze}
          className="bg-[#006633] hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-2xl flex items-center gap-2 border border-green-600/50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Re-analyze
        </motion.button>
      </div>
    </div>
  );
}
