import { useCallback, useMemo } from 'react';
import { requestThemes } from '@/features/assistant/lib/aiRequests';
import { toEventBrief } from '@/features/assistant/lib/toEventBrief';
import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import { useEventStore } from '@/features/events/store/useEventStore';
import { nowISO } from '@/lib/dates';
import { useAbortableRequest } from '@/lib/hooks/useAbortableRequest';
import { notifyWithUndo } from '@/lib/undoToast';
import type { AsyncStatus, CelebrationEvent, StoredThemes, ThemeSuggestion } from '@/types';

/** Stored theme suggestions and request state, with generate and "use this theme" actions. */
export interface AIThemesState {
  stored: StoredThemes | undefined;
  status: AsyncStatus;
  error: string | null;
  isWorking: boolean;
  /** Generates three themes; `force` skips the client cache ("New ideas"). */
  generate: (options?: { force?: boolean }) => Promise<void>;
  /** Applies a theme to the event, with undo back to the previous one. */
  applyTheme: (theme: ThemeSuggestion) => void;
}

/** AI theme suggestions for an event, plus generate and "use this theme" actions. */
export function useAIThemes(event: CelebrationEvent): AIThemesState {
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
      notifyWithUndo(
        `“${theme.name}” is now your theme`,
        () => {
          if (previous) saveTheme(event.id, previous);
          else clearTheme(event.id);
        },
        'Your dashboard has been updated.',
      );
    },
    [clearTheme, event.id, event.theme, saveTheme],
  );

  return { stored, status, error, isWorking: status === 'loading', generate, applyTheme };
}
