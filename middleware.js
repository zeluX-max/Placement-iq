import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * 1. Define Public Routes
 * These are accessible without logging in.
 * Includes your landing page (/home) and your login/signup page (/login).
 */
const isPublicRoute = createRouteMatcher([
  '/home(.*)', 
  '/login(.*)',
  '/api/public(.*)' // Optional: if you have public API routes later
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const { pathname } = req.nextUrl;

  // RULE 1: Redirect logged-in users away from the login page
  // If they are already authenticated, send them to the root dashboard "/"
  if (userId && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // RULE 2: Handle unauthenticated users
  if (!userId && !isPublicRoute(req)) {
    
    // If a guest hits the base URL "/", send them to the beautiful landing page
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    
    // For any other protected folder (like /dashboard or /interview), 
    // send them to the login screen
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  /**
   * The matcher tells Next.js which files this middleware should run on.
   * This pattern excludes static files (images, css) and Next.js internals.
   */
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};