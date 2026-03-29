'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WeeklyPlan({ plan }) {
  const [activeWeek, setActiveWeek] = useState(0)

  if (!plan || !plan.weeks) return null

  const { weeks, totalHours, targetCompany } = plan

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-100 mb-1">
          {totalHours} hours to reach {targetCompany}
        </h2>
        <p className="text-sm text-gray-400">Your personalized roadmap</p>
      </div>

      {/* Week Tabs */}
      <div className="flex overflow-x-auto md:overflow-visible gap-2 mb-6 scrollbar-hide pb-2">
        {weeks.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveWeek(index)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] flex-1 md:flex-none ${
              activeWeek === index
                ? 'bg-purple-900 text-purple-200 border-purple-600'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            Week {index + 1}
          </button>
        ))}
      </div>

      {/* Week Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWeek}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Theme Box */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-1">
              {weeks[activeWeek].theme}
            </h3>
            <p className="text-xs text-gray-500">
              {weeks[activeWeek].dailyHours} hours per day focus
            </p>
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {weeks[activeWeek].tasks.map((task, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3"
              >
                <div className="text-xs font-medium text-gray-500 min-w-[80px]">
                  {task.days}
                </div>
                <div className="flex-1 text-sm text-gray-300">
                  {task.task}
                </div>
                {task.resource && (
                  <a
                    href={task.resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-xs font-medium"
                  >
                    View Resource →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Weekly Goal */}
          {weeks[activeWeek].weeklyGoal && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-dashed border-gray-700 mt-6">
              <span className="text-xs text-gray-500 block mb-1">Weekly Milestone:</span>
              <p className="text-sm text-gray-300">{weeks[activeWeek].weeklyGoal}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}