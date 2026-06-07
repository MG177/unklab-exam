'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { logout } from '@/lib/auth/logout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard/exams', label: 'Exams', icon: LayoutDashboard },
  { href: '/dashboard/questions', label: 'Question banks', icon: BookOpen },
];

export default function Sidebar({ user: serverUser }) {
  const pathname = usePathname();
  const auth = useAuth();
  const user = serverUser ?? auth?.user;
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  const name = user?.username || user?.name || 'Admin KEP';
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative z-20 h-screen shrink-0">
      <aside
        className={cn(
          'flex h-full flex-col overflow-hidden border-r border-line bg-surface transition-[width] duration-200 ease-kep',
          collapsed ? 'w-16' : 'w-[236px]'
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            'border-b border-line',
            collapsed ? 'px-2 py-3.5 text-center' : 'px-4 pb-3.5 pt-[18px]'
          )}
        >
          {collapsed ? (
            <span className="text-[11px] font-extrabold text-ink">UE</span>
          ) : (
            <>
              <div className="text-base font-extrabold tracking-tight text-ink">
                <span className="text-brand">Unklab</span> Exams
              </div>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.08em] text-ink-faint">
                KEP · Placement
              </span>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3">
          {!collapsed && (
            <div className="px-2.5 pb-1 pt-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-ink-faint">
              Manage
            </div>
          )}
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  'mb-0.5 flex items-center gap-2.5 rounded-md border border-transparent text-sm font-semibold transition-colors duration-150',
                  collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                  active
                    ? 'border-brand/30 bg-brand-tint font-bold text-brand-ink'
                    : 'text-ink-muted hover:border-line hover:bg-paper hover:text-ink'
                )}
              >
                <Icon
                  className={cn(
                    'h-[17px] w-[17px] shrink-0',
                    active && 'text-brand'
                  )}
                  strokeWidth={2}
                />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-line p-3">
          <div
            className={cn(
              'flex items-center gap-2.5',
              collapsed && 'justify-center'
            )}
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line bg-paper text-[11px] font-extrabold text-ink">
              {initials}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-extrabold text-ink">
                    {name}
                  </div>
                  <div className="truncate text-[10px] text-ink-faint">
                    Universitas Klabat
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Sign out"
                  className="h-7 w-7 text-ink-faint hover:text-danger"
                >
                  <LogOut className="h-4 w-4" strokeWidth={2} />
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Edge toggle */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={toggle}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute right-0 top-[88px] z-30 h-6 w-6 translate-x-1/2 rounded-full border-line bg-surface text-ink-faint shadow-[0_1px_4px_rgba(26,35,50,0.08)] hover:border-line-strong hover:text-ink-muted"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" strokeWidth={2} />
        ) : (
          <ChevronLeft className="h-3 w-3" strokeWidth={2} />
        )}
      </Button>
    </div>
  );
}
