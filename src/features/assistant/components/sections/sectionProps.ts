import type { AIPlan } from '@shared/ai';
import type { CelebrationEvent, ISODate } from '@/types';
import type { PlanActions } from '../../hooks/usePlanActions';

/** Props shared by every AI plan section. */
export interface PlanSectionProps {
  plan: AIPlan;
  event: CelebrationEvent;
  actions: PlanActions;
  today: ISODate;
}
