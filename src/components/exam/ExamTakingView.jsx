'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Questions from '@/components/Question';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Sidebar } from 'primereact/sidebar';
import { useExamSession } from '@/contexts/ExamSessionContext';
import FontSizeControl from '@/components/exam/FontSizeControl';
import QuestionNavigator from '@/components/exam/QuestionNavigator';
import {
  FONT_SCALE_STORAGE_KEY,
  getFontScale,
  readStoredFontScaleIndex,
} from '@/lib/exam/fontScale';

export default function ExamTakingView() {
  const { questions, updateQuestionAtIndex, networkError, bootstrap } =
    useExamSession();
  const [number, setNumber] = useState(
    typeof window !== 'undefined'
      ? Number(sessionStorage.getItem('number')) || 0
      : 0
  );
  const [navOpen, setNavOpen] = useState(false);
  const [fontScaleIndex, setFontScaleIndex] = useState(
    readStoredFontScaleIndex
  );

  useEffect(() => {
    sessionStorage.setItem('number', number);
  }, [number]);

  useEffect(() => {
    sessionStorage.setItem(FONT_SCALE_STORAGE_KEY, String(fontScaleIndex));
  }, [fontScaleIndex]);

  const fontScale = getFontScale(fontScaleIndex);

  if (networkError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-paper">
        <h1 className="text-xl font-extrabold text-ink">Network error</h1>
        <button
          type="button"
          className="mt-4 rounded-pill bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-hover"
          onClick={() => bootstrap()}
        >
          Refresh
        </button>
      </div>
    );
  }

  if (!questions) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-paper">
      <Header />
      {!navOpen && (
        <FontSizeControl index={fontScaleIndex} onChange={setFontScaleIndex} />
      )}

      {!navOpen && (
        <button
          type="button"
          className="fixed right-0 top-1/2 z-30 flex h-24 w-7 -translate-y-1/2 items-center justify-center rounded-l-xl border border-r-0 border-line bg-surface text-ink-muted transition-colors hover:border-brand hover:text-brand"
          onClick={() => setNavOpen(true)}
          aria-label="Open question navigator"
        >
          <i className="pi pi-chevron-left text-sm" />
        </button>
      )}

      <Sidebar
        visible={navOpen}
        position="right"
        onHide={() => setNavOpen(false)}
        showCloseIcon={false}
        className="question-nav-sidebar"
        maskClassName="question-nav-mask"
        contentStyle={{ padding: 0, width: '100%', height: '100%' }}
      >
        <QuestionNavigator
          questions={questions}
          currentIndex={number}
          onClose={() => setNavOpen(false)}
          onSelect={(index) => {
            setNumber(index);
            setNavOpen(false);
          }}
        />
      </Sidebar>

      <ScrollPanel style={{ width: '100%', height: '100vh' }}>
        <div className="z-0 flex min-h-screen w-full flex-col items-center justify-center py-24">
          <Questions
            questions={questions}
            number={number}
            fontScale={fontScale}
            onQuestionUpdate={updateQuestionAtIndex}
          />
        </div>
      </ScrollPanel>
      <Footer
        questions={questions}
        number={number}
        setNumber={setNumber}
        onQuestionUpdate={updateQuestionAtIndex}
      />
    </div>
  );
}
