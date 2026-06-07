'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';
import { Topbar } from '@/components/dashboard/shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import QuestionCard, {
  cardAnchor,
  isComplete,
} from '@/components/dashboard/QuestionCard';
import { LoadingIndicator } from '@/components/dashboard/LoadingIndicator';

function createEmptyQuestion(id) {
  return {
    id,
    text: '',
    options: [
      { id: 1, text: '' },
      { id: 2, text: '' },
    ],
    image: null,
    audio: null,
    correctAnswer: 1,
  };
}

function truncate(text, max = 36) {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return 'Untitled question';
  return clean.length <= max ? clean : clean.slice(0, max).trimEnd() + '…';
}

function normalizeQuestions(questions) {
  return questions === null ? [createEmptyQuestion(1)] : questions;
}

function SaveStatus({ status }) {
  if (status === 'idle') return null;
  if (status === 'loading') {
    return (
      <span className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold text-warn-ink">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> saving…
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold text-danger">
        <AlertCircle className="h-3.5 w-3.5" /> save failed
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold text-live">
      <Check className="h-3.5 w-3.5" /> saved
    </span>
  );
}

export default function QuestionEditorClient({ initialBank }) {
  const router = useRouter();
  const [questions, setQuestions] = useState(() =>
    normalizeQuestions(initialBank.questions)
  );
  const [questionName, setQuestionName] = useState(
    initialBank.questionName || 'Question bank'
  );
  const [saveStatus, setSaveStatus] = useState('idle');
  const [importing, setImporting] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const mainRef = useRef(null);
  const saveTimerRef = useRef(null);
  const importRef = useRef(null);

  useEffect(() => {
    setQuestions(normalizeQuestions(initialBank.questions));
    setQuestionName(initialBank.questionName || 'Question bank');
  }, [initialBank]);

  useEffect(() => {
    return () => clearTimeout(saveTimerRef.current);
  }, []);

  const saveQuestions = async (showToast) => {
    setSaveStatus('loading');
    try {
      const res = await api.put('/questions/update/' + initialBank._id, {
        questions,
      });
      setQuestions(res.data.questions);
      setSaveStatus(true);
      if (showToast) toast.success('Questions saved');
    } catch (err) {
      console.error('Failed to save questions', err);
      setSaveStatus('failed');
      if (showToast) {
        toast.error('Failed to save', {
          description: err.response?.data?.msg?.message,
        });
      }
    }
  };

  const handleQuestionChange = () => {
    setSaveStatus('loading');
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveQuestions(false), 5000);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      setImporting(true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      e.target.value = '';
      await api.patch('/questions/import/' + initialBank._id, formData);
      router.refresh();
      toast.success('Questions imported');
    } catch (err) {
      console.log(err);
      toast.error('Import failed', {
        description: err.response?.data?.message,
      });
    } finally {
      setImporting(false);
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => {
      let newId = 1;
      while (prev.find((q) => q.id === newId)) newId++;
      return [...prev, createEmptyQuestion(newId)];
    });
  };

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const cards = main.querySelectorAll('[data-q-card]');
    if (!cards.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(Number(visible.target.dataset.qCard));
      },
      { root: main, rootMargin: '-12% 0px -72% 0px', threshold: [0, 0.25, 0.5] }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [questions]);

  const scrollToCard = (id) => {
    const main = mainRef.current;
    const el = document.getElementById(cardAnchor(id));
    if (!main || !el) return;
    const top =
      el.getBoundingClientRect().top -
      main.getBoundingClientRect().top +
      main.scrollTop -
      8;
    main.scrollTo({ top, behavior: 'smooth' });
    setActiveId(id);
  };

  const completeCount = useMemo(
    () => questions.filter(isComplete).length,
    [questions]
  );

  return (
    <>
      <Topbar
        crumbs={[
          { label: 'Banks', href: '/dashboard/questions' },
          { label: questionName },
        ]}
        center={<SaveStatus status={saveStatus} />}
      >
        <Button asChild variant="ghost" size="sm" disabled={importing}>
          <label
            className={cn(
              'cursor-pointer',
              importing && 'pointer-events-none opacity-60'
            )}
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {importing ? 'Importing…' : 'Import CSV'}
            <input
              ref={importRef}
              type="file"
              accept=".csv"
              className="hidden"
              disabled={importing}
              onChange={handleImport}
            />
          </label>
        </Button>
        <Button
          size="sm"
          disabled={saveStatus === 'loading'}
          onClick={() => saveQuestions(true)}
        >
          {saveStatus === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Save now
        </Button>
      </Topbar>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[188px] shrink-0 flex-col border-r border-line bg-surface">
          <div className="border-b border-line p-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink-faint">
            {`${questions.length} questions · ${completeCount} ready`}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {questions.map((q, i) => {
              const active = activeId === q.id;
              const ready = isComplete(q);
              return (
                <Button
                  key={q.id}
                  type="button"
                  variant="ghost"
                  onClick={() => scrollToCard(q.id)}
                  className={cn(
                    'h-auto w-full justify-start gap-2 rounded-none border-b border-line px-3 py-2 text-left text-xs font-bold',
                    active
                      ? 'bg-brand-tint font-extrabold text-brand-ink hover:bg-brand-tint'
                      : 'text-ink-muted hover:bg-paper'
                  )}
                >
                  <span
                    className={cn(
                      'h-[7px] w-[7px] shrink-0 rounded-full',
                      ready
                        ? 'bg-live'
                        : 'bg-line-strong shadow-[inset_0_0_0_1px_rgba(138,147,156,0.3)]'
                    )}
                  />
                  <span className="w-5 shrink-0 font-mono text-[10px] text-ink-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {truncate(q.text)}
                  </span>
                </Button>
              );
            })}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addQuestion}
            className="m-2.5 shrink-0 border-dashed text-[11px] font-extrabold text-ink-muted"
          >
            <Plus className="h-3.5 w-3.5" /> Add question
          </Button>
        </aside>

        <div
          ref={mainRef}
          className="min-h-0 flex-1 overflow-auto bg-paper p-[18px]"
        >
          <div className="flex max-w-[640px] flex-col gap-4">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                questions={questions}
                setQuestions={setQuestions}
                handleQuestionChange={handleQuestionChange}
                createEmptyQuestion={createEmptyQuestion}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
