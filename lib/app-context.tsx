'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Patient, TemperatureRecord, DoctorReview, AuditLog, UserRole } from './types';
import { DEMO_USERS, DEMO_PATIENTS } from './seed-data';

interface AppContextType {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  availableUsers: User[];
  switchUser: (userId: string) => void;

  // Patients
  patients: Patient[];
  getPatient: (id: string) => Patient | undefined;
  updatePatient: (patient: Patient) => void;
  addTemperatureRecord: (patientId: string, record: TemperatureRecord) => void;
  dischargePatient: (patientId: string, notes: string) => void;

  // Reviews
  reviews: DoctorReview[];
  addReview: (review: DoctorReview) => void;
  getPatientReview: (patientId: string) => DoctorReview | undefined;

  // Audit
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id'>) => void;

  // UI State
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(true);

  // Initialize with first user on mount
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser(DEMO_USERS[0]);
      setShowLoginModal(true);
    }
  }, [currentUser]);

  const switchUser = useCallback((userId: string) => {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setShowLoginModal(false);
      addAuditLog({
        userId: user.id,
        action: 'LOGIN',
        resource: 'user',
        resourceId: user.id,
        timestamp: new Date(),
        details: { userRole: user.role },
      });
    }
  }, []);

  const getPatient = useCallback((id: string) => {
    return patients.find((p) => p.id === id);
  }, [patients]);

  const updatePatient = useCallback((updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        action: 'UPDATE',
        resource: 'patient',
        resourceId: updatedPatient.id,
        timestamp: new Date(),
        details: { status: updatedPatient.status },
      });
    }
  }, [currentUser]);

  const addTemperatureRecord = useCallback(
    (patientId: string, record: TemperatureRecord) => {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id === patientId) {
            return {
              ...p,
              temperatureRecords: [...p.temperatureRecords, record],
              status: p.status === 'admitted' ? 'under-treatment' : p.status,
            };
          }
          return p;
        })
      );
      if (currentUser) {
        addAuditLog({
          userId: currentUser.id,
          action: 'CREATE',
          resource: 'temperature',
          resourceId: record.id,
          timestamp: new Date(),
          details: {
            patientId,
            temperature: record.temperature,
          },
        });
      }
    },
    [currentUser]
  );

  const dischargePatient = useCallback(
    (patientId: string, notes: string) => {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id === patientId) {
            return {
              ...p,
              status: 'discharged' as const,
              dischargeDate: new Date(),
              dischargeNotes: notes,
            };
          }
          return p;
        })
      );
      if (currentUser) {
        addAuditLog({
          userId: currentUser.id,
          action: 'DISCHARGE',
          resource: 'patient',
          resourceId: patientId,
          timestamp: new Date(),
          details: { notes },
        });
      }
    },
    [currentUser]
  );

  const addReview = useCallback(
    (review: DoctorReview) => {
      setReviews((prev) => [...prev, review]);
      if (currentUser) {
        addAuditLog({
          userId: currentUser.id,
          action: 'CREATE',
          resource: 'review',
          resourceId: review.id,
          timestamp: new Date(),
          details: {
            patientId: review.patientId,
            status: review.status,
          },
        });
      }
    },
    [currentUser]
  );

  const getPatientReview = useCallback(
    (patientId: string) => {
      return reviews.find((r) => r.patientId === patientId);
    },
    [reviews]
  );

  const addAuditLog = useCallback((log: Omit<AuditLog, 'id'>) => {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setAuditLogs((prev) => [...prev, { ...log, id }]);
  }, []);

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    availableUsers: DEMO_USERS,
    switchUser,
    patients,
    getPatient,
    updatePatient,
    addTemperatureRecord,
    dischargePatient,
    reviews,
    addReview,
    getPatientReview,
    auditLogs,
    addAuditLog,
    showLoginModal,
    setShowLoginModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
