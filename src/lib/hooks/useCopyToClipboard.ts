import { useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

/** Copies text to the clipboard and confirms (or explains failure) with a toast. */
export function useCopyToClipboard(): (text: string, label?: string) => Promise<void> {
  return useCallback(async (text: string, label = text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${label}`);
    } catch (error: unknown) {
      logger.warn('Clipboard write failed', error);
      toast.error('Couldn’t copy. Select the text and copy it manually.');
    }
  }, []);
}
