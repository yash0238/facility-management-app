'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { LoginModal } from '@/components/login-modal';

export const dynamic = 'force-dynamic';

function LoginContent() {
  const { showLoginModal, setShowLoginModal } = useApp();
  const router = useRouter();

  useEffect(() => {
    setShowLoginModal(true);
  }, [setShowLoginModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
      <LoginModal />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />}>
      <LoginContent />
    </Suspense>
  );
}
