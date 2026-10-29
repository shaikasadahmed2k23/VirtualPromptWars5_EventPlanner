import { todayISO } from '@/lib/dates';
import type { CelebrationEvent, StoredPlan } from '@/types';
import { usePlanActions } from '../hooks/usePlanActions';
import { ConceptCard } from './sections/ConceptCard';
import { ActivitiesSection, DecorSection, MenuSection } from './sections/IdeaSections';
import { ScheduleTimeline } from './sections/ScheduleTimeline';
import { BudgetAllocationSection, SuggestedTasksSection } from './sections/SuggestionSections';

/** The full plan: concept, décor, menu, activities, schedule and suggestions. */
export function PlanView({ stored, event }: { stored: StoredPlan; event: CelebrationEvent }) {
  const actions = usePlanActions(event);
  const props = { plan: stored.plan, event, actions, today: todayISO() };

  return (
    <div className="space-y-12">
      <ConceptCard concept={stored.plan.concept} />
      <DecorSection {...props} />
      <MenuSection {...props} />
      <ActivitiesSection {...props} />
      <ScheduleTimeline schedule={stored.plan.schedule} />
      <div className="grid gap-10 xl:grid-cols-2">
        <SuggestedTasksSection {...props} />
        <BudgetAllocationSection {...props} />
      </div>
    </div>
  );
}
