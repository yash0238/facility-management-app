'use client';

import { useApp } from '@/lib/app-context';
import { DEMO_USERS } from '@/lib/seed-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Activity,
  BarChart3,
  Clock,
  AlertTriangle,
  LogIn,
  PlusCircle,
} from 'lucide-react';

export function SuperAdminDashboard() {
  const { patients, auditLogs } = useApp();

  // Calculate system stats
  const totalStaff = DEMO_USERS.length;
  const nurses = DEMO_USERS.filter((u) => u.role === 'nurse').length;
  const doctors = DEMO_USERS.filter((u) => u.role === 'doctor').length;
  const admins = DEMO_USERS.filter((u) => u.role === 'admin').length;

  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status !== 'discharged').length;
  const criticalCount = patients.filter((p) => {
    const latest = p.temperatureRecords[p.temperatureRecords.length - 1];
    return latest && latest.temperature >= 40;
  }).length;

  const recentLogs = auditLogs.slice(-10).reverse();
  const loginCount = auditLogs.filter((l) => l.action === 'LOGIN').length;
  const temperatureRecords = auditLogs.filter((l) => l.resource === 'temperature').length;
  const dischargeActions = auditLogs.filter((l) => l.action === 'DISCHARGE').length;

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Staff</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalStaff}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {nurses} Nurses
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {doctors} Doctors
                </Badge>
              </div>
            </div>
            <Users className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Patients</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalPatients}</p>
              <p className="text-xs text-slate-500 mt-1">{activePatients} active</p>
            </div>
            <Activity className="w-8 h-8 text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Critical Cases</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{criticalCount}</p>
              <p className="text-xs text-slate-500 mt-1">Needs attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">System Uptime</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">99.9%</p>
              <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
            </div>
            <BarChart3 className="w-8 h-8 text-slate-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">System Logins</p>
              <p className="text-2xl font-bold text-slate-900">{loginCount}</p>
              <p className="text-xs text-slate-500 mt-2">User sessions</p>
            </div>
            <LogIn className="w-6 h-6 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Temperature Records</p>
              <p className="text-2xl font-bold text-slate-900">{temperatureRecords}</p>
              <p className="text-xs text-slate-500 mt-2">Total recorded</p>
            </div>
            <Activity className="w-6 h-6 text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Discharges</p>
              <p className="text-2xl font-bold text-slate-900">{dischargeActions}</p>
              <p className="text-xs text-slate-500 mt-2">Total completed</p>
            </div>
            <PlusCircle className="w-6 h-6 text-green-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Staff Directory */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Staff Directory</h3>
          <div className="space-y-2">
            {DEMO_USERS.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{user.name}</h4>
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{user.department}</p>
                  </div>
                  <Badge>{user.role.replace('-', ' ')}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <Card className="p-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, i) => (
                  <div
                    key={i}
                    className="pb-3 border-b border-slate-200 last:border-0 last:pb-0 text-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {log.action === 'LOGIN' && 'User Login'}
                          {log.action === 'CREATE' && log.resource === 'temperature' && 'Temperature Recorded'}
                          {log.action === 'CREATE' && log.resource === 'review' && 'Review Created'}
                          {log.action === 'UPDATE' && log.resource === 'patient' && 'Patient Updated'}
                          {log.action === 'DISCHARGE' && 'Patient Discharged'}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {log.resource === 'patient' && log.resourceId}
                          {log.resource === 'temperature' && `Patient: ${log.details?.patientId || 'Unknown'}`}
                          {log.resource === 'review' && `Patient: ${log.details?.patientId || 'Unknown'}`}
                          {log.resource === 'user' && `User: ${log.resourceId}`}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 py-8 text-center">No activity yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* System Configuration Notice */}
      <Card className="p-6 bg-blue-50 border border-blue-200">
        <div className="flex gap-4">
          <Activity className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">System Configuration</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Total Beds: 20 (Ward A: 11, Ward B: 9)</li>
              <li>• Discharge Criteria: 3 consecutive days with temperature below 37.5°C</li>
              <li>• Critical Temperature Threshold: 40°C</li>
              <li>• Facility Status: Operational and monitoring {activePatients} patients</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
