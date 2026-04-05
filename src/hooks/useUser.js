import { useUser as useClerkUser } from '@clerk/nextjs'

// Deterministic UUID generator for Clerk IDs
function clerkIdToUuid(clerkId) {
  if (!clerkId) return null;
  // Use a simple hash approach (in browser, we use a polyfill or basic string manipulation)
  // Clerk IDs are like "user_2xxxx...". We'll just pad/hash it to 32 hex chars.
  let hash = 0;
  for (let i = 0; i < clerkId.length; i++) {
    hash = ((hash << 5) - hash) + clerkId.charCodeAt(i);
    hash |= 0; 
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const fullHex = (hex + hex + hex + hex).substring(0, 32);
  
  return [
    fullHex.substring(0, 8),
    fullHex.substring(8, 12),
    fullHex.substring(12, 16),
    fullHex.substring(16, 20),
    fullHex.substring(20, 32)
  ].join('-');
}

export function useUser() {
  const { user, isLoaded } = useClerkUser()
  
  return { 
    user: isLoaded && user ? {
      id: clerkIdToUuid(user.id),
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      user_metadata: { full_name: user.fullName }
    } : null, 
    loading: !isLoaded 
  }
}