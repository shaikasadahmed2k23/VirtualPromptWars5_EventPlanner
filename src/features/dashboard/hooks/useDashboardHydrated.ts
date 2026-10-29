import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import { useBudgetStore } from '@/features/budget/store/useBudgetStore';
import { useGuestStore } from '@/features/guests/store/useGuestStore';
import { useTaskStore } from '@/features/tasks/store/useTaskStore';
import { usePersistHydrated } from '@/lib/hooks/usePersistHydrated';

const DASHBOARD_STORES = [useTaskStore, useBudgetStore, useGuestStore, useAssistantStore] as const;

/** True once every store the dashboard reads from has loaded saved data. */
export function useDashboardHydrated(): boolean {
  return usePersistHydrated(DASHBOARD_STORES);
}
