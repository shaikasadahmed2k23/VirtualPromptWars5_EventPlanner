import { aiPlanSchema, eventBriefSchema, themeSuggestionSchema } from '@shared/ai';
import { MOOD_PHOTOS, PHOTOS } from '@/data/photos';
import { createSeedBudget, createSeedEvent, createSeedGuests, createSeedPlan, createSeedTasks } from '.';

describe('seed data', () => {
  const event = createSeedEvent();

  it('produces a valid AI brief from the demo event', () => {
    const result = eventBriefSchema.safeParse({ ...event, ...event.requirements });
    expect(result.success).toBe(true);
  });

  it('stores an AI plan and theme that satisfy the shared response schemas', () => {
    expect(aiPlanSchema.safeParse(createSeedPlan().plan).success).toBe(true);
    expect(themeSuggestionSchema.safeParse(event.theme).success).toBe(true);
  });

  it('keeps committed spend within the ₹18L budget', () => {
    const committed = createSeedBudget().reduce((sum, item) => sum + Math.max(item.estimated, item.actual), 0);
    expect(committed).toBeLessThanOrEqual(event.budget);
  });

  it('scopes every record to the demo event with unique ids', () => {
    const records = [...createSeedTasks(), ...createSeedBudget(), ...createSeedGuests()];
    expect(records.every((record) => record.eventId === event.id)).toBe(true);
    expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
  });

  it('returns fresh copies so a reset never shares state', () => {
    expect(createSeedTasks()).not.toBe(createSeedTasks());
    expect(createSeedTasks()).toEqual(createSeedTasks());
  });
});

describe('photo registry', () => {
  it('only references curated photos from mood boards', () => {
    for (const keys of Object.values(MOOD_PHOTOS)) {
      for (const key of keys) expect(PHOTOS).toHaveProperty(key);
    }
  });

  it('gives every photo descriptive alt text', () => {
    for (const photo of Object.values(PHOTOS)) {
      expect(photo.alt.length).toBeGreaterThan(15);
    }
  });
});
