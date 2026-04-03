import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define the routes that do NOT require login
const isPublicRoute = createRouteMatcher(['/login(.*)', '/home(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const { pathname } = req.nextUrl;

  // RULE 1: If a logged-in user tries to go to the login page, send them to the dashboard
  if (userId && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // RULE 2: If the user is NOT logged in and tries to access a protected route
  if (!userId && !isPublicRoute(req)) {
    
    // If they hit the root URL "/", send them to your landing page
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    
    // For any other protected route, send them to the login page
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow the request to continue normally
  return NextResponse.next();
});

export const config = {
  // Clerk's standard matcher catches all routes except static files and internals
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};