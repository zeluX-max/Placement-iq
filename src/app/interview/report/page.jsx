'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import OverallScore from '@/components/interview/OverallScore'
import ReportCard from '@/components/interview/ReportCard'
import { ArrowLeft, LayoutDashboard, RefreshCcw } from 'lucide-react'

export default function InterviewReportPage() {
  const router = useRouter()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    
    const transcript = localStorage.getItem('interviewTranscript')
    const meta = localStorage.getItem('interviewMeta')

    if (!transcript || !meta) {
      router.push('/interview')
      return
    }

    const generateReport = async () => {
      try {
        fetchedRef.current = true
        const parsedTranscript = JSON.parse(transcript)
        const { company, role } = JSON.parse(meta)

        const res = await fetch('/api/interview-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: parsedTranscript, company, role })
        })

        const data = await res.json()
        if (data.error) throw new Error(data.error)

        setReport(data)
      } catch (err) {
        console.error('Report Generation Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    generateReport()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-full h-full rounded-full border-t-2 border-r-2 border-[#006633]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute top-2 left-2 w-20 h-20 rounded-full border-t-2 border-l-2 border-purple-500"
          />
        </div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl font-bold text-white mb-2"
        >
          AI is grading your interview...
        </motion.h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Analyzing your responses against company expectations and industry standards.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-950 border border-red-800 rounded-2xl p-8 max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-4">Grading Failed</h2>
          <p className="text-red-300 text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-800 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-8 py-10 md:py-16">
      <div className="max-w-4xl mx-auto space-y-12 pb-32">
        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => router.push('/interview')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Mock Interviews
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Interview <span className="text-[#006633]">Scorecard</span></h1>
          <p className="text-gray-400 text-sm">Detailed evaluation from your AI Interviewer session.</p>
        </div>

        {/* Overall Score Section */}
        <OverallScore 
          score={report.overallScore}
          verdict={report.overallVerdict}
          recommendation={report.hireRecommendation}
          strengths={report.topStrengths}
          weaknesses={report.topWeaknesses}
          nextSteps={report.nextSteps}
        />

        {/* Question Breakdown */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-medium">Conversation Breakdown</h3>
            <span className="text-xs text-gray-500">{report.specificFeedback?.length || 0} topics evaluated</span>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 gap-1"
          >
            {report.specificFeedback?.map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <ReportCard feedback={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/results')}
            className="flex-1 md:flex-none border border-gray-700 hover:bg-gray-800 text-white min-h-[48px] px-6 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={18} className="text-gray-400" />
            Go to Results
          </button>
          
          <button
            onClick={() => router.push('/interview')}
            className="flex-1 md:flex-none bg-[#006633] hover:bg-green-700 text-white min-h-[48px] px-8 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
          >
            <RefreshCcw size={18} />
            Practice Again
          </button>
        </div>
      </div>
    </div>
  )
}
