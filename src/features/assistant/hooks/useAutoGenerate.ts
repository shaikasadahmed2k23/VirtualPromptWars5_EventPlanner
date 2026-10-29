import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Query flag set by the dashboard's "Generate AI Plan" button. */
export const AUTO_GENERATE_PARAM = 'generate';

/**
 * Starts generation once when the page is opened with `?generate=1` and no
 * plan exists yet, then removes the flag so a refresh does not repeat it.
 */
export function useAutoGenerate(hasPlan: boolean, generate: () => unknown): void {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get(AUTO_GENERATE_PARAM) === '1';
  const started = useRef(false);

  useEffect(() => {
    if (!requested || started.current) return;
    started.current = true;
    setSearchParams({}, { replace: true });
    if (!hasPlan) void generate();
  }, [requested, hasPlan, generate, setSearchParams]);
}
