'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';
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

function formatDate(d) {
  if (!d) return 'No date';
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function examStatus(exam) {
  const now = Date.now();
  if (exam.endTime && new Date(exam.endTime).getTime() > now) return 'live';
  if (exam.endTime) return 'ended';
  return 'draft';
}

const STATUS_LABEL = { live: 'Live', ended: 'Ended', draft: 'Draft' };

export default function DashboardExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchExamList = async () => {
    try {
      const res = await api.get('/exam');
      setExams(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
    } catch (err) {
      console.log(err);
      toast.error('Failed to load exams');
    }
  };

  useEffect(() => {
    fetchExamList();
  }, []);

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
      await api.patch('/exam/name/' + id, { examName: value });
      toast.success('Exam renamed');
      setRenameTarget(null);
      fetchExamList();
    } catch (err) {
      console.log(err);
      toast.error('Failed to rename exam');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/exam/${id}`);
      toast.success('Exam deleted');
      fetchExamList();
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete exam');
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
          subtitle="Schedule sessions, import rosters, run placement tests."
        />

        {/* toolbar */}
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
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'rounded-pill border px-3 py-1.5 text-[11px] font-bold transition-colors',
                  filter === f.key
                    ? 'border-ink bg-ink text-surface'
                    : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
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
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-ink-faint">
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
                      exam._status === 'live' && 'bg-live-tint hover:bg-live-tint/70'
                    )}
                  >
                    <TableCell>
                      <div className="font-bold text-ink">{exam.examName || 'Untitled'}</div>
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
                          <button
                            aria-label="Actions"
                            className="grid h-7 w-7 place-items-center rounded-md border border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/exams/${exam._id}`)}
                          >
                            <ExternalLink className="h-4 w-4" /> Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setRenameTarget(exam)}>
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
