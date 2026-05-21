'use client';

import { useApp } from '@/lib/app-context';
import { DEMO_USERS } from '@/lib/seed-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export function LoginModal() {
  const { showLoginModal, switchUser } = useApp();

  if (!showLoginModal) return null;

  const groupedUsers = {
    Nurses: DEMO_USERS.filter((u) => u.role === 'nurse'),
    Doctors: DEMO_USERS.filter((u) => u.role === 'doctor'),
    Admin: DEMO_USERS.filter((u) => u.role === 'admin'),
    'Super Admin': DEMO_USERS.filter((u) => u.role === 'super-admin'),
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">QuaraCare</h2>
          <p className="text-slate-600 mt-1">Quarantine Facility Management System</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-4">
            Select a user account to login. This is a demo system with predefined accounts for testing different roles.
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedUsers).map(
            ([role, users]) =>
              users.length > 0 && (
                <div key={role}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">{role}</h3>
                  <div className="grid gap-2">
                    {users.map((user) => (
                      <Button
                        key={user.id}
                        onClick={() => switchUser(user.id)}
                        variant="outline"
                        className="justify-start h-auto p-3 text-left"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-600">{user.email}</div>
                          {user.department && (
                            <div className="text-xs text-slate-500 mt-0.5">{user.department}</div>
                          )}
                        </div>
                        <LogIn className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                      </Button>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            This is a demonstration system. All data is sample/mock data created for testing purposes.
          </p>
        </div>
      </Card>
    </div>
  );
}
