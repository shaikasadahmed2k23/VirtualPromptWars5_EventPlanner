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

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** `h3` inside a titled section (default); `h2` when the card sits directly under the page `h1`. */
  as?: 'h2' | 'h3';
}

/** Card heading at the level that keeps the page outline unbroken. */
export function CardTitle({ as: Heading = 'h3', className, children, ...props }: CardTitleProps) {
  return (
    <Heading className={cn('text-xl leading-tight sm:text-2xl', className)} {...props}>
      {children}
    </Heading>
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
