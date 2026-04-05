import { useEffect, useState } from 'react'
import { createClerkSupabaseClient } from '@/lib/supabase'
import { useUser } from './useUser'
import { useAuth } from '@clerk/nextjs'

export function useProfile() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      if (!user) return
      
      try {
        const token = await getToken({ template: 'supabase' })
        const supabase = createClerkSupabaseClient(token)

        const { data } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (isMounted) {
          setProfile(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        if (isMounted) setLoading(false)
      }
    }

    fetchProfile()

    return () => {
      isMounted = false
    }
  }, [user, getToken])

  return { profile, loading }
}