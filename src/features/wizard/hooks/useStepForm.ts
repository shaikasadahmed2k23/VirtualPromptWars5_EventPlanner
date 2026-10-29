import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';
import { toDraftPatch } from '../lib/wizardSchema';
import { useWizardDraftStore } from '../store/useWizardDraftStore';

/**
 * React Hook Form instance for a wizard step, validated by the step's Zod
 * schema. Validates on submit, re-validates as the user corrects a field, and
 * autosaves every keystroke to the persisted draft so a refresh loses nothing.
 */
export function useStepForm<T extends FieldValues>(
  schema: ZodType<T>,
  defaultValues: NoInfer<DefaultValues<T>>,
): UseFormReturn<T> {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { watch } = form;
  const patchDraft = useWizardDraftStore((state) => state.patchDraft);

  useEffect(() => {
    const subscription = watch((values) => {
      patchDraft(toDraftPatch(values));
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, patchDraft]);

  return form;
}
