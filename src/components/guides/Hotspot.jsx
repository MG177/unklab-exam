'use client';

import { useState } from 'react';

export default function Hotspot({ top, left, label, pixel = false }) {
  const [open, setOpen] = useState(false);

  const topStyle = pixel ? `${top}px` : top;
  const leftStyle = pixel ? `${left}px` : left;

  return (
    <button
      type="button"
      className="guide-hotspot absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ top: topStyle, left: leftStyle }}
      onClick={() => setOpen((v) => !v)}
      aria-label={label}
      aria-expanded={open}
    >
      <span className="guide-hotspot__pulse" aria-hidden="true" />
      <span className="guide-hotspot__dot" aria-hidden="true" />
      {open && (
        <span className="guide-hotspot__tooltip" role="tooltip">
          {label}
        </span>
      )}
    </button>
  );
}
