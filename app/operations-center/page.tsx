'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Users, Clock, AlertTriangle, Activity } from 'lucide-react';
import { useMemo } from 'react';
import { calculatePatientRisk, prioritizePatients } from '@/lib/ai-risk-engine';
import { checkEscalations } from '@/lib/escalation-engine';

export const dynamic = 'force-dynamic';

function OperationsCenterContent() {
  const { patients, temperatureRecords, staff } = useApp();

  if (!patients || !temperatureRecords || !staff) {
    return <LayoutWrapper><div className="p-6">Loading...</div></LayoutWrapper>;
  }

  // Build temperature map for easier lookup
  const temperatureMap = useMemo(() => {
    const map = new Map<string, typeof temperatureRecords>();
    patients.forEach((patient) => {
      const patientTemps = temperatureRecords.filter((t) => t.patientId === patient.id).sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
      map.set(patient.id, patientTemps);
    });
    return map;
  }, [patients, temperatureRecords]);

  // Calculate escalations
  const escalations = useMemo(() => {
    const occupancy = {
      occupied: patients.filter((p) => p.status !== 'discharged').length,
      total: 74,
    };
    return checkEscalations(patients, temperatureMap, occupancy);
  }, [patients, temperatureMap]);

  // Get prioritized patient queue
  const prioritized = useMemo(() => {
    return prioritizePatients(patients, temperatureMap).slice(0, 10);
  }, [patients, temperatureMap]);

  const occupiedBeds = patients.filter((p) => p.status !== 'discharged').length;
  const occupancyRate = occupiedBeds / 74;
  const criticalCases = patients.filter((p) => {
    const temps = temperatureMap.get(p.id) || [];
    const lastTemp = temps[temps.length - 1]?.temperature || 36.5;
    return lastTemp >= 40 || (p.status === 'hospitalized' && !p.lastReviewDate);
  }).length;

  const pendingReviews = patients.filter((p) => p.status === 'hospitalized' && !p.lastReviewDate).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6 max-w-7xl">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Operations Command Center</h1>
          <p className="text-muted-foreground">Real-time facility monitoring and patient prioritization</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Occupancy',
              value: `${occupiedBeds}/74`,
              subtext: `${(occupancyRate * 100).toFixed(0)}% capacity`,
              icon: Activity,
              color: occupancyRate > 0.9 ? 'text-red-400' : occupancyRate > 0.75 ? 'text-yellow-400' : 'text-green-400',
            },
            {
              label: 'Critical Cases',
              value: criticalCases.toString(),
              subtext: 'Require immediate attention',
              icon: AlertTriangle,
              color: 'text-red-400',
            },
            {
              label: 'Pending Reviews',
              value: pendingReviews.toString(),
              subtext: 'Awaiting doctor assessment',
              icon: Clock,
              color: 'text-yellow-400',
            },
            {
              label: 'Active Escalations',
              value: escalations.length.toString(),
              subtext: `${escalations.filter((e) => e.severity === 'critical').length} critical`,
              icon: AlertCircle,
              color: 'text-orange-400',
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={i} variants={itemVariants} className="glass rounded-xl p-6 glow-blue">
                <div className="flex justify-between items-start mb-4">
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`text-3xl font-bold ${kpi.color} mb-2`}>{kpi.value}</div>
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">{kpi.subtext}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Critical Alerts */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Active Escalations & Alerts
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {escalations.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">No active escalations</p>
              ) : (
                escalations.slice(0, 8).map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      event.severity === 'critical'
                        ? 'border-red-500/50 bg-red-500/10'
                        : 'border-yellow-500/50 bg-yellow-500/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-foreground">{event.patientName}</div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          event.severity === 'critical'
                            ? 'bg-red-500/30 text-red-300'
                            : 'bg-yellow-500/30 text-yellow-300'
                        }`}
                      >
                        {event.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.message}</p>
                    <p className="text-xs text-muted-foreground/70">→ {event.recommendedAction}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Priority Queue */}
          <motion.div variants={itemVariants} className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Priority Queue</h2>

            <div className="space-y-2">
              {prioritized.slice(0, 8).map(({ patient, risk }, i) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-3 rounded-lg border text-sm cursor-pointer hover:bg-white/5 transition ${
                    risk.riskLevel === 'Critical'
                      ? 'border-red-500/50 bg-red-500/5'
                      : risk.riskLevel === 'High'
                      ? 'border-orange-500/50 bg-orange-500/5'
                      : risk.riskLevel === 'Moderate'
                      ? 'border-yellow-500/50 bg-yellow-500/5'
                      : 'border-green-500/50 bg-green-500/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-foreground">{patient.name}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        risk.riskLevel === 'Critical'
                          ? 'bg-red-500/30 text-red-300'
                          : risk.riskLevel === 'High'
                          ? 'bg-orange-500/30 text-orange-300'
                          : risk.riskLevel === 'Moderate'
                          ? 'bg-yellow-500/30 text-yellow-300'
                          : 'bg-green-500/30 text-green-300'
                      }`}
                    >
                      {risk.riskLevel}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{risk.aiRecommendation}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Staff Status */}
        <motion.div variants={itemVariants} className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Staff Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Nurses', count: staff.filter((s) => s.role === 'nurse').length, color: 'text-blue-400' },
              { role: 'Doctors', count: staff.filter((s) => s.role === 'doctor').length, color: 'text-green-400' },
              { role: 'Admins', count: staff.filter((s) => s.role === 'admin').length, color: 'text-purple-400' },
            ].map((item) => (
              <div key={item.role} className="p-4 rounded-lg bg-white/5">
                <div className="text-sm text-muted-foreground mb-2">{item.role}</div>
                <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </LayoutWrapper>
  );
}

export default function OperationsCenterPage() {
  return (
    <Suspense fallback={<LayoutWrapper><div className="p-6">Loading...</div></LayoutWrapper>}>
      <OperationsCenterContent />
    </Suspense>
  );
}
