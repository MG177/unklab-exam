'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2 } from 'lucide-react';
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
import { LoadingIndicator } from '@/components/dashboard/LoadingIndicator';

const totalQuestion = (data) =>
  data.reduce(
    (sum, item) =>
      typeof item.quantity === 'number' && !isNaN(item.quantity)
        ? sum + item.quantity
        : sum,
    0
  );

const bankSize = (item) => item.questions?.length ?? 0;

const isQuantityValid = (item) => {
  const max = bankSize(item);
  const q = item.quantity;
  return max > 0 && typeof q === 'number' && !isNaN(q) && q >= 1 && q <= max;
};

const compressQuestion = (data) =>
  data.filter(isQuantityValid).map((i) => ({
    _id: i._id,
    questionName: i.questionName,
    quantity: i.quantity,
    questionLength: bankSize(i),
  }));

export default function ExamCreateDialog({ open, onOpenChange }) {
  const router = useRouter();
  const examLabelRef = useRef(null);
  const [questionSelected, setQuestionSelected] = useState([]);
  const [questionDB, setQuestionDB] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestionGroup = async () => {
    setBanksLoading(true);
    try {
      const res = await api.get('/questions');
      const verified = res.data.filter((i) => i.isVerified);
      const available = verified.filter(
        (i) => !questionSelected.some((s) => s._id === i._id)
      );
      setQuestionDB(available);
    } catch (err) {
      console.log(err);
      toast.error('Failed to load question banks');
    } finally {
      setBanksLoading(false);
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

  const setQuantity = (index, rawValue) => {
    const digits = rawValue.replace(/\D/g, '');
    setQuestionSelected((prev) => {
      const next = [...prev];
      const max = bankSize(next[index]);
      if (digits === '') {
        next[index] = { ...next[index], quantity: undefined };
        return next;
      }
      const parsed = Math.min(parseInt(digits, 10), max);
      next[index] = { ...next[index], quantity: parsed };
      return next;
    });
  };

  const commitQuantity = (index) => {
    setQuestionSelected((prev) => {
      const next = [...prev];
      const item = next[index];
      const max = bankSize(item);
      let quantity = item.quantity;
      if (typeof quantity !== 'number' || isNaN(quantity) || quantity < 1) {
        quantity = max > 0 ? 1 : undefined;
      } else if (quantity > max) {
        quantity = max;
      }
      next[index] = { ...next[index], quantity };
      return next;
    });
  };

  const handleCreate = async () => {
    const examLabel = examLabelRef.current?.value?.trim();
    if (!examLabel) {
      toast.error('Exam name cannot be empty');
      return;
    }
    if (questionSelected.length === 0) {
      toast.error('Choose at least one question bank');
      return;
    }
    const invalid = questionSelected.find((item) => !isQuantityValid(item));
    if (invalid) {
      const max = bankSize(invalid);
      if (max === 0) {
        toast.error(`"${invalid.questionName}" has no questions`);
      } else {
        toast.error(
          `Set question count for "${invalid.questionName}" (1–${max})`
        );
      }
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post(
        '/exam/' + examLabel,
        compressQuestion(questionSelected)
      );
      toast.success('Exam created');
      onOpenChange(false);
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
          <Input
            id="exam-name"
            ref={examLabelRef}
            placeholder="e.g. Endtime Test — Batch A"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Available banks</Label>
          <ScrollArea className="h-28 rounded-md border border-line">
            {banksLoading ? (
              <LoadingIndicator className="py-4" />
            ) : questionDB.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-ink-faint">
                No verified banks available
              </p>
            ) : (
              questionDB.map((item, index) => (
                <Button
                  key={item._id}
                  type="button"
                  variant="ghost"
                  onClick={() => addQuestion(item, index)}
                  className="h-auto w-full justify-between rounded-none px-3 py-2 font-normal hover:text-brand-ink"
                >
                  <span className="truncate">{item.questionName}</span>
                  <Plus className="h-3.5 w-3.5 shrink-0" />
                </Button>
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
              questionSelected.map((item, index) => {
                const max = bankSize(item);
                const quantity = item.quantity;
                const showValue =
                  typeof quantity === 'number' && !isNaN(quantity)
                    ? String(quantity)
                    : '';

                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm"
                  >
                    <span className="truncate">{item.questionName}</span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <Input
                          inputMode="numeric"
                          min={1}
                          max={max}
                          maxLength={String(max).length || 1}
                          placeholder="0"
                          value={showValue}
                          disabled={max === 0}
                          aria-describedby={
                            max > 0 ? `bank-max-${item._id}` : undefined
                          }
                          className="h-7 w-14 text-center font-mono text-xs tabular-nums"
                          onChange={(e) => setQuantity(index, e.target.value)}
                          onBlur={() => commitQuantity(index)}
                        />
                        <span
                          id={`bank-max-${item._id}`}
                          className="font-mono text-xs tabular-nums text-ink-faint"
                        >
                          / {max}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(item, index)}
                        className="h-6 w-6 text-ink-faint hover:text-danger"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
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
          <Button
            onClick={handleCreate}
            disabled={
              submitting ||
              banksLoading ||
              questionSelected.length === 0 ||
              questionSelected.some((item) => !isQuantityValid(item))
            }
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Creating…' : 'Create exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
