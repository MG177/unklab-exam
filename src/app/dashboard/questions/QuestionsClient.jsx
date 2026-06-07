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
import { RenameDialog, ConfirmDialog } from '@/components/dashboard/dialogs';
import { LoadingIndicator } from '@/components/dashboard/LoadingIndicator';
import { cn } from '@/lib/utils';

function formatDate(d) {
  if (!d) return 'No date';
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function QuestionsClient({ initialBanks }) {
  const router = useRouter();
  const [banks, setBanks] = useState(initialBanks);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setBanks(initialBanks);
    setRefreshing(false);
  }, [initialBanks]);

  const visible = useMemo(
    () =>
      banks.filter(
        (b) =>
          !query || b.questionName?.toLowerCase().includes(query.toLowerCase())
      ),
    [banks, query]
  );

  const handleCreate = async (value) => {
    try {
      setRefreshing(true);
      await api.post('/questions', { questionName: value });
      toast.success('Question bank created');
      setCreateOpen(false);
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Failed to create question bank');
      setRefreshing(false);
    }
  };

  const handleRename = async (id, value) => {
    try {
      setRefreshing(true);
      await api.patch('/questions/name/' + id, { questionName: value });
      toast.success('Bank renamed');
      setRenameTarget(null);
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Failed to rename bank');
      setRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setRefreshing(true);
      await api.delete(`/questions/${id}`);
      toast.success('Bank deleted');
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete bank');
      setRefreshing(false);
    }
  };

  return (
    <>
      <Topbar crumbs={[{ label: 'Question banks' }]}>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Create bank
        </Button>
      </Topbar>

      <div className="flex-1 overflow-auto p-5">
        <PageHeader
          title="Question banks"
          subtitle="Build and verify question sets for exams."
        />

        <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink-faint" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search banks…"
              className="h-9 rounded-md pl-8 text-[13px]"
            />
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
                <TableHead>Bank</TableHead>
                <TableHead className="text-right">Questions</TableHead>
                <TableHead>Status</TableHead>
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
                    No question banks yet.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((bank) => (
                  <TableRow
                    key={bank._id}
                    onClick={() =>
                      router.push(`/dashboard/questions/${bank._id}`)
                    }
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="font-bold text-ink">
                        {bank.questionName || 'Untitled'}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-faint">
                        Updated {formatDate(bank.updatedAt || bank.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {bank.questions?.length ?? 0}
                    </TableCell>
                    <TableCell>
                      {bank.isVerified ? (
                        <StatusBadge status="verified">Verified</StatusBadge>
                      ) : (
                        <StatusBadge status="review">Needs review</StatusBadge>
                      )}
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
                              router.push(`/dashboard/questions/${bank._id}`)
                            }
                          >
                            <ExternalLink className="h-4 w-4" /> Open editor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRenameTarget(bank)}
                          >
                            <Pencil className="h-4 w-4" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-danger focus:text-danger"
                            onClick={() => setDeleteTarget(bank)}
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

      <RenameDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create question bank"
        label="Bank name"
        defaultValue=""
        onSubmit={handleCreate}
      />

      <RenameDialog
        open={!!renameTarget}
        onOpenChange={(o) => !o && setRenameTarget(null)}
        title="Rename bank"
        label="Bank name"
        defaultValue={renameTarget?.questionName}
        onSubmit={(value) => handleRename(renameTarget._id, value)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete question bank?"
        description={`"${deleteTarget?.questionName}" and all its questions will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => handleDelete(deleteTarget._id)}
      />
    </>
  );
}
