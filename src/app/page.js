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
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <main className="max-w-4xl mx-auto pt-20 px-4">
          <LoadingState />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Are you placement ready?
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Upload your profile or fill your details manually to see which companies 
            visiting NIT Jalandhar are looking for you.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-400 text-sm text-center">
            {error}. Please try again.
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl">
          <InputToggle onProfileReady={handleProfileReady} />
        </div>

        <div className="mt-12 text-center text-gray-500 text-xs">
          Built for NIT Jalandhar students · HackMol 7.0
        </div>
      </main>
    </div>
  );
}
