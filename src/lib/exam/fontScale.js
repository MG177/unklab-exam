export const FONT_SCALE_STORAGE_KEY = 'examFontScale';

/** Readable exam text steps — body drives stem/options; title scales slightly above body. */
export const FONT_SCALE_STEPS = [
  { id: 'sm', label: 'Small', bodyRem: 0.8125, titleRem: 0.9375 },
  { id: 'md', label: 'Medium', bodyRem: 0.875, titleRem: 1 },
  { id: 'lg', label: 'Large', bodyRem: 1, titleRem: 1.125 },
  { id: 'xl', label: 'Extra large', bodyRem: 1.125, titleRem: 1.25 },
  { id: '2xl', label: 'Largest', bodyRem: 1.25, titleRem: 1.375 },
];

export const DEFAULT_FONT_SCALE_INDEX = 1;

export function readStoredFontScaleIndex() {
  if (typeof window === 'undefined') return DEFAULT_FONT_SCALE_INDEX;

  const raw = sessionStorage.getItem(FONT_SCALE_STORAGE_KEY);
  if (raw === null) return DEFAULT_FONT_SCALE_INDEX;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) return DEFAULT_FONT_SCALE_INDEX;

  return Math.min(
    FONT_SCALE_STEPS.length - 1,
    Math.max(0, parsed)
  );
}

export function getFontScale(index) {
  return FONT_SCALE_STEPS[
    Math.min(FONT_SCALE_STEPS.length - 1, Math.max(0, index))
  ];
}
