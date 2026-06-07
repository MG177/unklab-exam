'use client';

import React, { useEffect, useRef, useState } from 'react';
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

export function RenameDialog({
  open,
  onOpenChange,
  title = 'Rename',
  label = 'Name',
  defaultValue = '',
  onSubmit,
}) {
  const inputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitting(false);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.value = defaultValue || '';
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    }
  }, [open, defaultValue]);

  const submit = async () => {
    const value = inputRef.current?.value?.trim();
    if (!value || submitting) return;
    try {
      setSubmitting(true);
      await onSubmit(value);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !submitting && onOpenChange(o)}>
      <DialogContent className="max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="rename-field">{label}</Label>
          <Input
            id="rename-field"
            ref={inputRef}
            defaultValue={defaultValue}
            disabled={submitting}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  pendingLabel,
  destructive = false,
  onConfirm,
}) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (open) setConfirming(false);
  }, [open]);

  const handleConfirm = async () => {
    if (confirming) return;
    try {
      setConfirming(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setConfirming(false);
    }
  };

  const busyLabel =
    pendingLabel || (destructive ? 'Deleting…' : 'Working…');

  return (
    <Dialog open={open} onOpenChange={(o) => !confirming && onOpenChange(o)}>
      <DialogContent className="max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            disabled={confirming}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            disabled={confirming}
            onClick={handleConfirm}
          >
            {confirming ? busyLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
