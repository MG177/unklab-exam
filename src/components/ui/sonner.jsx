'use client';

import { useEffect, useRef } from 'react';
import { Toaster as Sonner, toast, useSonner } from 'sonner';

const DEFAULT_DURATION_MS = 4000;

// Sonner pauses its built-in timer while the stack is hovered/expanded
// (data-expanded=true). Use our own timer + toast.dismiss() so toasts still
// auto-close when the cursor is over them (e.g. bottom-right corner, devtools).
function ToastAutoDismiss() {
  const { toasts } = useSonner();
  const timersRef = useRef(new Map());

  useEffect(() => {
    const activeIds = new Set(toasts.filter((t) => !t.delete).map((t) => t.id));

    for (const [id, timer] of timersRef.current) {
      if (!activeIds.has(id)) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    }

    for (const t of toasts) {
      if (t.delete || timersRef.current.has(t.id)) continue;
      if (t.type === 'loading' || t.promise) continue;

      const duration =
        typeof t.duration === 'number' &&
        t.duration > 0 &&
        t.duration !== Infinity
          ? t.duration
          : DEFAULT_DURATION_MS;

      const timer = setTimeout(() => {
        toast.dismiss(t.id);
        timersRef.current.delete(t.id);
      }, duration);
      timersRef.current.set(t.id, timer);
    }
  }, [toasts]);

  return null;
}

// Light-only app — no next-themes provider needed.
const Toaster = ({ ...props }) => {
  return (
    <>
      <Sonner
        theme="light"
        className="toaster group"
        position="bottom-right"
        closeButton
        duration={Infinity}
        toastOptions={{
          duration: Infinity,
          classNames: {
            toast:
              'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-line group-[.toaster]:shadow-frame group-[.toaster]:rounded-lg',
            description: 'group-[.toast]:text-ink-muted',
            actionButton:
              'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton:
              'group-[.toast]:bg-muted group-[.toast]:text-ink-muted',
          },
        }}
        {...props}
      />
      <ToastAutoDismiss />
    </>
  );
};

export { Toaster };
