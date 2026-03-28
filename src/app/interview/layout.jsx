'use client'
import { ConversationProvider } from '@elevenlabs/react';

export default function InterviewLayout({ children }) {
  return (
    <ConversationProvider>
      <div className="min-h-screen bg-gray-950">
        {/* You can add a specific Interview Header here */}
        <nav className="p-4 border-b border-gray-800">
          <span className="text-[#006633] font-bold">PlacementIQ</span> 
          <span className="text-gray-500 ml-2">| Mock Interview</span>
        </nav>
        
        {children}
      </div>
    </ConversationProvider>
  );
}