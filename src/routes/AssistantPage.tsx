import { BookmarkCheck, RefreshCw, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/headings';
import { EmptyState } from '@/components/ui/states';
import { AIModeBadge } from '@/features/assistant/components/AIModeBadge';
import { AIStatus } from '@/features/assistant/components/AIStatus';
import { PlanHistory } from '@/features/assistant/components/PlanHistory';
import { PlanSkeleton } from '@/features/assistant/components/PlanSkeleton';
import { PlanView } from '@/features/assistant/components/PlanView';
import { RefinePanel } from '@/features/assistant/components/RefinePanel';
import { useAIPlan } from '@/features/assistant/hooks/useAIPlan';
import { useAutoGenerate } from '@/features/assistant/hooks/useAutoGenerate';
import { usePlanActions } from '@/features/assistant/hooks/usePlanActions';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

/** `/events/:eventId/assistant`: generate, explore, refine and save the AI plan. */
export default function AssistantPage() {
  const event = useCurrentEvent();
  const ai = useAIPlan(event);
  const { savePlan } = usePlanActions(event);
  const { current } = ai;
  useDocumentTitle(`AI Planning Assistant · ${event.name}`);
  useAutoGenerate(Boolean(current), ai.generate);

  const header = (
    <PageHeader
      eyebrow={event.name}
      title="AI Planning Assistant"
      description="Concept, décor, menu, activities and a day-of schedule, tailored to your celebration."
      actions={
        current ? (
          <>
            <AIModeBadge aiMode={current.aiMode} />
            {current.savedAt ? (
              <Badge tone="success">
                <BookmarkCheck aria-hidden="true" />
                Saved to event
              </Badge>
            ) : (
              <Button variant="secondary" onClick={savePlan} disabled={ai.isWorking}>
                <BookmarkCheck aria-hidden="true" />
                Save plan
              </Button>
            )}
            <Button onClick={() => void ai.generate({ force: true })} disabled={ai.isWorking}>
              <RefreshCw aria-hidden="true" className={ai.isWorking ? 'animate-spin' : undefined} />
              Regenerate
            </Button>
          </>
        ) : null
      }
    />
  );

  return (
    <div className="space-y-8">
      {header}
      <AIStatus
        status={ai.status}
        error={ai.error}
        onRetry={() => void ai.retry()}
        loadingMessage="Crafting your plan…"
        successMessage="Your plan is ready."
      />
      {ai.isWorking ? (
        <PlanSkeleton />
      ) : current ? (
        <div className="grid gap-10 2xl:grid-cols-[minmax(0,1fr)_22rem]">
          <PlanView stored={current} event={event} />
          <aside className="space-y-6 2xl:sticky 2xl:top-24 2xl:self-start" aria-label="Refine and history">
            <RefinePanel onRefine={(instruction) => void ai.refine(instruction)} disabled={ai.isWorking} />
            <PlanHistory history={ai.history} onRestore={ai.restore} disabled={ai.isWorking} />
          </aside>
        </div>
      ) : ai.status === 'error' ? null : (
        <EmptyState
          icon={Sparkles}
          title="Your plan starts here"
          description="Gemini will draft a concept, décor, menu, activities and a day-of schedule from your event details."
          action={
            <Button size="lg" onClick={() => void ai.generate()}>
              <Sparkles aria-hidden="true" />
              Generate plan
            </Button>
          }
        />
      )}
    </div>
  );
}
