'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navLinks = [
    { name: 'How it works', href: '/home#how' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'AI Interview', href: '/interview' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card border-x-0 border-t-0 border-b border-gray-800/60 transition-custom">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? "/" : "/home"} className="flex items-center gap-1.5 group transition-custom">
            <span className="text-xl font-bold text-white group-hover:text-brand-green transition-custom">
              Placement<span className="text-brand-green">IQ</span>
            </span>
            <span className="hidden sm:inline text-xs text-gray-500 border-l border-gray-800 ml-2 pl-2">
              NIT Jalandhar
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-custom hover:text-white ${
                  isActive(link.href) ? 'text-white' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop User / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-200">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-800 hover:bg-gray-900 text-gray-400 hover:text-white transition-custom active:scale-95"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-brand-green hover:bg-brand-green-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-custom active:scale-95 shadow-lg shadow-brand-green/10"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-white transition-custom"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-2xl"
          >
            <div className="px-4 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-300 hover:text-white py-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-gray-800">
                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-sm font-bold text-brand-green uppercase border border-brand-green/30">
                        {(user.user_metadata?.full_name || user.email)[0]}
                      </div>
                      <span className="text-sm font-medium text-white">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-center py-4 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium active:scale-[0.98] transition-transform"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-4 bg-brand-green text-white rounded-xl text-sm font-medium shadow-xl shadow-brand-green/20"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
