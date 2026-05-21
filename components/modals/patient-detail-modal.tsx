'use client';

import { Patient } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getLatestTemperature, daysSinceAdmission } from '@/lib/business-logic';

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
}

export function PatientDetailModal({ patient, onClose }: PatientDetailModalProps) {
  const latestTemp = getLatestTemperature(patient);
  const daysSince = daysSinceAdmission(patient);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{patient.name}</h2>
            <p className="text-sm text-slate-600 mt-1">ID: {patient.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Current Status</p>
              <Badge>{patient.status.replace('-', ' ')}</Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Days in Facility</p>
              <p className="font-semibold text-slate-900">{daysSince} days</p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Age</p>
                <p className="font-medium text-slate-900">{patient.age} years old</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Gender</p>
                <p className="font-medium text-slate-900">
                  {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Contact</p>
                <p className="font-medium text-slate-900">{patient.contact}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Emergency Contact</p>
                <p className="font-medium text-slate-900">{patient.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Facility Information */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Facility Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Ward</p>
                <p className="font-medium text-slate-900">{patient.ward}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Bed Number</p>
                <p className="font-medium text-slate-900">{patient.bedNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Admission Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(patient.admissionDate).toLocaleDateString()}
                </p>
              </div>
              {patient.dischargeDate && (
                <div>
                  <p className="text-sm text-slate-600">Discharge Date</p>
                  <p className="font-medium text-slate-900">
                    {new Date(patient.dischargeDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Medical Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 mb-1">Symptoms</p>
                <div className="flex gap-2 flex-wrap">
                  {patient.symptoms.map((symptom, i) => (
                    <Badge key={i} variant="secondary">{symptom}</Badge>
                  ))}
                </div>
              </div>
              {patient.medicalHistory && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Medical History</p>
                  <p className="text-slate-900">{patient.medicalHistory}</p>
                </div>
              )}
            </div>
          </div>

          {/* Temperature Records */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Temperature History</h3>
            {latestTemp && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-600 mb-1">Latest Reading</p>
                <p className="text-2xl font-bold text-slate-900">{latestTemp.temperature}°C</p>
                <p className="text-xs text-slate-600 mt-2">
                  Recorded at {latestTemp.recordedAt.toLocaleString()} by {latestTemp.recordedBy}
                </p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-medium text-slate-700">Date</th>
                    <th className="text-left py-2 px-3 font-medium text-slate-700">Temperature</th>
                    <th className="text-left py-2 px-3 font-medium text-slate-700">Recorded By</th>
                    <th className="text-left py-2 px-3 font-medium text-slate-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[...patient.temperatureRecords]
                    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
                    .slice(0, 10)
                    .map((record, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-2 px-3">
                          {new Date(record.recordedAt).toLocaleDateString()}{' '}
                          {new Date(record.recordedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2 px-3 font-medium">{record.temperature}°C</td>
                        <td className="py-2 px-3">{record.recordedBy}</td>
                        <td className="py-2 px-3 text-slate-600">{record.notes || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {patient.temperatureRecords.length > 10 && (
              <p className="text-xs text-slate-600 mt-2">
                Showing latest 10 of {patient.temperatureRecords.length} records
              </p>
            )}
          </div>

          {/* Discharge Notes */}
          {patient.dischargeNotes && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Discharge Notes</h3>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-900">{patient.dischargeNotes}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
