'use client'

import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden transition-custom">
      
      {/* Background Ambient Glow to match your 'Built for NIT Jalandhar' vibe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-green/5 to-transparent pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-10 text-center z-10 animate-fadeInUp">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
          Placement<span className="text-brand-green">IQ</span>
        </h1>
        <div className="h-1.5 w-12 bg-brand-green mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-6 opacity-80">
          N.I.T. Jalandhar Official Portal
        </p>
      </div>

      {/* Fully Styled Clerk Component */}
      <div className="w-full max-w-md flex justify-center z-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <SignIn 
          routing="hash" 
          signUpUrl="/login"
          appearance={{
            variables: {
              colorPrimary: '#22c55e', // Your brand-green
              colorBackground: '#0a0a0a', 
              colorText: '#ffffff',
              colorTextSecondary: '#94a3b8',
              colorInputBackground: '#171717',
              colorInputText: '#ffffff',
              borderRadius: '1rem',
            },
            elements: {
              card: "bg-[#0a0a0a] border border-white/10 shadow-[0_0_60px_-15px_rgba(34,197,94,0.15)] p-2 backdrop-blur-xl",
              headerTitle: "text-2xl font-black tracking-tight",
              headerSubtitle: "hidden", // Removes generic Clerk greeting
              socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300",
              socialButtonsBlockButtonText: "font-bold text-sm",
              formButtonPrimary: "bg-brand-green hover:bg-brand-green-hover font-black uppercase tracking-widest text-xs py-4 shadow-lg shadow-brand-green/20 active:scale-95 transition-all",
              formFieldInput: "bg-white/5 border-white/10 focus:ring-brand-green focus:border-brand-green py-3.5 px-4 transition-all",
              footerActionLink: "text-brand-green hover:text-brand-green-hover font-bold transition-colors",
              dividerLine: "bg-white/10",
              dividerText: "text-gray-600 text-[10px] font-black uppercase tracking-widest",
              formFieldLabel: "text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 ml-1"
            }
          }}
        />
      </div>
      
      {/* Verification Footer */}
      <div className="mt-12 text-center z-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          Use your @nitj.ac.in email for verification
        </p>
      </div>

    </div>
  )
}