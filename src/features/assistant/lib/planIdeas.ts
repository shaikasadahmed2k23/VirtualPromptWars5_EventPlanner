import type { AIPlan } from '@shared/ai';
import type { BudgetIdea, TaskIdea } from './planActions';

/**
 * A plan item as shown on its card, with what "Add to checklist" and "Add to
 * budget" create from it. `source` is the original plan item, for rendering.
 */
export interface PlanIdea<T> {
  source: T;
  heading: string;
  /** Names the item in the action buttons' accessible labels. */
  itemName: string;
  task: TaskIdea;
  budget: BudgetIdea;
}

type DecorIdea = AIPlan['decorIdeas'][number];
type MenuCourse = AIPlan['menu'][number];
type Activity = AIPlan['activities'][number];

/** Décor ideas become décor tasks and share the décor budget. */
export function decorIdeas(plan: AIPlan): PlanIdea<DecorIdea>[] {
  return plan.decorIdeas.map((idea) => ({
    source: idea,
    heading: idea.title,
    itemName: idea.title,
    task: { title: idea.title, description: idea.description, category: 'decor' },
    budget: { name: idea.title, category: 'decor', ideasInCategory: plan.decorIdeas.length },
  }));
}

/** Each course becomes a "finalise the menu" task and a share of the catering budget. */
export function menuIdeas(plan: AIPlan): PlanIdea<MenuCourse>[] {
  return plan.menu.map((course) => ({
    source: course,
    heading: course.course,
    itemName: `${course.course} course`,
    task: {
      title: `Finalise the ${course.course.toLowerCase()} menu`,
      description: course.items.join(', '),
      category: 'catering',
    },
    budget: { name: `${course.course} catering`, category: 'catering', ideasInCategory: plan.menu.length },
  }));
}

/** Activities become vendor-booking tasks and share the entertainment budget. */
export function activityIdeas(plan: AIPlan): PlanIdea<Activity>[] {
  return plan.activities.map((activity) => ({
    source: activity,
    heading: activity.name,
    itemName: activity.name,
    task: { title: `Arrange: ${activity.name}`, description: activity.description, category: 'vendors' },
    budget: { name: activity.name, category: 'entertainment', ideasInCategory: plan.activities.length },
  }));
}
