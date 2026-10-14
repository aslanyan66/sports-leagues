import { cva, type VariantProps } from 'class-variance-authority';

/** Shared button styles, also used to style links as buttons (e.g. <Link className={buttonVariants()} />). */
export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand-strong text-on-brand hover:bg-brand-strong-hover',
        secondary: 'border border-border-strong bg-surface text-fg hover:border-fg-muted',
      },
      size: {
        md: 'min-h-11 px-4 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
