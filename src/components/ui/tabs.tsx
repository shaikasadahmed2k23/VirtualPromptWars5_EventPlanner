import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

/** Accessible tabs (arrow-key navigation, roving focus) built on Radix. */
export const Tabs = TabsPrimitive.Root;

/** Pill-style tab list. */
export function TabsList({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1', className)}
      {...props}
    />
  );
}

/** A single tab trigger. */
export function TabsTrigger({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:text-charcoal data-[state=active]:bg-rose-ink data-[state=active]:text-white [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
}

/** Panel shown for the active tab. */
export function TabsContent({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-6', className)} {...props} />;
}
