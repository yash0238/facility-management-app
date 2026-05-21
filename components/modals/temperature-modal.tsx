'use client';

import { useState } from 'react';
import { Patient } from '@/lib/types';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Thermometer, X } from 'lucide-react';
import { isValidTemperature, hasTemperatureToday } from '@/lib/business-logic';

interface TemperatureModalProps {
  patient: Patient;
  onClose: () => void;
}

export function TemperatureModal({ patient, onClose }: TemperatureModalProps) {
  const { addTemperatureRecord, currentUser } = useApp();
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alreadyRecordedToday = hasTemperatureToday(patient);
  const latestTemp = patient.temperatureRecords[patient.temperatureRecords.length - 1];

  const handleSubmit = () => {
    setError('');

    // Validation
    if (!temperature.trim()) {
      setError('Temperature is required');
      return;
    }

    const temp = parseFloat(temperature);
    if (isNaN(temp)) {
      setError('Please enter a valid number');
      return;
    }

    if (!isValidTemperature(temp)) {
      setError('Temperature must be between 30°C and 45°C');
      return;
    }

    // Check for duplicate
    if (alreadyRecordedToday) {
      setError('Temperature already recorded for today. Update the existing record?');
      return;
    }

    // Success
    setIsSubmitting(true);
    try {
      const record = {
        id: `temp-${Date.now()}`,
        patientId: patient.id,
        temperature: temp,
        recordedAt: new Date(),
        recordedBy: currentUser?.name || 'Unknown',
        notes: notes || undefined,
      };

      addTemperatureRecord(patient.id, record);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setError('Failed to save temperature record');
      setIsSubmitting(false);
    }
  };

  const isCritical = temperature && parseFloat(temperature) >= 40;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Record Temperature</h2>
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
        <div className="p-6 space-y-4">
          {/* Existing Record Alert */}
          {alreadyRecordedToday && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                Temperature already recorded today at {latestTemp?.recordedAt.toLocaleTimeString()}
              </AlertDescription>
            </Alert>
          )}

          {/* Critical Alert */}
          {isCritical && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                Critical temperature detected (≥ 40°C). Alert doctor immediately.
              </AlertDescription>
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Temperature Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temperature (°C)
              </div>
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g., 37.5"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              disabled={alreadyRecordedToday}
              className={isCritical ? 'border-red-500' : ''}
            />
            <p className="text-xs text-slate-500 mt-1">Range: 30°C - 45°C</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes (Optional)
            </label>
            <Textarea
              placeholder="e.g., Patient feeling better, sweating reduced..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={alreadyRecordedToday}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Last Reading */}
          {latestTemp && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Last Reading:</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-slate-900">
                  {latestTemp.temperature}°C
                </span>
                <span className="text-xs text-slate-500">
                  {latestTemp.recordedAt.toLocaleDateString()} at{' '}
                  {latestTemp.recordedAt.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || alreadyRecordedToday || !temperature.trim()}
            className={isCritical ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isSubmitting ? 'Saving...' : 'Record Temperature'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
