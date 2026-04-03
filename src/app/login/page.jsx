'use client'

import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12 transition-custom">
      
      {/* Animated Brand Header */}
      <div className="mb-12 text-center animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Placement<span className="text-brand-green">IQ</span>
        </h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
          NIT Jalandhar
        </p>
      </div>

      {/* The All-in-One Clerk Component 
          By setting signUpUrl to "/login", we handle both flows here.
      */}
      <div className="w-full max-w-md flex justify-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <SignIn 
          routing="hash" 
          signUpUrl="/login"
          appearance={{
            variables: {
              colorPrimary: '#22c55e', // Your brand-green
              colorBackground: '#111827', // Matches your dark theme (gray-900)
              colorText: '#ffffff',
              colorTextSecondary: '#9ca3af',
              colorInputBackground: 'rgba(17, 24, 39, 0.5)',
              colorInputBorder: '#1f2937',
              borderRadius: '0.75rem'
            },
            elements: {
              card: "border border-gray-800 shadow-2xl p-2 bg-gray-900/50 backdrop-blur-xl",
              headerTitle: "text-2xl font-black tracking-tight",
              headerSubtitle: "text-gray-400 text-sm",
              primaryButton: "font-bold py-3 min-h-[52px] active:scale-95 transition-all shadow-lg shadow-brand-green/10",
              formFieldInput: "px-4 py-3.5 text-sm transition-all focus:ring-2 focus:ring-brand-green/50 bg-gray-950/50",
              footerActionLink: "font-bold text-brand-green hover:text-white transition-colors",
              dividerLine: "bg-gray-800",
              dividerText: "text-gray-500 text-[10px] uppercase font-black",
              socialButtonsBlockButton: "border-gray-800 hover:bg-gray-800/50 transition-all",
              formFieldLabel: "text-[10px] font-black text-gray-500 uppercase tracking-widest"
            }
          }}
        />
      </div>
      
      {/* Footer Instructions */}
      <p className="mt-12 text-gray-600 text-[10px] font-black uppercase tracking-widest opacity-50 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        Use your @nitj.ac.in email for verification
      </p>

    </div>
  )
}