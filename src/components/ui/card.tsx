import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/** Rounded surface container. */
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-2xl border border-line bg-surface shadow-soft', className)} {...props} />
));
Card.displayName = 'Card';

/** Card header with consistent padding. */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-5 pb-3 sm:p-6 sm:pb-3', className)} {...props} />;
}

/** Card heading; renders an `h3` by default to keep page outlines logical. */
export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl leading-tight sm:text-2xl', className)} {...props}>
      {children}
    </h3>
  );
}

/** Secondary text under a card title. */
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted', className)} {...props} />;
}

/** Main card body. */
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0 sm:p-6 sm:pt-0', className)} {...props} />;
}

/** Card footer for actions. */
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-3 p-5 pt-0 sm:p-6 sm:pt-0', className)} {...props} />;
}
