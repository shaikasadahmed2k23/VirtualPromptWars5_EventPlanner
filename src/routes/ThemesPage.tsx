import { Palette, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/headings';
import { EmptyState, Skeleton } from '@/components/ui/states';
import { AIModeBadge } from '@/features/assistant/components/AIModeBadge';
import { AIStatus } from '@/features/assistant/components/AIStatus';
import { useCurrentEvent } from '@/features/events/hooks/useCurrentEvent';
import { ThemeCard } from '@/features/themes/components/ThemeCard';
import { useAIThemes } from '@/features/themes/hooks/useAIThemes';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import type { CelebrationEvent } from '@/types';

const SKELETON_CARDS = 3;

interface ThemesSectionProps {
  themes: ReturnType<typeof useAIThemes>;
  event: CelebrationEvent;
}

/** Main area: skeleton cards while working, the three themes once ready, else the first-run prompt. */
function ThemesBody({ themes, event }: ThemesSectionProps) {
  if (themes.isWorking) {
    return (
      <div className="grid gap-6 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: SKELETON_CARDS }, (_, index) => (
          <Skeleton key={index} className="h-[36rem]" />
        ))}
      </div>
    );
  }
  if (themes.stored) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {themes.stored.themes.map((theme) => (
          <ThemeCard
            key={theme.name}
            theme={theme}
            isInUse={event.theme?.name === theme.name}
            onUse={() => {
              themes.applyTheme(theme);
            }}
          />
        ))}
      </div>
    );
  }
  // The error state (with Retry) is rendered by AIStatus.
  if (themes.status === 'error') return null;
  return (
    <EmptyState
      icon={Palette}
      title="Find your look"
      description="Generate three themes tailored to your event’s style, culture and city."
      action={
        <Button size="lg" onClick={() => void themes.generate()}>
          <Sparkles aria-hidden="true" />
          Generate themes
        </Button>
      }
    />
  );
}

/** `/events/:eventId/themes`: AI mood boards with palettes and curated imagery. */
export default function ThemesPage() {
  const event = useCurrentEvent();
  const themes = useAIThemes(event);
  useDocumentTitle(`Themes & mood boards · ${event.name}`);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={event.name}
        title="Themes & mood boards"
        description="Three AI-curated directions, each with a story, a palette you can copy, and décor inspiration."
        actions={
          themes.stored ? (
            <>
              <AIModeBadge aiMode={themes.stored.aiMode} />
              <Button onClick={() => void themes.generate({ force: true })} disabled={themes.isWorking}>
                <RefreshCw aria-hidden="true" className={themes.isWorking ? 'animate-spin' : undefined} />
                New ideas
              </Button>
            </>
          ) : null
        }
      />

      {event.theme ? (
        <Card className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm">
          <Palette className="size-4 text-rose-ink" aria-hidden="true" />
          Your current theme: <span className="font-semibold">{event.theme.name}</span>
        </Card>
      ) : null}

      <AIStatus
        status={themes.status}
        error={themes.error}
        onRetry={() => void themes.generate()}
        successMessage="Three themes are ready."
      />
      <ThemesBody themes={themes} event={event} />
    </div>
  );
}
