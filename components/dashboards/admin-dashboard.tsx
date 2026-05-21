'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Bed,
  TrendingUp,
  CheckCircle,
  Filter,
  Search,
  Eye,
} from 'lucide-react';
import { PatientDetailModal } from '@/components/modals/patient-detail-modal';

export function AdminDashboard() {
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'admitted' | 'under-treatment' | 'ready-for-discharge' | 'discharged'>(
    'all'
  );

  // Calculate facility stats
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status !== 'discharged').length;
  const dischargedPatients = patients.filter((p) => p.status === 'discharged').length;
  const totalBeds = 20;
  const occupiedBeds = activePatients;
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bedNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Group by ward
  const wardA = filteredPatients.filter((p) => p.ward === 'Ward A');
  const wardB = filteredPatients.filter((p) => p.ward === 'Ward B');

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Patients</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalPatients}</p>
              <p className="text-xs text-slate-500 mt-1">{activePatients} active</p>
            </div>
            <Users className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Bed Occupancy</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{occupancyRate}%</p>
              <p className="text-xs text-slate-500 mt-1">{occupiedBeds}/{totalBeds} beds</p>
            </div>
            <Bed className="w-8 h-8 text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Discharged Today</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {patients.filter(
                  (p) =>
                    p.dischargeDate &&
                    new Date(p.dischargeDate).toDateString() === new Date().toDateString()
                ).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total: {dischargedPatients}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Available Beds</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{availableBeds}</p>
              <p className="text-xs text-slate-500 mt-1">Capacity: {totalBeds}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-slate-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by patient name, ID, or bed number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
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
            Treatment
          </button>
          <button
            onClick={() => setFilterStatus('ready-for-discharge')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'ready-for-discharge'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Ready to Discharge
          </button>
          <button
            onClick={() => setFilterStatus('discharged')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'discharged'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Discharged
          </button>
        </div>
      </div>

      {/* Ward View */}
      <div className="grid grid-cols-2 gap-6">
        {/* Ward A */}
        {wardA.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Ward A ({wardA.length})</h3>
            <div className="space-y-2">
              {wardA.map((patient) => (
                <PatientRow
                  key={patient.id}
                  patient={patient}
                  onViewClick={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ward B */}
        {wardB.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Ward B ({wardB.length})</h3>
            <div className="space-y-2">
              {wardB.map((patient) => (
                <PatientRow
                  key={patient.id}
                  patient={patient}
                  onViewClick={() => setSelectedPatient(patient)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">No patients found</p>
        </Card>
      )}

      {/* Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

interface PatientRowProps {
  patient: Patient;
  onViewClick: () => void;
}

function PatientRow({ patient, onViewClick }: PatientRowProps) {
  const statusColors: Record<string, string> = {
    admitted: 'bg-blue-50 border-blue-200',
    'under-treatment': 'bg-yellow-50 border-yellow-200',
    'ready-for-discharge': 'bg-green-50 border-green-200',
    discharged: 'bg-slate-50 border-slate-200',
  };

  const statusBadgeVariant: Record<string, any> = {
    admitted: 'default',
    'under-treatment': 'secondary',
    'ready-for-discharge': 'outline',
    discharged: 'ghost',
  };

  return (
    <Card className={`p-4 border-l-4 ${statusColors[patient.status]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="font-semibold text-slate-900">{patient.name}</h4>
              <p className="text-sm text-slate-600">
                Bed {patient.bedNumber} • Age {patient.age}
              </p>
            </div>
            <Badge variant={statusBadgeVariant[patient.status]}>
              {patient.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>

        <div className="text-right mr-3">
          <p className="text-xs text-slate-600">Admitted</p>
          <p className="text-sm font-medium text-slate-900">
            {Math.floor(
              (Date.now() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24)
            )}{' '}
            days ago
          </p>
        </div>

        <Button
          onClick={onViewClick}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </Button>
      </div>
    </Card>
  );
}
