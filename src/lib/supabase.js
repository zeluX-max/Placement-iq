import { createClient } from '@supabase/supabase-js'

// 1. Your standard public client (used for the pre-login page)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// 2. The NEW function that Next.js is looking for!
// This injects the Clerk token into Supabase
export const createClerkSupabaseClient = (clerkToken) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    }
  )
}