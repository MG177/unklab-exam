'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Upload, Check, Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';
import { Topbar } from '@/components/dashboard/shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import QuestionCard, { cardAnchor, isComplete } from '@/components/dashboard/QuestionCard';

const INITIAL_QUESTIONS = [
  {
    id: 1,
    text: '',
    options: [
      { id: 1, text: '' },
      { id: 2, text: '' },
    ],
    image: null,
    audio: null,
    correctAnswer: 1,
  },
];

function truncate(text, max = 36) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return 'Untitled question';
  return clean.length <= max ? clean : clean.slice(0, max).trimEnd() + '…';
}

function SaveStatus({ status }) {
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

export default function QuestionEditorPage() {
  const params = useParams();
  const questionId = params.questionId;

  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState('Question bank');
  const [saveStatus, setSaveStatus] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const mainRef = useRef(null);
  const saveTimerRef = useRef(null);
  const importRef = useRef(null);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/questions/' + questionId);
      setQuestions(res.data.questions === null ? INITIAL_QUESTIONS : res.data.questions);
      setQuestionName(res.data.questionName || 'Question bank');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load question bank');
    }
  };

  useEffect(() => {
    fetchQuestions();
    return () => clearTimeout(saveTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const saveQuestions = async (showToast) => {
    try {
      const res = await api.put('/questions/update/' + questionId, { questions });
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
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      e.target.value = '';
      await api.patch('/questions/import/' + questionId, formData);
      await fetchQuestions();
      toast.success('Questions imported');
    } catch (err) {
      console.log(err);
      toast.error('Import failed', {
        description: err.response?.data?.message,
      });
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => {
      let newId = 1;
      while (prev.find((q) => q.id === newId)) newId++;
      return [...prev, { ...INITIAL_QUESTIONS[0], id: newId }];
    });
  };

  // scroll-spy: highlight the rail item for the most visible card
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
        <Button asChild variant="ghost" size="sm">
          <label className="cursor-pointer">
            <Upload className="h-4 w-4" /> Import CSV
            <input
              ref={importRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </Button>
        <Button size="sm" onClick={() => saveQuestions(true)}>
          <Check className="h-4 w-4" /> Save now
        </Button>
      </Topbar>

      <div className="flex min-h-0 flex-1">
        {/* index rail */}
        <aside className="flex w-[188px] shrink-0 flex-col border-r border-line bg-surface">
          <div className="border-b border-line p-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink-faint">
            {questions.length} questions · {completeCount} ready
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {questions.map((q, i) => {
              const active = activeId === q.id;
              const ready = isComplete(q);
              return (
                <button
                  key={q.id}
                  onClick={() => scrollToCard(q.id)}
                  className={cn(
                    'flex w-full items-center gap-2 border-b border-line px-3 py-2 text-left text-xs font-bold transition-colors',
                    active
                      ? 'bg-brand-tint font-extrabold text-brand-ink'
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
                  <span className="min-w-0 flex-1 truncate">{truncate(q.text)}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={addQuestion}
            className="m-2.5 flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-dashed border-line-strong p-2 text-[11px] font-extrabold text-ink-muted hover:bg-paper"
          >
            <Plus className="h-3.5 w-3.5" /> Add question
          </button>
        </aside>

        {/* cards */}
        <div ref={mainRef} className="min-h-0 flex-1 overflow-auto bg-paper p-[18px]">
          <div className="flex max-w-[640px] flex-col gap-4">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                questions={questions}
                setQuestions={setQuestions}
                handleQuestionChange={handleQuestionChange}
                initialQuestions={INITIAL_QUESTIONS}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
