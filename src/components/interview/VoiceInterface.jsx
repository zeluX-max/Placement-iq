'use client'

import { useState } from 'react'
import { useConversation } from '@elevenlabs/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function VoiceInterface({ 
  onInterviewEnd, 
  company, 
  role, 
  focus 
}) {
  const [transcript, setTranscript] = useState([])
  
  const conversation = useConversation({
    onMessage: (message) => {
      const newMsg = {
        role: message.source === 'ai' ? 'ai' : 'user',
        text: message.message
      }
      setTranscript(prev => {
        const updated = [...prev, newMsg]
        return updated
      })
    },
    onDisconnect: () => {
      // Small delay to let final state updates settle
      setTimeout(() => {
        setTranscript(prev => {
          onInterviewEnd(prev)
          return prev
        })
      }, 500)
    }
  })

  const { status, isSpeaking } = conversation

  const handleStart = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Pass the variables into the ElevenLabs session
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
        dynamicVariables: {
          company: company,
          role: role,
          focus: focus
        }
      })
    } catch (error) {
      console.error('Failed to start interview:', error)
      alert('Microphone access is required for the voice interview.')
    }
  }

  const handleEnd = async () => {
    await conversation.endSession()
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-8">
      {/* Visual Indicator / Pulse Orb */}
      <div className="relative flex items-center justify-center w-48 h-48">
        <AnimatePresence>
          {status === 'connected' && (
            <>
              {/* Outer Glow */}
              <motion.div
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ 
                  scale: isSpeaking ? [1, 1.4, 1] : [1, 1.1, 1],
                  opacity: isSpeaking ? [0.3, 0.1, 0.3] : [0.3, 0.2, 0.3]
                }}
                transition={{ 
                  duration: isSpeaking ? 0.8 : 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-[#006633] rounded-full blur-2xl"
              />
              {/* Inner Orb */}
              <motion.div
                animate={{ 
                  scale: isSpeaking ? [1, 1.2, 1] : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10 w-24 h-24 bg-[#006633] rounded-full border-4 border-green-400 shadow-[0_0_40px_rgba(0,102,51,0.6)]"
              />
            </>
          )}
          
          {status !== 'connected' && (
            <div className="w-24 h-24 bg-gray-900 rounded-full border-4 border-gray-800 flex items-center justify-center transition-colors">
              <div className="w-4 h-4 bg-gray-700 rounded-full" />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-sm space-y-4 px-4">
        {status !== 'connected' ? (
          <button
            onClick={handleStart}
            disabled={status === 'connecting'}
            className="w-full bg-[#006633] hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium py-4 rounded-xl transition-all shadow-lg active:scale-95 min-h-[56px]"
          >
            {status === 'connecting' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Connecting...
              </span>
            ) : 'Start Interview Session'}
          </button>
        ) : (
          <button
            onClick={handleEnd}
            className="w-full bg-red-950/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 font-medium py-4 rounded-xl transition-all active:scale-95 min-h-[56px]"
          >
            End Interview & Get Feedback
          </button>
        )}
        
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-gray-400">
            {status === 'connected' ? "Interviewer is listening..." : "Ready to practice?"}
          </p>
          <p className="text-xs text-gray-500 max-w-[280px] mx-auto">
            {status === 'connected' 
              ? "Speak naturally. When you're done, end the session to view your report." 
              : "Ensure you're in a quiet place and your microphone is ready."}
          </p>
        </div>
      </div>
    </div>
  )
}