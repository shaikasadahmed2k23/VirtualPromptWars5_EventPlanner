import type { AIPlan } from '@shared/ai';
import type { CelebrationEvent, ISODate } from '@/types';
import type { usePlanActions } from '../../hooks/usePlanActions';

/** Props shared by every AI plan section. */
export interface PlanSectionProps {
  plan: AIPlan;
  event: CelebrationEvent;
  actions: ReturnType<typeof usePlanActions>;
  today: ISODate;
}
