import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function supabaseServer() {
  // 1. Get the Clerk auth context on the server
  const { getToken } = auth();

  // 2. Request the special Supabase token from Clerk
  const token = await getToken({ template: 'supabase' });

  // 3. Set the Authorization header if the user is logged in
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // 4. Return the authenticated Supabase client
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers,
      },
    }
  );
}