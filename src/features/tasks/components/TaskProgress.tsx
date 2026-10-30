import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { TaskProgress } from '../lib/taskStats';

/** Progress bar for completed checklist tasks with an accessible text label. */
export function TaskProgress({ progress }: { progress: TaskProgress }) {
  const percent = Math.round(progress.ratio * 100);
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-success" aria-hidden="true" />
          <h2 className="font-serif text-xl font-semibold">Checklist progress</h2>
        </div>
        <span className="text-sm font-semibold">
          {progress.done} / {progress.total}
        </span>
      </div>
      <div
        className="mt-4 h-3 overflow-hidden rounded-full bg-ivory-deep"
        role="progressbar"
        aria-label="Checklist progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${progress.done} of ${progress.total} tasks complete`}
      >
        <div
          className="h-full rounded-full bg-success transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-muted">{percent}% complete</p>
    </Card>
  );
}
