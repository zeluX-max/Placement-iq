'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { companies } from '@/data/companies'
import { ChevronRight, Briefcase, Building, Target } from 'lucide-react'

export default function InterviewSetupPage() {
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState('')
  const [role, setRole] = useState('')
  const [focus, setFocus] = useState('Technical') // Technical, HR, Mixed

  const handleStart = () => {
    if (!selectedCompany || !role) {
      alert('Please select a company and entered a role.')
      return
    }

    const interviewMeta = {
      company: selectedCompany,
      role: role,
      focus: focus,
      timestamp: new Date().toISOString()
    }

    localStorage.setItem('interviewMeta', JSON.stringify(interviewMeta))
    router.push('/interview/session')
  }

  // Get unique company names for the dropdown
  const uniqueCompanyNames = Array.from(new Set(companies.map(c => c.name))).sort()

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-8 py-12 md:py-20">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-700 text-purple-300 text-xs font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Real-time AI Interviewer
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Mock Interview <span className="text-[#006633]">Setup</span>
          </motion.h1>
          <p className="text-gray-400 text-sm md:text-base">
            Configure your session to match your target company&apos;s patterns.
          </p>
        </div>

        {/* Setup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
        >
          {/* Company Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Building size={16} className="text-[#006633]" />
              Select Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#006633] transition-all appearance-none"
            >
              <option value="">Choose a company...</option>
              {uniqueCompanyNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Briefcase size={16} className="text-[#006633]" />
              Target Role
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer, SDE-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#006633] transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Focus Toggle */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Target size={16} className="text-[#006633]" />
              Interview Focus
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Technical', 'HR', 'Mixed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFocus(f)}
                  className={`py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all border ${
                    focus === f 
                      ? 'bg-purple-900/40 border-purple-600 text-purple-200 shadow-inner shadow-purple-900/20' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={handleStart}
              className="w-full bg-[#006633] hover:bg-green-700 text-white min-h-[56px] rounded-xl text-sm md:text-base font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 group"
            >
              Connect to AI Interviewer
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Hints / Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <p className="text-[10px] text-gray-500 leading-relaxed italic">
              * The AI will behave as a senior recruiter from the selected company. It will ask questions, listen to your responses, and follow up in real-time.
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <p className="text-[10px] text-gray-500 leading-relaxed italic">
              * Ensure your microphone is working and you are in a quiet environment for the best experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
