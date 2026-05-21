import { Patient, TemperatureRecord, DoctorReview } from './types';

/**
 * Check if patient is eligible for discharge
 * Criteria: 3+ consecutive days with temp < 37.5°C
 */
export function isEligibleForDischarge(patient: Patient): boolean {
  if (patient.temperatureRecords.length < 3) {
    return false;
  }

  // Sort records by date (newest first)
  const sortedRecords = [...patient.temperatureRecords].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );

  // Check last 3 records for consecutive days with temp < 37.5
  let consecutiveDays = 0;
  let lastDate: Date | null = null;

  for (let i = 0; i < sortedRecords.length && consecutiveDays < 3; i++) {
    const record = sortedRecords[i];
    const recordDate = new Date(record.recordedAt).toDateString();

    if (record.temperature < 37.5) {
      if (lastDate === null || isConsecutiveDay(lastDate, record.recordedAt)) {
        if (lastDate === null || recordDate !== lastDate) {
          consecutiveDays++;
          lastDate = new Date(record.recordedAt);
        }
      } else {
        consecutiveDays = 1;
        lastDate = new Date(record.recordedAt);
      }
    } else {
      consecutiveDays = 0;
      lastDate = null;
    }
  }

  return consecutiveDays >= 3;
}

/**
 * Check if two dates are consecutive days
 */
function isConsecutiveDay(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diff = d1.getTime() - d2.getTime();
  return diff === 24 * 60 * 60 * 1000 || diff === -24 * 60 * 60 * 1000;
}

/**
 * Get latest temperature record
 */
export function getLatestTemperature(patient: Patient): TemperatureRecord | null {
  if (patient.temperatureRecords.length === 0) return null;
  return [...patient.temperatureRecords].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  )[0];
}

/**
 * Get average temperature for last N days
 */
export function getAverageTemperature(patient: Patient, days: number = 7): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentRecords = patient.temperatureRecords.filter(
    (r) => new Date(r.recordedAt) >= cutoffDate
  );

  if (recentRecords.length === 0) return 0;
  const sum = recentRecords.reduce((acc, r) => acc + r.temperature, 0);
  return sum / recentRecords.length;
}

/**
 * Check if patient has critical temperature (>= 40°C)
 */
export function hasCriticalTemperature(patient: Patient): boolean {
  const latest = getLatestTemperature(patient);
  return latest ? latest.temperature >= 40 : false;
}

/**
 * Check if temperature is valid
 */
export function isValidTemperature(temp: number): boolean {
  return temp >= 30 && temp <= 45;
}

/**
 * Check if temperature record already exists for today
 */
export function hasTemperatureToday(patient: Patient, date: Date = new Date()): boolean {
  const today = date.toDateString();
  return patient.temperatureRecords.some(
    (r) => new Date(r.recordedAt).toDateString() === today
  );
}

/**
 * Get fever trend status
 */
export function getFeverTrend(patient: Patient): 'improving' | 'stable' | 'worsening' {
  if (patient.temperatureRecords.length < 2) return 'stable';

  const sorted = [...patient.temperatureRecords].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const recent = sorted.slice(-3);
  const temperatures = recent.map((r) => r.temperature);

  if (temperatures.length < 2) return 'stable';

  const isImproving = temperatures.every((t, i) => i === 0 || t <= temperatures[i - 1]);
  const isWorsening = temperatures.every((t, i) => i === 0 || t >= temperatures[i - 1]);

  if (isImproving && temperatures[0] > temperatures[temperatures.length - 1]) {
    return 'improving';
  }
  if (isWorsening && temperatures[0] < temperatures[temperatures.length - 1]) {
    return 'worsening';
  }

  return 'stable';
}

/**
 * Calculate days since admission
 */
export function daysSinceAdmission(patient: Patient): number {
  const today = new Date();
  const admission = new Date(patient.admissionDate);
  return Math.floor((today.getTime() - admission.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get discharge eligibility reason
 */
export function getDischargeEligibilityReason(patient: Patient): string {
  const days = daysSinceAdmission(patient);
  const tempRecords = patient.temperatureRecords.length;

  if (tempRecords < 3) {
    return `Needs ${3 - tempRecords} more temperature records`;
  }

  if (!isEligibleForDischarge(patient)) {
    return 'Patient needs 3 consecutive days with temp < 37.5°C';
  }

  return 'Eligible for discharge';
}
