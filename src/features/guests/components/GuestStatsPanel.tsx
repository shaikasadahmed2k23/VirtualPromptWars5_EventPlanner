import { Users, UserRoundCheck, UserRoundX, UserRoundPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import type { GuestStats } from '@/types';
import { GUEST_DIETARY, type GuestDietary } from '@/types';
import { GUEST_DIETARY_LABELS } from '@/lib/labels';

interface GuestStatsPanelProps {
  stats: GuestStats;
}

/** RSVP, headcount and dietary summary cards for the guest list. */
export function GuestStatsPanel({ stats }: GuestStatsPanelProps) {
  return (
    <section aria-labelledby="guest-overview-heading" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <h2 id="guest-overview-heading" className="sr-only">Guest overview</h2>
      <StatCard label="Households" value={stats.total} icon={Users} detail={`${stats.headcount} attending incl. plus-ones`} tone="lavender" />
      <StatCard label="Attending" value={stats.attending} icon={UserRoundCheck} detail={`${stats.headcount} people expected`} tone="success" />
      <StatCard label="Pending" value={stats.pending} icon={UserRoundPlus} detail={`${stats.declined} declined`} tone="gold" />
      <StatCard label="Declined" value={stats.declined} icon={UserRoundX} detail="Invitations declined" tone="rose" />
      <Card className="sm:col-span-2 xl:col-span-4">
        <CardHeader><CardTitle>Dietary breakdown</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {GUEST_DIETARY.filter((dietary) => dietary !== 'none').map((dietary: Exclude<GuestDietary, 'none'>) => (
            <Badge key={dietary} tone={stats.dietary[dietary] > 0 ? 'success' : 'neutral'}>
              {GUEST_DIETARY_LABELS[dietary]}: {stats.dietary[dietary]}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
