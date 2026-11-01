import type { ReactNode } from 'react';
import { formatPercent, toPercent } from '@/lib/format';
import { clamp, cn } from '@/lib/utils';

interface ProgressRingProps {
  /** Progress ratio; values above 1 render a full ring in the warning tone. */
  value: number;
  /** Accessible name, e.g. "Budget used". */
  label: string;
  size?: number;
  strokeWidth?: number;
  /** Centre content; defaults to the percentage. */
  children?: ReactNode;
  className?: string;
}

/** Circular progress indicator exposed to assistive tech as a `progressbar`. */
export function ProgressRing({ value, label, size = 120, strokeWidth = 10, children, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const bounded = clamp(value, 0, 1);
  const isOver = value > 1;
  const percent = toPercent(value);

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.min(percent, 100)}
      aria-valuetext={`${formatPercent(value)}${isOver ? ', over the limit' : ''}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-ivory-deep"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - bounded)}
          className={cn(
            'transition-[stroke-dashoffset] duration-700 ease-out',
            isOver ? 'stroke-danger' : 'stroke-rose',
          )}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {children ?? <span className="font-serif text-2xl font-semibold">{formatPercent(value)}</span>}
      </div>
    </div>
  );
}
