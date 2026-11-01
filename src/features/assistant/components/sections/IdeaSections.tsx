import { Flower2, Music4, UtensilsCrossed } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { budgetFromIdea, taskFromIdea } from '../../lib/planActions';
import { ItemActions } from '../ItemActions';
import { PlanSection } from '../PlanSection';
import type { PlanSectionProps } from './sectionProps';

/** Décor ideas, each addable as a checklist task or a décor budget line. */
export function DecorSection({ plan, event, actions, today }: PlanSectionProps) {
  return (
    <PlanSection title="Décor" icon={Flower2} description="Ideas for the look and feel of your celebration">
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plan.decorIdeas.map((idea) => (
          <li key={idea.title}>
            <Card className="flex h-full flex-col gap-3 p-5">
              <h3 className="text-xl">{idea.title}</h3>
              <p className="flex-1 text-sm text-muted">{idea.description}</p>
              <ItemActions
                itemName={idea.title}
                onAddToChecklist={() => {
                  actions.addToChecklist(
                    taskFromIdea({ title: idea.title, description: idea.description, category: 'decor' }, event, today),
                  );
                }}
                onAddToBudget={() => {
                  actions.addToBudget(
                    budgetFromIdea(
                      { name: idea.title, category: 'decor', ideasInCategory: plan.decorIdeas.length },
                      plan,
                      event,
                    ),
                  );
                }}
              />
            </Card>
          </li>
        ))}
      </ul>
    </PlanSection>
  );
}

/** Menu by course, with dietary notes. */
export function MenuSection({ plan, event, actions, today }: PlanSectionProps) {
  return (
    <PlanSection title="Menu" icon={UtensilsCrossed} description="Planned around your guests’ dietary needs">
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plan.menu.map((course) => (
          <li key={course.course}>
            <Card className="flex h-full flex-col gap-3 p-5">
              <h3 className="text-xl">{course.course}</h3>
              <ul className="flex-1 list-disc space-y-1 pl-5 text-sm marker:text-rose">
                {course.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {course.note ? (
                <p className="rounded-xl bg-gold-soft px-3 py-2 text-xs text-gold-ink">{course.note}</p>
              ) : null}
              <ItemActions
                itemName={`${course.course} course`}
                onAddToChecklist={() => {
                  const title = `Finalise the ${course.course.toLowerCase()} menu`;
                  actions.addToChecklist(
                    taskFromIdea({ title, description: course.items.join(', '), category: 'catering' }, event, today),
                  );
                }}
                onAddToBudget={() => {
                  const name = `${course.course} catering`;
                  actions.addToBudget(
                    budgetFromIdea({ name, category: 'catering', ideasInCategory: plan.menu.length }, plan, event),
                  );
                }}
              />
            </Card>
          </li>
        ))}
      </ul>
    </PlanSection>
  );
}

/** Activities and entertainment. */
export function ActivitiesSection({ plan, event, actions, today }: PlanSectionProps) {
  return (
    <PlanSection title="Activities" icon={Music4} description="Moments your guests will remember">
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plan.activities.map((activity) => (
          <li key={activity.name}>
            <Card className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl">{activity.name}</h3>
                <span className="shrink-0 rounded-full bg-lavender-soft px-2.5 py-0.5 text-xs text-lavender-ink">
                  {activity.duration}
                </span>
              </div>
              <p className="flex-1 text-sm text-muted">{activity.description}</p>
              <ItemActions
                itemName={activity.name}
                onAddToChecklist={() => {
                  actions.addToChecklist(
                    taskFromIdea(
                      { title: `Arrange: ${activity.name}`, description: activity.description, category: 'vendors' },
                      event,
                      today,
                    ),
                  );
                }}
                onAddToBudget={() => {
                  actions.addToBudget(
                    budgetFromIdea(
                      { name: activity.name, category: 'entertainment', ideasInCategory: plan.activities.length },
                      plan,
                      event,
                    ),
                  );
                }}
              />
            </Card>
          </li>
        ))}
      </ul>
    </PlanSection>
  );
}
