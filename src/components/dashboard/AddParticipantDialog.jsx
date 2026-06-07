'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const emptyRow = () => ({ studentId: '', studentName: '' });

export default function AddParticipantDialog({ open, onOpenChange, onSubmit }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setRows([emptyRow()]);
      setSubmitting(false);
    }
  }, [open]);

  const updateRow = (index, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload = [];
    for (const row of rows) {
      const studentId = row.studentId.trim();
      const studentName = row.studentName.trim();
      if (!studentId && !studentName) continue;
      if (!studentId || !studentName) {
        toast.error('Each row needs both student ID and name');
        return;
      }
      payload.push({ studentId, studentName });
    }

    if (payload.length === 0) {
      toast.error('Add at least one participant');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(payload);
      onOpenChange(false);
    } catch (err) {
      console.log(err);
      toast.error('Could not add participants', {
        description: err.response?.data?.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !submitting && onOpenChange(o)}>
      <DialogContent className="max-w-md gap-4 rounded-lg">
        <DialogHeader>
          <DialogTitle>Add participants</DialogTitle>
          <DialogDescription>
            Enter student ID and name for each participant. Row numbers are
            assigned automatically.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-64 rounded-md border border-line">
          <div className="space-y-3 p-3">
            {rows.map((row, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                  <div className="space-y-1">
                    {index === 0 && (
                      <Label htmlFor={`student-id-${index}`}>Student ID</Label>
                    )}
                    <Input
                      id={`student-id-${index}`}
                      value={row.studentId}
                      disabled={submitting}
                      placeholder="e.g. S2200521"
                      className="font-mono text-xs tabular-nums"
                      onChange={(e) =>
                        updateRow(index, 'studentId', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    {index === 0 && (
                      <Label htmlFor={`student-name-${index}`}>Name</Label>
                    )}
                    <Input
                      id={`student-name-${index}`}
                      value={row.studentName}
                      disabled={submitting}
                      placeholder="Full name"
                      onChange={(e) =>
                        updateRow(index, 'studentName', e.target.value)
                      }
                    />
                  </div>
                </div>
                {rows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={submitting}
                    aria-label="Remove row"
                    className="h-9 w-9 shrink-0 text-ink-faint hover:text-danger"
                    onClick={() => removeRow(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={submitting}
          className="w-full border-dashed"
          onClick={addRow}
        >
          <Plus className="h-4 w-4" /> Add another row
        </Button>

        <DialogFooter>
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button disabled={submitting} onClick={handleSubmit}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Adding…' : 'Add participants'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
