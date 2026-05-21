import { Patient, TemperatureRecord } from './types';

export interface RiskAssessment {
  riskScore: number; // 1-100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  priorityScore: number; // 1-100
  urgencyIndicator: string;
  aiRecommendation: string;
  escalationWarning?: string;
}

/**
 * Calculate comprehensive risk assessment for a patient based on multiple factors
 */
export function calculatePatientRisk(
  patient: Patient,
  temperatureRecords: TemperatureRecord[]
): RiskAssessment {
  const weights = {
    feverSeverity: 0.4,
    consecutiveFeverDays: 0.3,
    missedChecks: 0.15,
    delayedReview: 0.1,
    ageFactor: 0.05,
  };

  // Calculate fever severity (temp >= 38°C is fever, >=40°C is critical)
  const lastTemp = temperatureRecords[temperatureRecords.length - 1]?.temperature || 36.5;
  const feverScore = calculateFeverScore(lastTemp);

  // Calculate consecutive fever days
  const consecutiveFeverDays = calculateConsecutiveFeverDays(temperatureRecords);
  const feverDaysScore = Math.min((consecutiveFeverDays / 14) * 100, 100);

  // Calculate missed temperature checks (last 7 days)
  const missedChecksScore = calculateMissedChecksScore(temperatureRecords);

  // Calculate delay in doctor review
  const delayedReviewScore = calculateReviewDelayScore(patient);

  // Age factor (older patients score higher risk)
  const ageFactor = patient.ageGroup === '60+' ? 30 : patient.ageGroup === '40-59' ? 15 : 0;

  // Weighted risk score
  const riskScore = Math.round(
    feverScore * weights.feverSeverity +
    feverDaysScore * weights.consecutiveFeverDays +
    missedChecksScore * weights.missedChecks +
    delayedReviewScore * weights.delayedReview +
    ageFactor * weights.ageFactor
  );

  // Determine risk level
  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  if (riskScore >= 75) {
    riskLevel = 'Critical';
  } else if (riskScore >= 50) {
    riskLevel = 'High';
  } else if (riskScore >= 25) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'Low';
  }

  // Priority score (inverse of recovery readiness)
  const daysWithoutFever = calculateFeverFreeDays(temperatureRecords);
  const priorityScore = Math.max(100 - daysWithoutFever * 5 - (patient.status === 'approved' ? 30 : 0), 0);

  // AI Recommendation
  const aiRecommendation = generateAIRecommendation(
    patient,
    riskLevel,
    consecutiveFeverDays,
    daysWithoutFever,
    lastTemp
  );

  // Escalation warning
  const escalationWarning = generateEscalationWarning(riskLevel, lastTemp, consecutiveFeverDays);

  // Urgency indicator
  const urgencyIndicator = generateUrgencyIndicator(riskLevel, lastTemp);

  return {
    riskScore,
    riskLevel,
    priorityScore,
    urgencyIndicator,
    aiRecommendation,
    escalationWarning,
  };
}

function calculateFeverScore(temperature: number): number {
  if (temperature >= 40) return 95; // Critical fever
  if (temperature >= 39) return 75; // High fever
  if (temperature >= 38.5) return 50; // Moderate fever
  if (temperature >= 38) return 25; // Mild fever
  return Math.max(0, (temperature - 37) * 20); // Slightly elevated
}

function calculateConsecutiveFeverDays(records: TemperatureRecord[]): number {
  let consecutiveDays = 0;
  for (let i = records.length - 1; i >= 0; i--) {
    if (records[i].temperature >= 38) {
      consecutiveDays++;
    } else {
      break;
    }
  }
  return consecutiveDays;
}

function calculateFeverFreeDays(records: TemperatureRecord[]): number {
  let days = 0;
  for (let i = records.length - 1; i >= 0; i--) {
    if (records[i].temperature < 38) {
      days++;
    } else {
      break;
    }
  }
  return days;
}

function calculateMissedChecksScore(records: TemperatureRecord[]): number {
  // Check last 7 days
  const lastWeek = records.filter((r) => {
    const daysSince = Math.floor((Date.now() - new Date(r.recordedAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince <= 7;
  });

  // Expected ~2 checks per day
  const expectedChecks = 14;
  const missedChecks = Math.max(0, expectedChecks - lastWeek.length);
  return Math.min((missedChecks / expectedChecks) * 100, 100);
}

function calculateReviewDelayScore(patient: Patient): number {
  if (!patient.lastReviewDate) return 100; // Never reviewed = high risk
  const daysSinceReview = Math.floor((Date.now() - new Date(patient.lastReviewDate).getTime()) / (1000 * 60 * 60 * 24));
  return Math.min((daysSinceReview / 2) * 100, 100); // Each day of delay adds risk
}

function generateAIRecommendation(
  patient: Patient,
  riskLevel: string,
  consecutiveFeverDays: number,
  daysWithoutFever: number,
  lastTemp: number
): string {
  if (riskLevel === 'Critical') {
    return 'URGENT: Immediate doctor review required. Consider isolation precautions.';
  }

  if (riskLevel === 'High') {
    if (consecutiveFeverDays > 5) {
      return `Patient has been febrile for ${consecutiveFeverDays} days. Priority doctor review within 6 hours.`;
    }
    return 'Schedule urgent doctor review within 12 hours. Monitor closely.';
  }

  if (riskLevel === 'Moderate') {
    if (daysWithoutFever >= 3 && daysWithoutFever < 3) {
      return 'Recovery in progress. Recommend doctor review within 24 hours for discharge assessment.';
    }
    return 'Patient stable but requires monitoring. Routine doctor review scheduled.';
  }

  if (daysWithoutFever >= 3) {
    return 'Patient eligible for discharge pending doctor approval. Schedule final review.';
  }

  return 'Continue monitoring. Patient progressing well.';
}

function generateEscalationWarning(riskLevel: string, lastTemp: number, consecutiveFeverDays: number): string | undefined {
  if (riskLevel === 'Critical') {
    return `CRITICAL: Temperature ${lastTemp.toFixed(1)}°C - escalate to infectious disease team immediately`;
  }

  if (lastTemp >= 40) {
    return `Critical temperature detected (${lastTemp.toFixed(1)}°C). Recommend immediate intervention.`;
  }

  if (consecutiveFeverDays > 7) {
    return `Persistent fever for ${consecutiveFeverDays} days. Consider extended care plan.`;
  }

  if (riskLevel === 'High') {
    return 'High risk patient - requires enhanced monitoring and rapid doctor assessment';
  }

  return undefined;
}

function generateUrgencyIndicator(riskLevel: string, lastTemp: number): string {
  if (riskLevel === 'Critical' || lastTemp >= 40) {
    return '🔴 CRITICAL - Immediate Action Required';
  }
  if (riskLevel === 'High') {
    return '🟠 HIGH - Urgent Review Needed';
  }
  if (riskLevel === 'Moderate') {
    return '🟡 MODERATE - Routine Review';
  }
  return '🟢 LOW - Monitoring';
}

/**
 * Sort patients by priority score (higher = more urgent)
 */
export function prioritizePatients(
  patients: Patient[],
  temperatureMap: Map<string, TemperatureRecord[]>
): { patient: Patient; risk: RiskAssessment }[] {
  return patients
    .map((patient) => {
      const records = temperatureMap.get(patient.id) || [];
      return {
        patient,
        risk: calculatePatientRisk(patient, records),
      };
    })
    .sort((a, b) => b.risk.priorityScore - a.risk.priorityScore);
}
