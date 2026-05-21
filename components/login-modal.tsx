'use client';

import { useApp } from '@/lib/app-context';
import { DEMO_USERS } from '@/lib/seed-data';
import { motion } from 'framer-motion';
import { LogIn, Activity, Stethoscope, Settings, Crown } from 'lucide-react';

export function LoginModal() {
  const { showLoginModal, switchUser } = useApp();

  if (!showLoginModal) return null;

  const roleConfig = {
    nurse: { icon: Activity, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    doctor: { icon: Stethoscope, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    admin: { icon: Settings, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    'super-admin': { icon: Crown, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  };

  const groupedUsers = {
    Nurses: DEMO_USERS.filter((u) => u.role === 'nurse'),
    Doctors: DEMO_USERS.filter((u) => u.role === 'doctor'),
    Administrators: DEMO_USERS.filter((u) => u.role === 'admin'),
    'System Admin': DEMO_USERS.filter((u) => u.role === 'super-admin'),
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center z-50 overflow-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl mx-4 glass rounded-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-slate-900/20 p-8 lg:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl font-bold gradient-text mb-4">QuarantineOps AI</div>
              <p className="text-lg text-muted-foreground mb-8">Healthcare Operations Intelligence Platform</p>
              
              {/* Feature highlights */}
              <div className="space-y-4">
                {[
                  { title: 'Real-Time Coordination', desc: 'Manage multi-role operations seamlessly' },
                  { title: 'AI Risk Scoring', desc: 'Smart patient prioritization and escalation' },
                  { title: 'Complete Audit', desc: 'Full compliance and activity tracking' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2" />
                    <div>
                      <div className="font-semibold text-foreground">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated demo */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mt-12 p-4 glass rounded-lg"
            >
              <div className="text-xs text-muted-foreground mb-3">Real-Time Operations</div>
              <div className="space-y-2">
                {[
                  { label: 'Occupancy', value: '68/74' },
                  { label: 'Critical Cases', value: '3' },
                  { label: 'Pending Reviews', value: '12' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-cyan-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="p-8 lg:p-12"
          >
            <h2 className="text-2xl font-bold mb-2 text-foreground">Select Your Role</h2>
            <p className="text-muted-foreground mb-8">
              Choose a demo account to explore the platform&apos;s capabilities
            </p>

            <div className="space-y-6">
              {Object.entries(groupedUsers).map(([roleLabel, users], groupIndex) =>
                users.length > 0 ? (
                  <motion.div
                    key={roleLabel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + groupIndex * 0.1 }}
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {roleLabel}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {users.map((user) => {
                        const config = roleConfig[user.role as keyof typeof roleConfig];
                        const Icon = config.icon;
                        return (
                          <motion.button
                            key={user.id}
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            onClick={() => switchUser(user.id)}
                            className={`${config.bgColor} border border-white/10 rounded-lg p-4 text-left transition-all hover:border-white/20 hover:glow-blue`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-5 h-5 ${config.color}`} />
                              <div className="flex-1">
                                <div className="font-semibold text-foreground">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.role}</div>
                              </div>
                              <LogIn className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-8 text-center">
              This is a demo system. Select any account to explore QuarantineOps AI.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
