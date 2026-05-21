'use client';

import { LayoutWrapper } from '@/components/layout-wrapper';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, BarChart3, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { patients } = useApp();

  // Prepare data for charts
  const statusDistribution = [
    { name: 'Admitted', value: patients.filter((p) => p.status === 'admitted').length },
    { name: 'Under Treatment', value: patients.filter((p) => p.status === 'under-treatment').length },
    { name: 'Ready to Discharge', value: patients.filter((p) => p.status === 'ready-for-discharge').length },
    { name: 'Discharged', value: patients.filter((p) => p.status === 'discharged').length },
  ];

  // Temperature distribution
  const tempBuckets: { range: string; count: number }[] = [
    { range: '< 36°C', count: 0 },
    { range: '36-37°C', count: 0 },
    { range: '37-38°C', count: 0 },
    { range: '38-39°C', count: 0 },
    { range: '39-40°C', count: 0 },
    { range: '≥ 40°C', count: 0 },
  ];

  patients.forEach((p) => {
    const latest = p.temperatureRecords[p.temperatureRecords.length - 1];
    if (latest) {
      const temp = latest.temperature;
      if (temp < 36) tempBuckets[0].count++;
      else if (temp < 37) tempBuckets[1].count++;
      else if (temp < 38) tempBuckets[2].count++;
      else if (temp < 39) tempBuckets[3].count++;
      else if (temp < 40) tempBuckets[4].count++;
      else tempBuckets[5].count++;
    }
  });

  // Admission trend (last 7 days)
  const admissionTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const count = patients.filter((p) => {
      const admitDate = new Date(p.admissionDate);
      return admitDate.toDateString() === date.toDateString();
    }).length;
    admissionTrend.push({ date: dateStr, admissions: count });
  }

  // Ward occupancy
  const wardData = [
    { name: 'Ward A', occupied: patients.filter((p) => p.ward === 'Ward A' && p.status !== 'discharged').length, capacity: 11 },
    { name: 'Ward B', occupied: patients.filter((p) => p.ward === 'Ward B' && p.status !== 'discharged').length, capacity: 9 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // KPI Calculations
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status !== 'discharged').length;
  const dischargedPatients = patients.filter((p) => p.status === 'discharged').length;
  const dischargeRate = totalPatients > 0 ? ((dischargedPatients / totalPatients) * 100).toFixed(1) : 0;
  const averageStay =
    dischargedPatients > 0
      ? (
          dischargedPatients -
          patients
            .filter((p) => p.dischargeDate)
            .reduce((sum, p) => {
              const days = Math.floor(
                (new Date(p.dischargeDate!).getTime() - new Date(p.admissionDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return sum + days;
            }, 0) /
            dischargedPatients
        ).toFixed(1)
      : 0;

  const criticalPatients = patients.filter((p) => {
    const latest = p.temperatureRecords[p.temperatureRecords.length - 1];
    return latest && latest.temperature >= 40;
  }).length;

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Reporting</h1>
          <p className="text-slate-600 mt-1">Facility performance metrics and insights</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Patients</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{totalPatients}</p>
                <p className="text-xs text-slate-500 mt-1">{activePatients} currently active</p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Discharge Rate</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{dischargeRate}%</p>
                <p className="text-xs text-slate-500 mt-1">{dischargedPatients} discharged</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Critical Cases</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{criticalPatients}</p>
                <p className="text-xs text-slate-500 mt-1">Temperature ≥ 40°C</p>
              </div>
              <Activity className="w-8 h-8 text-red-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg. Stay</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{averageStay}d</p>
                <p className="text-xs text-slate-500 mt-1">Days in facility</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Patient Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Ward Occupancy */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Ward Occupancy</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied" fill="#3b82f6" name="Occupied" />
                <Bar dataKey="capacity" fill="#e5e7eb" name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Admission Trend */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Admission Trend (7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={admissionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="admissions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Temperature Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Temperature Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tempBuckets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Summary Section */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary & Insights</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Facility Status</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Operating at {((activePatients / 20) * 100).toFixed(0)}% capacity</li>
                <li>• {activePatients} patients currently in care</li>
                <li>• {dischargedPatients} patients discharged</li>
                <li>• {criticalPatients} critical cases requiring immediate attention</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Key Metrics</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Discharge Rate: {dischargeRate}%</li>
                <li>• Average Length of Stay: {averageStay} days</li>
                <li>• Total Temperature Records: {patients.reduce((sum, p) => sum + p.temperatureRecords.length, 0)}</li>
                <li>• Most Common Status: {statusDistribution.reduce((prev, current) => (prev.value > current.value ? prev : current)).name}</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
