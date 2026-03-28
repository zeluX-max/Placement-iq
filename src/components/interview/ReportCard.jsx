'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'

export default function ReportCard({ feedback }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!feedback) return null

  const getGradeStyles = (grade) => {
    switch (grade) {
      case 'A': return 'bg-green-950 text-green-400 border-green-800'
      case 'B': return 'bg-blue-950 text-blue-400 border-blue-800'
      case 'C': return 'bg-amber-950 text-amber-400 border-amber-800'
      case 'D': return 'bg-red-950 text-red-400 border-red-800'
      default: return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-4">
      {/* Header - Always Visible */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-100 truncate pr-4">
            {feedback.question}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getGradeStyles(feedback.grade)}`}>
              Grade {feedback.grade}
            </span>
            <span className="text-[10px] text-gray-500">
              Score: {feedback.score}%
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-gray-500 flex-shrink-0"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-2 space-y-4 border-t border-gray-800/50">
              {/* What Was Good */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">What was good</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed pl-6">
                  {feedback.whatWasGood}
                </p>
              </div>

              {/* What Was Missing */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">What was missing</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed pl-6">
                  {feedback.whatWasMissing}
                </p>
              </div>

              {/* Ideal Answer */}
              <div className="space-y-1.5 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="flex items-center gap-2 text-amber-400">
                  <Lightbulb size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Strategic Advice / Ideal Approach</span>
                </div>
                <p className="text-sm text-gray-400 italic leading-relaxed">
                  {feedback.idealAnswer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
