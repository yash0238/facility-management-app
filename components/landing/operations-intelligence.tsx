'use client';

import { motion } from 'framer-motion';
import { Activity, AlertCircle, TrendingUp } from 'lucide-react';

export function OperationsIntelligence() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Screenshot/Demo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-6 glow-blue"
        >
          <div className="bg-slate-900 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div className="font-semibold text-lg">Operations Command Center</div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-blue-500/50" />
                ))}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Occupancy', value: '68/74', color: 'text-blue-400' },
                { label: 'Critical Cases', value: '3', color: 'text-red-400' },
                { label: 'Pending Reviews', value: '12', color: 'text-yellow-400' },
                { label: 'Discharge Queue', value: '5', color: 'text-green-400' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                  className="glass rounded-lg p-4"
                >
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className={`text-2xl font-bold mt-2 ${item.color}`}>{item.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Alert Feed */}
            <div className="mt-6 space-y-2">
              <div className="text-sm text-muted-foreground mb-3">Recent Alerts</div>
              {[
                { icon: AlertCircle, text: 'Patient 23: Critical fever - immediate doctor review', color: 'text-red-400' },
                { icon: TrendingUp, text: 'Recovery milestone: Patient 15 fever-free for 3 days', color: 'text-green-400' },
                { icon: Activity, text: 'Occupancy 92% - near capacity warning', color: 'text-yellow-400' },
              ].map((alert, i) => {
                const Icon = alert.icon;
                return (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ delay: i * 0.3, duration: 2, repeat: Infinity }}
                    className="flex items-center gap-3 text-sm p-2 rounded bg-slate-800/50"
                  >
                    <Icon className={`w-4 h-4 ${alert.color}`} />
                    <span className="text-muted-foreground flex-1">{alert.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right: Features */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-4xl font-bold mb-4 gradient-text">Operations Command Center</h2>
            <p className="text-muted-foreground text-lg">
              Your air traffic control for hospital operations. Real-time visibility into patient status, staff coordination, and facility metrics all in one dashboard.
            </p>
          </div>

          {[
            { title: 'Real-Time KPIs', desc: 'Live metrics for occupancy, critical cases, and discharge readiness' },
            { title: 'Smart Prioritization', desc: 'AI-powered patient queue automatically sorted by acuity and urgency' },
            { title: 'Alert Aggregation', desc: 'All critical alerts in one feed, never miss an escalation' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
