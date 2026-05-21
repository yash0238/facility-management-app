'use client';

import { LayoutWrapper } from '@/components/layout-wrapper';
import { useApp } from '@/lib/app-context';
import { NurseDashboard } from '@/components/dashboards/nurse-dashboard';
import { DoctorDashboard } from '@/components/dashboards/doctor-dashboard';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { SuperAdminDashboard } from '@/components/dashboards/super-admin-dashboard';

export default function DashboardPage() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  return (
    <LayoutWrapper>
      {currentUser.role === 'nurse' && <NurseDashboard />}
      {currentUser.role === 'doctor' && <DoctorDashboard />}
      {currentUser.role === 'admin' && <AdminDashboard />}
      {currentUser.role === 'super-admin' && <SuperAdminDashboard />}
    </LayoutWrapper>
  );
}
