'use client';

import { LayoutWrapper } from '@/components/layout-wrapper';
import { useApp } from '@/lib/app-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { currentUser, showLoginModal } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && !showLoginModal) {
      router.push('/dashboard');
    }
  }, [currentUser, showLoginModal, router]);

  return (
    <LayoutWrapper>
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">Loading...</p>
      </div>
    </LayoutWrapper>
  );
}
