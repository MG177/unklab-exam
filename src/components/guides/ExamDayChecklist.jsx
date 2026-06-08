'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Circle } from 'lucide-react';
import { examDayChecklistItems, examDayErrors } from './guide-content';

const STORAGE_KEY = 'kep-exam-day-checklist';

const PHASE_LABELS = {
  before: 'Before the exam',
  start: 'Start',
  during: 'During',
  after: 'After',
};

export default function ExamDayChecklist() {
  const [checked, setChecked] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (id) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const phases = ['before', 'start', 'during', 'after'];
  const doneCount = examDayChecklistItems.filter(
    (item) => checked[item.id]
  ).length;

  return (
    <div className="exam-day">
      <div className="exam-day__progress">
        <span className="exam-day__progress-label">Checklist progress</span>
        <span className="exam-day__progress-value">
          {doneCount} / {examDayChecklistItems.length} complete
        </span>
        <div
          className="exam-day__progress-bar"
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={examDayChecklistItems.length}
        >
          <div
            className="exam-day__progress-fill"
            style={{
              width: `${(doneCount / examDayChecklistItems.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="exam-day__links">
        <Link href="/guides/admin" className="exam-day__link-card">
          <strong>Admin guide</strong>
          <span>Full setup and monitoring walkthrough</span>
        </Link>
        <Link href="/guides/student" className="exam-day__link-card">
          <strong>Student guide</strong>
          <span>Login through results for test-takers</span>
        </Link>
      </div>

      {phases.map((phase) => (
        <section key={phase} className="exam-day__phase">
          <h2>{PHASE_LABELS[phase]}</h2>
          <ul className="exam-day__list">
            {examDayChecklistItems
              .filter((item) => item.phase === phase)
              .map((item) => {
                const isDone = !!checked[item.id];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`exam-day__item${isDone ? ' is-done' : ''}`}
                      onClick={() => toggle(item.id)}
                      aria-pressed={isDone}
                    >
                      <span className="exam-day__check" aria-hidden="true">
                        {isDone ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Circle className="h-3.5 w-3.5" />
                        )}
                      </span>
                      {item.label}
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}

      <section className="exam-day__errors">
        <h2>Troubleshooting login errors</h2>
        <div className="exam-day__table-wrap">
          <table className="exam-day__table">
            <thead>
              <tr>
                <th>What the student sees</th>
                <th>Likely cause</th>
                <th>What to do</th>
              </tr>
            </thead>
            <tbody>
              {examDayErrors.map((row) => (
                <tr key={row.symptom}>
                  <td>{row.symptom}</td>
                  <td>{row.cause}</td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
