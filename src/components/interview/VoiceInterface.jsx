'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useConversation } from '@elevenlabs/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function VoiceInterface({ onInterviewEnd }) {
  const [status, setStatus] = useState('idle')
  const [transcript, setTranscript] = useState([])
  
  // THE FIX: We use a Ref to shadow the state. This completely prevents the 
  // "Stale Closure" bug inside the onDisconnect callback, while still letting 
  // you use standard React state for the transcript!
  const latestTranscript = useRef([])

  useEffect(() => {
    latestTranscript.current = transcript
  }, [transcript])

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs')
      setStatus('interviewing')
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs')
      setStatus('idle')
      // Send the absolute latest data from the Ref
      onInterviewEnd(latestTranscript.current)
    },
    onMessage: (message) => {
      console.log('ElevenLabs Message:', message)
      
      // Defensive fallback just in case ElevenLabs changes their object keys
      const role = message.source === 'user' ? 'user' : 'ai'
      const text = message.message || message.text || ''
      
      if (text.trim() !== '') {
        setTranscript((prev) => [...prev, { role, text }])
      }
    },
    onError: (error) => {
      console.error('ElevenLabs Error:', error)
      setStatus('idle')
      alert('Lost connection to the AI interviewer. Please try again.')
    },
  })

  const startInterview = useCallback(async () => {
    try {
      // 1. Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // 2. Clear previous transcript
      setTranscript([])
      latestTranscript.current = []
      
      // 3. Ensure the Environment Variable actually exists
      if (!process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID) {
        throw new Error('Missing ElevenLabs Agent ID in .env file')
      }

      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
      })
    } catch (error) {
      console.error('Failed to start interview:', error)
      alert(error.message || 'Failed to access microphone. Please check permissions.')
    }
  }, [conversation])

  const endInterview = useCallback(async () => {
    await conversation.endSession()
  }, [conversation])

  const isAgentSpeaking = conversation.isSpeaking

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl mx-auto space-y-12">
      {/* Visual Indicator: Pulsing Orb */}
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {status === 'interviewing' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isAgentSpeaking ? [1, 1.2, 1] : 1,
                opacity: 1 
              }}
              transition={{ 
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                opacity: { duration: 0.5 }
              }}
              className={`w-32 h-32 md:w-48 md:h-48 rounded-full blur-3xl absolute opacity-30 ${
                isAgentSpeaking ? 'bg-purple-500' : 'bg-green-500/50'
              }`}
            />
          )}
        </AnimatePresence>
        
        <motion.div
          animate={{
            scale: isAgentSpeaking ? [1, 1.1, 1] : 1,
            borderWidth: isAgentSpeaking ? '4px' : '2px',
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`w-24 h-24 md:w-36 md:h-36 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-500 ${
            status === 'interviewing' 
              ? (isAgentSpeaking ? 'border-purple-500 bg-purple-900/20' : 'border-green-500 bg-green-900/20') 
              : 'border-gray-700 bg-gray-900'
          }`}
        >
          {status === 'interviewing' ? (
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: isAgentSpeaking ? [8, 24, 8] : 8 }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                  className={`w-1 rounded-full ${isAgentSpeaking ? 'bg-purple-400' : 'bg-green-400'}`}
                />
              ))}
            </div>
          ) : (
            <span className="text-gray-500 text-3xl">🎙️</span>
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="w-full space-y-4 px-4">
        {status === 'idle' ? (
          <button
            onClick={startInterview}
            className="w-full bg-[#006633] hover:bg-green-700 text-white min-h-[56px] rounded-xl text-lg font-medium transition-all shadow-lg shadow-green-900/20"
          >
            Start Interview
          </button>
        ) : (
          <button
            onClick={endInterview}
            className="w-full bg-red-950 border border-red-800 hover:bg-red-900 text-red-400 min-h-[56px] rounded-xl text-lg font-medium transition-all"
          >
            End Interview & Get Feedback
          </button>
        )}
        
        <p className="text-center text-xs text-gray-500">
          {status === 'interviewing' 
            ? 'The AI is listening. Speak naturally as you would in a real placement interview.'
            : 'Ready to practice? Your interview will be recorded for feedback.'}
        </p>
      </div>
    </div>
  )
}