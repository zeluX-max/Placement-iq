'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname.includes('/login');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden transition-all">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-green/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-10 text-center z-10 animate-fadeInUp">
        <h1 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tighter">
          Placement<span className="text-brand-green">IQ</span>
        </h1>
        <div className="h-1.5 w-12 bg-brand-green mx-auto mt-4 rounded-full" />
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-6 transition-all duration-300">
          {isLogin ? "Welcome Back" : "N.I.T. Jalandhar"}
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col items-center z-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex w-full bg-white border border-slate-200 shadow-sm p-1 rounded-xl mb-4 max-w-[280px]">
          <Link href="/login" className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isLogin ? 'bg-brand-green/10 text-brand-green shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
            Sign In
          </Link>
          <Link href="/signup" className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!isLogin ? 'bg-brand-green/10 text-brand-green shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
            Sign Up
          </Link>
        </div>

        <div className="w-full flex justify-center mt-2 relative min-h-[500px]">
          <AnimatePresence>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full flex justify-center absolute top-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
