'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BarChart3, Activity, AlertCircle, Zap, Users, Clock, TrendingUp, Shield } from 'lucide-react';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { OperationsIntelligence } from '@/components/landing/operations-intelligence';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { PremiumFooter } from '@/components/landing/premium-footer';

export default function LandingPage() {
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text">QuarantineOps AI</div>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition">
              Testimonials
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition">
              FAQ
            </Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/auth/login">Launch Platform</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Trusted Metrics */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-6 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="glass rounded-xl p-8 text-center hover:glow-blue transition-all duration-300 hover:scale-105"
              >
                <Icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold gradient-text mb-2">{item.metric}</div>
                <div className="text-muted-foreground">{item.label}</div>
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
