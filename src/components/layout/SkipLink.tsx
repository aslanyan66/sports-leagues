/** First focusable element: lets keyboard and screen-reader users jump past the header. */
export const SkipLink = () => (
  <a
    href="#main"
    className="sr-only rounded-lg bg-surface px-4 py-3 font-semibold text-fg shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100"
  >
    Skip to content
  </a>
);
