'use client';

import { useApp } from '@/lib/app-context';
import { Bell, Clock, BarChart3 } from 'lucide-react';

export function Navbar() {
  const { currentUser, patients } = useApp();

  if (!currentUser) return null;

  // Calculate stats
  const criticalPatients = patients.filter((p) => {
    const latest = p.temperatureRecords[p.temperatureRecords.length - 1];
    return latest && latest.temperature >= 40;
  }).length;

  const readyForDischarge = patients.filter((p) => p.status === 'ready-for-discharge').length;
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left side - Title */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {currentUser.role === 'nurse' && 'Temperature Management'}
            {currentUser.role === 'doctor' && 'Patient Reviews'}
            {currentUser.role === 'admin' && 'Patient Management'}
            {currentUser.role === 'super-admin' && 'System Overview'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentTime}
          </p>
        </div>

        {/* Right side - Alerts and Status */}
        <div className="flex items-center gap-4">
          {/* Critical Alert */}
          {criticalPatients > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200">
              <Bell className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                {criticalPatients} Critical
              </span>
            </div>
          )}

          {/* Discharge Ready Alert */}
          {readyForDischarge > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {readyForDischarge} Ready to Discharge
              </span>
            </div>
          )}

          {/* Total Patients */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {patients.length} Patients
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
