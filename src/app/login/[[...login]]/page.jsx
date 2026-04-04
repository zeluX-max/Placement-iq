'use client'

import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden transition-all">
      
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-green/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-10 text-center z-10 animate-fadeInUp">
        <h1 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tighter">
          Placement<span className="text-brand-green">IQ</span>
        </h1>
        <div className="h-1.5 w-12 bg-brand-green mx-auto mt-4 rounded-full" />
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-6">
          Welcome Back
        </p>
      </div>

      <div className="w-full max-w-md flex justify-center z-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <SignIn 
          routing="path" 
          path="/login"
          signUpUrl="/signup" 
          appearance={{
            variables: { colorPrimary: '#22c55e', borderRadius: '1rem' },
            elements: {
              card: "bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2",
              headerTitle: "text-2xl font-black tracking-tight text-slate-900",
              headerSubtitle: "text-slate-500",
              socialButtonsBlockButton: "bg-white border-slate-200 hover:bg-slate-50 transition-all duration-200",
              formButtonPrimary: "bg-brand-green hover:bg-brand-green-hover font-black uppercase tracking-widest text-xs py-4 shadow-lg shadow-green-500/20 active:scale-95 transition-all",
              formFieldInput: "bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green py-3.5 px-4 transition-all",
              footerActionLink: "text-brand-green hover:text-green-700 font-bold transition-colors",
              dividerLine: "bg-slate-200",
              dividerText: "text-slate-400 text-[10px] font-black uppercase tracking-widest",
              formFieldLabel: "text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1"
            }
          }}
        />
      </div>

    </div>
  )
}