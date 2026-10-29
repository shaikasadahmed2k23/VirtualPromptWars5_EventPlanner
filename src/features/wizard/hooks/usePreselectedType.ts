import { EVENT_TYPES, type EventType } from '@shared/domain';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWizardDraftStore } from '../store/useWizardDraftStore';

const isEventType = (value: string | null): value is EventType =>
  value !== null && (EVENT_TYPES as readonly string[]).includes(value);

/**
 * Applies `?type=wedding` (from the landing page cards) to the draft, returns
 * the wizard to the first step, then drops the parameter so a later refresh
 * keeps the user's place.
 *
 * Returns `true` while the parameter is still being applied, so the caller can
 * defer mounting the step form until its default values include the type.
 */
export function usePreselectedType(): boolean {
  const [searchParams, setSearchParams] = useSearchParams();
  const patchDraft = useWizardDraftStore((state) => state.patchDraft);
  const goToStep = useWizardDraftStore((state) => state.goToStep);
  const requested = searchParams.get('type');

  useEffect(() => {
    if (!isEventType(requested)) return;
    patchDraft({ type: requested });
    goToStep(0);
    setSearchParams({}, { replace: true });
  }, [requested, patchDraft, goToStep, setSearchParams]);

  return isEventType(requested);
}
