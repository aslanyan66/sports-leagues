import { cn } from '@/utils/cn';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface IStateMessageProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  variant?: 'info' | 'error';
  className?: string;
}

/**
 * Empty, error and "nothing here" states: says what happened and what to do next.
 * Errors are announced (role="alert"); info states are not, because the surrounding UI
 * already announces the change (e.g. the live result count).
 */
export const StateMessage = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'info',
  className,
}: IStateMessageProps) => (
  <div
    role={variant === 'error' ? 'alert' : undefined}
    className={cn(
      'flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-strong px-6 py-10 text-center',
      className,
    )}
  >
    <Icon
      aria-hidden="true"
      className={cn('size-10', variant === 'error' ? 'text-brand-text' : 'text-fg-muted')}
    />
    <p className="font-display text-2xl font-bold">{title}</p>
    {description ? <p className="max-w-prose text-fg-muted">{description}</p> : null}
    {action ? <div className="mt-2 flex flex-wrap justify-center gap-3">{action}</div> : null}
  </div>
);
