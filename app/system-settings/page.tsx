'use client';

import { LayoutWrapper } from '@/components/layout-wrapper';
import { Card } from '@/components/ui/card';
import { Settings, AlertCircle, Lock, Bell } from 'lucide-react';

export default function SystemSettingsPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-600 mt-1">Manage facility configuration and system parameters</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Facility Configuration */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Settings className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Facility Configuration</h2>
                <p className="text-sm text-slate-600 mt-1">Core facility settings and capacity</p>
              </div>
            </div>

            <div className="space-y-4 pl-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Beds</p>
                  <p className="text-2xl font-bold text-slate-900">20</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Ward Configuration</p>
                  <p className="text-sm text-slate-900">Ward A: 11 beds, Ward B: 9 beds</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Medical Parameters */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Medical Parameters</h2>
                <p className="text-sm text-slate-600 mt-1">Thresholds and clinical criteria</p>
              </div>
            </div>

            <div className="space-y-4 pl-10">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Temperature Thresholds</h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Normal Range: 36.5°C - 37.5°C</li>
                    <li>• High Fever: 38°C - 40°C</li>
                    <li>• Critical: ≥ 40°C (Requires Alert)</li>
                    <li>• Valid Range: 30°C - 45°C</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Discharge Criteria</h3>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Fever-free Period: 3 consecutive days</li>
                    <li>• Temperature Threshold: &lt; 37.5°C</li>
                    <li>• Doctor Approval: Required</li>
                    <li>• Record Frequency: Daily</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Bell className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Notification Settings</h2>
                <p className="text-sm text-slate-600 mt-1">Alert triggers and thresholds</p>
              </div>
            </div>

            <div className="space-y-4 pl-10">
              <ul className="text-sm text-slate-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Critical Temperature Alert: Temperature ≥ 40°C
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                  High Fever Alert: Temperature ≥ 38°C for 2+ consecutive days
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  Discharge Ready Alert: Patient meets discharge criteria
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Missing Record Alert: No temperature recorded in 24 hours
                </li>
              </ul>
            </div>
          </Card>

          {/* Security & Access */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Lock className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Security & Access Control</h2>
                <p className="text-sm text-slate-600 mt-1">User permissions and data access</p>
              </div>
            </div>

            <div className="space-y-4 pl-10">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 font-medium text-slate-700">Role</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-700">Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-900">Nurse</td>
                      <td className="py-2 px-3 text-slate-700">Record temperature, view patient history</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-900">Doctor</td>
                      <td className="py-2 px-3 text-slate-700">Create reviews, approve discharges, view all patient data</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-900">Admin</td>
                      <td className="py-2 px-3 text-slate-700">Manage patients, view analytics, manage facility</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-900">Super Admin</td>
                      <td className="py-2 px-3 text-slate-700">Full system access, user management, audit logs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* System Status */}
          <Card className="p-6 bg-gradient-to-r from-green-50 to-slate-50 border border-green-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">System Status</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">System Health</p>
                <p className="text-2xl font-bold text-green-600">Operational</p>
                <p className="text-xs text-slate-500 mt-1">All services running normally</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Uptime</p>
                <p className="text-2xl font-bold text-slate-900">99.9%</p>
                <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  );
}
