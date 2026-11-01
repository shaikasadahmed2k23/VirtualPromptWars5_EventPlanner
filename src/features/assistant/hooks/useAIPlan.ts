import { useCallback, useMemo, useRef } from 'react';
import type { AIPlan } from '@shared/ai';
import { nowISO } from '@/lib/dates';
import { useAbortableRequest } from '@/lib/hooks/useAbortableRequest';
import { createId } from '@/lib/id';
import type { AsyncStatus, CelebrationEvent, StoredPlan } from '@/types';
import { type AIOutcome, requestPlan, requestRefinedPlan } from '../lib/aiRequests';
import { toEventBrief } from '../lib/toEventBrief';
import { useAssistantStore } from '../store/useAssistantStore';

const NO_HISTORY: StoredPlan[] = [];

/** The event's current plan, earlier versions and request state, with the actions that change them. */
export interface AIPlanState {
  current: StoredPlan | undefined;
  /** Earlier versions, newest first. */
  history: readonly StoredPlan[];
  status: AsyncStatus;
  error: string | null;
  isWorking: boolean;
  /** Generates a plan; `force` skips the client cache ("Regenerate"). */
  generate: (options?: { force?: boolean }) => Promise<void>;
  refine: (instruction: string) => Promise<void>;
  /** Repeats the last generate or refine. */
  retry: () => Promise<void>;
  restore: (planId: string) => void;
}

/**
 * The event's AI plan plus actions to generate, refine, retry and restore it.
 * Requests are cancelled automatically when the page unmounts.
 */
export function useAIPlan(event: CelebrationEvent): AIPlanState {
  const current = useAssistantStore((state) => state.plans[event.id]);
  const history = useAssistantStore((state) => state.history[event.id] ?? NO_HISTORY);
  const setPlan = useAssistantStore((state) => state.setPlan);
  const restorePlan = useAssistantStore((state) => state.restorePlan);
  const { status, error, run } = useAbortableRequest();
  const brief = useMemo(() => toEventBrief(event), [event]);
  const lastAction = useRef<() => Promise<void>>(() => Promise.resolve());

  const store = useCallback(
    (outcome: AIOutcome<AIPlan>, refinements: string[]) => {
      setPlan({
        id: createId('plan'),
        eventId: event.id,
        plan: outcome.data,
        aiMode: outcome.aiMode,
        refinements,
        generatedAt: nowISO(),
        savedAt: null,
      });
    },
    [event.id, setPlan],
  );

  const generate = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      lastAction.current = () => generate({ force });
      const outcome = await run((signal) => requestPlan(brief, { signal, force }));
      if (outcome) store(outcome, []);
    },
    [brief, run, store],
  );

  const refine = useCallback(
    async (instruction: string) => {
      if (!current) return;
      lastAction.current = () => refine(instruction);
      const outcome = await run((signal) => requestRefinedPlan(brief, current.plan, instruction, { signal }));
      if (outcome) store(outcome, [...current.refinements, instruction]);
    },
    [brief, current, run, store],
  );

  const retry = useCallback(() => lastAction.current(), []);
  const restore = useCallback(
    (planId: string) => {
      restorePlan(event.id, planId);
    },
    [event.id, restorePlan],
  );

  return { current, history, status, error, isWorking: status === 'loading', generate, refine, retry, restore };
}
