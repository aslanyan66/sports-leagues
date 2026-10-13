import { cn } from '@/utils/cn';

import type { ReactNode } from 'react';

interface IChipProps {
  children: ReactNode;
  className?: string;
}

export const Chip = ({ children, className }: IChipProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-sm font-semibold text-brand-text',
      className,
    )}
  >
    {children}
  </span>
);
