import { LoaderCircle } from 'lucide-react';

import { cn } from '@/utils/cn';

interface ISpinnerProps {
  label: string;
  className?: string;
}

export const Spinner = ({ label, className }: ISpinnerProps) => (
  <div role="status" className={cn('flex items-center justify-center p-6', className)}>
    <LoaderCircle aria-hidden="true" className="size-8 text-brand motion-safe:animate-spin" />
    <span className="sr-only">{label}</span>
  </div>
);
