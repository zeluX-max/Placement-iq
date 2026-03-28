// import { createServerClient } from '@supabase/ssr'
// import { NextResponse } from 'next/server'

// export async function middleware(req) {
//   let supabaseResponse = NextResponse.next({ request: req })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     {
//       cookies: {
//         getAll() {
//           return req.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) =>
//             req.cookies.set(name, value)
//           )
//           supabaseResponse = NextResponse.next({ request: req })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           )
//         }
//       }
//     }
//   )

//   const { data: { session } } = await supabase.auth.getSession()

//   const protectedRoutes = ['/', '/results', '/interview']
//   const isProtected = protectedRoutes.some(route =>
//     req.nextUrl.pathname.startsWith(route)
//   )

//   // if (!session && isProtected) {
//   //   return NextResponse.redirect(new URL('/login', req.url))
//   // }
//   if (!session && isProtected) {
//     // If they just type the plain domain, show them the landing page
//     if (req.nextUrl.pathname === '/') {
//       return NextResponse.redirect(new URL('/home', req.url))
//     }
//     // For any other protected route, send them to login
//     return NextResponse.redirect(new URL('/login', req.url))
//   }

//   return supabaseResponse
// }

// export const config = {
//   matcher: ['/', '/results', '/interview/:path*']
// }

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  let supabaseResponse = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // IMPORTANT: always call getUser not getSession for middleware
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = req.nextUrl
  const publicRoutes = ['/login', '/home']
  const isPublic = publicRoutes.some(r => pathname.startsWith(r))

  if (!user && !isPublic) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/home', req.url))
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)']
}