import { cn } from '@/lib/utils';

/** Ornamental section divider: hairlines meeting at a gold lotus knot. Decorative. */
export function RibbonDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)} aria-hidden="true">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold sm:w-24" />
      <svg viewBox="0 0 40 20" className="h-5 w-10" focusable="false">
        <path
          d="M20 3c3 4 3 9 0 14-3-5-3-10 0-14Zm0 14c-5-1-9-4-11-9 5 0 9 3 11 9Zm0 0c5-1 9-4 11-9-5 0-9 3-11 9Z"
          fill="var(--color-gold-soft)"
          stroke="var(--color-gold)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold sm:w-24" />
    </div>
  );
}
