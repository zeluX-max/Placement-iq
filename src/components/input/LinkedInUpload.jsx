'use client'

import { useState } from 'react'
import { pdfToBase64 } from '@/lib/pdfToBase64'

export default function LinkedInUpload({ onProfileReady }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const base64 = await pdfToBase64(file)
      const res = await fetch('/api/parse-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64: base64, type: 'linkedin' })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setPreview(data.profile)
    } catch (err) {
      setError(err.message || 'Failed to parse PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <label className="block text-center cursor-pointer">
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileUpload}
            className="hidden" 
            disabled={loading}
          />
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 hover:border-purple-500 transition-colors">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-gray-400">Extracting details from LinkedIn PDF...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-3xl">📄</div>
                <p className="text-sm font-medium text-white">Click to upload LinkedIn PDF</p>
                <p className="text-xs text-gray-500">LinkedIn → More → Save to PDF</p>
              </div>
            )}
          </div>
        </label>

        {error && (
          <p className="mt-4 text-xs text-red-500 text-center">{error}</p>
        )}

        <div className="mt-4 p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg">
          <p className="text-[10px] text-black leading-relaxed text-center">
            ⚠️ Chrome/Edge recommended for full voice feature support in the interview phase.
          </p>
        </div>
      </div>

      {preview && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Profile Extracted
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Found Name</p>
              <p className="text-xl text-white font-medium">{preview.name || 'Student'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Technical Skills Detected</p>
              <div className="flex flex-wrap gap-2">
                {preview.skills?.slice(0, 10).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-[10px] text-gray-300">
                    {skill}
                  </span>
                ))}
                {preview.skills?.length > 10 && (
                  <span className="text-[10px] text-gray-500">+{preview.skills.length - 10} more</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onProfileReady(preview)}
              className="w-full bg-[#006633] hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors mt-4 min-h-[44px]"
            >
              Analyze my profile →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
