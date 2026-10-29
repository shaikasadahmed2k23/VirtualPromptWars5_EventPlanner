import { useEffect } from 'react';
import { APP_NAME } from '@/lib/constants';

/** Sets `document.title` to "`title` · Utsav" while the calling page is mounted. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · ${APP_NAME}`;
  }, [title]);
}
