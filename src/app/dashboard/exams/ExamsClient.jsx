'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';
import { examStatus } from '@/lib/dashboard/exam-utils';
import { Topbar, PageHeader, StatusBadge } from '@/components/dashboard/shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import ExamCreateDialog from '@/components/dashboard/ExamCreateDialog';
import { RenameDialog, ConfirmDialog } from '@/components/dashboard/dialogs';
import { LoadingIndicator } from '@/components/dashboard/LoadingIndicator';

function formatDate(d) {
  if (!d) return 'No date';
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_LABEL = { live: 'Live', ended: 'Ended', draft: 'Draft' };

export default function ExamsClient({ initialExams }) {
  const router = useRouter();
  const [exams, setExams] = useState(initialExams);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setExams(initialExams);
    setRefreshing(false);
  }, [initialExams]);

  const withStatus = useMemo(
    () => exams.map((e) => ({ ...e, _status: examStatus(e) })),
    [exams]
  );

  const counts = useMemo(() => {
    const c = { all: withStatus.length, live: 0, draft: 0, ended: 0 };
    withStatus.forEach((e) => (c[e._status] += 1));
    return c;
  }, [withStatus]);

  const visible = useMemo(() => {
    return withStatus.filter((e) => {
      if (filter !== 'all' && e._status !== filter) return false;
      if (query && !e.examName?.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [withStatus, filter, query]);

  const handleRename = async (id, value) => {
    try {
      setRefreshing(true);
      await api.patch('/exam/name/' + id, { examName: value });
      toast.success('Exam renamed');
      setRenameTarget(null);
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Failed to rename exam');
      setRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setRefreshing(true);
      await api.delete(`/exam/${id}`);
      toast.success('Exam deleted');
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete exam');
      setRefreshing(false);
    }
  };

  const FILTERS = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'live', label: `Live (${counts.live})` },
    { key: 'draft', label: `Draft (${counts.draft})` },
    { key: 'ended', label: `Ended (${counts.ended})` },
  ];

  return (
    <>
      <Topbar crumbs={[{ label: 'Exams' }]}>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Create exam
        </Button>
      </Topbar>

      <div className="flex-1 overflow-auto p-5">
        <PageHeader
          title="Exams"
          subtitle="Schedule sessions, import participants, run placement tests."
        />

        <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-faint" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exams…"
              className="h-9 rounded-md pl-8 text-[13px]"
            />
          </div>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <Button
                key={f.key}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFilter(f.key)}
                className={cn(
                  'h-auto rounded-pill px-3 py-1.5 text-[11px] font-bold',
                  filter === f.key
                    ? 'border-ink bg-ink text-surface hover:bg-ink hover:text-surface'
                    : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'
                )}
              >
                {f.label}
              </Button>
            ))}
          </div>
          {refreshing && (
            <LoadingIndicator label="" size="sm" className="shrink-0" />
          )}
        </div>

        <div
          className={cn(
            'overflow-hidden rounded-lg border border-line bg-surface transition-opacity',
            refreshing && 'opacity-60'
          )}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Exam</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-sm text-ink-faint"
                  >
                    No exams found.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((exam) => (
                  <TableRow
                    key={exam._id}
                    onClick={() => router.push(`/dashboard/exams/${exam._id}`)}
                    className={cn(
                      'cursor-pointer',
                      exam._status === 'live' &&
                        'bg-live-tint hover:bg-live-tint/70'
                    )}
                  >
                    <TableCell>
                      <div className="font-bold text-ink">
                        {exam.examName || 'Untitled'}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-faint">
                        {formatDate(exam.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={exam._status}>
                        {STATUS_LABEL[exam._status]}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {exam.students?.length ?? 0}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            aria-label="Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/exams/${exam._id}`)
                            }
                          >
                            <ExternalLink className="h-4 w-4" /> Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRenameTarget(exam)}
                          >
                            <Pencil className="h-4 w-4" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-danger focus:text-danger"
                            onClick={() => setDeleteTarget(exam)}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ExamCreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <RenameDialog
        open={!!renameTarget}
        onOpenChange={(o) => !o && setRenameTarget(null)}
        title="Rename exam"
        label="Exam name"
        defaultValue={renameTarget?.examName}
        onSubmit={(value) => handleRename(renameTarget._id, value)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete exam?"
        description={`"${deleteTarget?.examName}" and its session data will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(deleteTarget._id)}
      />
    </>
  );
}
