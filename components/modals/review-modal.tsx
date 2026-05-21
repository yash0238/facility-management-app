'use client';

import { useState } from 'react';
import { Patient } from '@/lib/types';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, X, Thermometer } from 'lucide-react';
import { getLatestTemperature, hasCriticalTemperature, isEligibleForDischarge } from '@/lib/business-logic';

interface ReviewModalProps {
  patient: Patient;
  onClose: () => void;
}

export function ReviewModal({ patient, onClose }: ReviewModalProps) {
  const { addReview, currentUser, dischargePatient } = useApp();
  const [findings, setFindings] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'review' | 'discharge'>('review');

  const latestTemp = getLatestTemperature(patient);
  const isCritical = hasCriticalTemperature(patient);
  const eligible = isEligibleForDischarge(patient);

  const handleReview = () => {
    setError('');

    if (!findings.trim()) {
      setError('Findings are required');
      return;
    }

    if (!treatment.trim()) {
      setError('Treatment plan is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const review = {
        id: `review-${Date.now()}`,
        patientId: patient.id,
        doctorId: currentUser?.id || 'unknown',
        status: 'approved' as const,
        findings,
        treatment,
        notes: notes || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addReview(review);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setError('Failed to save review');
      setIsSubmitting(false);
    }
  };

  const handleDischarge = () => {
    setError('');

    if (!dischargeNotes.trim()) {
      setError('Discharge notes are required');
      return;
    }

    if (isCritical) {
      setError('Cannot discharge patient with critical temperature');
      return;
    }

    if (!eligible) {
      setError('Patient must meet discharge criteria (3 days fever-free)');
      return;
    }

    setIsSubmitting(true);
    try {
      dischargePatient(patient.id, dischargeNotes);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setError('Failed to discharge patient');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Doctor Review</h2>
            <p className="text-sm text-slate-600 mt-1">{patient.name}</p>
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
          {/* Mode Tabs */}
          <div className="flex gap-4 border-b border-slate-200 pb-4">
            <button
              onClick={() => setMode('review')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                mode === 'review'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Medical Review
            </button>
            {eligible && (
              <button
                onClick={() => setMode('discharge')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  mode === 'discharge'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Discharge Patient
              </button>
            )}
          </div>

          {/* Critical Alert */}
          {isCritical && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="ml-3 text-red-800">
                Patient has critical temperature ({latestTemp?.temperature}°C). Immediate intervention may be required.
              </AlertDescription>
            </Alert>
          )}

          {/* Temperature Status */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-600">Latest Temperature</p>
                <p className={`text-lg font-semibold mt-1 ${isCritical ? 'text-red-600' : 'text-slate-900'}`}>
                  {latestTemp ? `${latestTemp.temperature}°C` : 'No records'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Total Records</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {patient.temperatureRecords.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Days in Facility</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {Math.floor(
                    (Date.now() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24)
                  )}
                </p>
              </div>
            </div>
          </div>

          {mode === 'review' ? (
            <>
              {/* Review Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Clinical Findings
                  </label>
                  <Textarea
                    placeholder="Describe patient's clinical condition, symptoms, and observations..."
                    value={findings}
                    onChange={(e) => setFindings(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Treatment Plan
                  </label>
                  <Textarea
                    placeholder="Prescribe medications, therapies, and medical interventions..."
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Any additional observations or follow-up instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Discharge Form */}
              {!eligible && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <AlertDescription className="ml-3 text-yellow-800">
                    Patient does not yet meet discharge criteria. They need 3 consecutive days with temperature below 37.5°C.
                  </AlertDescription>
                </Alert>
              )}

              {eligible && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="ml-3 text-green-800">
                    Patient meets discharge criteria and is cleared for discharge.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Discharge Notes
                </label>
                <Textarea
                  placeholder="Post-discharge care instructions, medications to continue, follow-up appointments, restrictions, etc..."
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="ml-3 text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={mode === 'review' ? handleReview : handleDischarge}
            disabled={
              isSubmitting ||
              (mode === 'review' && (!findings.trim() || !treatment.trim())) ||
              (mode === 'discharge' && (!dischargeNotes.trim() || isCritical || !eligible))
            }
            className={mode === 'discharge' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isSubmitting ? 'Saving...' : mode === 'review' ? 'Save Review' : 'Discharge Patient'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
