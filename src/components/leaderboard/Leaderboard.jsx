'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/useUser'
import { motion, AnimatePresence } from 'framer-motion'

export default function Leaderboard() {
  const { user } = useUser()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, user_id, ready_companies, cgpa')

    if (error) {
      console.error('Error fetching students:', error)
      setLoading(false)
      return
    }

    const sorted = (data || []).sort((a, b) => {
      const aReady = a.ready_companies || []
      const bReady = b.ready_companies || []
      
      // Calculate max package for A
      const aMaxPackage = aReady.length > 0 
        ? Math.max(...aReady.map(c => c.package_lpa || 0)) 
        : 0
        
      // Calculate max package for B
      const bMaxPackage = bReady.length > 0 
        ? Math.max(...bReady.map(c => c.package_lpa || 0)) 
        : 0

      // Sort by highest package first
      if (aMaxPackage !== bMaxPackage) return bMaxPackage - aMaxPackage
      
      // Tie-breaker: CGPA
      return (b.cgpa || 0) - (a.cgpa || 0)
    })

    setStudents(sorted.slice(0, 10))
    setLoading(false)
  }

  useEffect(() => {
    fetchStudents()

    const channel = supabase
      .channel('students-leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        () => fetchStudents()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const getRankDisplay = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return <span className="text-gray-500 text-xs">#{index + 1}</span>
  }

  const userRank = user 
    ? students.findIndex(s => s.user_id === user.id) + 1 
    : 0

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 
          border-b-2 border-[#006633]"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900 
      border border-gray-800 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-950/50">
        <h3 className="text-sm font-medium text-gray-100 
          flex items-center justify-between">
          🏆 Student Leaderboard
          <span className="text-xs text-gray-500 font-normal">
            Top 10 Packages
          </span>
        </h3>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-800">
        <AnimatePresence>
          {students.map((student, index) => {
            const isCurrentUser = user && student.user_id === user.id
            const readyCompanies = student.ready_companies || []
            const readyCount = readyCompanies.length
            
            // Find the highest package for this specific student
            const highestPackage = readyCount > 0 
              ? Math.max(...readyCompanies.map(c => c.package_lpa || 0))
              : 0

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between 
                  px-4 py-3 ${isCurrentUser 
                    ? 'bg-purple-900/40 border-l-4 border-purple-600' 
                    : 'hover:bg-gray-800/20'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 text-sm flex items-center 
                    justify-center">
                    {getRankDisplay(index)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200 
                      flex items-center gap-2">
                      {student.name || 'Anonymous Student'}
                      {isCurrentUser && (
                        <span className="text-[10px] bg-purple-700 
                          px-1.5 py-0.5 rounded uppercase">
                          You 📍
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      CGPA: {student.cgpa || 'N/A'} · {readyCount} companies ready
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    highestPackage >= 20 ? 'text-green-400' :
                    highestPackage >= 10 ? 'text-amber-400' :
                    'text-gray-100'
                  }`}>
                    {highestPackage > 0 ? `${highestPackage} LPA` : '-'}
                  </div>
                  <div className="text-[10px] text-gray-500 
                    uppercase tracking-tighter">
                    Max Package
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {students.length === 0 && (
        <div className="p-8 text-center text-sm text-gray-500">
          No records yet — be the first to analyze! 🚀
        </div>
      )}

      {/* Motivational footer */}
      <div className="p-3 text-center text-xs text-gray-500 
        border-t border-gray-800 bg-gray-950/30">
        {userRank > 0
          ? `You're ranked #${userRank} on PlacementIQ 🚀`
          : 'Analyze your profile to join the leaderboard!'
        }
      </div>
    </div>
  )
}

