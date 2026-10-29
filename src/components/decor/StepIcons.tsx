import type { ReactNode } from 'react';

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className="size-16" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill="var(--color-blush-soft)" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="2 4" />
      <g fill="none" stroke="var(--color-rose-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

/** Quill over a card: "tell us your story". Decorative. */
export function StoryIcon() {
  return (
    <IconFrame>
      <rect x="18" y="22" width="22" height="26" rx="3" fill="var(--color-surface)" />
      <path d="M23 30h12M23 35h12M23 40h7" />
      <path d="M46 16c-6 2-11 8-13 16l3 1c3-6 7-11 10-17Z" fill="var(--color-gold-soft)" />
      <path d="M33 32l-2 5" />
    </IconFrame>
  );
}

/** Spark bursting from a lotus: "AI drafts your plan". Decorative. */
export function SparkIcon() {
  return (
    <IconFrame>
      <path d="M32 44c-6-3-9-8-9-13 4 0 7 3 9 7 2-4 5-7 9-7 0 5-3 10-9 13Z" fill="var(--color-surface)" />
      <path d="M32 14v6M32 14l2 4M32 14l-2 4" />
      <path d="M44 20l-3 4M20 20l3 4" />
      <path d="M32 26l1.6 3.4L37 31l-3.4 1.6L32 36l-1.6-3.4L27 31l3.4-1.6Z" fill="var(--color-gold-soft)" />
    </IconFrame>
  );
}

/** Calendar with a heart tick: "plan it together". Decorative. */
export function CalendarHeartIcon() {
  return (
    <IconFrame>
      <rect x="17" y="20" width="30" height="26" rx="4" fill="var(--color-surface)" />
      <path d="M17 28h30M24 16v8M40 16v8" />
      <path
        d="M32 42c-4-2.5-6-4.6-6-7a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2.4-2 4.5-6 7Z"
        fill="var(--color-blush)"
        stroke="var(--color-rose-deep)"
      />
    </IconFrame>
  );
}
