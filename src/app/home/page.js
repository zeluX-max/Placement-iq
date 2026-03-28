'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { companies } from '@/data/companies';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const steps = [
    { title: "Upload", description: "Upload your LinkedIn PDF or Resume in seconds." },
    { title: "AI Analyzes", description: "Our AI compares your skills against 53 top companies." },
    { title: "Get Roadmap", description: "Receive a personalized 4-week study plan to bridge gaps." }
  ];

  const features = [
    { title: "Company Board", description: "See exactly where you stand with 53 major recruiters.", color: "bg-green-500" },
    { title: "Skill Gaps", description: "Identify the exact technical and soft skills you're missing.", color: "bg-purple-500" },
    { title: "Study Plan", description: "A day-by-day roadmap tailored to your target companies.", color: "bg-amber-500" },
    { title: "AI Interview", description: "Practice with our AI-powered mock interviewer.", color: "bg-red-500" }
  ];

  const difficultyColors = {
    easy: "bg-green-950 text-green-400 border-green-800",
    medium: "bg-amber-950 text-amber-400 border-amber-800",
    hard: "bg-red-950 text-red-400 border-red-800"
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative px-4 pt-16 md:pt-24 pb-12 md:pb-24 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-purple-900/40 text-purple-300 rounded-full px-4 py-1.5 text-xs font-medium border border-purple-800/50 mb-8"
          >
            Built for NIT Jalandhar · HackMol 7.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
          >
            Know if you&apos;re ready for <br />
            <span className="text-[#006633]">campus placements</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            PlacementIQ uses AI to match your profile against NIT Jalandhar&apos;s top recruiters, revealing skill gaps and providing a custom roadmap to success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-[#006633] hover:bg-green-700 text-white rounded-xl text-base font-semibold transition-all shadow-lg hover:shadow-green-900/20"
            >
              Check my readiness →
            </Link>
            <Link
              href="#how"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-xl text-base font-medium transition-all"
            >
              See how it works
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-4 border-t border-gray-900 pt-8"
          >
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-white">53</span>
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-medium">Companies</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-white">10s</span>
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-medium">Results</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-white">4-wk</span>
              <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-medium">Study Plan</span>
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section id="how" className="px-4 py-20 bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">How it works</h2>
              <div className="w-12 h-1 bg-[#006633] mx-auto rounded-full"></div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-gray-900 border border-gray-800 p-8 rounded-2xl relative"
                >
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#006633] rounded-full flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* What You Get */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">What you get</h2>
              <p className="text-gray-500 text-sm">Everything you need to land your dream job at NITJ</p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-start gap-5 hover:border-gray-700 transition-colors"
                >
                  <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${feature.color}`}></div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Companies Section */}
        <section className="px-4 py-20 bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Targeting 53 Companies</h2>
              <p className="text-gray-500 text-sm mb-8">From service giants to premium product firms visiting NITJ</p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10 text-xs font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-red-400">Hard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                  <span className="text-amber-400">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-green-400">Easy</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
              {companies.map((company, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${difficultyColors[company.difficulty]}`}
                >
                  {company.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Loved by Students</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl italic text-gray-300">
                <div className="flex items-center gap-4 mb-4 not-italic font-bold text-white">
                  <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center">AS</div>
                  <span>Abhay Sharma, 4th Year CSE</span>
                </div>
                &quot;The study plan was a lifesaver. It showed me exactly what I needed to learn for Atlassian in just 4 weeks.&quot;
              </div>
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl italic text-gray-300">
                <div className="flex items-center gap-4 mb-4 not-italic font-bold text-white">
                  <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center">PK</div>
                  <span>Priya Kaur, 3rd Year IT</span>
                </div>
                &quot;I didn&apos;t know I was missing so many soft skills for Google PM. PlacementIQ&apos;s analysis was eye-opening.&quot;
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-24 bg-linear-to-b from-gray-950 to-gray-900 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Ready to find out where you stand?</h2>
          <p className="text-gray-400 mb-10 text-center max-w-md">Free for all NIT Jalandhar students. Analyze your profile in 60 seconds.</p>
          <Link
            href="/login"
            className="px-10 py-4 bg-[#006633] hover:bg-green-700 text-white rounded-xl text-lg font-bold transition-all transform hover:scale-105"
          >
            Get Started Now
          </Link>
          <p className="mt-6 text-xs text-gray-500 italic">No college credentials required to start analyzing</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-12 px-4 md:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold italic">
              Placement<span className="text-[#006633]">IQ</span>
            </span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 mb-2">Built at HackMol 7.0 · NIT Jalandhar</p>
            <p className="text-xs text-gray-600">© 2026 PlacementIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
