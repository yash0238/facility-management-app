'use client';

import { useApp } from '@/lib/app-context';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { LoginModal } from './login-modal';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser, showLoginModal } = useApp();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {!showLoginModal && currentUser && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        {!showLoginModal && currentUser && <Navbar />}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          {showLoginModal && currentUser ? (
            <LoginModal />
          ) : currentUser ? (
            <div className="p-6">{children}</div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
