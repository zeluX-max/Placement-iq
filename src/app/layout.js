import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs' 
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PlacementIQ — NIT Jalandhar',
  description: 'Campus placement intelligence for NITJ students',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} relative`}>
          {children}
          <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-green/10 to-transparent pointer-events-none z-50" />
          <div className="fixed -top-24 -right-24 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none z-50" />
        </body>
      </html>
    </ClerkProvider>
  )
}