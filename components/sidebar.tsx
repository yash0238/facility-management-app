'use client';

import { useApp } from '@/lib/app-context';
import { UserRole } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Activity,
  Settings,
  LogOut,
  Home,
  Zap,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Home className="w-4 h-4" />,
    roles: ['nurse', 'doctor', 'admin', 'super-admin'],
  },
  {
    href: '/operations-center',
    label: 'Operations Center',
    icon: <Zap className="w-4 h-4" />,
    roles: ['admin', 'super-admin'],
  },
  {
    href: '/patients',
    label: 'Patients',
    icon: <Users className="w-4 h-4" />,
    roles: ['nurse', 'doctor', 'admin'],
  },
  {
    href: '/temperature-log',
    label: 'Temperature Log',
    icon: <Activity className="w-4 h-4" />,
    roles: ['nurse'],
  },
  {
    href: '/reviews',
    label: 'Reviews',
    icon: <BarChart3 className="w-4 h-4" />,
    roles: ['doctor'],
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    roles: ['admin', 'super-admin'],
  },
  {
    href: '/system-settings',
    label: 'System Settings',
    icon: <Settings className="w-4 h-4" />,
    roles: ['super-admin'],
  },
];

export function Sidebar() {
  const { currentUser, setShowLoginModal } = useApp();
  const pathname = usePathname();

  if (!currentUser) return null;

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(currentUser.role));

  return (
    <div className="w-64 bg-slate-900 text-slate-100 h-screen flex flex-col border-r border-slate-700">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-slate-50">QuaraCare</h1>
        <p className="text-xs text-slate-400 mt-1">Facility Management</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <div className="text-sm font-medium text-slate-100">{currentUser.name}</div>
        <div className="text-xs text-slate-400 capitalize mt-1">{currentUser.role.replace('-', ' ')}</div>
        {currentUser.department && (
          <div className="text-xs text-slate-500 mt-1">{currentUser.department}</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-slate-50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={() => setShowLoginModal(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
