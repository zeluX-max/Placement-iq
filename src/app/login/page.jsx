'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.fullName }
          }
        })
        if (signUpError) throw signUpError
        await supabase.auth.getSession()
        router.refresh()
        router.push('/')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
        if (signInError) throw signInError
        await supabase.auth.getSession()
        router.refresh()
        router.push('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12 transition-custom">
      <div className="mb-12 text-center animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Placement<span className="text-brand-green">IQ</span>
        </h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">NIT Jalandhar</p>
      </div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 md:p-10 shadow-2xl shadow-brand-green/5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-black text-white mb-8 text-center tracking-tight">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Ex. Rahul Kumar"
                required={isSignUp}
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-custom"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              College Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="rahul.ks.21@nitj.ac.in"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-custom"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-custom"
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs font-medium mt-4 bg-red-950/20 border border-red-900/30 p-4 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-bold py-4 rounded-xl transition-custom min-h-[52px] mt-8 flex items-center justify-center disabled:opacity-50 active:scale-95 shadow-xl shadow-brand-green/10"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-gray-500 hover:text-white text-sm font-medium transition-custom"
          >
            {isSignUp ? (
              <>Already have an account? <span className="text-brand-green font-bold">Sign In</span></>
            ) : (
              <>Don&apos;t have an account? <span className="text-brand-green font-bold">Create Account</span></>
            )}
          </button>
        </div>
      </div>
      
      <p className="mt-12 text-gray-600 text-[10px] font-black uppercase tracking-widest opacity-50">
        Use your @nitj.ac.in email for verification
      </p>
    </div>
  )
}