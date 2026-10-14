import { env } from '@/config/env';

/** Browser tab title: "Page · App name", or just the app name (from `VITE_APP_NAME`). */
export const pageTitle = (page?: string): string =>
  page ? `${page} · ${env.appName}` : env.appName;
