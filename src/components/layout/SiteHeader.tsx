import { Trophy } from 'lucide-react';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { env } from '@/config/env';

import type { ReactNode } from 'react';

export interface IHomeLinkRenderProps {
  className: string;
  children: ReactNode;
}

interface ISiteHeaderProps {
  /**
   * Renders the home link. Inside the router pass a router <Link> (no page reload);
   * the default plain <a> is for screens rendered outside the router (top-level error fallback).
   */
  renderHomeLink?: (props: IHomeLinkRenderProps) => ReactNode;
}

const defaultRenderHomeLink = ({ className, children }: IHomeLinkRenderProps) => (
  <a href="/" className={className}>
    {children}
  </a>
);

export const SiteHeader = ({ renderHomeLink = defaultRenderHomeLink }: ISiteHeaderProps) => (
  <header className="border-b-4 border-brand bg-header text-header-fg">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 md:px-6">
      {renderHomeLink({
        className:
          'flex items-center gap-2 rounded-md font-display text-2xl font-bold focus-visible:outline-header-fg',
        children: (
          <>
            <Trophy aria-hidden="true" className="size-6" />
            {env.appName}
          </>
        ),
      })}
      <ThemeToggle />
    </div>
  </header>
);
