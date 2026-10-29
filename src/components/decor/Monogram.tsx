import { cn } from '@/lib/utils';

/** Utsav brand mark: a "U" cradling a gold bindu inside a double ring. Decorative. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-9', className)} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill="var(--color-surface)" stroke="var(--color-rose-ink)" strokeWidth="2.5" />
      <circle
        cx="32"
        cy="32"
        r="24.5"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.25"
        strokeDasharray="2 3"
      />
      <path
        d="M22 19v15a10 10 0 0 0 20 0V19"
        fill="none"
        stroke="var(--color-rose-ink)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M27 19h-9M46 19h-9" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="49" r="2.6" fill="var(--color-gold)" />
    </svg>
  );
}
