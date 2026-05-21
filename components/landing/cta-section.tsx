'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-8 sm:p-12 text-center glow-blue"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Ready to Transform</span>{' '}
          <span className="text-white">Your Hospital Operations?</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Start improving patient outcomes and operational efficiency today. Join leading hospitals worldwide using QuarantineOps AI.
        </p>

        <div className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
            <Link href="/auth/login" className="flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-sm sm:text-base">
            <Link href="mailto:sales@quarantineops.ai">Contact Sales</Link>
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mt-8">
          No credit card required. Full access for 14 days. Setup takes less than 30 minutes.
        </p>
      </motion.div>
    </section>
  );
}
