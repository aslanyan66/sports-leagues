/// <reference types="vite/client" />

// Must be interfaces: they merge with Vite's built-in ImportMetaEnv declaration.
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
