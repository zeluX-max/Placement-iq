'use client'

import { SignUp } from "@clerk/nextjs"

export default function SignupPage() {
  return (
    <SignUp 
      routing="path" 
      path="/signup"
      signInUrl="/login" 
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
  )
}