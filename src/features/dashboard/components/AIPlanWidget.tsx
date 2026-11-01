import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/app/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WidgetCard } from '@/components/ui/widget-card';
import { AUTO_GENERATE_PARAM } from '@/features/assistant/hooks/useAutoGenerate';
import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import type { CelebrationEvent, StoredPlan } from '@/types';

/** Concept highlights previewed on the dashboard; the full list lives in the assistant. */
const HIGHLIGHT_PREVIEW_COUNT = 3;

/** The saved or draft plan's concept, with a link to the full plan. */
function PlanSummary({ stored, eventId }: { stored: StoredPlan; eventId: string }) {
  const { concept } = stored.plan;
  return (
    <div className="flex flex-1 flex-col">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {stored.savedAt ? 'Saved plan' : 'Draft, not yet saved'}
      </p>
      <p className="mt-1 font-serif text-2xl font-semibold leading-tight text-rose-deep">{concept.title}</p>
      <p className="mt-1 text-sm italic text-muted">{concept.tagline}</p>
      <p className="mt-3 line-clamp-4 text-sm leading-relaxed">{concept.summary}</p>
      <ul className="mt-3 space-y-1 text-sm">
        {concept.highlights.slice(0, HIGHLIGHT_PREVIEW_COUNT).map((highlight) => (
          <li key={highlight} className="flex gap-2">
            <span className="text-gold-ink" aria-hidden="true">
              ✦
            </span>
            {highlight}
          </li>
        ))}
      </ul>
      <Button asChild variant="secondary" className="mt-5 self-start">
        <Link to={paths.assistant(eventId)}>
          Open the full plan
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

/** First-run call to action that opens the assistant and starts generating straight away. */
function GeneratePlanPrompt({ eventId }: { eventId: string }) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-4 rounded-2xl border border-dashed border-lavender p-6">
      <Badge tone="lavender">Coming in assistant</Badge>
      <p className="font-serif text-2xl font-semibold leading-tight">
        Let Gemini draft your concept, décor, menu and day-of schedule.
      </p>
      <p className="text-sm text-muted">Built from your date, guests, budget, style and traditions.</p>
      <Button asChild size="lg">
        <Link to={`${paths.assistant(eventId)}?${AUTO_GENERATE_PARAM}=1`}>
          <Sparkles aria-hidden="true" />
          Generate AI Plan
        </Link>
      </Button>
    </div>
  );
}

/** The AI concept at a glance, or a prominent prompt to generate one. */
export function AIPlanWidget({ event, isLoading }: { event: CelebrationEvent; isLoading: boolean }) {
  const stored = useAssistantStore((state) => state.plans[event.id]);

  return (
    <WidgetCard
      title="AI plan"
      isLoading={isLoading}
      className="bg-linear-to-br from-surface via-surface to-lavender-soft"
      action={
        stored ? (
          <Badge tone={stored.aiMode === 'live' ? 'lavender' : 'gold'}>
            <Sparkles aria-hidden="true" />
            {stored.aiMode === 'live' ? 'Gemini' : 'Demo mode'}
          </Badge>
        ) : null
      }
    >
      {stored ? <PlanSummary stored={stored} eventId={event.id} /> : <GeneratePlanPrompt eventId={event.id} />}
    </WidgetCard>
  );
}
