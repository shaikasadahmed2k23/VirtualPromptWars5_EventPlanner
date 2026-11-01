import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-rose-ink text-white shadow-soft hover:bg-rose-deep hover:shadow-lift active:translate-y-px',
        secondary: 'border border-line bg-surface text-charcoal shadow-soft hover:border-rose hover:text-rose-ink',
        soft: 'bg-blush-soft text-rose-deep hover:bg-blush/60',
        ghost: 'text-charcoal hover:bg-ivory-deep',
        link: 'rounded-none px-0 text-rose-ink underline-offset-4 hover:underline',
        danger: 'bg-danger text-white hover:bg-danger/90',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-13 px-7 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a router `Link`) with button styling. */
  asChild?: boolean;
}

/** Primary action primitive. Icon-only buttons must pass an `aria-label`. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
