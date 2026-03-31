'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import VoiceInterface from '@/components/interview/VoiceInterface'

export default function InterviewSessionPage() {
  const router = useRouter()
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    // Check localStorage only on client
    const savedMeta = localStorage.getItem('interviewMeta')
    if (!savedMeta) {
      router.push('/interview')
      return
    }
    
    // Defer update to avoid "cascading renders" warning on mount
    const timer = setTimeout(() => {
      setMeta(JSON.parse(savedMeta))
    }, 0)
    return () => clearTimeout(timer)
  }, [router])

  const handleInterviewEnd = (transcript) => {
    localStorage.setItem('interviewTranscript', JSON.stringify(transcript))
    router.push('/interview/report')
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-[#006633]/20 border border-[#006633]/30 text-[#006633] text-xs font-semibold uppercase tracking-wider">
            Live Session
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {meta.company} Interview
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Interviewing for <span className="text-gray-200">{meta.role}</span> with 
            a <span className="text-[#006633]">{meta.focus}</span> focus.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        {/* Pass the meta variables as props here */}
        <VoiceInterface 
          onInterviewEnd={handleInterviewEnd} 
          company={meta.company}
          role={meta.role}
          focus={meta.focus}
        />
      </motion.div>

      {/* Safety Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => {
          if (confirm('Are you sure you want to leave? Your progress will not be saved.')) {
            router.push('/interview')
          }
        }}
        className="mt-12 text-gray-600 hover:text-gray-400 text-xs transition-colors"
      >
        Cancel and return to setup
      </motion.button>
    </div>
  )
}
