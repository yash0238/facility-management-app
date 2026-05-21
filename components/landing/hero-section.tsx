'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"
      />
      <motion.div
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-6 glass px-4 py-2 rounded-full"
        >
          <span className="text-sm text-blue-300">🚀 AI-Assisted Healthcare Operations</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="gradient-text">AI-Powered Operations</span> During Critical Outbreak Conditions
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          Coordinate nurses, doctors, patients, and hospital operations in real time. Smart prioritization, escalation alerts, and automated workflows for maximum efficiency.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex gap-4 justify-center flex-wrap mb-12"
        >
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/dashboard" className="flex items-center gap-2">
              Launch Platform <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features" className="flex items-center gap-2">
              View Features
            </Link>
          </Button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="relative"
        >
          <div className="glass rounded-xl p-1 shadow-2xl glow-blue">
            <div className="bg-slate-900 rounded-lg p-6 backdrop-blur-sm border border-slate-700">
              {/* Fake Dashboard Preview */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                      className="flex-1 glass rounded-lg p-4 h-20 flex items-end justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
                      <div className="text-2xl font-bold text-blue-400">
                        {[68, 12, 45, 99][i - 1]}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ delay: i * 0.2, duration: 3, repeat: Infinity }}
                      className="glass rounded-lg p-4 text-center"
                    >
                      <div className="text-sm text-muted-foreground mb-2">Metric {i}</div>
                      <div className="text-xl font-bold text-cyan-400">{Math.random().toFixed(2)}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating metrics card */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-10 right-0 glass rounded-lg p-4 max-w-xs hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-xs text-muted-foreground">Discharge Rate</div>
                <div className="text-lg font-bold text-green-400">+24% This Week</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
