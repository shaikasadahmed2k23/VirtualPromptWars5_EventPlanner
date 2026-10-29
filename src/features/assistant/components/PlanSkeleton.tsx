import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/states';

const SECTION_COUNT = 3;
const CARDS_PER_SECTION = 3;

/** Placeholder layout shown while a plan is being generated. */
export function PlanSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-8">
      <Card className="space-y-4 p-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </Card>
      {Array.from({ length: SECTION_COUNT }, (_, section) => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: CARDS_PER_SECTION }, (__, card) => (
              <Skeleton key={card} className="h-32" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
