import type { AIPlan } from '@shared/ai';
import { Clock3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PlanSection } from '../PlanSection';

/** Day-of schedule as a vertical timeline. */
export function ScheduleTimeline({ schedule }: { schedule: AIPlan['schedule'] }) {
  return (
    <PlanSection title="Day-of schedule" icon={Clock3} description="How the day unfolds, hour by hour">
      <Card className="p-5 sm:p-8">
        <ol className="relative space-y-6 border-l-2 border-blush pl-6">
          {schedule.map((step) => (
            <li key={`${step.time}-${step.title}`} className="relative">
              <span
                className="absolute -left-[2.05rem] top-1 size-4 rounded-full border-4 border-surface bg-rose-ink"
                aria-hidden="true"
              />
              <time className="font-serif text-lg font-semibold tabular-nums text-rose-ink">{step.time}</time>
              <h3 className="text-xl">{step.title}</h3>
              <p className="text-sm text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Card>
    </PlanSection>
  );
}
