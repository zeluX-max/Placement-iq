'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@clerk/nextjs'
import { supabase as publicSupabase, createClerkSupabaseClient } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

// Helper function to extract the number from strings like "8 LPA"
const extractPackageNumber = (pkgString) => {
  if (!pkgString) return 0;
  const match = String(pkgString).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

export default function Leaderboard() {
  const { session } = useSession() // Replaced custom useUser with Clerk
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = async () => {
    // 1. Determine which Supabase client to use based on Clerk session
    let activeClient = publicSupabase; // Default to public read for landing page

    if (session) {
      const token = await session.getToken({ template: 'supabase' });
      activeClient = createClerkSupabaseClient(token); // Use secure client if logged in
    }

    // 2. Fetch the data
    const { data, error } = await activeClient
      .from('students')
      .select('id, name, user_id, ready_companies, gap_analysis, cgpa')

    if (error) {
      console.error('Error fetching students:', error)
      setLoading(false)
      return
    }

    // 3. Sort by highest package
    const sorted = (data || []).sort((a, b) => {
      const aReady = a.gap_analysis?.ready || a.ready_companies || []
      const bReady = b.gap_analysis?.ready || b.ready_companies || []
      
      const aMaxPackage = aReady.length > 0 
        ? Math.max(...aReady.map(c => extractPackageNumber(c.avgPackage))) 
        : 0
        
      const bMaxPackage = bReady.length > 0 
        ? Math.max(...bReady.map(c => extractPackageNumber(c.avgPackage))) 
        : 0

      if (aMaxPackage !== bMaxPackage) return bMaxPackage - aMaxPackage
      return (b.cgpa || 0) - (a.cgpa || 0)
    })

    setStudents(sorted.slice(0, 10))
    setLoading(false)
  }

  // Refetch when the session changes (user logs in or out)
  useEffect(() => {
    fetchStudents()

    // Real-time subscription fallback (uses public client for broadcasts)
    const channel = publicSupabase
      .channel('students-leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        () => fetchStudents()
      )
      .subscribe()

    return () => publicSupabase.removeChannel(channel)
  }, [session])

  const getRankDisplay = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return <span className="text-gray-500 text-xs">#{index + 1}</span>
  }

  // Check against Clerk's user ID instead of Supabase's
  const clerkUserId = session?.user?.id;
  const userRank = clerkUserId 
    ? students.findIndex(s => s.user_id === clerkUserId) + 1 
    : 0

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006633]"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">

      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-950/50">
        <h3 className="text-sm font-medium text-gray-100 flex items-center justify-between">
          🏆 Student Leaderboard
          <span className="text-xs text-gray-500 font-normal">Top 10 Packages</span>
        </h3>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-800">
        <AnimatePresence>
          {students.map((student, index) => {
            const isCurrentUser = clerkUserId && student.user_id === clerkUserId
            const readyCompanies = student.gap_analysis?.ready || student.ready_companies || []
            const readyCount = readyCompanies.length
            
            const highestPackage = readyCount > 0 
              ? Math.max(...readyCompanies.map(c => extractPackageNumber(c.avgPackage)))
              : 0

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between px-4 py-3 ${
                  isCurrentUser 
                    ? 'bg-purple-900/40 border-l-4 border-purple-600' 
                    : 'hover:bg-gray-800/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 text-sm flex items-center justify-center">
                    {getRankDisplay(index)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200 flex items-center gap-2">
                      {student.name || 'Anonymous Student'}
                      {isCurrentUser && (
                        <span className="text-[10px] bg-purple-700 px-1.5 py-0.5 rounded uppercase">
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
                  <div className="text-[10px] text-gray-500 uppercase tracking-tighter">
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
      <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-800 bg-gray-950/30">
        {userRank > 0
          ? `You're ranked #${userRank} on PlacementIQ 🚀`
          : 'Analyze your profile to join the leaderboard!'
        }
      </div>
    </div>
  )
}
