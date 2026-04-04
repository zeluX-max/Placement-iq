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
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}