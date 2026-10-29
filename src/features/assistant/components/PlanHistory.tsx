import { History, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDisplayDate } from '@/lib/dates';
import type { StoredPlan } from '@/types';
import { AIModeBadge } from './AIModeBadge';

interface PlanHistoryProps {
  history: StoredPlan[];
  onRestore: (planId: string) => void;
  disabled: boolean;
}

const describe = (version: StoredPlan) => version.refinements.at(-1) ?? 'Original plan';

/** Earlier plan versions (most recent first) with one-click restore. */
export function PlanHistory({ history, onRestore, disabled }: PlanHistoryProps) {
  return (
    <Card className="p-5 sm:p-6">
      <section aria-labelledby="history-title">
        <h2 id="history-title" className="flex items-center gap-2 text-2xl">
          <History className="size-5 text-rose-ink" aria-hidden="true" />
          Earlier versions
        </h2>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Each time you refine or regenerate, the previous version is kept here.
          </p>
        ) : (
          <ol className="mt-3 divide-y divide-line">
            {history.map((version) => (
              <li key={version.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{describe(version)}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>{formatDisplayDate(version.generatedAt.slice(0, 10))}</span>
                    <AIModeBadge aiMode={version.aiMode} />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  onClick={() => {
                    onRestore(version.id);
                  }}
                  aria-label={`Restore version: ${describe(version)}`}
                >
                  <RotateCcw aria-hidden="true" />
                  Restore
                </Button>
              </li>
            ))}
          </ol>
        )}
      </section>
    </Card>
  );
}
