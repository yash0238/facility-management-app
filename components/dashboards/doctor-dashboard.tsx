'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { hasCriticalTemperature, getLatestTemperature, isEligibleForDischarge, getDischargeEligibilityReason } from '@/lib/business-logic';
import { ReviewModal } from '@/components/modals/review-modal';

export function DoctorDashboard() {
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'ready'>(
    'all'
  );

  // Filter patients under treatment
  const allActivePatients = patients.filter((p) => p.status !== 'discharged');

  const filteredPatients = allActivePatients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === 'ready') {
      matchesStatus = isEligibleForDischarge(p);
    } else if (filterStatus === 'pending') {
      matchesStatus = !isEligibleForDischarge(p);
    }

    return matchesSearch && matchesStatus;
  });

  const criticalPatients = filteredPatients.filter((p) => hasCriticalTemperature(p));
  const readyForDischarge = filteredPatients.filter((p) => isEligibleForDischarge(p));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-300">Total Patients</p>
              <p className="text-3xl font-bold text-slate-100 mt-2">
                {filteredPatients.length}
              </p>
            </div>
            <Stethoscope className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-300">Critical Cases</p>
              <p className="text-3xl font-bold text-red-400 mt-2">
                {criticalPatients.length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-300">Ready to Discharge</p>
              <p className="text-3xl font-bold text-green-400 mt-2">
                {readyForDischarge.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-300">Avg. Stay</p>
              <p className="text-3xl font-bold text-slate-100 mt-2">
                {Math.round(
                  filteredPatients.reduce((sum, p) => {
                    const days = Math.floor(
                      (Date.now() - new Date(p.admissionDate).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return sum + days;
                  }, 0) / filteredPatients.length || 0
                )}d
              </p>
            </div>
            <Clock className="w-8 h-8 text-slate-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Critical Alert */}
      {criticalPatients.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="ml-3 text-red-800">
            <strong>Critical Alert:</strong> {criticalPatients.length} patient{criticalPatients.length !== 1 ? 's' : ''} with critical temperature readings.
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
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('ready')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'ready'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Ready to Discharge
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
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
                  onReviewClick={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          </div>
        )}

        {readyForDischarge.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-green-700 mb-2">
              Ready for Discharge ({readyForDischarge.length})
            </h3>
            <div className="space-y-2">
              {readyForDischarge.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onReviewClick={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredPatients.filter(p => !hasCriticalTemperature(p) && !isEligibleForDischarge(p)).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Under Review ({filteredPatients.filter(p => !hasCriticalTemperature(p) && !isEligibleForDischarge(p)).length})
            </h3>
            <div className="space-y-2">
              {filteredPatients
                .filter(p => !hasCriticalTemperature(p) && !isEligibleForDischarge(p))
                .map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onReviewClick={() => setSelectedPatient(patient)}
                  />
                ))}
            </div>
          </div>
        )}

        {filteredPatients.length === 0 && (
          <Card className="p-8 text-center">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-300">No patients found</p>
          </Card>
        )}
      </div>

      {/* Modal */}
      {selectedPatient && (
        <ReviewModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

interface PatientCardProps {
  patient: Patient;
  onReviewClick: () => void;
}

function PatientCard({ patient, onReviewClick }: PatientCardProps) {
  const latestTemp = getLatestTemperature(patient);
  const isCritical = hasCriticalTemperature(patient);
  const eligibleForDischarge = isEligibleForDischarge(patient);
  const reason = getDischargeEligibilityReason(patient);

  return (
    <Card className={`p-4 transition-colors ${isCritical ? 'border-red-300 bg-red-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">{patient.name}</h3>
              <p className="text-sm text-slate-300">
                Ward {patient.ward} • Bed {patient.bedNumber} • Age {patient.age}
              </p>
            </div>
            <Badge variant={eligibleForDischarge ? 'default' : isCritical ? 'destructive' : 'secondary'}>
              {eligibleForDischarge ? 'Discharge Ready' : isCritical ? 'Critical' : 'Under Treatment'}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <p className="text-xs text-slate-300">Latest Temp</p>
              <p className={`font-semibold text-lg ${isCritical ? 'text-red-400' : 'text-slate-100'}`}>
                {latestTemp ? `${latestTemp.temperature}°C` : 'No record'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-300">Temp Records</p>
              <p className="font-semibold text-slate-100">{patient.temperatureRecords.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-300">Status</p>
              <p className="text-sm font-medium text-slate-100">{reason}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onReviewClick}
          className="gap-2 flex-shrink-0"
        >
          <Stethoscope className="w-4 h-4" />
          Review
        </Button>
      </div>
    </Card>
  );
}
