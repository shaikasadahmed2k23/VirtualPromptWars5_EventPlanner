import { FlaskConical, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AIMode } from '@/types';

/**
 * Shows where content came from. Demo mode is labelled clearly (with an
 * explanation for screen readers) so sample output is never mistaken for live AI.
 */
export function AIModeBadge({ aiMode }: { aiMode: AIMode }) {
  if (aiMode === 'live') {
    return (
      <Badge tone="lavender">
        <Sparkles aria-hidden="true" />
        Generated with Gemini
      </Badge>
    );
  }
  return (
    <Badge
      tone="gold"
      title="No Gemini API key is configured, or Gemini was unavailable. Showing tailored sample ideas."
    >
      <FlaskConical aria-hidden="true" />
      Demo mode
      <span className="sr-only">: tailored sample ideas, not live AI output</span>
    </Badge>
  );
}
