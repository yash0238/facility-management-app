'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function PremiumFooter() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-2xl font-bold gradient-text mb-4">QuarantineOps AI</div>
            <p className="text-muted-foreground text-sm">
              AI-powered healthcare operations platform for outbreak response and facility management.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-foreground transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-foreground transition">
                  API
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-foreground transition">
                  Security
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm text-muted-foreground">© 2024 QuarantineOps AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
