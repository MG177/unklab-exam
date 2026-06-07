'use client';

import React from 'react';
import { Image as ImageIcon, AudioLines, Trash2, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/api/client';
import Media from '@/components/Media';

export const cardAnchor = (id) => `qc-${id}`;

export function isComplete(question) {
  return (
    !!question?.text?.trim() &&
    question.options?.some(
      (o) => o.id === question.correctAnswer && o.text?.trim()
    )
  );
}

export default function QuestionCard({
  question,
  index,
  questions,
  setQuestions,
  handleQuestionChange,
  initialQuestions,
}) {
  const hasMedia = question.image || question.audio;

  const updateText = (value) => {
    setQuestions((prev) => {
      const next = [...prev];
      const q = next.find((x) => x.id === question.id);
      if (q) q.text = value;
      return next;
    });
    handleQuestionChange();
  };

  const setCorrect = (optionId) => {
    setQuestions((prev) => {
      const next = [...prev];
      const q = next.find((x) => x.id === question.id);
      if (q) q.correctAnswer = optionId;
      return next;
    });
    handleQuestionChange();
  };

  const updateOption = (optionId, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      const q = next.find((x) => x.id === question.id);
      const o = q?.options.find((opt) => opt.id === optionId);
      if (o) o.text = value;
      return next;
    });
    handleQuestionChange();
  };

  const addOption = () => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== question.id) return q;
        let newId = 1;
        while (q.options.find((o) => o.id === newId)) newId++;
        return { ...q, options: [...q.options, { id: newId, text: '' }] };
      })
    );
    handleQuestionChange();
  };

  const deleteOption = (optionId) => {
    setQuestions((prev) => {
      const next = [...prev];
      const q = next.find((x) => x.id === question.id);
      if (!q) return prev;
      q.options = q.options.filter((o) => o.id !== optionId);
      if (q.correctAnswer === optionId) q.correctAnswer = '';
      return next;
    });
    handleQuestionChange();
  };

  const deleteQuestion = () => {
    if (questions.length === 1) {
      setQuestions(initialQuestions);
    } else {
      setQuestions((prev) => prev.filter((q) => q.id !== question.id));
    }
    handleQuestionChange();
  };

  const uploadFile = async (e, type) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1_000_000 && type === 'image') {
        alert('Image exceeds the 1MB limit');
        return;
      }
      if (file.size > 5_000_000 && type === 'audio') {
        alert('Audio exceeds the 5MB limit');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/file', formData);
      const fileId = res.data.id;
      setQuestions((prev) => {
        const next = [...prev];
        const q = next.find((x) => x.id === question.id);
        if (q) q[type] = fileId;
        return next;
      });
      handleQuestionChange();
    } catch (err) {
      console.error(err);
    } finally {
      e.target.value = '';
    }
  };

  const removeFile = (type) => {
    setQuestions((prev) => {
      const next = [...prev];
      const q = next.find((x) => x.id === question.id);
      if (q) q[type] = null;
      return next;
    });
    handleQuestionChange();
  };

  return (
    <div
      id={cardAnchor(question.id)}
      data-q-card={question.id}
      className="scroll-mt-3 rounded-lg border border-line bg-surface p-[18px]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink-faint">
          Question {index + 1}
        </h3>
        <button
          onClick={deleteQuestion}
          aria-label="Delete question"
          className="grid h-7 w-7 place-items-center rounded-md text-ink-faint transition-colors hover:bg-paper hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {hasMedia && (
        <div className="mb-3 overflow-hidden rounded-md border border-line">
          <Media id={question.image || question.audio} dashboard />
        </div>
      )}

      <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-faint">
        Stem
      </label>
      <textarea
        rows={2}
        value={question.text || ''}
        placeholder="Type the question…"
        onChange={(e) => updateText(e.target.value)}
        className="w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:outline-2 focus:outline-brand"
      />

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {question.image ? (
          <Button variant="secondary" size="sm" onClick={() => removeFile('image')}>
            <X className="h-3.5 w-3.5" /> Remove image
          </Button>
        ) : (
          <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border border-line-strong bg-surface px-3 text-xs font-semibold text-ink shadow-sm transition-colors hover:bg-paper">
            <ImageIcon className="h-3.5 w-3.5" /> Image
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadFile(e, 'image')} />
          </label>
        )}
        {question.audio ? (
          <Button variant="secondary" size="sm" onClick={() => removeFile('audio')}>
            <X className="h-3.5 w-3.5" /> Remove audio
          </Button>
        ) : (
          <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border border-line-strong bg-surface px-3 text-xs font-semibold text-ink shadow-sm transition-colors hover:bg-paper">
            <AudioLines className="h-3.5 w-3.5" /> Audio
            <input type="file" accept="audio/*" className="hidden" onChange={(e) => uploadFile(e, 'audio')} />
          </label>
        )}
      </div>

      <label className="mb-1.5 mt-3.5 block text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-faint">
        Options
      </label>
      <div className="space-y-1.5">
        {question.options?.map((option) => {
          const correct = option.id === question.correctAnswer;
          return (
            <div
              key={option.id}
              className={cn(
                'flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-[13px]',
                correct ? 'border-brand bg-brand-tint' : 'border-line bg-surface'
              )}
            >
              <button
                type="button"
                onClick={() => setCorrect(option.id)}
                aria-label="Mark as correct answer"
                className={cn(
                  'grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition-colors',
                  correct
                    ? 'border-brand bg-brand text-white shadow-[inset_0_0_0_2px_#fff]'
                    : 'border-line-strong'
                )}
              >
                {correct && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
              </button>
              <input
                value={option.text || ''}
                placeholder="Option…"
                onChange={(e) => updateOption(option.id, e.target.value)}
                className="flex-1 bg-transparent text-ink outline-none"
              />
              <button
                type="button"
                onClick={() => deleteOption(option.id)}
                aria-label="Delete option"
                className="grid h-6 w-6 place-items-center rounded text-ink-faint hover:text-danger"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={addOption}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-line-strong px-3 py-2.5 text-[13px] font-bold text-ink-faint hover:bg-paper"
        >
          <Plus className="h-3.5 w-3.5" /> Add option
        </button>
      </div>
    </div>
  );
}
