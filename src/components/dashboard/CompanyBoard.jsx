'use client'

import { motion } from 'framer-motion'
import CompanyCard from '@/components/dashboard/CompanyCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const SectionHeader = ({ title, count, color }) => (
  <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-950/80 backdrop-blur-md z-10 py-2">
    <h3 className={`text-xs md:text-sm font-bold uppercase tracking-widest ${color}`}>
      {title}
    </h3>
    <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${color.replace('text', 'bg').replace('600', '950/50')} border ${color.replace('text', 'border').replace('600', '900')}`}>
      {count}
    </span>
  </div>
)

const EmptyState = ({ text }) => (
  <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-xl p-8 text-center">
    <p className="text-gray-600 text-[10px] md:text-sm italic">{text}</p>
  </div>
)

/**
 * CompanyBoard component for categorizing and listing companies.
 * @param {object[]} ready - Ready companies array.
 * @param {object[]} stretch - Stretch companies array.
 * @param {object[]} future - Future companies array.
 */
export default function CompanyBoard({ ready = [], stretch = [], future = [] }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mt-8">
      {/* Ready Column */}
      <div className="space-y-4">
        <SectionHeader title="Ready to Apply" count={ready.length} color="text-green-600" />
        <motion.div
           variants={container}
           initial="hidden"
           animate="show" 
           className="flex flex-col gap-4"
        >
          {ready.length > 0 ? (
            ready.map((company, idx) => (
              <CompanyCard key={`${company.name}-${idx}`} company={company} type="ready" />
            ))
          ) : (
            <EmptyState text="Keep building! Ready companies will appear here." />
          )}
        </motion.div>
      </div>

      {/* Stretch Column */}
      <div className="space-y-4">
        <SectionHeader title="Stretch (Gaps Found)" count={stretch.length} color="text-amber-600" />
        <motion.div
           variants={container}
           initial="hidden"
           animate="show" 
           className="flex flex-col gap-4"
        >
          {stretch.length > 0 ? (
            stretch.map((company, idx) => (
              <CompanyCard key={`${company.name}-${idx}`} company={company} type="stretch" />
            ))
          ) : (
            <EmptyState text="Hooray! No gaps detected for your current focus." />
          )}
        </motion.div>
      </div>

      {/* Future Column */}
      <div className="space-y-4">
        <SectionHeader title="Future Targets" count={future.length} color="text-red-600" />
        <motion.div
           variants={container}
           initial="hidden"
           animate="show" 
           className="flex flex-col gap-4"
        >
          {future.length > 0 ? (
            future.map((company, idx) => (
              <CompanyCard key={`${company.name}-${idx}`} company={company} type="future" />
            ))
          ) : (
            <EmptyState text="Long-term targets will be analyzed here." />
          )}
        </motion.div>
      </div>
    </div>
  )
}
