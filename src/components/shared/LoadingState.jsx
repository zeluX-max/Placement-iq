'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      {/* Animated Dots */}
      <div className="flex gap-2 mb-8">
        <div className="w-4 h-4 rounded-full bg-purple-600 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce"></div>
      </div>

      <h2 className="text-2xl md:text-3xl font-medium mb-2">Analyzing your profile</h2>
      <p className="text-sm text-gray-500 mb-8">Comparing against 53 companies</p>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-gray-800 rounded-full h-1.5 mb-10 overflow-hidden">
        <motion.div
          className="bg-purple-600 h-full"
          initial={{ width: "30%" }}
          animate={{ width: "70%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Step Tracker */}
      <div className="space-y-4 text-left w-full max-w-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-sm text-gray-300">PDF extracted</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse shadow-[0_0_8px_rgba(147,51,234,0.6)]"></div>
          <span className="text-sm text-white font-medium">Running gap analysis...</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
          <span className="text-sm text-gray-500">Generating study plan</span>
        </div>
      </div>
    </div>
  );
}
