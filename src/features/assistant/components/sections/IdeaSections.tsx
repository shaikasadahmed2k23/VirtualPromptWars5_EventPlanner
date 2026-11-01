import { Flower2, Music4, UtensilsCrossed } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { budgetFromIdea, taskFromIdea } from '../../lib/planActions';
import { activityIdeas, decorIdeas, menuIdeas, type PlanIdea } from '../../lib/planIdeas';
import { ItemActions } from '../ItemActions';
import { PlanSection } from '../PlanSection';
import type { PlanSectionProps } from './sectionProps';

interface IdeaGridProps<T> extends PlanSectionProps {
  ideas: readonly PlanIdea<T>[];
  /** Card content between the heading and the action buttons. */
  renderBody: (source: T) => ReactNode;
  /** Optional content beside the heading, e.g. a duration badge. */
  renderAside?: (source: T) => ReactNode;
}

/** Cards for plan ideas, each with "Add to checklist" and "Add to budget". */
function IdeaGrid<T>({ ideas, renderBody, renderAside, plan, event, actions, today }: IdeaGridProps<T>) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {ideas.map((idea) => (
        <li key={idea.heading}>
          <Card className="flex h-full flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl">{idea.heading}</h3>
              {renderAside?.(idea.source)}
            </div>
            {renderBody(idea.source)}
            <ItemActions
              itemName={idea.itemName}
              onAddToChecklist={() => {
                actions.addToChecklist(taskFromIdea(idea.task, event, today));
              }}
              onAddToBudget={() => {
                actions.addToBudget(budgetFromIdea(idea.budget, plan, event));
              }}
            />
          </Card>
        </li>
      ))}
    </ul>
  );
}

/** Décor ideas, each addable as a checklist task or a décor budget line. */
export function DecorSection(props: PlanSectionProps) {
  return (
    <PlanSection title="Décor" icon={Flower2} description="Ideas for the look and feel of your celebration">
      <IdeaGrid
        {...props}
        ideas={decorIdeas(props.plan)}
        renderBody={(idea) => <p className="flex-1 text-sm text-muted">{idea.description}</p>}
      />
    </PlanSection>
  );
}

/** Menu by course, with dietary notes. */
export function MenuSection(props: PlanSectionProps) {
  return (
    <PlanSection title="Menu" icon={UtensilsCrossed} description="Planned around your guests’ dietary needs">
      <IdeaGrid
        {...props}
        ideas={menuIdeas(props.plan)}
        renderBody={(course) => (
          <>
            <ul className="flex-1 list-disc space-y-1 pl-5 text-sm marker:text-rose">
              {course.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {course.note ? (
              <p className="rounded-xl bg-gold-soft px-3 py-2 text-xs text-gold-ink">{course.note}</p>
            ) : null}
          </>
        )}
      />
    </PlanSection>
  );
}

/** Activities and entertainment. */
export function ActivitiesSection(props: PlanSectionProps) {
  return (
    <PlanSection title="Activities" icon={Music4} description="Moments your guests will remember">
      <IdeaGrid
        {...props}
        ideas={activityIdeas(props.plan)}
        renderAside={(activity) => (
          <span className="shrink-0 rounded-full bg-lavender-soft px-2.5 py-0.5 text-xs text-lavender-ink">
            {activity.duration}
          </span>
        )}
        renderBody={(activity) => <p className="flex-1 text-sm text-muted">{activity.description}</p>}
      />
    </PlanSection>
  );
}
