'use client';

import { LayoutWrapper } from '@/components/layout-wrapper';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Thermometer } from 'lucide-react';
import { useState } from 'react';

export default function TemperatureLogPage() {
  const { patients } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Get all temperature records
  const allRecords = patients
    .flatMap((p) =>
      p.temperatureRecords.map((r) => ({
        ...r,
        patientName: p.name,
        patientId: p.id,
      }))
    )
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

  const filteredRecords = allRecords.filter(
    (r) =>
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Temperature Log</h1>
          <p className="text-slate-600 mt-1">View all temperature records across the facility</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-blue-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Total Records</p>
                <p className="text-2xl font-bold text-slate-900">{allRecords.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-orange-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Avg Temperature</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(allRecords.reduce((sum, r) => sum + r.temperature, 0) / allRecords.length).toFixed(1)}°C
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-red-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Critical Records</p>
                <p className="text-2xl font-bold text-slate-900">
                  {allRecords.filter((r) => r.temperature >= 40).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Temperature</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Recorded By</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{record.patientName}</p>
                        <p className="text-sm text-slate-600 font-mono">{record.patientId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-sm">
                      {new Date(record.recordedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold text-lg ${
                          record.temperature >= 40
                            ? 'text-red-600'
                            : record.temperature >= 38
                              ? 'text-orange-600'
                              : 'text-slate-900'
                        }`}
                      >
                        {record.temperature}°C
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-sm">{record.recordedBy}</td>
                    <td className="py-3 px-4 text-slate-600 text-sm">{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="py-8 text-center">
              <Thermometer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No temperature records found</p>
            </div>
          )}
        </Card>
      </div>
    </LayoutWrapper>
  );
}
