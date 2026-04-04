import { useUser as useClerkUser } from '@clerk/nextjs'

export function useUser() {
  const { user, isLoaded } = useClerkUser()
  
  return { 
    user: isLoaded && user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      user_metadata: { full_name: user.fullName }
    } : null, 
    loading: !isLoaded 
  }
}