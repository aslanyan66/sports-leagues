import { cn } from '@/utils/cn';

interface ISkeletonProps {
  className?: string;
}

/** Decorative loading placeholder; pair it with a text status for screen readers. */
export const Skeleton = ({ className }: ISkeletonProps) => (
  <span
    aria-hidden="true"
    className={cn('block rounded-md bg-surface-muted motion-safe:animate-pulse', className)}
  />
);
