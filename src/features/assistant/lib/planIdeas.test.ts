import { createSeedPlan } from '@/data/seed/plan';
import { activityIdeas, decorIdeas, menuIdeas } from './planIdeas';

const plan = createSeedPlan().plan;

describe('plan ideas', () => {
  it('turns décor ideas into décor tasks that share the décor budget', () => {
    const ideas = decorIdeas(plan);
    const first = plan.decorIdeas[0]!;
    expect(ideas).toHaveLength(plan.decorIdeas.length);
    expect(ideas[0]).toMatchObject({
      source: first,
      heading: first.title,
      task: { title: first.title, description: first.description, category: 'decor' },
      budget: { name: first.title, category: 'decor', ideasInCategory: plan.decorIdeas.length },
    });
  });

  it('turns each course into a "finalise the menu" task listing its dishes', () => {
    const course = plan.menu[0]!;
    expect(menuIdeas(plan)[0]).toMatchObject({
      heading: course.course,
      itemName: `${course.course} course`,
      task: {
        title: `Finalise the ${course.course.toLowerCase()} menu`,
        description: course.items.join(', '),
        category: 'catering',
      },
      budget: { name: `${course.course} catering`, category: 'catering', ideasInCategory: plan.menu.length },
    });
  });

  it('books activities as vendor tasks and shares the entertainment budget', () => {
    const activity = plan.activities[0]!;
    expect(activityIdeas(plan)[0]).toMatchObject({
      task: { title: `Arrange: ${activity.name}`, category: 'vendors' },
      budget: { name: activity.name, category: 'entertainment', ideasInCategory: plan.activities.length },
    });
  });
});
