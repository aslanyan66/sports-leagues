const getEnv = (key: keyof ImportMetaEnv): string => {
  const value: unknown = import.meta.env[key];

  if (typeof value !== 'string' || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  appName: getEnv('VITE_APP_NAME'),
  apiUrl: getEnv('VITE_API_URL'),
  isDev: import.meta.env.DEV,
} as const;
