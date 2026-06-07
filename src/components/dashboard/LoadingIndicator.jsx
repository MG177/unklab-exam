'use client';

import { Loader2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const SIZE_CLASS = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function LoadingIndicator({ label = 'Loading…', size = 'md', className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 text-sm text-ink-faint',
        className
      )}
    >
      <Loader2 className={cn(SIZE_CLASS[size], 'animate-spin')} />
      {label && <span>{label}</span>}
    </div>
  );
}

export function TableLoadingRow({ colSpan, label = 'Loading…' }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="py-10">
        <LoadingIndicator label={label} />
      </TableCell>
    </TableRow>
  );
}
