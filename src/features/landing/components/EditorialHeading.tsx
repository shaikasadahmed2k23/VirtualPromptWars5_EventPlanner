import { RibbonDivider } from '@/components/decor/RibbonDivider';
import { cn } from '@/lib/utils';

interface EditorialHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}

/** Magazine-style section heading: small-caps eyebrow, serif `h2`, ribbon divider. */
export function EditorialHeading({ id, eyebrow, title, align = 'center', className }: EditorialHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn(centered && 'text-center', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-ink">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-4xl leading-tight sm:text-5xl">
        {title}
      </h2>
      <RibbonDivider className={cn('mt-5', !centered && 'justify-start')} />
    </div>
  );
}
