'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowRight, BarChart3, Activity, AlertCircle, Zap, Users, Clock, TrendingUp, Shield } from 'lucide-react';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { OperationsIntelligence } from '@/components/landing/operations-intelligence';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { PremiumFooter } from '@/components/landing/premium-footer';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold gradient-text">QuarantineOps AI</div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="#features" className="text-slate-300 hover:text-white transition">
              Features
            </Link>
            <Link href="#testimonials" className="text-slate-300 hover:text-white transition">
              Testimonials
            </Link>
            <Link href="#faq" className="text-slate-300 hover:text-white transition">
              FAQ
            </Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/auth/login">Launch Platform</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-900/50 backdrop-blur-lg"
          >
            <div className="px-4 sm:px-6 py-4 space-y-3">
              <Link href="#features" className="block text-slate-300 hover:text-white py-2 transition" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#testimonials" className="block text-slate-300 hover:text-white py-2 transition" onClick={() => setMobileMenuOpen(false)}>
                Testimonials
              </Link>
              <Link href="#faq" className="block text-slate-300 hover:text-white py-2 transition" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/auth/login">Launch Platform</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Trusted Metrics */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {[
            { metric: '1000+', label: 'Hospitals', icon: Activity },
            { metric: '500K+', label: 'Patients Managed', icon: Users },
            { metric: '99.9%', label: 'Uptime', icon: Shield },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass rounded-xl p-6 sm:p-8 text-center hover:glow-blue transition-all duration-300 hover:scale-105"
              >
                <Icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">{item.metric}</div>
                <div className="text-slate-300 text-sm sm:text-base">{item.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Operations Intelligence */}
      <OperationsIntelligence />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <PremiumFooter />
    </div>
  );
}
