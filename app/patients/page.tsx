'use client';

import { useState } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { useApp } from '@/lib/app-context';
import { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Eye,
  Thermometer,
  Stethoscope,
  Plus,
} from 'lucide-react';
import { PatientDetailModal } from '@/components/modals/patient-detail-modal';
import { TemperatureModal } from '@/components/modals/temperature-modal';
import { getLatestTemperature, hasCriticalTemperature } from '@/lib/business-logic';

export default function PatientsPage() {
  const { patients, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedForTemp, setSelectedForTemp] = useState<Patient | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'discharged'>('all');

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ward.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = p.status !== 'discharged';
    } else if (filterStatus === 'discharged') {
      matchesStatus = p.status === 'discharged';
    }

    return matchesSearch && matchesStatus;
  });

  const activeCount = filteredPatients.filter((p) => p.status !== 'discharged').length;
  const dischargedCount = filteredPatients.filter((p) => p.status === 'discharged').length;

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patient Directory</h1>
            <p className="text-slate-600 mt-1">View and manage all facility patients</p>
          </div>
          {currentUser?.role === 'admin' && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Patient
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Total Patients</p>
                <p className="text-2xl font-bold text-slate-900">{filteredPatients.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-orange-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Active Patients</p>
                <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-green-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Discharged</p>
                <p className="text-2xl font-bold text-slate-900">{dischargedCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by patient name, ID, or ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('discharged')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'discharged'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Discharged
            </button>
          </div>
        </div>

        {/* Patient Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Ward</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Latest Temp</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Days</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => {
                  const latestTemp = getLatestTemperature(patient);
                  const isCritical = hasCriticalTemperature(patient);
                  const daysSince = Math.floor(
                    (Date.now() - new Date(patient.admissionDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-900">{patient.name}</p>
                          <p className="text-sm text-slate-600">{patient.age}y, {patient.gender}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-mono text-sm">{patient.id}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {patient.ward} - Bed {patient.bedNumber}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            patient.status === 'discharged'
                              ? 'secondary'
                              : patient.status === 'ready-for-discharge'
                                ? 'default'
                                : 'outline'
                          }
                        >
                          {patient.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            isCritical ? 'text-red-600' : 'text-slate-900'
                          }`}
                        >
                          {latestTemp ? `${latestTemp.temperature}°C` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{daysSince}d</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => setSelectedPatient(patient)}
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          {currentUser?.role === 'nurse' && patient.status !== 'discharged' && (
                            <Button
                              onClick={() => setSelectedForTemp(patient)}
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                            >
                              <Thermometer className="w-4 h-4" />
                              Temp
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="py-8 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No patients found</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {selectedForTemp && (
        <TemperatureModal
          patient={selectedForTemp}
          onClose={() => setSelectedForTemp(null)}
        />
      )}
    </LayoutWrapper>
  );
}
