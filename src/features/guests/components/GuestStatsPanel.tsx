import { Users, UserRoundCheck, UserRoundX, UserRoundPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { GUEST_DIETARY_LABELS } from '@/lib/labels';
import { GUEST_DIETARY, type GuestDietary, type GuestStats } from '@/types';

/** Dietary needs worth reporting to the caterer ("no preference" is omitted). */
const REPORTED_DIETARY = GUEST_DIETARY.filter(
  (dietary): dietary is Exclude<GuestDietary, 'none'> => dietary !== 'none',
);

interface GuestStatsPanelProps {
  stats: GuestStats;
}

/** RSVP, headcount and dietary summary cards for the guest list. */
export function GuestStatsPanel({ stats }: GuestStatsPanelProps) {
  return (
    <section aria-labelledby="guest-overview-heading" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <h2 id="guest-overview-heading" className="sr-only">
        Guest overview
      </h2>
      <StatCard
        label="Invitations"
        value={stats.total}
        icon={Users}
        detail="Guests and households invited"
        tone="lavender"
      />
      <StatCard
        label="Attending"
        value={stats.attending}
        icon={UserRoundCheck}
        detail={`${String(stats.headcount)} people incl. plus-ones`}
        tone="success"
      />
      <StatCard label="Pending" value={stats.pending} icon={UserRoundPlus} detail="Awaiting a reply" tone="gold" />
      <StatCard label="Declined" value={stats.declined} icon={UserRoundX} detail="Invitations declined" tone="rose" />
      <Card className="sm:col-span-2 xl:col-span-4">
        <CardHeader>
          <CardTitle>Dietary needs of attending guests</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {REPORTED_DIETARY.map((dietary) => (
            <Badge key={dietary} tone={stats.dietary[dietary] > 0 ? 'success' : 'neutral'}>
              {GUEST_DIETARY_LABELS[dietary]}: {stats.dietary[dietary]}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
