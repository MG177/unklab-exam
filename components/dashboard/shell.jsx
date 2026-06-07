'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ── Topbar (56px) — breadcrumb + center slot + right actions ── */
export function Topbar({ crumbs = [], center, children, className }) {
  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center gap-3.5 border-b border-line bg-surface px-[18px]',
        className
      )}
    >
      <Breadcrumb crumbs={crumbs} />
      {center}
      <div className="flex-1" />
      {children}
    </header>
  );
}

export function Breadcrumb({ crumbs = [] }) {
  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-xs text-ink-faint">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-line-strong">/</span>}
            {last ? (
              <strong className="truncate font-bold text-ink">{c.label}</strong>
            ) : c.href ? (
              <Link href={c.href} className="truncate transition-colors hover:text-brand-ink">
                {c.label}
              </Link>
            ) : (
              <span className="truncate">{c.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ── Page header (.ph) — title + subtitle + actions ── */
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[1.45rem] font-extrabold leading-tight tracking-[-0.02em] text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-xs text-ink-muted">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}

/* ── Stat cards ── */
export function Stats({ children, className }) {
  return (
    <div className={cn('grid grid-cols-3 gap-2.5', className)}>{children}</div>
  );
}

export function StatCard({ label, value, hint, timer }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3.5">
      <div className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-ink-faint">
        {label}
      </div>
      <div
        className={cn(
          'mt-1.5 font-mono text-[1.6rem] font-semibold leading-none tracking-[-0.02em] tabular-nums',
          timer ? 'text-danger' : 'text-ink'
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-[11px] text-ink-faint">{hint}</div>}
    </div>
  );
}

/* ── Status badge — KEP status → color family ── */
const STATUS_STYLES = {
  live: 'bg-live-tint text-live',
  verified: 'bg-live-tint text-live',
  scheduled: 'bg-brand-tint text-brand-ink',
  review: 'bg-warn-tint text-warn-ink',
  draft: 'border border-line bg-paper text-ink-faint',
  ended: 'bg-paper text-ink-faint',
};

export function StatusBadge({ status = 'draft', children }) {
  return (
    <span
      className={cn(
        'inline-block rounded-pill px-2.5 py-[3px] text-[10px] font-extrabold uppercase tracking-[0.04em]',
        STATUS_STYLES[status] || STATUS_STYLES.draft
      )}
    >
      {children}
    </span>
  );
}

/* ── Token strip — mono code pill ── */
export function TokenStrip({ token, live }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-3 py-[5px] text-[11px] font-bold text-ink-muted',
        live ? 'border-live bg-live-tint' : 'border-line bg-paper'
      )}
    >
      <span>Token</span>
      <span
        className={cn(
          'select-all font-mono text-[13px] font-semibold tracking-[0.06em]',
          live ? 'text-live' : 'text-ink'
        )}
      >
        {token || '—'}
      </span>
    </span>
  );
}
