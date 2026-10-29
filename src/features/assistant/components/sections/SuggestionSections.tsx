import { ListChecks, PieChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PriorityBadge } from '@/features/tasks/components/TaskBadges';
import { formatCurrency, pluralize } from '@/lib/format';
import { BUDGET_CATEGORY_LABELS, TASK_CATEGORY_LABELS } from '@/lib/labels';
import { allocationAmount, budgetFromAllocation, taskFromSuggestion } from '../../lib/planActions';
import { ItemActions } from '../ItemActions';
import { PlanSection } from '../PlanSection';
import type { PlanSectionProps } from './sectionProps';

/** AI-suggested checklist tasks with months-before deadlines. */
export function SuggestedTasksSection({ plan, event, actions, today }: PlanSectionProps) {
  return (
    <PlanSection title="Suggested tasks" icon={ListChecks} description="Add the ones you need to your checklist">
      <Card>
        <ul className="divide-y divide-line">
          {plan.suggestedTasks.map((task) => (
            <li key={task.title} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6">
              <div className="min-w-0">
                <p className="font-medium">{task.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>{TASK_CATEGORY_LABELS[task.category]}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {task.monthsBefore === 0 ? 'Event month' : `${pluralize(task.monthsBefore, 'month')} before`}
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
              <ItemActions
                itemName={task.title}
                onAddToChecklist={() => {
                  actions.addToChecklist(taskFromSuggestion(task, event, today));
                }}
              />
            </li>
          ))}
        </ul>
      </Card>
    </PlanSection>
  );
}

/** Suggested budget split by category, in the event currency. */
export function BudgetAllocationSection({ plan, event, actions }: PlanSectionProps) {
  return (
    <PlanSection title="Budget allocation" icon={PieChart} description="A suggested split of your total budget">
      <Card>
        <ul className="divide-y divide-line">
          {plan.budgetAllocation.map((line) => (
            <li key={line.category} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6">
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline justify-between gap-3 font-medium">
                  {BUDGET_CATEGORY_LABELS[line.category]}
                  <span className="text-sm text-muted">
                    {line.percent}% · {formatCurrency(allocationAmount(event, line.percent), event.currency)}
                  </span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory-deep" aria-hidden="true">
                  <div className="h-full rounded-full bg-rose" style={{ width: `${String(line.percent)}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-muted">{line.note}</p>
              </div>
              <ItemActions
                itemName={`${BUDGET_CATEGORY_LABELS[line.category]} allocation`}
                onAddToBudget={() => {
                  actions.addToBudget(budgetFromAllocation(line, event));
                }}
              />
            </li>
          ))}
        </ul>
      </Card>
    </PlanSection>
  );
}
