'use client';

import { Toaster as Sonner } from 'sonner';

// Light-only app — no next-themes provider needed.
const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      toastOptions={{
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
  );
};

export { Toaster };
