'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Is QuarantineOps HIPAA compliant?',
    answer: 'Yes, QuarantineOps AI is fully HIPAA compliant with end-to-end encryption, comprehensive audit logs, and strict access controls.',
  },
  {
    question: 'How long does implementation take?',
    answer: 'Typical implementation takes 2-4 weeks depending on facility size and existing infrastructure integration requirements.',
  },
  {
    question: 'Can it integrate with existing EHR systems?',
    answer: 'Yes, we provide FHIR-compliant APIs and support integration with major EHR vendors including Epic, Cerner, and Athena.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: '24/7 support with dedicated account managers, training programs, and regular optimization consultations.',
  },
  {
    question: 'How is data backup handled?',
    answer: 'Automatic redundant backups with geo-distributed disaster recovery across multiple data centers with 99.99% uptime SLA.',
  },
  {
    question: 'What are the pricing options?',
    answer: 'Flexible per-bed-per-month pricing, volume discounts available. Custom enterprise agreements for large hospital systems.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          <span className="gradient-text">Frequently Asked Questions</span>
        </motion.h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-4 sm:px-6 py-4 flex justify-between items-center hover:bg-white/5 transition"
            >
              <span className="font-semibold text-left text-white text-sm sm:text-base">{faq.question}</span>
              <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
              </motion.div>
            </button>

            <motion.div
              animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-4 text-slate-300 text-sm sm:text-base border-t border-white/10">
                {faq.answer}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
