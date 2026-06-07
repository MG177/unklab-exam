'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';
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

const totalQuestion = (data) =>
  data.reduce(
    (sum, item) =>
      typeof item.quantity === 'number' && !isNaN(item.quantity)
        ? sum + item.quantity
        : sum,
    0
  );

const compressQuestion = (data) =>
  data
    .filter((i) => typeof i.quantity === 'number' && !isNaN(i.quantity))
    .map((i) => ({
      _id: i._id,
      questionName: i.questionName,
      quantity: i.quantity,
      questionLength: i.questions.length,
    }));

export default function ExamCreateDialog({ open, onOpenChange }) {
  const router = useRouter();
  const examLabelRef = useRef(null);
  const [questionSelected, setQuestionSelected] = useState([]);
  const [questionDB, setQuestionDB] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestionGroup = async () => {
    try {
      const res = await api.get('/questions');
      const verified = res.data.filter((i) => i.isVerified);
      const available = verified.filter(
        (i) => !questionSelected.some((s) => s._id === i._id)
      );
      setQuestionDB(available);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (open) {
      setQuestionSelected([]);
      fetchQuestionGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const addQuestion = (item, index) => {
    setQuestionDB((prev) => prev.filter((_, i) => i !== index));
    setQuestionSelected((prev) => [...prev, item]);
  };

  const removeQuestion = (item, index) => {
    setQuestionDB((prev) =>
      [...prev, item].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      )
    );
    setQuestionSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const setQuantity = (index, quantity) => {
    setQuestionSelected((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: parseInt(quantity, 10) };
      return next;
    });
  };

  const handleCreate = async () => {
    const examLabel = examLabelRef.current?.value?.trim();
    if (!examLabel) {
      toast.error('Exam name cannot be empty');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post(
        '/exam/' + examLabel,
        compressQuestion(questionSelected)
      );
      toast.success('Exam created');
      router.push('/dashboard/exams/' + res.data._id);
    } catch (err) {
      console.log(err);
      toast.error('Could not create exam', {
        description: err.response?.data?.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-4 rounded-lg">
        <DialogHeader>
          <DialogTitle>Create new exam</DialogTitle>
          <DialogDescription>
            Name the session and choose verified question banks to draw from.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="exam-name">Exam name</Label>
          <Input id="exam-name" ref={examLabelRef} placeholder="e.g. Endtime Test — Batch A" />
        </div>

        <div className="space-y-1.5">
          <Label>Available banks</Label>
          <ScrollArea className="h-28 rounded-md border border-line">
            {questionDB.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-ink-faint">
                No verified banks available
              </p>
            ) : (
              questionDB.map((item, index) => (
                <button
                  key={item._id}
                  onClick={() => addQuestion(item, index)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-paper hover:text-brand-ink"
                >
                  <span className="truncate">{item.questionName}</span>
                  <Plus className="h-3.5 w-3.5 shrink-0" />
                </button>
              ))
            )}
          </ScrollArea>
        </div>

        <div className="space-y-1.5">
          <Label>Selected banks — set question count</Label>
          <ScrollArea className="h-28 rounded-md border border-line">
            {questionSelected.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-ink-faint">
                Add a bank from the list above
              </p>
            ) : (
              questionSelected.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm"
                >
                  <span className="truncate">{item.questionName}</span>
                  <div className="flex items-center gap-1.5">
                    <Input
                      inputMode="numeric"
                      maxLength={3}
                      placeholder="00"
                      className="h-7 w-14 text-center font-mono text-xs tabular-nums"
                      onChange={(e) => setQuantity(index, e.target.value)}
                    />
                    <button
                      onClick={() => removeQuestion(item, index)}
                      className="grid h-6 w-6 place-items-center rounded text-ink-faint hover:text-danger"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        <div className="flex items-center justify-end gap-2 text-sm font-bold text-ink">
          <span className="text-ink-muted">Total questions</span>
          <span className="rounded-md bg-paper px-2.5 py-1 font-mono tabular-nums">
            {totalQuestion(questionSelected) || 0}
          </span>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={submitting}>
            {submitting ? 'Creating…' : 'Create exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
