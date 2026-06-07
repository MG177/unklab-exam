# KEP Admin — Design System

**Canonical design system for all admin dashboard / frontend UI work in this app.**
Any new screen, component, or style change MUST follow these tokens and patterns — match
them exactly, do not introduce new colors, fonts, radii, or shadows.

- **Visual reference (open in a browser):** [`design-system.html`](./design-system.html) — a rendered
  spec sheet (foundations · color · type · components · app shell · patterns in context).
- **Source of truth for values:** the prototype at `temp/admin-dashboard-mockups/styles.css`
  (token names below match its `:root`).

Design language: **fun but clean** — cool paper, clinical blue brand accent, navy ink, bold headings,
pill controls, Lucide icons. Light mode only.

---

## 1. Design tokens

### Color

| Token | Value | Role |
|---|---|---|
| `--ink` | `#1a2332` | Primary text · dark sidebar background |
| `--ink-muted` | `#5c6570` | Secondary text, body copy |
| `--ink-faint` | `#8a939c` | Tertiary text, labels, placeholders, meta |
| `--paper` | `#f6f8fb` | App canvas (cool off-white) · table header · hover fills |
| `--surface` | `#ffffff` | Cards, panels, inputs, light sidebar |
| `--line` | `#e2e7ee` | Default borders & dividers |
| `--line-strong` | `#c4cdd9` | Hover borders, dashed strokes, radio rings |
| `--brand` | `#1b81c4` | Brand blue (clinical / medical) — primary actions, active accents, focus ring |
| `--brand-ink` | `#0d4b75` | Brand text on tint backgrounds |
| `--brand-tint` | `#e7f2fb` | Brand-tinted surfaces (active nav, selected option) |
| `--live` | `#0d7a5c` | Live / active / verified / success |
| `--live-tint` | `#e8f5f0` | Live status background |
| `--danger` | `#d23438` | Destructive actions, countdown timer (clinical alert red — **only when < 1 min**) |
| `--danger-ink` | `#9b1f23` | Danger text on tint |
| `--warn-tint` | `#fdf6e8` | Warning / "needs review" background |
| `--warn-ink` | `#8a5a12` | Warning text, pending save status |

Primary-button hover = `#166aa3`. Status→color mapping: **live/verified → green**,
**scheduled → brand blue**, **review → amber**, **draft/ended → neutral paper**,
**danger → red**, **timer → `--ink` (red only when < 1 min)**. Use `color-mix(in srgb, var(--brand) N%, transparent)` for subtle
brand-on-active borders.

### Typography

- **UI font:** `"Plus Jakarta Sans"`, system-ui fallback. Weights **500 / 600 / 700 / 800**.
- **Mono font:** `"IBM Plex Mono"`, SF Mono fallback. Weights **500 / 600**.
- **Base:** body `14px`, weight `500`, line-height `1.55`, antialiased.

| Style | Spec | Used for |
|---|---|---|
| Page title (`h1`) | `1.45rem`, 800, `-0.02em` | Page headers |
| Section / table label | `9–11px`, 800, uppercase, `0.1em` tracking, `--ink-faint` | Field labels, table headers, stat labels, eyebrows |
| Body | `14px`, 500, `--ink` | Default copy |
| Muted / meta | `12px`, `--ink-muted` / `--ink-faint` | Descriptions, captions |
| Mono | `12–13px`, 600, tabular-nums | **Tokens, timers, IDs, scores, counts, dates** · *timers: `--ink` normal, `--danger` only when < 1 min* |

**Rule:** anything numeric or code-like (exam tokens, timers, student IDs, scores, durations,
counts) renders in **IBM Plex Mono** with `font-variant-numeric: tabular-nums`.

### Shape & radius

| Token | Value | Applies to |
|---|---|---|
| `--radius` | `12px` | Cards, frames, tables, panels, stat cards |
| `--radius-pill` | `999px` | Buttons, chips, badges, token strip, progress bars |
| `--radius-input` | `10px` | Inputs, icon buttons, avatars, nav links |
| inline | `4–6px` | Inline `<code>`, checkboxes |

### Layout

| Token | Value |
|---|---|
| `--sidebar-w` | `236px` |
| `--sidebar-collapsed` | `64px` |
| `--topbar-h` | `56px` |

Page padding `20px`; card padding `14–18px`; gaps `6 / 8 / 10 / 12 / 16px`. Editor column max `640px`.

### Elevation & motion

- **`--shadow-frame`:** `0 2px 6px rgba(26,35,50,.05), 0 14px 36px rgba(26,35,50,.08)` — only the
  app frame, toasts, floating controls. **Cards use borders, not shadows.**
- **`--ease`:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Durations `0.12s` (hover) / `0.15s`
  (checkbox) / `0.2s` (sidebar). Honor `prefers-reduced-motion`.

### Iconography

- **Lucide** (`lucide-react` in Next.js), stroke-width **2**. Sizes: `17px` default, `15px` in
  buttons, `22px` in empty states, `12px` in toggles.
- Working set: `layout-dashboard`, `book-open`, `plus`, `search`, `ellipsis`, `upload`,
  `download`, `square` (stop), `play`, `settings`, `check`, `image`, `audio-lines`,
  `chevron-left/right`.

### Focus & a11y

Focus ring `outline: 2px solid var(--brand)`. Hidden-input checkbox pattern (clip-rect) with a
styled box proxy. Icon-only buttons need `aria-label`; sidebar toggle manages `aria-expanded`.

---

## 2. Components

- **Buttons (`.btn`)** — pill, 12px/700. Variants: `.btn-primary` (brand), `.btn-secondary`
  (surface + strong border), `.btn-ghost`, `.btn-danger`, `.btn-sm`, `.btn-icon` (square, row actions).
- **Chips** — `.chip` (screen toggle) / `.fchip` (filter, shows counts); `.is-on` → ink fill.
- **Badges (`.badge`)** — pill, 10px/800 uppercase. `.b-live` / `.b-verified` (green),
  `.b-scheduled` (brand), `.b-review` (amber), `.b-draft` / `.b-ended` (neutral).
- **Token strip (`.token-strip`)** — pill, mono code, `user-select: all`; `.is-live` → green tint.
- **Inputs** — `.search-wrap` (leading icon) and `.field` (uppercase label + input/textarea);
  focus → brand ring. **Options (`.opt`)** + `.radio`; `.opt.is-correct` → brand border + tint.
  **Active checkbox (`.q-active-check`)** → checked = live fill + white check.
- **Stat cards (`.stats` / `.stat-card`)** — uppercase label + large mono `.val` + faint hint;
  `.val.timer` → danger. **Progress line (`.progress-line`)** — 3px track + green fill.
- **Empty state (`.empty`)**, **toast (`.toast`)** — both surface; toast gets `--shadow-frame`.
- **Data table (`.card-table` + `table.data`)** — paper header (uppercase labels), `.row-title` +
  `.row-sub` two-line cells, `.num` mono cells, `tr.is-live` highlight row, hover `#eef2f7`.

### App shell

- **Sidebar (`.sb` / `.sb-light`)** — collapsible 236↔64px. Brand → nav (`.sb-label` groups +
  `.sb-link`) → footer user. Active light link: brand tint bg + brand-ink + tinted border + brand icon.
- **Topbar (`.topbar`)** — 56px, breadcrumb + spacer + contextual token strip / save status + CTA.
- **Breadcrumb (`.breadcrumb`)** — 12px faint; current page 700 ink.

### Question bank editor — "index rail" (locked layout)

- **Left rail (`.q-sidebar`, 188px):** live count head + scrollable `.q-item` list (status dot +
  mono `#` + truncated stem) + dashed "Add question". Active → brand tint; inactive → faint + strike.
- **Right pane (`.editor-main`):** paper bg, single scroll column (max 640px) of `.q-block` cards
  (head + active checkbox, Stem textarea, Image/Audio buttons, option rows). Inactive → dashed muted.
- **Interactions:** click rail → smooth-scroll to card; IntersectionObserver scroll-spy updates the
  active rail item; checkbox toggle syncs card + rail + head count; typing the stem live-updates the rail label.

---

## 3. Porting into Next.js

1. **Tokens first** — put the `:root` custom properties in global CSS (or map to Tailwind theme
   tokens). Load Plus Jakarta Sans (500–800) + IBM Plex Mono (500/600) via `next/font`.
2. **Icons** — `lucide-react` at the sizes above.
3. **Components** — build under `components/dashboard/`, reusing the class recipes 1:1.
4. **Keep semantics** — status→color, mono-for-numbers, borders-over-shadows, brand only for
   primary/active/focus.
5. **A11y** — preserve the hidden-input checkbox, focus rings, and `aria-*` on toggles/icon buttons.
