'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Patient } from '@/lib/types';
import { TemperatureModal } from '@/components/modals/temperature-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getLatestTemperature, getFeverTrend, hasCriticalTemperature } from '@/lib/business-logic';

export function NurseDashboard() {
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'admitted' | 'under-treatment'>(
    'all'
  );

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesStatus && (p.status === 'admitted' || p.status === 'under-treatment');
  });

  // Group patients by status
  const criticalPatients = filteredPatients.filter((p) => hasCriticalTemperature(p));
  const normalPatients = filteredPatients.filter((p) => !hasCriticalTemperature(p));

  const getCriticalCount = () => patients.filter((p) => hasCriticalTemperature(p)).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Patients</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {filteredPatients.length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Need Temperature</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {filteredPatients.filter((p) => !new Date(p.temperatureRecords[p.temperatureRecords.length - 1]?.recordedAt || 0).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <Thermometer className="w-8 h-8 text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Critical Temps</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {getCriticalCount()}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Critical Alert */}
      {criticalPatients.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="ml-3 text-red-800">
            <strong>Critical Alert:</strong> {criticalPatients.length} patient{criticalPatients.length !== 1 ? 's' : ''} with temperature ≥ 40°C. Notify doctor immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            All
          </button>
          <button
            onClick={() => setFilterStatus('admitted')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'admitted'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Admitted
          </button>
          <button
            onClick={() => setFilterStatus('under-treatment')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'under-treatment'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Under Treatment
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {/* Critical Patients First */}
        {criticalPatients.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-red-700 mb-2">
              Critical Patients ({criticalPatients.length})
            </h3>
            <div className="space-y-2">
              {criticalPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onTemperatureClick={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Normal Patients */}
        {normalPatients.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Other Patients ({normalPatients.length})
            </h3>
            <div className="space-y-2">
              {normalPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onTemperatureClick={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredPatients.length === 0 && (
          <Card className="p-8 text-center">
            <Thermometer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No patients found</p>
          </Card>
        )}
      </div>

      {/* Modal */}
      {selectedPatient && (
        <TemperatureModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

interface PatientCardProps {
  patient: Patient;
  onTemperatureClick: () => void;
}

function PatientCard({ patient, onTemperatureClick }: PatientCardProps) {
  const latestTemp = getLatestTemperature(patient);
  const trend = getFeverTrend(patient);
  const isCritical = hasCriticalTemperature(patient);

  return (
    <Card className={`p-4 transition-colors ${isCritical ? 'border-red-300 bg-red-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">{patient.name}</h3>
              <p className="text-sm text-slate-600">
                Ward {patient.ward} • Bed {patient.bedNumber}
              </p>
            </div>
            <Badge variant={isCritical ? 'destructive' : 'secondary'}>
              {patient.status === 'admitted' ? 'Just Admitted' : 'Under Treatment'}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <p className="text-xs text-slate-600">Age</p>
              <p className="font-semibold text-slate-900">{patient.age} years</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Latest Temp</p>
              <p className={`font-semibold ${isCritical ? 'text-red-600' : 'text-slate-900'}`}>
                {latestTemp ? `${latestTemp.temperature}°C` : 'No record'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Trend</p>
              <Badge variant="outline" className="mt-1">
                {trend === 'improving' && '📈 Improving'}
                {trend === 'stable' && '➡️ Stable'}
                {trend === 'worsening' && '📉 Worsening'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={onTemperatureClick}
            className="gap-2"
          >
            <Thermometer className="w-4 h-4" />
            Record
          </Button>
        </div>
      </div>
    </Card>
  );
}
