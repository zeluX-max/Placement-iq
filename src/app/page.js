'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import InputToggle from '@/components/input/InputToggle';
import LoadingState from '@/components/shared/LoadingState';

export default function DashboardEntry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleProfileReady = async (profile) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Analyze profile
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeData.error || 'Analysis failed');

      const { gapAnalysis, studyPlan } = analyzeData;

      // 2. Save profile to Supabase
      const saveRes = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          gapAnalysis,
          studyPlan
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Failed to save profile');

      // 3. Store results in localStorage for the results page
      localStorage.setItem('placementResults', JSON.stringify({
        profile,
        gapAnalysis,
        studyPlan,
        timestamp: new Date().toISOString()
      }));

      // 4. Redirect to results
      router.push('/results');
    } catch (err) {
      console.error('Final Analysis Error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="max-w-4xl mx-auto pt-24 px-4">
          <LoadingState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-custom">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-block bg-brand-green/10 text-brand-green rounded-full px-4 py-1 border border-brand-green/20 mb-6 text-xs font-bold uppercase tracking-widest">
            Profile Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
            Are you placement ready?
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Upload your profile or fill your details manually to see which companies 
            visiting NIT Jalandhar are looking for you.
          </p>
        </div>

        {error && (
          <div className="mb-10 p-5 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 text-sm text-center font-medium animate-fadeInUp">
            {error}. Please try again.
          </div>
        )}

        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl shadow-brand-green/5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <InputToggle onProfileReady={handleProfileReady} />
        </div>

        <div className="mt-16 text-center text-gray-500 text-xs font-bold uppercase tracking-widest opacity-50">
          Built for NIT Jalandhar students
        </div>
      </main>
    </div>
  );
}
