import type { ReactNode } from 'react';

interface IErrorScreenProps {
  code: string;
  title: string;
  description: string;
  actions: ReactNode;
  details?: string | undefined;
}

/** Full-page error layout shared by the 404 page and the unexpected-error pages. */
export const ErrorScreen = ({ code, title, description, actions, details }: IErrorScreenProps) => (
  <section
    aria-labelledby="error-title"
    className="mx-auto flex max-w-xl flex-col items-center gap-4 py-12 text-center md:py-20"
  >
    <p
      aria-hidden="true"
      className="font-display text-[7rem] leading-none font-bold text-brand md:text-[10rem]"
    >
      {code}
    </p>
    <h1 id="error-title" className="font-display text-4xl font-bold">
      {title}
    </h1>
    <p className="text-lg text-fg-muted">{description}</p>
    <div className="mt-4 flex flex-wrap justify-center gap-3">{actions}</div>
    {details ? (
      <details className="mt-6 w-full rounded-lg border border-border bg-surface p-4 text-left text-sm">
        <summary className="cursor-pointer font-medium">Error details</summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-fg-muted">{details}</pre>
      </details>
    ) : null}
  </section>
);
