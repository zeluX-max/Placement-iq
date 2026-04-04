import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define the routes that do NOT require login
const isPublicRoute = createRouteMatcher([
  '/home(.*)', 
  '/login(.*)',
  '/signup(.*)' 
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Redirect logged-in users away from auth pages
  if (userId && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Handle unauthenticated users
  if (!userId && !isPublicRoute(req)) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};