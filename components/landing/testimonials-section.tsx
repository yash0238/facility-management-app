'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Hospital Director',
    text: 'QuarantineOps AI reduced our patient coordination time by 60% during peak outbreak. The escalation engine caught critical cases I would have missed.',
  },
  {
    name: 'Maria Chen',
    role: 'Nurse Manager',
    text: 'The interface is intuitive and the real-time alerts keep us informed. Our staff training time dropped significantly.',
  },
  {
    name: 'Dr. Michael Brooks',
    role: 'Infectious Disease Specialist',
    text: 'The AI risk scoring is remarkably accurate. It helps us prioritize reviews and predict patient outcomes better than before.',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          <span className="gradient-text">Trusted by Healthcare Leaders</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-slate-300"
        >
          See what healthcare professionals say about QuarantineOps AI
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6 sm:p-8 hover:glow-blue transition-all"
          >
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((j) => (
                <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white text-sm sm:text-base mb-6 leading-relaxed">{testimonial.text}</p>
            <div>
              <div className="font-semibold text-white text-sm sm:text-base">{testimonial.name}</div>
              <div className="text-xs sm:text-sm text-slate-400">{testimonial.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
