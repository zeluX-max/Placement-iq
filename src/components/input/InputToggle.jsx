'use client'

import { useState } from 'react'
import LinkedInUpload from './LinkedInUpload'
import ResumeUpload from './ResumeUpload'
import ManualForm from './ManualForm'

export default function InputToggle({ onProfileReady }) {
  const [activeTab, setActiveTab] = useState('linkedin')

  const tabs = [
    { id: 'linkedin', label: 'LinkedIn PDF', subtitle: 'Most accurate results', icon: '📄' },
    { id: 'resume', label: 'Resume PDF', subtitle: 'Traditional parsing', icon: '📝' },
    { id: 'manual', label: 'Manual Form', subtitle: 'Type it yourself', icon: '⌨️' }
  ]

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all text-center min-h-[88px] ${
              activeTab === tab.id
                ? 'border-2 border-purple-500 bg-purple-950/40'
                : 'border border-gray-700 hover:border-gray-500 bg-gray-900/50'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-sm font-medium text-white">{tab.label}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{tab.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'linkedin' && <LinkedInUpload onProfileReady={onProfileReady} />}
        {activeTab === 'resume' && <ResumeUpload onProfileReady={onProfileReady} />}
        {activeTab === 'manual' && <ManualForm onProfileReady={onProfileReady} />}
      </div>
    </div>
  )
}
