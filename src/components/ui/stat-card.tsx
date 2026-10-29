import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card } from './card';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  /** Supporting line under the value. */
  detail?: ReactNode;
  tone?: 'rose' | 'lavender' | 'gold' | 'success';
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<StatCardProps['tone']>, string> = {
  rose: 'bg-blush-soft text-rose-deep',
  lavender: 'bg-lavender-soft text-lavender-ink',
  gold: 'bg-gold-soft text-gold-ink',
  success: 'bg-success-soft text-success',
};

/** Compact metric tile: icon, label, headline value and optional detail. */
export function StatCard({ label, value, icon: Icon, detail, tone = 'rose', className }: StatCardProps) {
  return (
    <Card className={cn('flex items-start gap-4 p-5', className)}>
      <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', TONE_CLASSES[tone])}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-0.5 truncate font-serif text-2xl font-semibold leading-tight">{value}</p>
        {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
      </div>
    </Card>
  );
}
