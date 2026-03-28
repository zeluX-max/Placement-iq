'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SkillBadge from '@/components/dashboard/SkillBadge'
import { ChevronDown, MapPin, Briefcase, IndianRupee, Info } from 'lucide-react'

/**
 * CompanyCard component displays individual recruiter information.
 * @param {object} company - The company data object.
 * @param {'ready' | 'stretch' | 'future'} type - The readiness category.
 */
export default function CompanyCard({ company, type = 'ready' }) {
  const [expanded, setExpanded] = useState(false)

  const borderColors = {
    ready: 'border-l-green-600',
    stretch: 'border-l-amber-600',
    future: 'border-l-red-600'
  }

  const bgHover = {
    ready: 'hover:bg-green-950/10',
    stretch: 'hover:bg-amber-950/10',
    future: 'hover:bg-red-950/10'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-5 
        border-l-4 ${borderColors[type]} ${bgHover[type]}
        transition-all cursor-pointer group shadow-lg
      `}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm md:text-base font-bold text-white group-hover:text-green-400 transition-colors">
              {company.name}
            </h3>
            {type === 'ready' && (
              <span className="bg-green-950/50 text-green-400 text-[8px] uppercase px-1.5 py-0.5 rounded border border-green-900">
                Ready
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-3">
            <Briefcase size={12} className="text-gray-500" />
            {company.role}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs md:text-sm font-bold text-green-500 flex items-center justify-end">
            <IndianRupee size={12} />
            {company.avgPackage}
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">Avg. Package</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-gray-300">
            {company.rounds?.length || 0}
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Rounds</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-gray-600" />
          <span className="text-[10px] text-gray-500 truncate">{company.location || 'Pan India'}</span>
        </div>
      </div>

      {/* Missing Skills (for Stretch) */}
      {type === 'stretch' && company.missingSkills && company.missingSkills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {company.missingSkills.map((skill, idx) => (
            <SkillBadge key={idx} skill={skill} type="missing" />
          ))}
        </div>
      )}

      {/* Expandable Topper Tip */}
      {company.topperTip && (
        <div className="mt-4 overflow-hidden">
          <button 
            className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors"
          >
            <Info size={12} />
             Topper Tip
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="mt-3 bg-indigo-950/20 border border-indigo-900/30 rounded-lg p-3 text-xs text-indigo-200/90 leading-relaxed"
              >
                {company.topperTip}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
