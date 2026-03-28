'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, CheckCircle, AlertCircle } from 'lucide-react'

export default function OverallScore({ score, verdict, recommendation, strengths = [], weaknesses = [], nextSteps = [] }) {
  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-400'
    if (s >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getRecStyles = (rec) => {
    switch (rec?.toLowerCase()) {
      case 'yes': return 'bg-green-900/30 text-green-400 border-green-700'
      case 'consider': return 'bg-amber-900/30 text-amber-400 border-amber-700'
      case 'no': return 'bg-red-900/30 text-red-400 border-red-700'
      default: return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 text-center">
        <div className="flex flex-col items-center">
          <motion.h2 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-6xl md:text-7xl font-bold ${getScoreColor(score)} tabular-nums`}
          >
            {score}<span className="text-2xl text-gray-600">%</span>
          </motion.h2>
          <p className="text-gray-400 mt-2 font-medium tracking-wide uppercase text-xs">Overall Performance Score</p>
          
          <div className={`mt-6 inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-semibold ${getRecStyles(recommendation)}`}>
            Recommendation: {recommendation?.toUpperCase()}
          </div>

          <p className="mt-6 text-gray-200 text-sm md:text-base max-w-lg leading-relaxed">
            {verdict}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Top Strengths */}
          <div className="bg-green-950/20 border border-green-900/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 mb-3">
              <TrendingUp size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Key Strengths</span>
            </div>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle size={14} className="mt-0.5 text-green-500/70" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Weaknesses */}
          <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <TrendingDown size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Growth Areas</span>
            </div>
            <ul className="space-y-2">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <AlertCircle size={14} className="mt-0.5 text-red-500/70" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-4 bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 text-left">
          <div className="flex items-center gap-2 text-amber-500 mb-3">
            <Target size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Next Steps for You</span>
          </div>
          <ol className="space-y-2">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-300">
                <span className="font-bold text-amber-500/50">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
