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
            data: {
              full_name: formData.fullName
            }
          }
        })
        if (signUpError) throw signUpError
        // In signup case, if email confirm is off, we might just be logged in
        // If it's on, we would wait for verification, but common practice here
        // is to redirect and let them know OR redirect to confirm page
        // For simplicity as per instruction: "router.push('/') on success"
        router.push('/')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
        if (signInError) throw signInError
        router.push('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Placement<span className="text-[#006633]">IQ</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">NIT Jalandhar</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl">
        <h2 className="text-xl md:text-2xl font-medium text-white mb-6 text-center">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Ex. Rahul Kumar"
                required={isSignUp}
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#006633] transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5 ml-1">
              College Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="rahul.ks.21@nitj.ac.in"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#006633] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#006633] transition-all"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs mt-2 bg-red-950/30 border border-red-900/50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006633] hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors min-h-[44px] mt-6 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              isSignUp ? 'Sign Up' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-gray-400 hover:text-white text-sm transition-colors decoration-gray-700 hover:decoration-white"
          >
            {isSignUp ? (
              <>Already have an account? <span className="text-[#006633] font-medium">Sign In</span></>
            ) : (
              <>Don&apos;t have an account? <span className="text-[#006633] font-medium">Create Account</span></>
            )}
          </button>
        </div>
      </div>
      
      {/* Footer Hint */}
      <p className="mt-8 text-gray-500 text-xs">
        Use your @nitj.ac.in email for verification
      </p>
    </div>
  )
}
