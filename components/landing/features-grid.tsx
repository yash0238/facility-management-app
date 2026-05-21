'use client';

import { motion } from 'framer-motion';
import { AlertCircle, BarChart3, Clock, Users, Zap, Shield, TrendingUp, Activity, Workflow } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-Time Patient Monitoring',
    description: 'Track temperature, vital signs, and patient status across your facility in real time',
  },
  {
    icon: AlertCircle,
    title: 'Smart Escalation Engine',
    description: 'Automatic alerts for critical cases with AI-powered risk scoring',
  },
  {
    icon: Users,
    title: 'Multi-Role Coordination',
    description: 'Seamless workflows for nurses, doctors, admins, and facility management',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Detailed insights into patient outcomes, discharge rates, and facility metrics',
  },
  {
    icon: Workflow,
    title: 'Automated Workflows',
    description: 'Streamlined processes from admission to discharge with less paperwork',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'HIPAA-compliant with full audit trails and role-based access control',
  },
  {
    icon: Clock,
    title: 'Shift Management',
    description: 'Efficient handover reports and shift tracking for 24/7 operations',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Intelligence',
    description: 'AI recommendations for patient care and facility optimization',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance with sub-second response times',
  },
];

export function FeaturesGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          <span className="gradient-text">Powerful Features</span> for{' '}
          <span className="text-white">Modern Healthcare</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Everything you need to manage outbreak conditions and maintain operational excellence
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, translateY: -10 }}
              className="group glass rounded-xl p-6 cursor-pointer transition-all duration-300 hover:glow-blue"
            >
              <div className="mb-4 p-3 rounded-lg bg-blue-500/10 w-fit group-hover:bg-blue-500/20 transition">
                <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white group-hover:text-blue-300 transition">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 group-hover:text-slate-100 transition">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
