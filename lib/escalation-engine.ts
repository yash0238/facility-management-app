import { Patient, TemperatureRecord } from './types';

export interface EscalationEvent {
  id: string;
  patientId: string;
  patientName: string;
  type: 'fever' | 'missed_check' | 'review_delay' | 'occupancy' | 'recovery_concern';
  severity: 'warning' | 'critical';
  message: string;
  timestamp: Date;
  actionRequired: boolean;
  recommendedAction: string;
}

/**
 * Check all escalation rules and generate events
 */
export function checkEscalations(
  patients: Patient[],
  temperatureMap: Map<string, TemperatureRecord[]>,
  facilityOccupancy: { occupied: number; total: number }
): EscalationEvent[] {
  const events: EscalationEvent[] = [];

  // Check each patient for escalation triggers
  patients.forEach((patient) => {
    const records = temperatureMap.get(patient.id) || [];

    // Rule 1: Fever Escalation (>=40°C for 2+ consecutive days)
    const feverEscalation = checkFeverEscalation(patient, records);
    if (feverEscalation) events.push(feverEscalation);

    // Rule 2: Missed Check Escalation
    const missedCheckEscalation = checkMissedCheckEscalation(patient, records);
    if (missedCheckEscalation) events.push(missedCheckEscalation);

    // Rule 3: Review Delay Escalation (>24 hours without review)
    const reviewDelayEscalation = checkReviewDelayEscalation(patient);
    if (reviewDelayEscalation) events.push(reviewDelayEscalation);

    // Rule 4: Recovery Concern (worsening fever pattern)
    const recoveryEscalation = checkRecoveryConcern(patient, records);
    if (recoveryEscalation) events.push(recoveryEscalation);
  });

  // Rule 5: Occupancy Escalation (>90% capacity)
  const occupancyEscalation = checkOccupancyEscalation(facilityOccupancy);
  if (occupancyEscalation) events.push(occupancyEscalation);

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function checkFeverEscalation(patient: Patient, records: TemperatureRecord[]): EscalationEvent | null {
  if (records.length < 2) return null;

  const lastTwo = records.slice(-2);
  const bothCritical = lastTwo.every((r) => r.temperature >= 40);

  if (bothCritical) {
    return {
      id: `fever-${patient.id}-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'fever',
      severity: 'critical',
      message: `Critical fever alert: ${patient.name} has maintained temperature ≥40°C for 2+ days`,
      timestamp: new Date(),
      actionRequired: true,
      recommendedAction: 'Immediate infectious disease specialist consultation required',
    };
  }

  const lastTemp = records[records.length - 1]?.temperature || 36.5;
  if (lastTemp >= 40) {
    return {
      id: `fever-${patient.id}-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'fever',
      severity: 'warning',
      message: `High fever: ${patient.name} temperature is ${lastTemp.toFixed(1)}°C`,
      timestamp: new Date(),
      actionRequired: true,
      recommendedAction: 'Priority doctor review within 2 hours',
    };
  }

  return null;
}

function checkMissedCheckEscalation(patient: Patient, records: TemperatureRecord[]): EscalationEvent | null {
  // Check if no temperature recorded today by 10 AM
  const today = new Date();
  today.setHours(10, 0, 0, 0);

  const todayRecords = records.filter((r) => {
    const recordDate = new Date(r.recordedAt);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  });

  if (todayRecords.length === 0 && new Date().getHours() >= 10) {
    return {
      id: `missed-${patient.id}-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'missed_check',
      severity: 'warning',
      message: `Missed temperature check: ${patient.name} has not recorded temperature today`,
      timestamp: new Date(),
      actionRequired: true,
      recommendedAction: 'Nurse should record temperature immediately',
    };
  }

  return null;
}

function checkReviewDelayEscalation(patient: Patient): EscalationEvent | null {
  if (!patient.lastReviewDate) {
    // Never reviewed
    if (new Date().getTime() - new Date(patient.admissionDate).getTime() > 24 * 60 * 60 * 1000) {
      return {
        id: `review-${patient.id}-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        type: 'review_delay',
        severity: 'critical',
        message: `No doctor review: ${patient.name} admitted 24+ hours ago without doctor review`,
        timestamp: new Date(),
        actionRequired: true,
        recommendedAction: 'Schedule immediate doctor review',
      };
    }
  } else {
    const hoursSinceReview = (new Date().getTime() - new Date(patient.lastReviewDate).getTime()) / (1000 * 60 * 60);
    if (hoursSinceReview > 24) {
      return {
        id: `review-${patient.id}-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        type: 'review_delay',
        severity: 'warning',
        message: `Overdue review: ${patient.name} hasn&apos;t had doctor review in ${Math.floor(hoursSinceReview)} hours`,
        timestamp: new Date(),
        actionRequired: true,
        recommendedAction: 'Schedule follow-up doctor review',
      };
    }
  }

  return null;
}

function checkRecoveryConcern(patient: Patient, records: TemperatureRecord[]): EscalationEvent | null {
  if (records.length < 3) return null;

  // Check if temperatures are increasing (worsening)
  const lastThree = records.slice(-3).map((r) => r.temperature);
  const isWorsening = lastThree[0] < lastThree[1] && lastThree[1] < lastThree[2];

  if (isWorsening && lastThree[2] >= 39) {
    return {
      id: `recovery-${patient.id}-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: 'recovery_concern',
      severity: 'warning',
      message: `Recovery concern: ${patient.name}&apos;s fever is worsening (trend: ${lastThree.map((t) => t.toFixed(1)).join(' → ')})`,
      timestamp: new Date(),
      actionRequired: true,
      recommendedAction: 'Increase monitoring frequency and consider treatment adjustment',
    };
  }

  return null;
}

function checkOccupancyEscalation(occupancy: {
  occupied: number;
  total: number;
}): EscalationEvent | null {
  const occupancyRate = occupancy.occupied / occupancy.total;

  if (occupancyRate >= 0.95) {
    return {
      id: `occupancy-critical-${Date.now()}`,
      patientId: 'facility',
      patientName: 'Facility',
      type: 'occupancy',
      severity: 'critical',
      message: `CRITICAL CAPACITY: Facility at ${(occupancyRate * 100).toFixed(0)}% occupancy (${occupancy.occupied}/${occupancy.total} beds)`,
      timestamp: new Date(),
      actionRequired: true,
      recommendedAction: 'Activate overflow protocols. Consider patient transfers or expanding capacity.',
    };
  }

  if (occupancyRate >= 0.9) {
    return {
      id: `occupancy-warning-${Date.now()}`,
      patientId: 'facility',
      patientName: 'Facility',
      type: 'occupancy',
      severity: 'warning',
      message: `High capacity alert: Facility at ${(occupancyRate * 100).toFixed(0)}% occupancy (${occupancy.occupied}/${occupancy.total} beds)`,
      timestamp: new Date(),
      actionRequired: true,
      recommendedAction: 'Monitor admissions closely and prepare overflow procedures',
    };
  }

  return null;
}

/**
 * Get summary of critical escalations
 */
export function getEscalationSummary(events: EscalationEvent[]): {
  critical: number;
  warnings: number;
  byType: Record<string, number>;
} {
  const summary = {
    critical: events.filter((e) => e.severity === 'critical').length,
    warnings: events.filter((e) => e.severity === 'warning').length,
    byType: {} as Record<string, number>,
  };

  events.forEach((e) => {
    summary.byType[e.type] = (summary.byType[e.type] || 0) + 1;
  });

  return summary;
}
