'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  Home,
  Calendar,
  BarChart3,
  FileText,
  BotMessageSquare,
  Users,
  CreditCard,
  Settings,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'medico', 'recepcionista', 'paciente'] },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'medico', 'recepcionista', 'paciente'] },
  { href: '/dashboard/patients', label: 'Patients', icon: Users, roles: ['admin', 'medico', 'recepcionista'] },
  { href: '/dashboard/records', label: 'E-Health Records', icon: FileText, roles: ['medico'] },
  { href: '/dashboard/financial', label: 'Financial', icon: CreditCard, roles: ['admin', 'recepcionista'] },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3, roles: ['admin'] },
  { href: '/dashboard/ai-logs', label: 'AI Agent Logs', icon: BotMessageSquare, roles: ['admin', 'recepcionista'] },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { hasRole, loading } = useAuth();

  if (loading) {
    return (
      <nav className="grid items-start px-4 text-sm font-medium gap-2">
        {[...Array(8)].map((_, i) => (
           <Skeleton key={i} className="h-8 w-full" />
        ))}
      </nav>
    );
  }

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {navItems.map(({ href, label, icon: Icon, roles }) => {
        if (!hasRole(roles)) {
          return null;
        }
        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              isActive && 'bg-muted text-primary'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
