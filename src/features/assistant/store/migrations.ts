import { isRecord } from '@/lib/utils';

/**
 * v1 → v2: plans gained `id`, `aiMode` (replacing `source`) and `savedAt`,
 * and the store gained `history`. Unknown shapes are dropped rather than trusted.
 */
export function migrateAssistantV1(state: unknown): unknown {
  if (!isRecord(state)) return { plans: {}, history: {}, themes: {} };
  const upgradePlan = ([eventId, plan]: [string, unknown]): [string, unknown][] => {
    if (!isRecord(plan)) return [];
    const { source, ...rest } = plan;
    return [
      [
        eventId,
        {
          ...rest,
          id: typeof plan.id === 'string' ? plan.id : `plan-migrated-${eventId}`,
          aiMode: source === 'gemini' ? 'live' : 'demo',
          savedAt: typeof plan.generatedAt === 'string' ? plan.generatedAt : null,
        },
      ],
    ];
  };
  return {
    plans: Object.fromEntries(Object.entries(isRecord(state.plans) ? state.plans : {}).flatMap(upgradePlan)),
    history: {},
    // v1 theme suggestions lack image keywords; they are regenerated on demand instead.
    themes: {},
  };
}
