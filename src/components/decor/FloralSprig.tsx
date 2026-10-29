import { cn } from '@/lib/utils';

/** Hand-drawn floral sprig used to frame hero and card corners. Decorative. */
export function FloralSprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={cn('pointer-events-none', className)} aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--color-rose)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M18 186C46 140 78 110 132 86s52-50 56-70" />
        <path d="M70 128c-18-4-30-16-34-34 18 2 30 14 34 34Z" fill="var(--color-blush-soft)" />
        <path d="M102 104c-4-18 2-34 16-46 6 16 0 34-16 46Z" fill="var(--color-lavender-soft)" />
        <path d="M134 84c16-8 32-6 46 4-14 10-32 10-46-4Z" fill="var(--color-blush-soft)" />
        <path d="M48 156c-14 4-28 0-38-10 14-6 28-2 38 10Z" fill="var(--color-gold-soft)" />
      </g>
      <g fill="var(--color-blush)">
        <circle cx="160" cy="34" r="9" />
        <circle cx="160" cy="34" r="4" fill="var(--color-gold)" />
        <circle cx="96" cy="144" r="6" />
        <circle cx="96" cy="144" r="2.5" fill="var(--color-gold)" />
      </g>
      <g fill="var(--color-lavender)">
        <circle cx="182" cy="60" r="3" />
        <circle cx="122" cy="122" r="3" />
        <circle cx="30" cy="120" r="2.5" />
      </g>
    </svg>
  );
}
