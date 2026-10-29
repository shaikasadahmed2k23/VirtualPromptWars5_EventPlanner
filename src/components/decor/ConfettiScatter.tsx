import { cn } from '@/lib/utils';

type Piece = [x: number, y: number, rotate: number, color: string, shape: 'rect' | 'dot'];

const PIECES: readonly Piece[] = [
  [12, 18, 20, 'var(--color-rose)', 'rect'],
  [48, 8, -30, 'var(--color-gold)', 'dot'],
  [86, 24, 45, 'var(--color-lavender)', 'rect'],
  [130, 12, -10, 'var(--color-blush)', 'rect'],
  [168, 30, 60, 'var(--color-gold)', 'dot'],
  [30, 52, -50, 'var(--color-lavender)', 'dot'],
  [72, 60, 15, 'var(--color-blush)', 'rect'],
  [112, 48, -40, 'var(--color-rose)', 'dot'],
  [150, 66, 25, 'var(--color-lavender)', 'rect'],
  [188, 54, -15, 'var(--color-rose)', 'rect'],
];

/** Soft confetti scatter for celebratory headers. Decorative. */
export function ConfettiScatter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={cn('pointer-events-none', className)} aria-hidden="true" focusable="false">
      {PIECES.map(([x, y, rotate, color, shape]) =>
        shape === 'dot' ? (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill={color} />
        ) : (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="10"
            height="4"
            rx="2"
            fill={color}
            transform={`rotate(${rotate} ${x + 5} ${y + 2})`}
          />
        ),
      )}
    </svg>
  );
}
