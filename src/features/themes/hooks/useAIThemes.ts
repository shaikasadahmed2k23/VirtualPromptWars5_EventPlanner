import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { requestThemes } from '@/features/assistant/lib/aiRequests';
import { toEventBrief } from '@/features/assistant/lib/toEventBrief';
import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import { useEventStore } from '@/features/events/store/useEventStore';
import { nowISO } from '@/lib/dates';
import { useAbortableRequest } from '@/lib/hooks/useAbortableRequest';
import type { CelebrationEvent, ThemeSuggestion } from '@/types';

/** AI theme suggestions for an event, plus generate and "use this theme" actions. */
export function useAIThemes(event: CelebrationEvent) {
  const stored = useAssistantStore((state) => state.themes[event.id]);
  const setThemes = useAssistantStore((state) => state.setThemes);
  const saveTheme = useEventStore((state) => state.saveTheme);
  const clearTheme = useEventStore((state) => state.clearTheme);
  const { status, error, run } = useAbortableRequest();
  const brief = useMemo(() => toEventBrief(event), [event]);

  const generate = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      const outcome = await run((signal) => requestThemes(brief, { signal, force }));
      if (outcome) {
        setThemes({ eventId: event.id, themes: outcome.data.themes, aiMode: outcome.aiMode, generatedAt: nowISO() });
      }
    },
    [brief, event.id, run, setThemes],
  );

  const applyTheme = useCallback(
    (theme: ThemeSuggestion) => {
      const previous = event.theme;
      saveTheme(event.id, theme);
      toast.success(`“${theme.name}” is now your theme`, {
        description: 'Your dashboard has been updated.',
        action: {
          label: 'Undo',
          onClick: () => {
            if (previous) saveTheme(event.id, previous);
            else clearTheme(event.id);
          },
        },
      });
    },
    [clearTheme, event.id, event.theme, saveTheme],
  );

  return { stored, status, error, isWorking: status === 'loading', generate, applyTheme };
}
