import { SiteHeader, type IHomeLinkRenderProps } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';

import type { ReactNode } from 'react';

interface IMainLayoutProps {
  children: ReactNode;
  renderHomeLink?: (props: IHomeLinkRenderProps) => ReactNode;
}

/** Page frame: skip link, site header and the main landmark. */
export const MainLayout = ({ children, renderHomeLink }: IMainLayoutProps) => (
  <div className="flex min-h-dvh flex-col">
    <SkipLink />
    <SiteHeader {...(renderHomeLink && { renderHomeLink })} />
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 focus-visible:outline-none md:px-6 md:py-10"
    >
      {children}
    </main>
  </div>
);
