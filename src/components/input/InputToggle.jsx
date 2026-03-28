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
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-custom text-center min-h-[100px] active:scale-[0.98] ${
              activeTab === tab.id
                ? 'border-2 border-brand-green bg-brand-green/10 shadow-lg shadow-brand-green/5'
                : 'border border-gray-800 hover:border-gray-700 bg-gray-900/40 hover:bg-gray-900/60'
            }`}
          >
            <span className="text-2xl mb-2">{tab.icon}</span>
            <span className={`text-sm font-bold tracking-tight ${activeTab === tab.id ? 'text-white' : 'text-gray-300'}`}>
              {tab.label}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
              {tab.subtitle}
            </span>
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
