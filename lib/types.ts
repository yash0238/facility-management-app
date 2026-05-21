// User roles and authentication
export type UserRole = 'nurse' | 'doctor' | 'admin' | 'super-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  phone?: string;
  createdAt: Date;
}

// Patient management
export type PatientStatus = 'admitted' | 'under-treatment' | 'ready-for-discharge' | 'discharged';

export interface TemperatureRecord {
  id: string;
  patientId: string;
  temperature: number; // Celsius
  recordedAt: Date;
  recordedBy: string; // Nurse ID
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  admissionDate: Date;
  status: PatientStatus;
  ward: string;
  bedNumber: string;
  contact: string;
  emergencyContact: string;
  symptoms: string[];
  medicalHistory?: string;
  temperatureRecords: TemperatureRecord[];
  dischargeDate?: Date;
  dischargeNotes?: string;
}

// Doctor review
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface DoctorReview {
  id: string;
  patientId: string;
  doctorId: string;
  status: ReviewStatus;
  findings: string;
  treatment: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Audit log
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: 'patient' | 'temperature' | 'review' | 'user' | 'system';
  resourceId: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

// System statistics
export interface FacilityStats {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  totalPatients: number;
  patientsAdmitted: number;
  patientsUnderTreatment: number;
  patientsReadyForDischarge: number;
  averageStay: number; // days
  dischargeRate: number; // percentage
}
